import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeInRight,
  FadeOutRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';

type Props = { isConnected: boolean | null; pendingCount: number };

export function EstadoConexion({ isConnected, pendingCount }: Props) {
  const conectado = isConnected !== false;

  const opacidadPunto = useSharedValue(1);
  const escalaContador = useSharedValue(1);
  const primerRender = useRef(true);

  // Latido del punto: lento con conexión, más rápido y marcado sin conexión.
  useEffect(() => {
    cancelAnimation(opacidadPunto);
    const minimo = conectado ? 0.35 : 0.15;
    const duracion = conectado ? 900 : 450;
    opacidadPunto.set(
      withRepeat(
        withSequence(withTiming(minimo, { duration: duracion }), withTiming(1, { duration: duracion })),
        -1,
      ),
    );
    return () => cancelAnimation(opacidadPunto);
  }, [conectado, opacidadPunto]);

  // "Pop" del contador cuando cambia el número (no en el primer render).
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    escalaContador.set(withSequence(withTiming(1.3, { duration: 120 }), withSpring(1, { damping: 8 })));
  }, [pendingCount, escalaContador]);

  const estiloPunto = useAnimatedStyle(() => ({ opacity: opacidadPunto.get() }));
  const estiloContador = useAnimatedStyle(() => ({ transform: [{ scale: escalaContador.get() }] }));

  return (
    <View className="flex-row gap-2">
      <View className="flex-row gap-1">
        <Animated.View style={estiloPunto}>
          <ThemedText type="small" className="text-[12px] font-semibold text-white">●</ThemedText>
        </Animated.View>
        <ThemedText type="small" className="text-[12px] font-semibold text-white">
          {conectado ? 'Conectado' : 'Sin conexión'}
        </ThemedText>
      </View>

      {pendingCount > 0 && (
        <Animated.View entering={FadeInRight} exiting={FadeOutRight}>
          <Animated.View style={estiloContador}>
            <ThemedText type="small" className="text-[12px] font-semibold text-white">
              | Pendientes: {pendingCount}
            </ThemedText>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}
