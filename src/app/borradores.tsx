import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SOMBRA_TARJETA } from '@/constants/sombras';
import { obtenerLecturasPorEstado, eliminarLectura, type Lectura } from '@/database/repository';
import { useConnectionStatus } from '@/hooks/use-connection';
import { sincronizarPendientes } from '@/services/sync.service';

import Animated, { FadeIn, FadeInRight, FadeOutLeft, FadeOutRight, LinearTransition } from 'react-native-reanimated';
import { EstadoConexion } from '@/components/animados/estado-conexion';
import { PressableAnimado } from '@/components/animados/pressable-animado';

export default function BorradoresScreen() {
  const router = useRouter();
  const [borradores, setBorradores] = useState<Lectura[]>([]);
  const [cargando, setCargando] = useState(true);
  const { isConnected, pendingCount, actualizarContador } = useConnectionStatus();

  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const lista = obtenerLecturasPorEstado('borrador');
        setBorradores(lista);
      } catch {
        setBorradores([]);
      } finally {
        setCargando(false);
      }
    });
  }, []);

  const formatearFecha = (iso: string): string => {
    return new Date(iso).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDescartar = (idLocal: string) => {
    Alert.alert(
      'Descartar borrador',
      '¿Está seguro de que desea descartar este borrador? Los datos se perderán y el medidor quedará disponible para una nueva lectura del mismo mes.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: () => {
            try {
              const resultado = eliminarLectura(idLocal);
              if (resultado.ok) {
                setBorradores((prev) => prev.filter((b) => b.id_local !== idLocal));
              } else {
                Alert.alert('Error al descartar', resultado.error);
              }
            } catch {
              Alert.alert('Error', 'No se pudo descartar el borrador.');
            }
          },
        },
      ]
    );
  };

  const handleContinuar = (idLocal: string, codigo: string) => {
    router.push(`/lectura?borradorId=${encodeURIComponent(idLocal)}&codigo=${encodeURIComponent(codigo)}`);
  };

  if (cargando) {
    return (
      <ThemedView type="backgroundLight" className="flex-1">
        <ThemedText type="default" className="mt-16 text-center text-[16px] text-apagado">
          Cargando borradores...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      contentContainerClassName="bg-canvas pb-16"
      className="grow bg-canvas"
      keyboardShouldPersistTaps="handled">

      {/* Cabecera institucional moderna */}
      <View className="bg-primary px-8 pb-6 pt-[50px]">
        <View className="flex-row items-center justify-between">
          <View>
            <ThemedText type="title" className="text-[26px] font-black tracking-[1px] text-white" themeColor="text">
              EPMAPS
            </ThemedText>
            <ThemedText type="smallBold" className="mt-0.5 text-[12px] tracking-[2px] text-canvas" themeColor="textSecondary">
              Borradores pendientes
            </ThemedText>
          </View>
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <EstadoConexion isConnected={isConnected} pendingCount={pendingCount}/>

          {isConnected !== false && pendingCount > 0 && (
            <PressableAnimado
              entering={FadeInRight.springify().damping(18)}
              exiting={FadeOutRight}
              className="rounded-lg bg-white/25 px-4 py-1.5"
              onPress={() => {
                sincronizarPendientes()
                  .then(() => actualizarContador())
                  .catch(() => actualizarContador());
              }}>
              <ThemedText type="smallBold" className="text-[12px] text-white" themeColor="text">
                Sincronizar ahora
              </ThemedText>
            </PressableAnimado>
          )}
        </View>
      </View>

      <View className="mx-6 -mt-4 gap-4 rounded-[20px] bg-white p-6" style={SOMBRA_TARJETA}>
        <View className="mb-1 flex-row items-center gap-2">
          <Ionicons name="document-text-outline" size={20} color="#035AA6" />
          <ThemedText type="smallBold" className="text-[16px]" themeColor="primaryDark">
            Registros incompletos
          </ThemedText>
        </View>

        {borradores.length === 0 ? (
          <Animated.View
            entering={FadeIn.delay(250)}
            className="items-center py-8"
          >
            <View className="mb-2">
              <Ionicons name="checkmark-circle-outline" size={48} color="#035AA6" />
            </View>
            <ThemedText type="smallBold" className="mb-1 text-[16px] text-[#0F172A]" themeColor="text">
              No hay borradores pendientes
            </ThemedText>
            <ThemedText type="small" className="text-center text-[13px] text-apagado" themeColor="textSecondary">
              No existen registros incompletos para continuar.
            </ThemedText>
          </Animated.View>
        ) : (
          borradores.map((b, i) => (
            <Animated.View
              key={b.id_local}
              entering={FadeInRight.delay(Math.min(i, 6) * 90).springify().damping(18)}
              exiting={FadeOutLeft.duration(250)}
              layout={LinearTransition}
              className="mb-2 flex-row items-center justify-between rounded-[14px] border border-borde bg-[#F8FAFC] p-4"

            >
              <View className="flex-1 gap-1 pr-2">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="barcode-outline" size={16} color="#035AA6" />
                  <ThemedText type="smallBold" className="text-[15px] text-primary" themeColor="primaryDark">
                    {b.codigo_medidor}
                  </ThemedText>
                </View>
                <ThemedText type="small" className="text-[12px] text-apagado" themeColor="textSecondary">
                  Periodo: {b.mes}/{b.anio} &bull; Estado: <ThemedText className="font-semibold text-tinta">{b.estado_medidor}</ThemedText>
                </ThemedText>
                <ThemedText type="code" className="mt-0.5 text-[11px] text-[#94A3B8]" themeColor="textSecondary">
                  Modificado: {formatearFecha(b.fecha_creacion)}
                </ThemedText>
              </View>
              <View className="w-[100px] gap-2">
                <Pressable className="items-center rounded-[10px] border border-primary bg-[#E0F2FE] px-3 py-2" onPress={() => handleContinuar(b.id_local, b.codigo_medidor)}>
                  <ThemedText type="smallBold" className="text-[13px] text-primary" themeColor="text">
                    Continuar
                  </ThemedText>
                </Pressable>
                <Pressable className="items-center rounded-[10px] border border-error bg-error-suave px-3 py-2" onPress={() => handleDescartar(b.id_local)}>
                  <ThemedText type="smallBold" className="text-[13px] text-error" themeColor="error">
                    Descartar
                  </ThemedText>
                </Pressable>
              </View>
            </Animated.View>
          ))
        )}

        <Pressable className="mt-2 min-h-[52px] items-center justify-center rounded-xl border-[1.5px] border-primary bg-white py-4" onPress={() => router.back()}>
          <ThemedText type="smallBold" className="text-[15px] text-primary" themeColor="primarySecondary">
            Volver al inicio
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}
