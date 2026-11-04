/*Mensaje de resultado (error o éxito) que aparece sobre el formulario.
El color y el ícono permiten distinguir el tipo sin leer el texto. */

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, ZoomIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { MedidoresColors, Spacing } from '@/constants/theme';

export function Aviso({ tipo, mensaje }: { tipo: 'error' | 'exito'; mensaje: string }) {
  const esError = tipo === 'error';
  const color = esError ? MedidoresColors.error : '#22704F';
  return (
    <Animated.View
      key={`${tipo}-${mensaje}`}
      entering={FadeInDown.springify().damping(15)}
      exiting={FadeOutUp.duration(200)}
      accessibilityRole="alert"
      style={[styles.caja, { backgroundColor: esError ? '#FEE2E2' : '#E3F3EA', borderColor: color }]}>
      <Animated.View entering={ZoomIn.delay(150).springify().damping(10)}>
        <Ionicons name={esError ? 'alert-circle-outline' : 'checkmark-circle-outline'} size={18} color={color} />
      </Animated.View>
      <ThemedText type="small" style={[styles.texto, { color }]}>
        {mensaje}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  caja: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.four,
  },
  texto: { flex: 1, fontSize: 13, fontWeight: '600' },
});