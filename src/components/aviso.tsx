/*Mensaje de resultado (error o exito) que aparece sobre el formulario
La barra lateral de color permite distinguir el tipo sin leer el texto */

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MedidoresColors, Spacing } from '@/constants/theme';

export function Aviso({ tipo, mensaje }: { tipo: 'error' | 'exito'; mensaje: string }) {
  const esError = tipo === 'error';
  const color = esError ? MedidoresColors.error : '#22704F';
  return (
    <View
      accessibilityRole="alert"
      style={[styles.caja, { backgroundColor: esError ? '#FEE2E2' : '#E3F3EA', borderColor: color }]}>
      <Ionicons name={esError ? 'alert-circle-outline' : 'checkmark-circle-outline'} size={18} color={color} />
      <ThemedText type="small" style={[styles.texto, { color }]}>
        {mensaje}
      </ThemedText>
    </View>
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