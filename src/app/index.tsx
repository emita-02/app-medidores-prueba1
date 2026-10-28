import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import {
  eliminarMedidor,
  guardarMedidor,
  inicializarBaseDeDatos,
  obtenerMedidorPorCodigo,
  type Medidor,
} from '@/database/repository';
import { consultarMedidor, type ConsultaResult } from '@/services/medidor.service';
import { useAuth } from '@/services/auth-context';

const CODIGO_REGEX = new RegExp('^MED-\\d{6}$');

export default function HomeScreen() {
  const router = useRouter();
  const { session, loading: authLoading, logout } = useAuth();

  const [codigo, setCodigo] = useState('');
  const [consulta, setConsulta] = useState<ConsultaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consultando, setConsultando] = useState(false);
  const [verificando, setVerificando] = useState<'idle' | 'ok' | 'fallo' | null>(null);

  useEffect(() => {
    inicializarBaseDeDatos();
  }, []);

  if (authLoading) {
    return (
      <ThemedView type="background" style={styles.container}>
        <ThemedText type="default" themeColor="text" style={styles.loadingText}>
          Cargando sesión...
        </ThemedText>
      </ThemedView>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleConsultar = async () => {
    inicializarBaseDeDatos();
    setError(null);
    setConsulta(null);

    const valor = codigo.trim();
    if (!CODIGO_REGEX.test(valor)) {
      setError(
        'El código del medidor debe tener el formato MED-XXXXXX (MED- seguido de exactamente seis dígitos).'
      );
      return;
    }

    setConsultando(true);
    try {
      const resultado = await consultarMedidor(valor);
      setConsulta(resultado);
      if (resultado.estado === 'error') {
        setError(resultado.mensaje);
      }
    } catch {
      setError('Error inesperado al consultar el medidor.');
    } finally {
      setConsultando(false);
    }
  };

  const handleVerificarSQLite = async () => {
    inicializarBaseDeDatos();
    setVerificando(null);
    try {
      inicializarBaseDeDatos();
      const prueba: Medidor = {
        codigo: 'MED-000000',
        direccion: 'Prueba de integridad SQLite',
        sector: 'Prueba',
        numero_cuenta: '0000000000',
        estado: 'Activo',
        ultima_lectura: null,
        fecha_ultima_lectura: null,
        consumo_promedio_mensual: null,
        fecha_consulta: new Date().toISOString(),
      };
      guardarMedidor(prueba);
      const recuperado = obtenerMedidorPorCodigo('MED-000000');
      const ok =
        !!recuperado &&
        recuperado.codigo === 'MED-000000' &&
        recuperado.direccion === prueba.direccion &&
        recuperado.sector === prueba.sector &&
        recuperado.numero_cuenta === prueba.numero_cuenta &&
        recuperado.estado === prueba.estado;
      if (ok) {
        eliminarMedidor('MED-000000');
      }
      setVerificando(ok ? 'ok' : 'fallo');
    } catch {
      setVerificando('fallo');
    }
  };

  const chipTexto = (): string => {
    if (!consulta) return 'Sin consulta realizada.';
    if (consulta.estado === 'exito') {
      return consulta.origen === 'api' ? 'En línea — datos de MockAPI' : 'Sin conexión — datos de caché';
    }
    if (consulta.estado === 'sin_conexion') {
      return consulta.medidor ? 'Sin conexión — datos de caché' : 'Sin conexión — sin datos guardados';
    }
    if (consulta.estado === 'error') return 'Error de consulta.';
    return 'Medidor no encontrado.';
  };

  const formatearFecha = (iso: string | null | undefined): string => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filaDato = (etiqueta: string, valor: string | number | null | undefined) => (
    <View style={styles.fila} key={etiqueta}>
      <ThemedText type="smallBold" style={styles.etiqueta} themeColor="text">
        {etiqueta}
      </ThemedText>
      <ThemedText type="code" style={styles.valor} themeColor="text">
        {valor == null || valor === '' ? '—' : String(valor)}
      </ThemedText>
    </View>
  );

  const renderResultado = () => {
    if (!consulta) return null;

    if (consulta.estado === 'no_encontrado') {
      return (
        <ThemedView style={styles.cardResultado}>
          <ThemedText type="smallBold" style={styles.tituloResultado} themeColor="text">
            Medidor no encontrado
          </ThemedText>
          <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
            No existe un medidor registrado con el código consultado en MockAPI.
          </ThemedText>
        </ThemedView>
      );
    }

    if (consulta.estado === 'error') {
      return (
        <ThemedView style={[styles.cardResultado, styles.cardError]}>
          <ThemedText type="smallBold" style={styles.tituloResultado} themeColor="error">
            Error al consultar
          </ThemedText>
          <ThemedText type="small" style={styles.mensajeResultado} themeColor="text">
            {consulta.mensaje}
          </ThemedText>
        </ThemedView>
      );
    }

    if (consulta.estado === 'sin_conexion') {
      if (!consulta.medidor) {
        return (
          <ThemedView style={styles.cardResultado}>
            <ThemedText type="smallBold" style={styles.tituloResultado} themeColor="text">
              Sin conexión y sin datos guardados
            </ThemedText>
            <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
              No hay conexión y no existe información previa de este medidor en SQLite.
            </ThemedText>
          </ThemedView>
        );
      }

      const medidor = consulta.medidor;
      const vencida = !consulta.vigente;
      return (
        <ThemedView style={[styles.cardResultado, styles.cardAlmacenado]}>
          <ThemedView style={styles.badgeAlmacenado}>
            <ThemedText type="smallBold" style={styles.textoBadge} themeColor="text">
              {vencida ? 'CACHÉ VENCIDA' : 'DATOS ALMACENADOS'}
            </ThemedText>
          </ThemedView>
          <ThemedText type="smallBold" style={styles.tituloResultado} themeColor="text">
            Medidor (consulta offline)
          </ThemedText>
          <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
            Sin conexión. Mostrando datos guardados en SQLite, consultados el{' '}
            {formatearFecha(medidor.fecha_consulta)}.
            {vencida ? ' La caché superó un día de vigencia.' : ''}
          </ThemedText>
          <View style={styles.datos}>
            {filaDato('Código', medidor.codigo)}
            {filaDato('Dirección', medidor.direccion)}
            {filaDato('Sector', medidor.sector)}
            {filaDato('Número de cuenta', medidor.numero_cuenta)}
            {filaDato('Estado', medidor.estado)}
            {filaDato('Última lectura', medidor.ultima_lectura)}
            {filaDato('Fecha última lectura', formatearFecha(medidor.fecha_ultima_lectura))}
            {filaDato('Consumo promedio mensual', medidor.consumo_promedio_mensual)}
          </View>

          <Pressable style={styles.button} onPress={() => router.push(`/lectura?codigo=${encodeURIComponent(medidor.codigo)}`)}>
            <ThemedText type="smallBold" style={styles.buttonText} themeColor="text">
              Registrar lectura
            </ThemedText>
          </Pressable>
        </ThemedView>
      );
    }

    // estado === 'exito'
    const medidor = consulta.medidor;
    const origenTexto = consulta.origen === 'api' ? 'Consultado en línea (MockAPI)' : 'Consultado desde caché';
    return (
      <ThemedView style={[styles.cardResultado, styles.cardDatos]}>
        <ThemedView style={styles.badgeOnline}>
          <ThemedText type="smallBold" style={styles.textoBadge} themeColor="text">
            {consulta.vigente ? 'CACHÉ VIGENTE' : 'CACHÉ VENCIDA'}
          </ThemedText>
        </ThemedView>
        <ThemedText type="smallBold" style={styles.tituloResultado} themeColor="text">
          Medidor encontrado
        </ThemedText>
        <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
          {origenTexto}. Consulta realizada: {formatearFecha(medidor.fecha_consulta)}.
        </ThemedText>
        <View style={styles.datos}>
          {filaDato('Código', medidor.codigo)}
          {filaDato('Dirección', medidor.direccion)}
          {filaDato('Sector', medidor.sector)}
          {filaDato('Número de cuenta', medidor.numero_cuenta)}
          {filaDato('Estado', medidor.estado)}
          {filaDato('Última lectura', medidor.ultima_lectura)}
          {filaDato('Fecha última lectura', formatearFecha(medidor.fecha_ultima_lectura))}
          {filaDato('Consumo promedio mensual', medidor.consumo_promedio_mensual)}
          </View>

          <Pressable style={styles.button} onPress={() => router.push(`/lectura?codigo=${encodeURIComponent(medidor.codigo)}`)}>
            <ThemedText type="smallBold" style={styles.buttonText} themeColor="text">
              Registrar lectura
            </ThemedText>
          </Pressable>
        </ThemedView>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.scrollView}
      keyboardShouldPersistTaps="handled">
      <ThemedView type="primaryDark" style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle} themeColor="text">
          EPMAPS
        </ThemedText>
        <ThemedText type="smallBold" style={styles.headerSubtitle} themeColor="textSecondary">
          Registro de lecturas de medidores
        </ThemedText>
      </ThemedView>

      <ThemedView type="backgroundLight" style={styles.card}>
        <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="text">
          Sesión activa
        </ThemedText>
        <ThemedView style={styles.infoRow}>
          <ThemedText type="smallBold" themeColor="text">
            Empleado:
          </ThemedText>
          <ThemedText type="code" style={styles.empleadoCode} themeColor="text">
            {session?.employeeCode ?? '—'}
          </ThemedText>
        </ThemedView>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText type="smallBold" style={styles.logoutText} themeColor="error">
            Cerrar sesión
          </ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView type="backgroundLight" style={styles.card}>
        <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="text">
          Consulta de medidor
        </ThemedText>

        <ThemedText type="smallBold" style={styles.label} themeColor="text">
          Código del medidor
        </ThemedText>
        <TextInput
          style={styles.input}
          value={codigo}
          onChangeText={setCodigo}
          placeholder="MED-000001"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          editable={!consultando}
        />

        {error && (
          <ThemedView style={styles.errorBanner}>
            <ThemedText type="small" style={styles.errorText} themeColor="text">
              {error}
            </ThemedText>
          </ThemedView>
        )}

        <Pressable
          style={[styles.button, consultando && styles.buttonDisabled]}
          disabled={consultando}
          onPress={handleConsultar}>
          <ThemedText type="smallBold" style={styles.buttonText} themeColor="text">
            {consultando ? 'Consultando...' : 'Consultar medidor'}
          </ThemedText>
        </Pressable>

        {consultando && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.light.primary} />
          </View>
        )}

        <ThemedText type="small" style={styles.chip} themeColor="textSecondary">
          {chipTexto()}
        </ThemedText>

        {renderResultado()}

        <View style={styles.divisor} />
        <Pressable style={styles.buttonSecundario} onPress={handleVerificarSQLite}>
          <ThemedText type="smallBold" style={styles.buttonTextoSecundario} themeColor="primarySecondary">
            Verificar base de datos SQLite
          </ThemedText>
        </Pressable>
        {verificando === 'ok' && (
          <ThemedText type="small" style={styles.mensajeOK} themeColor="text">
            SQLite verificada: base de datos inicializada, medidor de prueba guardado, recuperado y eliminado correctamente.
          </ThemedText>
        )}
        {verificando === 'fallo' && (
          <ThemedText type="small" style={styles.mensajeFallo} themeColor="error">
            La verificación de SQLite falló.
          </ThemedText>
        )}

        <Pressable style={styles.buttonSecundario} onPress={() => router.push('/borradores')}>
          <ThemedText type="smallBold" style={styles.buttonTextoSecundario} themeColor="primarySecondary">
            Borradores pendientes
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundLight,
  },
  scrollView: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  header: {
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 700,
  },
  headerSubtitle: {
    marginTop: Spacing.half,
    fontSize: 14,
  },
  card: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: Spacing.two,
    marginTop: Spacing.two,
  },
  empleadoCode: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: Spacing.one,
  },
  logoutText: {
    color: Colors.light.error,
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.six,
  },
  label: {
    fontSize: 14,
    fontWeight: 800,
    marginBottom: Spacing.half,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    color: '#000000',
    minHeight: 52,
  },
  errorBanner: {
    backgroundColor: '#fdecea',
    borderWidth: 1,
    borderColor: Colors.light.error,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.one,
    minHeight: 52,
  },
  buttonDisabled: {
    backgroundColor: '#9cc3e6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 700,
  },
  buttonSecundario: {
    borderWidth: 1,
    borderColor: Colors.light.primarySecondary,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.one,
    minHeight: 52,
  },
  buttonTextoSecundario: {
    color: Colors.light.primarySecondary,
    fontSize: 16,
    fontWeight: 700,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: Spacing.two,
  },
  chip: {
    marginTop: Spacing.two,
    fontSize: 12,
  },
  cardResultado: {
    padding: Spacing.four,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: Spacing.two,
    marginTop: Spacing.three,
  },
  cardAlmacenado: {
    borderColor: '#b08d1e',
  },
  cardError: {
    borderColor: Colors.light.error,
  },
  cardDatos: {
    borderColor: Colors.light.primary,
  },
  badgeOnline: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.one,
    backgroundColor: 'rgba(3, 90, 166, 0.12)',
    marginBottom: Spacing.two,
  },
  badgeAlmacenado: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.one,
    backgroundColor: 'rgba(176, 141, 30, 0.12)',
    marginBottom: Spacing.two,
  },
  textoBadge: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  tituloResultado: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: Spacing.half,
  },
  mensajeResultado: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.three,
  },
  divisor: {
    height: 1,
    backgroundColor: '#cccccc',
    marginVertical: Spacing.three,
  },
  datos: {
    gap: Spacing.two,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
  },
  etiqueta: {
    color: Colors.light.text,
    flex: 1,
    paddingRight: Spacing.two,
  },
  valor: {
    fontSize: 14,
    color: Colors.light.text,
    flexShrink: 1,
    textAlign: 'right',
  },
  mensajeOK: {
    marginTop: Spacing.two,
    color: '#035AA6',
    fontSize: 13,
  },
  mensajeFallo: {
    marginTop: Spacing.two,
    fontSize: 13,
  },
});
