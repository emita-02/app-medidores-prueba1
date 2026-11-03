/*Campo de texto con etiqueta, estado de foco, mensaje de error y
si es una contraseña, el boton para mostrarla u ocultarla */

import { Ionicons } from '@expo/vector-icons';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MedidoresColors, Spacing } from '@/constants/theme';

type Props = TextInputProps & {
  etiqueta: string;
  error?: string | null;
  esClave?: boolean;
  icono?: keyof typeof Ionicons.glyphMap;
  pie?: ReactNode;
};

export function CampoTexto({ etiqueta, error, esClave = false, icono, pie, style, ...props }: Props) {
  const [claveVisible, setClaveVisible] = useState(false);
  const iconoFinal =
    icono ??
    (esClave ? 'lock-closed-outline' : props.keyboardType === 'email-address' ? 'mail-outline' : 'person-outline');

  return (
    <View style={styles.formGroup}>
      <ThemedText type="smallBold" style={styles.label} themeColor="primaryDark">
        {etiqueta}
      </ThemedText>
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <Ionicons name={iconoFinal} size={20} color={MedidoresColors.primary} style={styles.inputIcon} />
        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholderTextColor="#999"
          secureTextEntry={esClave && !claveVisible}
          autoCapitalize={props.autoCapitalize ?? 'none'}
          autoCorrect={false}
          spellCheck={false}
          accessibilityLabel={etiqueta}
        />
        {esClave && (
          <Pressable
            onPress={() => setClaveVisible((v) => !v)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={claveVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
            <Ionicons
              name={claveVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={MedidoresColors.primary}
            />
          </Pressable>
        )}
      </View>
      {error ? (
        <ThemedText type="small" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
      {pie}
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: { marginBottom: Spacing.four },
  label: { fontSize: 13, fontWeight: '700', marginBottom: Spacing.half },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
  },
  inputError: { borderColor: MedidoresColors.error },
  inputIcon: { marginRight: Spacing.two },
  input: { flex: 1, fontSize: 16, color: '#1E293B', paddingVertical: 0 },
  error: { color: MedidoresColors.error, fontSize: 13, fontWeight: '600', marginTop: Spacing.one },
});

