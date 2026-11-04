import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';


import { ThemedText } from '@/components/themed-text';
import { SOMBRA_BOTON, SOMBRA_TARJETA } from '@/constants/sombras';
import { cn } from '@/lib/cn';
import {
  crearLecturaBorrador,
  actualizarLecturaCompleta,
  obtenerMedidorPorCodigo,
  obtenerLecturaPorId,
  obtenerLecturaPorCodigoYMes,
  inicializarBaseDeDatos,
  guardarFotoLectura,
  marcarLecturaComoPendiente,
} from '@/database/repository';
import { hayConexion } from '@/services/medidor.service';
import { useConnectionStatus } from '@/hooks/use-connection';
import { sincronizarPendientes } from '@/services/sync.service';

import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';


let ImagePicker: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ImagePicker = require('expo-image-picker');
} catch {
  ImagePicker = null;
}
let FileSystem: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  FileSystem = require('expo-file-system/legacy');
} catch {
  FileSystem = null;
}




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
    <View className="flex-row items-center justify-between border-b-[0.5px] border-b-[#F1F5F9] py-1.5" key={etiqueta}>
      <ThemedText type="smallBold" className="flex-1 pr-2 text-[13px] text-apagado" themeColor="textSecondary">
        {etiqueta}
      </ThemedText>
      <ThemedText type="code" className="shrink text-right text-[13px] font-semibold text-[#0F172A]" themeColor="text">
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
      contentContainerClassName="pb-16"
      className="flex-1 bg-canvas"
      keyboardShouldPersistTaps="handled">
      
      {/* Cabecera institucional moderna */}
      <View className="bg-primary px-8 py-6">
        <View>
          <ThemedText type="title" className="text-[26px] font-black tracking-[1px] text-white" themeColor="text">
            EPMAPS
          </ThemedText>
          <ThemedText type="smallBold" className="mt-0.5 text-[12px] tracking-[2px] text-canvas" themeColor="textSecondary">
            Registro de lectura de medidor
          </ThemedText>
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-row gap-2">
            <ThemedText type="small" className="text-[12px] font-semibold text-white" themeColor="text">
              {isConnected === false ? '● Sin conexión' : '● Conectado'}
            </ThemedText>
            {pendingCount > 0 && (
              <ThemedText type="small" className="text-[12px] font-semibold text-white" themeColor="text">
                | Pendientes: {pendingCount}
              </ThemedText>
            )}
          </View>
          {isConnected !== false && pendingCount > 0 && (
            <Pressable
              className="rounded-lg bg-white/25 px-4 py-1.5"
              onPress={() => {
                sincronizarPendientes()
                  .then(() => actualizarContador())
                  .catch(() => actualizarContador());
              }}>
              <ThemedText type="smallBold" className="text-[12px] text-white" themeColor="text">
                Sincronizar ahora
              </ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      <View className="mx-6 -mt-4 gap-6 rounded-[20px] bg-white p-6" style={SOMBRA_TARJETA}>
        {/* Tarjeta Detalle del Medidor */}
        <View className="rounded-[14px] border border-borde bg-[#F8FAFC] p-6">
          <View className="mb-4 flex-row items-center gap-2">
            <Ionicons name="information-circle-outline" size={20} color="#035AA6" />
            <ThemedText type="smallBold" className="text-[16px]" themeColor="primaryDark">
              Detalle del medidor
            </ThemedText>
          </View>
          {medidor && (
            <View className="gap-1">
              {filaDato('Código', medidor.codigo)}
              {filaDato('Dirección', medidor.direccion)}
              {filaDato('Sector', medidor.sector)}
              {filaDato('Número de cuenta', medidor.numero_cuenta)}
              {filaDato('Estado', medidor.estado)}
            </View>
          )}
          {!medidor && codigo && (
            <ThemedText type="small" className="text-[13px] leading-[18px]" themeColor="textSecondary">
              No hay información detallada del código {codigo} en caché local.
            </ThemedText>
          )}
        </View>

        {esBorradorExistente && idLocal && (
          <View className="rounded-[14px] border border-[#D97706] bg-[#FEF3C7] p-6">
            <ThemedText type="smallBold" className="text-[16px]" themeColor="primaryDark">
              Borrador recuperado
            </ThemedText>
            <ThemedText type="small" className="text-[13px] leading-[18px]" themeColor="textSecondary">
              Se cargaron los valores guardados previamente para este medidor. Puede modificarlos y guardar los cambios.
            </ThemedText>
          </View>
        )}
      
        {/* Tarjeta Datos de Lectura */}
        <View className="rounded-[14px] border border-borde bg-[#F8FAFC] p-6">
          <View className="mb-4 flex-row items-center gap-2">
            <Ionicons name="create-outline" size={20} color="#035AA6" />
            <ThemedText type="smallBold" className="text-[16px]" themeColor="primaryDark">
              Datos de la lectura
            </ThemedText>
          </View>

          <ThemedText type="smallBold" className="mb-0.5 text-[13px]" themeColor="primaryDark">
            Estado del medidor
          </ThemedText>
          <View className="flex-row gap-2">
            <Pressable
              className={cn(
                'flex-1 items-center rounded-xl border bg-white py-4',
                estado === 'normal' ? 'border-primary bg-primary' : 'border-borde',
              )}
              onPress={() => handleSeleccionarEstado('normal')}>
              <ThemedText type="smallBold" className={cn('text-[13px]', estado === 'normal' ? 'text-white' : 'text-apagado')}>
                Normal
              </ThemedText>
            </Pressable>
            <Pressable
              className={cn(
                'flex-1 items-center rounded-xl border bg-white py-4',
                estado === 'inaccesible' ? 'border-primary bg-primary' : 'border-borde',
              )}
              onPress={() => handleSeleccionarEstado('inaccesible')}>
              <ThemedText type="smallBold" className={cn('text-[13px]', estado === 'inaccesible' ? 'text-white' : 'text-apagado')}>
                Inaccesible
              </ThemedText>
            </Pressable>
            <Pressable
              className={cn(
                'flex-1 items-center rounded-xl border bg-white py-4',
                estado === 'dano' ? 'border-primary bg-primary' : 'border-borde',
              )}
              onPress={() => handleSeleccionarEstado('dano')}>
              <ThemedText type="smallBold" className={cn('text-[13px]', estado === 'dano' ? 'text-white' : 'text-apagado')}>
                Dañado
              </ThemedText>
            </Pressable>
          </View>

          {esNormal && (
            <>
              <ThemedText type="smallBold" className="mb-0.5 mt-4 text-[13px]" themeColor="primaryDark">
                Lectura actual
              </ThemedText>
              <View className="min-h-[52px] flex-row items-center rounded-xl border border-borde bg-white px-4">
                <View className="mr-2">
                  <Ionicons name="speedometer-outline" size={20} color="#035AA6" />
                </View>
                <TextInput
                  className="flex-1 py-0 text-[16px] text-tinta"
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
                <ThemedText type="small" className="mt-0.5 text-[12px] font-semibold" themeColor="error">
                  Campo obligatorio para estado normal.
                </ThemedText>
              )}
            </>
          )}

          {esInaccesible && (
            <>
              <ThemedText type="smallBold" className="mb-0.5 mt-4 text-[13px]" themeColor="primaryDark">
                Motivo de inaccesibilidad
              </ThemedText>
              <View className="min-h-[52px] flex-row items-center rounded-xl border border-borde bg-white px-4">
                <TextInput
                  className="flex-1 py-0 text-[16px] text-tinta"
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
                <ThemedText type="small" className="mt-0.5 text-[12px] font-semibold" themeColor="error">
                  Campo obligatorio para estado inaccesible.
                </ThemedText>
              )}
            </>
          )}

          {esDano && (
            <>
              <ThemedText type="smallBold" className="mb-0.5 mt-4 text-[13px]" themeColor="primaryDark">
                Descripción del daño
              </ThemedText>
              <View className="min-h-[52px] flex-row items-center rounded-xl border border-borde bg-white px-4">
                <TextInput
                  className="flex-1 py-0 text-[16px] text-tinta"
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
                <ThemedText type="small" className="mt-0.5 text-[12px] font-semibold" themeColor="error">
                  Campo obligatorio para estado dañado.
                </ThemedText>
              )}
              <ThemedText type="smallBold" className="mb-0.5 mt-4 text-[13px]" themeColor="primaryDark">
                Lectura actual (opcional)
              </ThemedText>
              <View className="min-h-[52px] flex-row items-center rounded-xl border border-borde bg-white px-4">
                <TextInput
                  className="flex-1 py-0 text-[16px] text-tinta"
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
                <View className="mt-4 rounded-[14px] border border-primary bg-[#E0F2FE] p-6">
                  <ThemedText type="smallBold" className="text-[16px]" themeColor="text">
                    Consumo mensual
                  </ThemedText>
                  {lecturaMenorAnterior && (
                    <View className="mt-2 rounded-[10px] border border-[#D97706] bg-[#FEF3C7] px-4 py-2">
                      <ThemedText type="small" className="text-[12px] font-semibold text-[#92400E]" themeColor="text">
                        La lectura actual es menor que la última lectura registrada. Verifique el valor ingresado.
                      </ThemedText>
                    </View>
                  )}
                  {datosInsuficientes && (
                    <View className="mt-2 rounded-[10px] border border-[#D97706] bg-[#FEF3C7] px-4 py-2">
                      <ThemedText type="small" className="text-[12px] font-semibold text-[#92400E]" themeColor="text">
                        No se puede determinar el consumo con certeza: faltan datos de referencia.
                      </ThemedText>
                    </View>
                  )}
                  {consumoMensual !== null && !lecturaMenorAnterior && !datosInsuficientes && (
                    <>
                      <ThemedText type="small" className="mb-2 text-[14px] font-bold text-primary" themeColor="text">
                        Consumo mensual: {consumoMensual.toFixed(2)} M³
                      </ThemedText>
                      {esAnomalia && (
                        <View className="mt-2 rounded-[10px] border border-error bg-error-suave px-4 py-4">
                          <ThemedText type="smallBold" className="mb-1 text-[14px] text-error" themeColor="error">
                            ⚠ Consumo anómalo detectado
                          </ThemedText>
                          <ThemedText type="small" className="mb-2 text-[12px] leading-[18px] text-apagado" themeColor="text">
                            Consumo: {consumoMensual.toFixed(2)} | Promedio: {medidor?.consumo_promedio_mensual?.toFixed(2) ?? '—'}
                          </ThemedText>
                          <Pressable className="mt-1 flex-row items-center gap-1" onPress={() => setConfirmacionRevisada(!confirmacionRevisada)}>
                            <ThemedText type="small" className="text-[13px] font-semibold text-tinta" themeColor="text">
                              {confirmacionRevisada ? '✔ ' : '☐ '}He revisado el medidor y confirmo la lectura.
                            </ThemedText>
                          </Pressable>
                          {!confirmacionRevisada && (
                            <ThemedText type="small" className="mt-1 text-[12px] font-bold text-error" themeColor="error">
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
        <View className="rounded-[14px] border border-borde bg-[#F8FAFC] p-6">
          <View className="mb-4 flex-row items-center gap-2">
            <Ionicons name="camera-outline" size={20} color="#035AA6" />
            <ThemedText type="smallBold" className="text-[16px]" themeColor="primaryDark">
              Foto del medidor
            </ThemedText>
          </View>
          <ThemedText type="small" className="text-[13px] leading-[18px]" themeColor="textSecondary">
            {fotoObligatoria
              ? 'Obligatoria (medidor dañado o consumo anómalo).'
              : 'Opcional en este caso.'}
          </ThemedText>
          {fotoUri ? (
            <View className="mt-4 items-center gap-4">
              <Image source={{ uri: fotoUri }} className="h-[200px] w-full rounded-xl bg-borde" resizeMode="cover" />
              <Pressable className="min-h-[52px] items-center justify-center rounded-xl border-[1.5px] border-primary bg-white py-4" onPress={tomarFoto} disabled={subiendoFoto}>
                <ThemedText type="smallBold" className="text-[15px] text-primary" themeColor="primarySecondary">
                  {subiendoFoto ? 'Guardando...' : 'Tomar otra foto'}
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            <Pressable
              className={cn(
                'min-h-[52px] items-center justify-center rounded-xl bg-primary py-4',
                subiendoFoto && 'bg-deshabilitado',
              )}
              style={SOMBRA_BOTON}
              disabled={subiendoFoto}
              onPress={tomarFoto}>
              <ThemedText type="smallBold" className="text-[16px] text-white" themeColor="text">
                {subiendoFoto ? 'Abriendo cámara...' : 'Tomar foto del medidor'}
              </ThemedText>
            </Pressable>
          )}
          {fotoObligatoria && !fotoUri && (
            <ThemedText type="small" className="mt-0.5 text-[12px] font-semibold" themeColor="error">
              Se requiere foto para guardar esta lectura.
            </ThemedText>
          )}
        </View>

        {error && (
          <Animated.View key={error} entering={FadeInDown.springify().damping(15)} exiting={FadeOutUp.duration(200)}>
            <View className="rounded-xl border border-error bg-error-suave px-4 py-2">
              <ThemedText type="small" className="text-[13px] font-semibold text-error">
                {error}
              </ThemedText>
            </View>
          </Animated.View>
        )}

        {exito && (
          <Animated.View key={exito} entering={FadeInDown.springify().damping(15)} exiting={FadeOutUp.duration(200)}>
            <View className="rounded-xl border border-[#2E8B57] bg-[#E7F4EA] px-4 py-2">
              <ThemedText type="small" className="text-[13px] font-semibold text-[#1E6B43]" themeColor="text">
                {exito}
              </ThemedText>
            </View>
          </Animated.View>
        )}

        <Pressable
          className={cn(
            'min-h-[52px] items-center justify-center rounded-xl bg-primary py-4',
            guardando && 'bg-deshabilitado',
          )}
          style={SOMBRA_BOTON}
          disabled={guardando}
          onPress={handleGuardar}>
          <ThemedText type="smallBold" className="text-[16px] text-white" themeColor="text">
            {guardando ? 'Guardando...' : 'Guardar lectura'}
          </ThemedText>
        </Pressable>

        <Pressable className="min-h-[52px] items-center justify-center rounded-xl border-[1.5px] border-primary bg-white py-4" onPress={handleVolver}>
          <ThemedText type="smallBold" className="text-[15px] text-primary" themeColor="primarySecondary">
            Volver a la consulta
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}
