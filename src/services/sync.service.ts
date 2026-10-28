import { API } from '@/constants/api';
import {
  obtenerLecturaPorId,
  obtenerLecturasPorEstado,
  actualizarEstadoLectura,
  type Lectura,
} from '@/database/repository';
import { hayConexion } from '@/services/medidor.service';

let envioEnCurso = false;
const enviosActivos = new Set<string>();

function construirPayloadLectura(lectura: Lectura): Record<string, unknown> {
  return {
    id_local: lectura.id_local,
    codigo_medidor: lectura.codigo_medidor,
    mes: lectura.mes,
    anio: lectura.anio,
    lectura_actual: lectura.lectura_actual ?? null,
    estado_medidor: lectura.estado_medidor,
    motivo_inaccesibilidad: lectura.motivo_inaccesibilidad ?? null,
    descripcion_dano: lectura.descripcion_dano ?? null,
    confirmacion_revision: lectura.confirmacion_revision ?? 0,
    uri_fotografia: lectura.uri_fotografia ?? null,
    fecha_creacion: lectura.fecha_creacion,
    fecha_modificacion: lectura.fecha_modificacion,
  };
}

async function enviarLectura(lectura: Lectura): Promise<{ ok: boolean; error?: string }> {
  if (enviosActivos.has(lectura.id_local)) {
    return { ok: false, error: 'Envío ya en curso para esta lectura.' };
  }

  if (lectura.estado_sincronizacion === 'enviado') {
    return { ok: true };
  }

  const conectado = await hayConexion();
  if (!conectado) {
    return { ok: false, error: 'Sin conexión.' };
  }

  enviosActivos.add(lectura.id_local);

  const controller = new AbortController();
  const temporizador = setTimeout(() => controller.abort(), API.timeoutMs);

  try {
    const payload = construirPayloadLectura(lectura);
    const url = `${API.baseUrl}/lecturas`;

    const respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!respuesta.ok) {
      const actualizada = obtenerLecturaPorId(lectura.id_local);
      if (actualizada && actualizada.estado_sincronizacion !== 'enviado') {
        actualizarEstadoLectura(lectura.id_local, 'error');
      }
      return { ok: false, error: `Error del servidor (${respuesta.status}).` };
    }

    // Verificar estado actual antes de marcar como enviado para evitar condiciones de carrera
    const actualizada = obtenerLecturaPorId(lectura.id_local);
    if (!actualizada) {
      return { ok: false, error: 'Lectura no encontrada tras envío.' };
    }
    if (actualizada.estado_sincronizacion === 'enviado') {
      return { ok: true };
    }

    const marcado = actualizarEstadoLectura(lectura.id_local, 'enviado');
    if (!marcado.ok) {
      return { ok: false, error: marcado.error };
    }

    return { ok: true };
  } catch (error) {
    const actualizada = obtenerLecturaPorId(lectura.id_local);
    if (actualizada && actualizada.estado_sincronizacion !== 'enviado') {
      try {
        actualizarEstadoLectura(lectura.id_local, 'error');
      } catch {
        // Ignorar fallo al marcar error
      }
    }
    const mensaje = error instanceof Error ? error.message : 'Error de red al enviar lectura.';
    return { ok: false, error: mensaje };
  } finally {
    clearTimeout(temporizador);
    enviosActivos.delete(lectura.id_local);
  }
}

export async function sincronizarPendientes(): Promise<{
  enviados: number;
  errores: number;
  omitidos: number;
}> {
  if (envioEnCurso) {
    return { enviados: 0, errores: 0, omitidos: 0 };
  }

  envioEnCurso = true;
  let enviados = 0;
  let errores = 0;
  let omitidos = 0;

  try {
    const conectado = await hayConexion();
    if (!conectado) {
      return { enviados: 0, errores: 0, omitidos: 0 };
    }

    const pendientes = obtenerLecturasPorEstado('pendiente');
    const conError = obtenerLecturasPorEstado('error');

    // Reintentar pendientes primero, luego errores (transición error -> pendiente válida)
    const aEnviar: Lectura[] = [];

    for (const lectura of pendientes) {
      if (lectura.estado_sincronizacion === 'pendiente') {
        aEnviar.push(lectura);
      }
    }
    for (const lectura of conError) {
      // Solo reintentar si la transición es válida (error -> pendiente)
      const actual = obtenerLecturaPorId(lectura.id_local);
      if (actual && actual.estado_sincronizacion === 'error') {
        const marcado = actualizarEstadoLectura(lectura.id_local, 'pendiente');
        if (marcado.ok) {
          const actualizada = obtenerLecturaPorId(lectura.id_local);
          if (actualizada) {
            aEnviar.push(actualizada);
          }
        } else {
          omitidos++;
        }
      } else {
        omitidos++;
      }
    }

    for (const lectura of aEnviar) {
      const resultado = await enviarLectura(lectura);
      if (resultado.ok) {
        enviados++;
      } else {
        errores++;
      }
    }

    return { enviados, errores, omitidos };
  } finally {
    envioEnCurso = false;
  }
}

export function estaSincronizando(): boolean {
  return envioEnCurso;
}

/**
 * LIMITACIÓN DE IDEMPOTENCIA (MockAPI):
 * - id_local se incluye en el payload, pero MockAPI no garantiza idempotencia por defecto.
 * - Si la aplicación pierde la conexión justo después de que el servidor procese la petición
 *   pero antes de recibir la respuesta HTTP 2xx, la lectura quedará marcada como error localmente
 *   y al reintentar se enviará nuevamente, pudiendo crear un duplicado en MockAPI.
 * - Alternativa mínima segura: verificar antes de enviar si ya existe una lectura enviada para
 *   el mismo (codigo_medidor, mes, anio). Si existe y está enviada, marcar la lectura local
 *   como enviada sin reenviarla. También considerar que MockAPI podría tener restricciones;
 *   si el recurso no soporta búsqueda por id_local, esta verificación es limitada.
 */
export function obtenerLimitacionIdempotencia(): string {
  return 'MockAPI no garantiza idempotencia por id_local. Se recomienda verificar duplicados por (codigo_medidor, mes, anio) antes de reintentar y documentar el comportamiento.';
}
