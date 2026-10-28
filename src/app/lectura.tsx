import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
let ImagePicker: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ImagePicker = require('expo-image-picker');
} catch {
  ImagePicker = null;
}
let FileSystem: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  FileSystem = require('expo-file-system');
} catch {
  FileSystem = null;
}

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import {
  crearLecturaBorrador,
  actualizarLecturaCompleta,
  obtenerMedidorPorCodigo,
  obtenerLecturaPorId,
  obtenerLecturaPorCodigoYMes,
  inicializarBaseDeDatos,
  guardarFotoLectura,
  marcarLecturaComoPendiente,
  type Lectura,
} from '@/database/repository';
import { hayConexion } from '@/services/medidor.service';
import { useConnectionStatus } from '@/hooks/use-connection';
import { sincronizarPendientes } from '@/services/sync.service';

type EstadoMedidor = 'normal' | 'inaccesible' | 'dano';

function generarUUID(): Promise<string> {
  return Crypto.getRandomBytesAsync(16).then((bytes) => {
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      '4' + hex.slice(13, 16),
      '89ab'[Math.floor(Math.random() * 4)] + hex.slice(17, 20),
      hex.slice(20, 32),
    ].join('-');
  });
}

export default function LecturaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const codigo = typeof params.codigo === 'string' ? params.codigo : undefined;
  const { isConnected, pendingCount, actualizarContador } = useConnectionStatus();

  const [estado, setEstado] = useState<EstadoMedidor>('normal');
  const [lecturaActual, setLecturaActual] = useState('');
  const [motivoInaccesibilidad, setMotivoInaccesibilidad] = useState('');
  const [descripcionDano, setDescripcionDano] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [idLocal, setIdLocal] = useState<string | null>(null);
  const [esBorradorExistente, setEsBorradorExistente] = useState(false);
  const [formularioModificado, setFormularioModificado] = useState(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [confirmacionRevisada, setConfirmacionRevisada] = useState(false);
  const [consumoMensual, setConsumoMensual] = useState<number | null>(null);
  const [esAnomalia, setEsAnomalia] = useState(false);
  const [umbralAnomalia, setUmbralAnomalia] = useState<number | null>(null);
  const [lecturaMenorAnterior, setLecturaMenorAnterior] = useState(false);
  const [datosInsuficientes, setDatosInsuficientes] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const ahora = new Date();
  const mes = ahora.getMonth() + 1;
  const anio = ahora.getFullYear();

  const borradorId = typeof params.borradorId === 'string' ? params.borradorId : undefined;

  const medidor = codigo ? obtenerMedidorPorCodigo(codigo) : null;

  const esNormal = estado === 'normal';
  const esInaccesible = estado === 'inaccesible';
  const esDano = estado === 'dano';

  const construirCampos = useCallback((): {
    lectura_actual?: number;
    estado_medidor: string;
    motivo_inaccesibilidad?: string;
    descripcion_dano?: string;
    confirmacion_revision?: number;
  } => {
    const campos: {
      lectura_actual?: number;
      estado_medidor: string;
      motivo_inaccesibilidad?: string;
      descripcion_dano?: string;
      confirmacion_revision?: number;
    } = {
      estado_medidor: estado,
      confirmacion_revision: confirmacionRevisada ? 1 : 0,
    };

    if (esNormal && lecturaActual.trim() !== '') {
      const num = parseFloat(lecturaActual);
      if (!isNaN(num)) campos.lectura_actual = num;
    }

    if (esInaccesible && motivoInaccesibilidad.trim() !== '') {
      campos.motivo_inaccesibilidad = motivoInaccesibilidad.trim();
    }

    if (esDano) {
      if (descripcionDano.trim() !== '') {
        campos.descripcion_dano = descripcionDano.trim();
      }
      if (lecturaActual.trim() !== '') {
        const num = parseFloat(lecturaActual);
        if (!isNaN(num)) campos.lectura_actual = num;
      }
    }

    return campos;
  }, [estado, lecturaActual, motivoInaccesibilidad, descripcionDano, esNormal, esInaccesible, esDano, confirmacionRevisada]);

  useEffect(() => {
    let montado = true;

    async function inicializar() {
      if (!codigo) return;
      inicializarBaseDeDatos();

      if (borradorId) {
        const existente = obtenerLecturaPorId(borradorId);
        if (!existente) {
          setError('El borrador ya no existe.');
          return;
        }
        if (existente.estado_sincronizacion !== 'borrador') {
          setError('No se puede modificar una lectura ya enviada.');
          return;
        }
        setIdLocal(existente.id_local);
        setEstado(existente.estado_medidor as EstadoMedidor);
        setLecturaActual(String(existente.lectura_actual ?? ''));
        setMotivoInaccesibilidad(existente.motivo_inaccesibilidad ?? '');
        setDescripcionDano(existente.descripcion_dano ?? '');
        setConfirmacionRevisada(existente.confirmacion_revision === 1);
        setFotoUri(existente.uri_fotografia ?? null);
        setEsBorradorExistente(true);
        return;
      }

      const existente = obtenerLecturaPorCodigoYMes(codigo, mes, anio);
      if (existente && existente.estado_sincronizacion === 'borrador') {
        setIdLocal(existente.id_local);
        setEstado(existente.estado_medidor as EstadoMedidor);
        setLecturaActual(String(existente.lectura_actual ?? ''));
        setMotivoInaccesibilidad(existente.motivo_inaccesibilidad ?? '');
        setDescripcionDano(existente.descripcion_dano ?? '');
        setConfirmacionRevisada(existente.confirmacion_revision === 1);
        setFotoUri(existente.uri_fotografia ?? null);
        setEsBorradorExistente(true);
      } else if (!existente) {
        try {
          const id = await generarUUID();
          if (!montado) return;
          const resultado = crearLecturaBorrador(codigo, mes, anio, id);
          if (resultado.ok) {
            setIdLocal(resultado.lectura.id_local);
            setEsBorradorExistente(true);
          } else {
            setError(resultado.error);
          }
        } catch {
          setError('No se pudo inicializar el borrador.');
        }
      }
    }

    inicializar();
    return () => {
      montado = false;
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [codigo, borradorId, mes, anio]);

  useEffect(() => {
    if (!idLocal || !formularioModificado) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      try {
        const campos = construirCampos();
        actualizarLecturaCompleta(idLocal, campos);
      } catch {
        // Auto-guardado silencioso: no interrumpe al usuario
      }
      setFormularioModificado(false);
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [
    idLocal,
    formularioModificado,
    construirCampos,
  ]);

  // Cálculo de consumo mensual y detección de consumo anómalo
  useEffect(() => {
    Promise.resolve().then(() => {
      setConsumoMensual(null);
      setEsAnomalia(false);
      setUmbralAnomalia(null);
      setLecturaMenorAnterior(false);
      setDatosInsuficientes(false);

      if (!medidor) return;

      const ultimaLectura = medidor.ultima_lectura;
      const promedioMensual = medidor.consumo_promedio_mensual;
      const lecturaNum = parseFloat(lecturaActual);
      const lecturaValida = !isNaN(lecturaNum) && lecturaActual.trim() !== '' && lecturaNum >= 0;
      const esNormalOConLectura = esNormal || (esDano && lecturaValida);

      if (!esNormalOConLectura) {
        return;
      }

      if (!lecturaValida) {
        return;
      }

      if (ultimaLectura == null || !Number.isFinite(ultimaLectura)) {
        setDatosInsuficientes(true);
        return;
      }

      if (lecturaNum < ultimaLectura) {
        setLecturaMenorAnterior(true);
        return;
      }

      setLecturaMenorAnterior(false);

      const consumo = lecturaNum - ultimaLectura;
      setConsumoMensual(consumo);

      if (promedioMensual == null || !Number.isFinite(promedioMensual)) {
        setDatosInsuficientes(true);
        return;
      }

      const umbral = 3 * promedioMensual;
      setUmbralAnomalia(umbral);

      if (consumo > umbral) {
        setEsAnomalia(true);
      }
    });
  }, [medidor, estado, lecturaActual, esNormal, esDano, esInaccesible]);

  const fotoObligatoria = esDano || esAnomalia;

  const solicitarPermisoCamara = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso de cámara requerido',
        'Para cumplir con el requerimiento, la aplicación necesita acceso a la cámara para tomar la foto del medidor cuando es obligatoria (medidor dañado o consumo anómalo). En los casos donde la foto no es obligatoria puedes continuar sin ella.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir configuración', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
    return true;
  };

  const tomarFoto = async () => {
    if (!idLocal) {
      setError('Guarda el borrador primero antes de tomar la foto.');
      return;
    }
    setError(null);
    const tienePermiso = await solicitarPermisoCamara();
    if (!tienePermiso) {
      if (fotoObligatoria) {
        setError('No es posible continuar sin foto cuando el consumo es anómalo o el medidor está dañado. Otorga el permiso de cámara o intenta nuevamente.');
      }
      return;
    }
    setSubiendoFoto(true);
    try {
      const ImagePickerMod: any = ImagePicker;
      const result = await ImagePickerMod.launchCameraAsync?.({
        mediaTypes: ImagePickerMod.MediaTypeOptions?.Images || ['images'],
        allowsEditing: false,
        quality: 0.7,
        exif: false,
      });
      if (!result || result.canceled || !result.assets || result.assets.length === 0) {
        setSubiendoFoto(false);
        return;
      }
      const asset = result.assets[0];
      const uri = asset.uri;
      let finalUri = uri;
      try {
        const FS: any = FileSystem;
        if (FS) {
          const baseDir = FS.documentDirectory || FS.cacheDirectory;
          if (baseDir) {
            const destDir = baseDir.endsWith('/') ? baseDir + 'fotos_medidores/' : baseDir + '/fotos_medidores/';
            if (FS.makeDirectoryAsync) {
              await FS.makeDirectoryAsync(destDir, { intermediates: true });
            }
            const fileName = `medidor_${codigo || 'x'}_${Date.now()}_${idLocal}.jpg`;
            const destUri = destDir + fileName;
            if (FS.copyAsync) {
              await FS.copyAsync({ from: uri, to: destUri });
              finalUri = destUri;
            } else if (FS.moveAsync) {
              await FS.moveAsync({ from: uri, to: destUri });
              finalUri = destUri;
            }
          }
        }
      } catch {
        finalUri = uri;
      }
      setFotoUri(finalUri);
      const guardado = guardarFotoLectura(idLocal, finalUri);
      if (!guardado.ok) {
        setError(guardado.error);
      } else {
        setFormularioModificado(true);
      }
    } catch (e: any) {
      setError(e?.message || 'No se pudo tomar o guardar la foto.');
    } finally {
      setSubiendoFoto(false);
    }
  };

  const filaDato = (etiqueta: string, valor: string | number | null | undefined) => (
    <View style={styles.fila} key={etiqueta}>
      <ThemedText type="smallBold" style={styles.etiqueta} themeColor="textSecondary">
        {etiqueta}
      </ThemedText>
      <ThemedText type="code" style={styles.valor} themeColor="text">
        {valor == null || valor === '' ? '—' : String(valor)}
      </ThemedText>
    </View>
  );

  const handleSeleccionarEstado = (valor: EstadoMedidor) => {
    setEstado(valor);
    setError(null);
    setFormularioModificado(true);
    if (valor === 'inaccesible') {
      setLecturaActual('');
    } else if (valor === 'normal') {
      setMotivoInaccesibilidad('');
      setDescripcionDano('');
    } else if (valor === 'dano') {
      setMotivoInaccesibilidad('');
    }
  };

  const handleGuardar = async () => {
    setError(null);
    setExito(null);

    if (!codigo) {
      setError('No se especificó el código del medidor.');
      return;
    }

    if (!medidor) {
      setError('No se encontró la información del medidor.');
      return;
    }

    if (esNormal) {
      const lecturaNum = parseFloat(lecturaActual);
      if (lecturaActual.trim() === '' || isNaN(lecturaNum) || lecturaNum < 0) {
        setError('Para estado normal, ingrese una lectura actual válida (número no negativo).');
        return;
      }
      const ultimaLectura = medidor.ultima_lectura;
      if (ultimaLectura != null && Number.isFinite(ultimaLectura) && lecturaNum < ultimaLectura) {
        setError('La lectura actual no puede ser inferior a la última lectura registrada. Verifique el valor ingresado.');
        return;
      }
    }

    if (esInaccesible && !motivoInaccesibilidad.trim()) {
      setError('Para estado inaccesible, debe indicar el motivo de inaccesibilidad.');
      return;
    }

    if (esDano && !descripcionDano.trim()) {
      setError('Para estado dañado, debe indicar la descripción del daño.');
      return;
    }

    if (esDano && lecturaActual.trim() !== '') {
      const lecturaNum = parseFloat(lecturaActual);
      if (isNaN(lecturaNum) || lecturaNum < 0) {
        setError('La lectura ingresada debe ser un número válido no negativo.');
        return;
      }
      const ultimaLectura = medidor.ultima_lectura;
      if (ultimaLectura != null && Number.isFinite(ultimaLectura) && lecturaNum < ultimaLectura) {
        setError('La lectura actual no puede ser inferior a la última lectura registrada. Verifique el valor ingresado.');
        return;
      }
    }

    if (esAnomalia && !confirmacionRevisada) {
      setError('Se detectó consumo anómalo. Confirme que ha revisado el medidor antes de guardar.');
      return;
    }

    if ((esDano || esAnomalia) && !fotoUri) {
      setError('La foto del medidor es obligatoria cuando el medidor está dañado o cuando hay consumo anómalo.');
      return;
    }

    setGuardando(true);
    try {
      // Asegurar que la base de datos esta inicializada antes de cualquier operacion SQLite
      inicializarBaseDeDatos();

      let idLocalParaGuardar = idLocal;

      // Si no hay borrador existente, crear uno nuevo
      if (!idLocalParaGuardar) {
        const id = await generarUUID();
        const borrador = crearLecturaBorrador(medidor.codigo, mes, anio, id);

        if (!borrador.ok) {
          setError(borrador.error);
          setGuardando(false);
          return;
        }

        idLocalParaGuardar = borrador.lectura.id_local;
        setIdLocal(idLocalParaGuardar);
        setEsBorradorExistente(true);
      }

      const campos = construirCampos();

      const actualizada = actualizarLecturaCompleta(idLocalParaGuardar, campos);

      if (!actualizada.ok) {
        setError(actualizada.error);
        setGuardando(false);
        return;
      }

      if (fotoUri) {
        guardarFotoLectura(idLocalParaGuardar, fotoUri);
      }

      // Marcar como pendiente de verificar (R4). Si hay conexión, se marca pendiente;
      // si no hay, igual se guarda localmente como pendiente para verificar al recuperar conexión.
      try {
        const conectado = await hayConexion();
        marcarLecturaComoPendiente(idLocalParaGuardar);
        if (conectado) {
          setExito('Lectura guardada y marcada como pendiente de verificar (con conexión). Se comparará con la anterior al sincronizar.');
        } else {
          setExito('Lectura guardada sin conexión. Marcada como pendiente de verificar. Se comparará con la anterior cuando se recupere la conexión.');
        }
      } catch {
        marcarLecturaComoPendiente(idLocalParaGuardar);
        setExito('Lectura guardada como pendiente de verificar.');
      }
      actualizarContador();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error inesperado al guardar la lectura.';
      setError(`Error al guardar: ${mensaje}`);
    } finally {
      setGuardando(false);
    }
  };

  const handleVolver = () => {
    router.back();
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
          Registro de lectura de medidor
        </ThemedText>
        <ThemedView style={styles.statusRow}>
          <ThemedText type="small" style={styles.statusText} themeColor="text">
            {isConnected === false ? '● Sin conexión' : '● Conectado'}
          </ThemedText>
          {pendingCount > 0 && (
            <ThemedText type="small" style={styles.statusText} themeColor="text">
              | Pendientes: {pendingCount}
            </ThemedText>
          )}
        </ThemedView>
        {isConnected !== false && pendingCount > 0 && (
          <Pressable
            style={styles.syncButton}
            onPress={() => {
              sincronizarPendientes()
                .then(() => actualizarContador())
                .catch(() => actualizarContador());
            }}>
            <ThemedText type="smallBold" style={styles.syncButtonText} themeColor="text">
              Sincronizar ahora
            </ThemedText>
          </Pressable>
        )}
      </ThemedView>

      <ThemedView type="backgroundLight" style={styles.card}>
        <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
          Medidor
        </ThemedText>
        {medidor && (
          <>
            {filaDato('Código', medidor.codigo)}
            {filaDato('Dirección', medidor.direccion)}
            {filaDato('Sector', medidor.sector)}
            {filaDato('Número de cuenta', medidor.numero_cuenta)}
            {filaDato('Estado', medidor.estado)}
          </>
        )}
        {!medidor && codigo && (
          <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
            No hay información detallada del código {codigo} en caché local.
          </ThemedText>
        )}

      {esBorradorExistente && idLocal && (
        <ThemedView style={[styles.card, styles.cardBorradorExistente]}>
          <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
            Borrador recuperado
          </ThemedText>
          <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
            Se cargaron los valores guardados previamente para este medidor. Puede modificarlos y guardar los cambios.
          </ThemedText>
        </ThemedView>
      )}
      
      <View style={styles.divisor} />
        <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
          Datos de la lectura
        </ThemedText>

        <ThemedText type="smallBold" style={styles.label} themeColor="primaryDark">
          Estado del medidor
        </ThemedText>
        <View style={styles.estadoRow}>
          <Pressable
            style={[styles.estadoBoton, estado === 'normal' && styles.estadoBotonActivo]}
            onPress={() => handleSeleccionarEstado('normal')}>
            <ThemedText type="smallBold" style={styles.estadoTexto} themeColor="primaryDark">
              Normal
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.estadoBoton, estado === 'inaccesible' && styles.estadoBotonActivo]}
            onPress={() => handleSeleccionarEstado('inaccesible')}>
            <ThemedText type="smallBold" style={styles.estadoTexto} themeColor="primaryDark">
              Inaccesible
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.estadoBoton, estado === 'dano' && styles.estadoBotonActivo]}
            onPress={() => handleSeleccionarEstado('dano')}>
            <ThemedText type="smallBold" style={styles.estadoTexto} themeColor="primaryDark">
              Dañado
            </ThemedText>
          </Pressable>
        </View>

        {!esInaccesible && (
          <>
            <ThemedText type="smallBold" style={[styles.label, styles.mt]} themeColor="primaryDark">
              Lectura actual
            </ThemedText>
            <TextInput
              style={styles.input}
              value={lecturaActual}
              onChangeText={(valor) => {
                setLecturaActual(valor);
                setFormularioModificado(true);
              }}
              placeholder="0"
              keyboardType="numeric"
              autoComplete="off"
              spellCheck={false}
            />
            {esNormal && lecturaActual.trim() === '' && (
              <ThemedText type="small" style={styles.campoRequerido} themeColor="error">
                Campo obligatorio para estado normal.
              </ThemedText>
            )}
          </>
        )}

        {esInaccesible && (
          <>
            <ThemedText type="smallBold" style={[styles.label, styles.mt]} themeColor="primaryDark">
              Motivo de inaccesibilidad
            </ThemedText>
            <TextInput
              style={styles.input}
              value={motivoInaccesibilidad}
              onChangeText={(valor) => {
                setMotivoInaccesibilidad(valor);
                setFormularioModificado(true);
              }}
              placeholder="Ej. cerradura bloqueada, acceso denegado"
              autoComplete="off"
              spellCheck={false}
            />
            {!motivoInaccesibilidad.trim() && (
              <ThemedText type="small" style={styles.campoRequerido} themeColor="error">
                Campo obligatorio para estado inaccesible.
              </ThemedText>
            )}
          </>
        )}

        {esDano && (
          <>
            <ThemedText type="smallBold" style={[styles.label, styles.mt]} themeColor="primaryDark">
              Descripción del daño
            </ThemedText>
            <TextInput
              style={styles.input}
              value={descripcionDano}
              onChangeText={(valor) => {
                setDescripcionDano(valor);
                setFormularioModificado(true);
              }}
              placeholder="Ej. medidor roto, fuga en la conexión"
              autoComplete="off"
              spellCheck={false}
            />
            {!descripcionDano.trim() && (
              <ThemedText type="small" style={styles.campoRequerido} themeColor="error">
                Campo obligatorio para estado dañado.
              </ThemedText>
            )}
            <ThemedText type="smallBold" style={[styles.label, styles.mt]} themeColor="text">
              Lectura actual (opcional)
            </ThemedText>
            <TextInput
              style={styles.input}
              value={lecturaActual}
              onChangeText={(valor) => {
                setLecturaActual(valor);
                setFormularioModificado(true);
              }}
              placeholder="0"
              keyboardType="numeric"
              autoComplete="off"
              spellCheck={false}
            />
          </>
        )}

                {!esInaccesible && (
                  <>
                    {(consumoMensual !== null || lecturaMenorAnterior || datosInsuficientes) && (
                      <ThemedView style={[styles.card, styles.cardConsumo]}>
                        <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="text">
                          Consumo mensual
                        </ThemedText>
                        {lecturaMenorAnterior && (
                          <ThemedView style={styles.warningBanner}>
                            <ThemedText type="small" style={styles.warningText} themeColor="text">
                              La lectura actual es menor que la última lectura registrada. Verifique el valor ingresado antes de guardar.
                            </ThemedText>
                          </ThemedView>
                        )}
                        {datosInsuficientes && (
                          <ThemedView style={styles.warningBanner}>
                            <ThemedText type="small" style={styles.warningText} themeColor="text">
                              No se puede determinar el consumo con certeza: faltan datos de referencia (última lectura o promedio mensual). Es posible continuar, pero se recomienda validar los valores.
                            </ThemedText>
                          </ThemedView>
                        )}
                        {consumoMensual !== null && !lecturaMenorAnterior && !datosInsuficientes && (
                  <>
                    <ThemedText type="small" style={styles.consumoTexto} themeColor="text">
                      Consumo mensual: {consumoMensual.toFixed(2)}
                    </ThemedText>
                    {esAnomalia && (
                      <>
                        <ThemedView style={styles.alertBanner}>
                          <ThemedText type="smallBold" style={styles.alertTitle} themeColor="text">
                            ⚠ Consumo anómalo detectado
                          </ThemedText>
                          <ThemedText type="small" style={styles.alertDetail} themeColor="text">
                            Consumo mensual: {consumoMensual.toFixed(2)} &nbsp;|&nbsp; Promedio mensual: {medidor?.consumo_promedio_mensual?.toFixed(2) ?? '—'} &nbsp;|&nbsp; Umbral (3× promedio): {umbralAnomalia?.toFixed(2) ?? '—'}
                          </ThemedText>
                          <Pressable style={styles.confirmRow} onPress={() => setConfirmacionRevisada(!confirmacionRevisada)}>
                            <ThemedText type="small" style={styles.confirmTexto} themeColor="text">
                              {confirmacionRevisada ? '✔ ' : '☐ '}He revisado el medidor y confirmo la lectura.
                            </ThemedText>
                          </Pressable>
                          {!confirmacionRevisada && (
                            <ThemedText type="small" style={styles.alertRequired} themeColor="error">
                              Debe confirmar la revisión antes de guardar.
                            </ThemedText>
                          )}
                        </ThemedView>
                      </>
                    )}
                  </>
                )}
              </ThemedView>
            )}
          </>
        )}
        <View style={styles.divisor} />
        <ThemedView type="backgroundLight" style={[styles.card, { marginTop: Spacing.three }]}>
          <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
            Foto del medidor
          </ThemedText>
          <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
            {fotoObligatoria
              ? 'Obligatoria (medidor dañado o consumo anómalo). Se conservará en el teléfono hasta que se envíe la lectura.'
              : 'Opcional en este caso.'}
          </ThemedText>
          {fotoUri ? (
            <View style={styles.fotoContainer}>
              <Image source={{ uri: fotoUri }} style={styles.fotoPreview} resizeMode="cover" />
              <Pressable style={styles.buttonSecundario} onPress={tomarFoto} disabled={subiendoFoto}>
                <ThemedText type="smallBold" style={styles.buttonTextoSecundario} themeColor="primarySecondary">
                  {subiendoFoto ? 'Guardando...' : 'Tomar otra foto'}
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            <Pressable style={[styles.button, subiendoFoto && styles.buttonDisabled]} disabled={subiendoFoto} onPress={tomarFoto}>
              <ThemedText type="smallBold" style={styles.buttonText} themeColor="text">
                {subiendoFoto ? 'Abriendo cámara...' : 'Tomar foto del medidor'}
              </ThemedText>
            </Pressable>
          )}
          {fotoObligatoria && !fotoUri && (
            <ThemedText type="small" style={styles.campoRequerido} themeColor="error">
              Se requiere foto para guardar esta lectura.
            </ThemedText>
          )}
        </ThemedView>

        {error && (
          <ThemedView style={styles.errorBanner}>
            <ThemedText type="small" style={styles.errorText} themeColor="text">
              {error}
            </ThemedText>
          </ThemedView>
        )}

        {exito && (
          <ThemedView style={styles.exitoBanner}>
            <ThemedText type="small" style={styles.exitoText} themeColor="text">
              {exito}
            </ThemedText>
          </ThemedView>
        )}
        <View style={styles.divisor} />
        <Pressable
          style={[styles.button, guardando && styles.buttonDisabled]}
          disabled={guardando}
          onPress={handleGuardar}>
          <ThemedText type="smallBold" style={styles.buttonText} themeColor="text">
            {guardando ? 'Guardando...' : 'Guardar lectura'}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.buttonSecundario} onPress={handleVolver}>
          <ThemedText type="smallBold" style={styles.buttonTextoSecundario} themeColor="primarySecondary">
            Volver a la consulta
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
    paddingHorizontal: Spacing.half,
    paddingBottom: Spacing.six,
    gap: Spacing.half,
  },
  header: {
    paddingVertical: Spacing.four,
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
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
  },
  syncButton: {
    marginTop: Spacing.two,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
  card: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    alignSelf: 'center',
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
  label: {
    fontSize: 14,
    fontWeight: 800,
    marginBottom: Spacing.half,
  },
  mt: {
    marginTop: Spacing.four,
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
  campoRequerido: {
    marginTop: Spacing.half,
    marginBottom: Spacing.two,
  },
  estadoRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  estadoBoton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: Spacing.two,
    backgroundColor: '#ffffff',
  },
  estadoBotonActivo: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  estadoTexto: {
    fontSize: 14,
    fontWeight: 700,
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
  exitoBanner: {
    backgroundColor: '#e7f4ea',
    borderWidth: 1,
    borderColor: '#2e8b57',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
  exitoText: {
    color: '#1e6b43',
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
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.six,
  },
  mensajeResultado: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardBorradorExistente: {
    borderColor: '#b08d1e',
    backgroundColor: 'rgba(176, 141, 30, 0.05)',
  },
  cardConsumo: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(3, 90, 166, 0.05)',
  },
  fotoContainer: {
    gap: Spacing.three,
    alignItems: 'center',
  },
  fotoPreview: {
    width: '100%',
    height: 220,
    borderRadius: Spacing.two,
    backgroundColor: '#e5e5e5',
  },
  warningBanner: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#b08d1e',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
  warningText: {
    color: '#856404',
    fontSize: 13,
  },
  consumoTexto: {
    fontSize: 14,
    fontWeight: 700,
    color: Colors.light.primary,
    marginBottom: Spacing.two,
  },
  alertBanner: {
    backgroundColor: '#fdecea',
    borderWidth: 1,
    borderColor: Colors.light.error,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
  alertTitle: {
    color: Colors.light.error,
    fontSize: 14,
    fontWeight: 700,
    marginBottom: Spacing.one,
  },
  alertDetail: {
    color: Colors.light.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: Spacing.two,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  confirmTexto: {
    fontSize: 13,
    color: Colors.light.text,
  },
  alertRequired: {
    color: Colors.light.error,
    fontSize: 12,
    fontWeight: 700,
    marginTop: Spacing.one,
  },
  divisor: {
    height: 1,
    backgroundColor: '#cccccc',
    marginVertical: Spacing.three,
  },
});
