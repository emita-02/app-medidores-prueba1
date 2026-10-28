import { db, initDatabase } from './connection';

export type Medidor = {
  codigo: string;
  direccion: string;
  sector: string;
  numero_cuenta: string;
  estado: string;
  ultima_lectura?: number | null;
  fecha_ultima_lectura?: string | null;
  consumo_promedio_mensual?: number | null;
  fecha_consulta: string;
};

export type Lectura = {
  id_local: string;
  codigo_medidor: string;
  mes: number;
  anio: number;
  lectura_actual?: number | null;
  estado_medidor: string;
  motivo_inaccesibilidad?: string | null;
  descripcion_dano?: string | null;
  confirmacion_revision?: number | null;
  uri_fotografia?: string | null;
  estado_sincronizacion: EstadoSincronizacion;
  fecha_creacion: string;
  fecha_modificacion: string;
};

export type EstadoSincronizacion = 'borrador' | 'pendiente' | 'enviado' | 'error';

function ahora(): string {
  return new Date().toISOString();
}

export function inicializarBaseDeDatos(): void {
  initDatabase();
}

export function guardarMedidor(medidor: Medidor): void {
  db.runSync(
    `INSERT OR REPLACE INTO medidores (
      codigo, direccion, sector, numero_cuenta, estado,
      ultima_lectura, fecha_ultima_lectura,
      consumo_promedio_mensual, fecha_consulta
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      medidor.codigo,
      medidor.direccion,
      medidor.sector,
      medidor.numero_cuenta,
      medidor.estado,
      medidor.ultima_lectura ?? null,
      medidor.fecha_ultima_lectura ?? null,
      medidor.consumo_promedio_mensual ?? null,
      medidor.fecha_consulta,
    ]
  );
}

export function obtenerMedidorPorCodigo(codigo: string): Medidor | null {
  const result = db.getFirstSync<Medidor | null>(
    `SELECT * FROM medidores WHERE codigo = ?`,
    [codigo]
  );
  return result ?? null;
}

export function eliminarMedidor(codigo: string): void {
  db.runSync(`DELETE FROM medidores WHERE codigo = ?`, [codigo]);
}

export function crearLecturaBorrador(
  codigoMedidor: string,
  mes: number,
  anio: number,
  idLocal: string
): { ok: true; lectura: Lectura } | { ok: false; error: string } {
  if (mes < 1 || mes > 12) {
    return {
      ok: false,
      error: 'El mes debe estar entre 1 y 12.',
    };
  }

  if (anio < 2000 || anio > 2100) {
    return {
      ok: false,
      error: 'El año no es válido.',
    };
  }

  const existente = obtenerLecturaPorCodigoYMes(codigoMedidor, mes, anio);
  if (existente) {
    return {
      ok: false,
      error: 'Ya existe una lectura para este medidor en el mes y año indicados.',
    };
  }

  const fecha = ahora();

  db.runSync(
    `INSERT INTO lecturas (
      id_local, codigo_medidor, mes, anio,
      estado_medidor, estado_sincronizacion,
      fecha_creacion, fecha_modificacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [idLocal, codigoMedidor, mes, anio, 'borrador', 'borrador', fecha, fecha]
  );

  return {
    ok: true,
    lectura: {
      id_local: idLocal,
      codigo_medidor: codigoMedidor,
      mes,
      anio,
      estado_medidor: 'borrador',
      estado_sincronizacion: 'borrador',
      fecha_creacion: fecha,
      fecha_modificacion: fecha,
    },
  };
}

export function obtenerLecturaPorCodigoYMes(
  codigoMedidor: string,
  mes: number,
  anio: number
): Lectura | null {
  const result = db.getFirstSync<Lectura | null>(
    `SELECT * FROM lecturas WHERE codigo_medidor = ? AND mes = ? AND anio = ?`,
    [codigoMedidor, mes, anio]
  );
  return result ?? null;
}

export function obtenerLecturasPorEstado(
  estado: EstadoSincronizacion
): Lectura[] {
  const rows = db.getAllSync<Lectura>(
    `SELECT * FROM lecturas WHERE estado_sincronizacion = ? ORDER BY fecha_creacion DESC`,
    [estado]
  );
  return rows;
}

export function obtenerTodasLasLecturas(): Lectura[] {
  return db.getAllSync<Lectura>(
    `SELECT * FROM lecturas ORDER BY fecha_creacion DESC`
  );
}

// Transiciones de estado permitidas:
// - borrador → pendiente (al intentar enviar)
// - borrador → error (si falla validación previa al envío)
// - pendiente → enviado (éxito en sincronización)
// - pendiente → error (fallo en sincronización)
// - error → pendiente (reintento tras error)
// No se permite modificar una lectura con estado 'enviado'.
const transicionesValidas: Record<EstadoSincronizacion, EstadoSincronizacion[]> = {
  borrador: ['pendiente', 'error'],
  pendiente: ['enviado', 'error'],
  error: ['pendiente'],
  enviado: [],
};

export function actualizarEstadoLectura(
  idLocal: string,
  estado: EstadoSincronizacion
): { ok: true } | { ok: false; error: string } {
  const existente = obtenerLecturaPorId(idLocal);
  if (!existente) {
    return { ok: false, error: 'No se encontró la lectura.' };
  }

  if (existente.estado_sincronizacion === estado) {
    return { ok: true };
  }

  const permitidas = transicionesValidas[existente.estado_sincronizacion];
  if (!permitidas.includes(estado)) {
    return {
      ok: false,
      error: `No se puede pasar de '${existente.estado_sincronizacion}' a '${estado}'.`,
    };
  }

  const fecha = ahora();
  db.runSync(
    `UPDATE lecturas
     SET estado_sincronizacion = ?, fecha_modificacion = ?
     WHERE id_local = ?`,
    [estado, fecha, idLocal]
  );

  return { ok: true };
}

export function actualizarLecturaCompleta(
  idLocal: string,
  campos: Partial<{
    lectura_actual: number | null;
    estado_medidor: string;
    motivo_inaccesibilidad: string | null;
    descripcion_dano: string | null;
    confirmacion_revision: number | null;
    uri_fotografia: string | null;
  }>
): { ok: true; lectura: Lectura } | { ok: false; error: string } {
  const existente = obtenerLecturaPorId(idLocal);
  if (!existente) {
    return { ok: false, error: 'No se encontró la lectura.' };
  }

  if (existente.estado_sincronizacion === 'enviado') {
    return {
      ok: false,
      error: 'No se puede modificar una lectura ya enviada.',
    };
  }

  const fecha = ahora();
  const sets: string[] = [];
  const valores: (string | number | null)[] = [];

  if (campos.lectura_actual !== undefined) {
    sets.push('lectura_actual = ?');
    valores.push(campos.lectura_actual);
  }
  if (campos.estado_medidor !== undefined) {
    sets.push('estado_medidor = ?');
    valores.push(campos.estado_medidor);
  }
  if (campos.motivo_inaccesibilidad !== undefined) {
    sets.push('motivo_inaccesibilidad = ?');
    valores.push(campos.motivo_inaccesibilidad);
  }
  if (campos.descripcion_dano !== undefined) {
    sets.push('descripcion_dano = ?');
    valores.push(campos.descripcion_dano);
  }
  if (campos.confirmacion_revision !== undefined) {
    sets.push('confirmacion_revision = ?');
    valores.push(campos.confirmacion_revision);
  }
  if ((campos as any).uri_fotografia !== undefined) {
    sets.push('uri_fotografia = ?');
    valores.push((campos as any).uri_fotografia);
  }

  sets.push('fecha_modificacion = ?');
  valores.push(fecha);
  valores.push(idLocal);

  if (sets.length === 0) {
    const actualizada = obtenerLecturaPorId(idLocal);
    return {
      ok: true,
      lectura: actualizada!,
    };
  }

  db.runSync(
    `UPDATE lecturas SET ${sets.join(', ')} WHERE id_local = ?`,
    valores
  );

  const actualizada = obtenerLecturaPorId(idLocal);
  return {
    ok: true,
    lectura: actualizada!,
  };
}

export function marcarLecturaComoPendiente(
  idLocal: string
): { ok: true } | { ok: false; error: string } {
  return actualizarEstadoLectura(idLocal, 'pendiente');
}

export function marcarLecturaComoError(
  idLocal: string
): { ok: true } | { ok: false; error: string } {
  return actualizarEstadoLectura(idLocal, 'error');
}

export function guardarFotoLectura(
  idLocal: string,
  uri: string
): { ok: true; lectura: Lectura } | { ok: false; error: string } {
  return actualizarLecturaCompleta(idLocal, { uri_fotografia: uri } as any);
}

export function obtenerLecturaPorId(idLocal: string): Lectura | null {
  const result = db.getFirstSync<Lectura | null>(
    `SELECT * FROM lecturas WHERE id_local = ?`,
    [idLocal]
  );
  return result ?? null;
}

export function eliminarLectura(idLocal: string): { ok: true } | { ok: false; error: string } {
  const existente = obtenerLecturaPorId(idLocal);
  if (!existente) {
    return { ok: false, error: 'No se encontró la lectura.' };
  }

  if (existente.estado_sincronizacion === 'enviado') {
    return {
      ok: false,
      error: 'No se puede eliminar una lectura ya enviada.',
    };
  }

  db.runSync(`DELETE FROM lecturas WHERE id_local = ?`, [idLocal]);
  return { ok: true };
}
