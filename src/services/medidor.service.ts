import { API } from '@/constants/api';
import { Medidor, guardarMedidor, obtenerMedidorPorCodigo } from '@/database/repository';
let NetInfo: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  NetInfo = require('@react-native-community/netinfo').default || require('@react-native-community/netinfo');
} catch {
  NetInfo = null;
}

const CACHE_DIA_MS = API.cacheVigenciaMs;

export type ConsultaExitosa = {
  estado: 'exito';
  medidor: Medidor;
  origen: 'api' | 'cache';
  vigente: boolean;
};

export type ConsultaNoEncontrado = {
  estado: 'no_encontrado';
};

export type ConsultaSinConexion = {
  estado: 'sin_conexion';
  medidor: Medidor | null;
  vigente: boolean;
};

export type ConsultaError = {
  estado: 'error';
  mensaje: string;
};

export type ConsultaResult =
  | ConsultaExitosa
  | ConsultaNoEncontrado
  | ConsultaSinConexion
  | ConsultaError;

export async function hayConexion(): Promise<boolean> {
  try {
    if (NetInfo && typeof NetInfo.fetch === 'function') {
      const state = await NetInfo.fetch();
      if (state?.isConnected === false) return false;
      if (state?.isInternetReachable === false) return false;
      return true;
    }
    return true;
  } catch {
    return true;
  }
}

function estaVigente(fechaConsulta: string | null | undefined): boolean {
  if (!fechaConsulta) return false;
  return Date.now() - new Date(fechaConsulta).getTime() <= CACHE_DIA_MS;
}

type MedidorCrudo = Record<string, unknown>;

function obtenerCampo(crudo: MedidorCrudo, claves: string[]): unknown {
  for (const clave of claves) {
    if (clave in crudo && crudo[clave] !== undefined && crudo[clave] !== null) {
      return crudo[clave];
    }
  }
  return undefined;
}

function texto(valor: unknown): string {
  return valor == null ? '' : String(valor);
}

function numerico(valor: unknown): number | null {
  if (valor == null) return null;
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

function mapearMedidor(crudo: MedidorCrudo, codigoSolicitado: string): Medidor {
  const campo = (claves: string[]) => obtenerCampo(crudo, claves);

  const codigoTexto = texto(campo(['codigo', 'id', 'code'])) || codigoSolicitado;

  return {
    codigo: codigoTexto,
    direccion: texto(campo(['direccion', 'dirección', 'address', 'direccionCompleta'])),
    sector: texto(campo(['sector', 'zona', 'zone'])),
    numero_cuenta: texto(
      campo(['numero_cuenta', 'numeroCuenta', 'accountNumber', 'cuenta', 'numero_de_cuenta'])
    ),
    estado: texto(campo(['estado', 'status'])),
    ultima_lectura: numerico(campo(['ultima_lectura', 'ultimaLectura', 'lastReading', 'lecturaActual', 'lectura'])),
    fecha_ultima_lectura:
      texto(campo(['fecha_ultima_lectura', 'fechaUltimaLectura', 'fechaUltima', 'lastReadingDate'])) || null,
    consumo_promedio_mensual: numerico(
      campo([
        'consumo_promedio_mensual',
        'consumoPromedioMensual',
        'averageMonthlyConsumption',
        'consumoPromedio',
        'consumo',
      ])
    ),
    fecha_consulta: new Date().toISOString(),
  };
}

function esErrorDeRed(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') return true;
  if (error instanceof TypeError) return true;
  const mensaje = (error as { message?: string })?.message ?? '';
  const nombre = (error as { name?: string })?.name ?? '';
  return /network|fetch|connection|failed|timeout|unreachable|refused/i.test(mensaje) || nombre === 'TypeError';
}

export async function consultarMedidor(codigo: string): Promise<ConsultaResult> {
  const url = `${API.baseUrl}/${API.resource}?codigo=${encodeURIComponent(codigo)}`;
  const controller = new AbortController();
  const temporizador = setTimeout(() => controller.abort(), API.timeoutMs);

  try {
    const respuesta = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!respuesta.ok) {
      return {
        estado: 'error',
        mensaje: `Error del servidor (${respuesta.status}). Intente nuevamente.`,
      };
    }

    const datos = await respuesta.json();
    const registros = Array.isArray(datos) ? datos : [];
    const registro = registros.find(
      (item: Record<string, unknown>) => String(item.codigo ?? item.id ?? '') === codigo
    );

    if (!registro) {
      return { estado: 'no_encontrado' };
    }

    const medidor = mapearMedidor(registro as MedidorCrudo, codigo);

    try {
      guardarMedidor(medidor);
    } catch {
      // No se bloquea la entrega de datos por un fallo de escritura en caché.
    }

    return { estado: 'exito', medidor, origen: 'api', vigente: true };
  } catch (error) {
    const medidorGuardado = obtenerMedidorPorCodigo(codigo);

    if (!esErrorDeRed(error)) {
      return {
        estado: 'error',
        mensaje: 'Respuesta inválida del servidor. Intente nuevamente.',
      };
    }

    // Sin conexión: devolvemos lo que haya en caché local, aunque la petición
    // a MockAPI haya fallado por falta de red o timeout.
    const vigente = medidorGuardado ? estaVigente(medidorGuardado.fecha_consulta) : false;
    return { estado: 'sin_conexion', medidor: medidorGuardado ?? null, vigente };
  } finally {
    clearTimeout(temporizador);
  }
}
