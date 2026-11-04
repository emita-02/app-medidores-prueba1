import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
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
import { Spacing } from '@/constants/theme';

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
    <View style={styles.fila}>
      <View style={styles.grupo}>
        <Animated.View style={estiloPunto}>
          <ThemedText type="small" style={styles.texto} themeColor="text">●</ThemedText>
        </Animated.View>
        <ThemedText type="small" style={styles.texto} themeColor="text">
          {conectado ? 'Conectado' : 'Sin conexión'}
        </ThemedText>
      </View>

      {pendingCount > 0 && (
        <Animated.View entering={FadeInRight} exiting={FadeOutRight}>
          <Animated.View style={estiloContador}>
            <ThemedText type="small" style={styles.texto} themeColor="text">
              | Pendientes: {pendingCount}
            </ThemedText>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', gap: Spacing.two },
  grupo: { flexDirection: 'row', gap: 4 },
  texto: { fontSize: 12, color: '#ffffff', fontWeight: '600' },
});