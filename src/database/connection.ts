import { openDatabaseSync } from 'expo-sqlite';

export const db = openDatabaseSync('medidores.db');

export function initDatabase(): void {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS medidores (
      codigo TEXT PRIMARY KEY,
      direccion TEXT NOT NULL,
      sector TEXT NOT NULL,
      numero_cuenta TEXT NOT NULL,
      estado TEXT NOT NULL,
      ultima_lectura REAL,
      fecha_ultima_lectura TEXT,
      consumo_promedio_mensual REAL,
      fecha_consulta TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lecturas (
      id_local TEXT PRIMARY KEY,
      codigo_medidor TEXT NOT NULL,
      mes INTEGER NOT NULL,
      anio INTEGER NOT NULL,
      lectura_actual REAL,
      estado_medidor TEXT NOT NULL,
      motivo_inaccesibilidad TEXT,
      descripcion_dano TEXT,
      confirmacion_revision INTEGER DEFAULT 0,
      uri_fotografia TEXT,
      estado_sincronizacion TEXT NOT NULL DEFAULT 'borrador',
      fecha_creacion TEXT NOT NULL,
      fecha_modificacion TEXT NOT NULL,
      UNIQUE(codigo_medidor, mes, anio)
    );
  `);
}
