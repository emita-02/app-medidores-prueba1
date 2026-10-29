import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
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
  FileSystem = require('expo-file-system/legacy');
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
        // Auto-guardado silencioso
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

      if (!esNormalOConLectura || !lecturaValida) {
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
        'Para cumplir con el requerimiento, la aplicación necesita acceso a la cámara para tomar la foto del medidor cuando es obligatoria.',
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
        setError('No es posible continuar sin foto cuando el consumo es anómalo o el medidor está dañado.');
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
        setError('Para estado normal, ingrese una lectura actual válida.');
        return;
      }
      const ultimaLectura = medidor.ultima_lectura;
      if (ultimaLectura != null && Number.isFinite(ultimaLectura) && lecturaNum < ultimaLectura) {
        setError('La lectura actual no puede ser inferior a la última lectura registrada.');
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
        setError('La lectura actual no puede ser inferior a la última lectura registrada.');
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
      inicializarBaseDeDatos();
      let idLocalParaGuardar = idLocal;

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

      try {
        const conectado = await hayConexion();
        marcarLecturaComoPendiente(idLocalParaGuardar);
        if (conectado) {
          setExito('Lectura guardada y marcada como pendiente de verificar (con conexión).');
        } else {
          setExito('Lectura guardada sin conexión. Marcada como pendiente de verificar.');
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
      
      {/* Cabecera institucional moderna */}
      <View style={styles.header}>
        <View>
          <ThemedText type="title" style={styles.headerTitle} themeColor="text">
            EPMAPS
          </ThemedText>
          <ThemedText type="smallBold" style={styles.headerSubtitle} themeColor="textSecondary">
            Registro de lectura de medidor
          </ThemedText>
        </View>
        <View style={styles.statusRowContainer}>
          <View style={styles.statusRow}>
            <ThemedText type="small" style={styles.statusText} themeColor="text">
              {isConnected === false ? '● Sin conexión' : '● Conectado'}
            </ThemedText>
            {pendingCount > 0 && (
              <ThemedText type="small" style={styles.statusText} themeColor="text">
                | Pendientes: {pendingCount}
              </ThemedText>
            )}
          </View>
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
        </View>
      </View>

      <View style={styles.cardContainer}>
        {/* Tarjeta Detalle del Medidor */}
        <View style={styles.subCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="information-circle-outline" size={20} color="#035AA6" />
            <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
              Detalle del medidor
            </ThemedText>
          </View>
          {medidor && (
            <View style={styles.datos}>
              {filaDato('Código', medidor.codigo)}
              {filaDato('Dirección', medidor.direccion)}
              {filaDato('Sector', medidor.sector)}
              {filaDato('Número de cuenta', medidor.numero_cuenta)}
              {filaDato('Estado', medidor.estado)}
            </View>
          )}
          {!medidor && codigo && (
            <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
              No hay información detallada del código {codigo} en caché local.
            </ThemedText>
          )}
        </View>

        {esBorradorExistente && idLocal && (
          <View style={[styles.subCard, styles.cardBorradorExistente]}>
            <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
              Borrador recuperado
            </ThemedText>
            <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
              Se cargaron los valores guardados previamente para este medidor. Puede modificarlos y guardar los cambios.
            </ThemedText>
          </View>
        )}
      
        {/* Tarjeta Datos de Lectura */}
        <View style={styles.subCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="create-outline" size={20} color="#035AA6" />
            <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
              Datos de la lectura
            </ThemedText>
          </View>

          <ThemedText type="smallBold" style={styles.label} themeColor="primaryDark">
            Estado del medidor
          </ThemedText>
          <View style={styles.estadoRow}>
            <Pressable
              style={[styles.estadoBoton, estado === 'normal' && styles.estadoBotonActivo]}
              onPress={() => handleSeleccionarEstado('normal')}>
              <ThemedText type="smallBold" style={[styles.estadoTexto, estado === 'normal' && styles.estadoTextoActivo]}>
                Normal
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.estadoBoton, estado === 'inaccesible' && styles.estadoBotonActivo]}
              onPress={() => handleSeleccionarEstado('inaccesible')}>
              <ThemedText type="smallBold" style={[styles.estadoTexto, estado === 'inaccesible' && styles.estadoTextoActivo]}>
                Inaccesible
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.estadoBoton, estado === 'dano' && styles.estadoBotonActivo]}
              onPress={() => handleSeleccionarEstado('dano')}>
              <ThemedText type="smallBold" style={[styles.estadoTexto, estado === 'dano' && styles.estadoTextoActivo]}>
                Dañado
              </ThemedText>
            </Pressable>
          </View>

          {esNormal && (
            <>
              <ThemedText type="smallBold" style={[styles.label, styles.mt]} themeColor="primaryDark">
                Lectura actual
              </ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons name="speedometer-outline" size={20} color="#035AA6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={lecturaActual}
                  onChangeText={(valor) => {
                    setLecturaActual(valor);
                    setFormularioModificado(true);
                  }}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  autoComplete="off"
                  spellCheck={false}
                />
              </View>
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
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={motivoInaccesibilidad}
                  onChangeText={(valor) => {
                    setMotivoInaccesibilidad(valor);
                    setFormularioModificado(true);
                  }}
                  placeholder="Ej. cerradura bloqueada, acceso denegado"
                  placeholderTextColor="#999"
                  autoComplete="off"
                  spellCheck={false}
                />
              </View>
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
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={descripcionDano}
                  onChangeText={(valor) => {
                    setDescripcionDano(valor);
                    setFormularioModificado(true);
                  }}
                  placeholder="Ej. medidor roto, fuga en la conexión"
                  placeholderTextColor="#999"
                  autoComplete="off"
                  spellCheck={false}
                />
              </View>
              {!descripcionDano.trim() && (
                <ThemedText type="small" style={styles.campoRequerido} themeColor="error">
                  Campo obligatorio para estado dañado.
                </ThemedText>
              )}
              <ThemedText type="smallBold" style={[styles.label, styles.mt]} themeColor="primaryDark">
                Lectura actual (opcional)
              </ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={lecturaActual}
                  onChangeText={(valor) => {
                    setLecturaActual(valor);
                    setFormularioModificado(true);
                  }}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  autoComplete="off"
                  spellCheck={false}
                />
              </View>
            </>
          )}

          {!esInaccesible && (
            <>
              {(consumoMensual !== null || lecturaMenorAnterior || datosInsuficientes) && (
                <View style={[styles.subCard, styles.cardConsumo]}>
                  <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="text">
                    Consumo mensual
                  </ThemedText>
                  {lecturaMenorAnterior && (
                    <View style={styles.warningBanner}>
                      <ThemedText type="small" style={styles.warningText} themeColor="text">
                        La lectura actual es menor que la última lectura registrada. Verifique el valor ingresado.
                      </ThemedText>
                    </View>
                  )}
                  {datosInsuficientes && (
                    <View style={styles.warningBanner}>
                      <ThemedText type="small" style={styles.warningText} themeColor="text">
                        No se puede determinar el consumo con certeza: faltan datos de referencia.
                      </ThemedText>
                    </View>
                  )}
                  {consumoMensual !== null && !lecturaMenorAnterior && !datosInsuficientes && (
                    <>
                      <ThemedText type="small" style={styles.consumoTexto} themeColor="text">
                        Consumo mensual: {consumoMensual.toFixed(2)} M³
                      </ThemedText>
                      {esAnomalia && (
                        <View style={styles.alertBanner}>
                          <ThemedText type="smallBold" style={styles.alertTitle} themeColor="error">
                            ⚠ Consumo anómalo detectado
                          </ThemedText>
                          <ThemedText type="small" style={styles.alertDetail} themeColor="text">
                            Consumo: {consumoMensual.toFixed(2)} | Promedio: {medidor?.consumo_promedio_mensual?.toFixed(2) ?? '—'}
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
                        </View>
                      )}
                    </>
                  )}
                </View>
              )}
            </>
          )}
        </View>

        {/* Tarjeta Foto del Medidor */}
        <View style={styles.subCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="camera-outline" size={20} color="#035AA6" />
            <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
              Foto del medidor
            </ThemedText>
          </View>
          <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
            {fotoObligatoria
              ? 'Obligatoria (medidor dañado o consumo anómalo).'
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
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <ThemedText type="small" style={styles.errorText} themeColor="text">
              {error}
            </ThemedText>
          </View>
        )}

        {exito && (
          <View style={styles.exitoBanner}>
            <ThemedText type="small" style={styles.exitoText} themeColor="text">
              {exito}
            </ThemedText>
          </View>
        )}

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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  contentContainer: {
    paddingBottom: Spacing.six,
  },
  header: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.five,
    backgroundColor: '#035AA6',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F2F2F2',
    letterSpacing: 2,
    marginTop: 2,
  },
  statusRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  syncButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 8,
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardContainer: {
    marginHorizontal: Spacing.four,
    marginTop: -Spacing.three,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    gap: Spacing.four,
  },
  subCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  etiqueta: {
    color: '#64748B',
    flex: 1,
    paddingRight: Spacing.two,
    fontSize: 13,
  },
  valor: {
    fontSize: 13,
    color: '#0F172A',
    flexShrink: 1,
    textAlign: 'right',
    fontWeight: '600',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: Spacing.half,
  },
  mt: {
    marginTop: Spacing.three,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 0,
  },
  campoRequerido: {
    marginTop: Spacing.half,
    fontSize: 12,
    fontWeight: '600',
  },
  estadoRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  estadoBoton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  estadoBotonActivo: {
    backgroundColor: '#035AA6',
    borderColor: '#035AA6',
  },
  estadoTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  estadoTextoActivo: {
    color: '#FFFFFF',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#D93030',
    borderRadius: 12,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  errorText: {
    color: '#D93030',
    fontSize: 13,
    fontWeight: '600',
  },
  exitoBanner: {
    backgroundColor: '#E7F4EA',
    borderWidth: 1,
    borderColor: '#2E8B57',
    borderRadius: 12,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  exitoText: {
    color: '#1E6B43',
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#035AA6',
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    shadowColor: '#035AA6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#9CC3E6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonSecundario: {
    borderWidth: 1.5,
    borderColor: '#035AA6',
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonTextoSecundario: {
    color: '#035AA6',
    fontSize: 15,
    fontWeight: '700',
  },
  mensajeResultado: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardBorradorExistente: {
    borderColor: '#D97706',
    backgroundColor: '#FEF3C7',
  },
  cardConsumo: {
    borderColor: '#035AA6',
    backgroundColor: '#E0F2FE',
    marginTop: Spacing.three,
  },
  fotoContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  fotoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  warningBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#D97706',
    borderRadius: 10,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
  warningText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  consumoTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: '#035AA6',
    marginBottom: Spacing.two,
  },
  alertBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#D93030',
    borderRadius: 10,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
  alertTitle: {
    color: '#D93030',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
  alertDetail: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: Spacing.two,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  confirmTexto: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  alertRequired: {
    color: '#D93030',
    fontSize: 12,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
  datos: {
    gap: Spacing.one,
  },
});