import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MedidoresColors, Spacing } from '@/constants/theme';

type Props = {
  texto: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'enlace';
  cargando?: boolean;
  deshabilitado?: boolean;
};

export function Boton({ texto, onPress, variante = 'primario', cargando = false, deshabilitado = false }: Props) {
  const inactivo = cargando || deshabilitado;

  if (variante === 'enlace') {
    return (
      <Pressable onPress={onPress} disabled={inactivo} hitSlop={8} accessibilityRole="link">
        <ThemedText type="smallBold" style={[styles.enlace, inactivo && { opacity: 0.5 }]}>
          {texto}
        </ThemedText>
      </Pressable>
    );
  }

  const primario = variante === 'primario';
  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      style={[
        styles.boton,
        primario ? styles.primario : styles.secundario,
        inactivo && (primario ? styles.primarioInactivo : { opacity: 0.6 }),
      ]}>
      {cargando ? (
        <ActivityIndicator color={primario ? '#FFFFFF' : MedidoresColors.primary} />
      ) : (
        <ThemedText type="smallBold" style={[styles.texto, !primario && { color: MedidoresColors.primary }]}>
          {texto}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    borderRadius: 12,
    paddingVertical: Spacing.three,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  primario: {
    backgroundColor: '#035AA6',
    shadowColor: '#035AA6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primarioInactivo: { backgroundColor: '#9CC3E6' },
  secundario: { borderWidth: 1.5, borderColor: '#035AA6', backgroundColor: 'transparent' },
  texto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  enlace: { color: '#035AA6', textDecorationLine: 'underline' },
});