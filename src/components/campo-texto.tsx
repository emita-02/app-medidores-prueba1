/*Campo de texto con etiqueta, estado de foco, mensaje de error y
si es una contraseña, el boton para mostrarla u ocultarla */

import { Ionicons } from '@expo/vector-icons';
import { useState, type ReactNode } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { MedidoresColors } from '@/constants/theme';
import { cn } from '@/lib/cn';

type Props = TextInputProps & {
  etiqueta: string;
  error?: string | null;
  esClave?: boolean;
  icono?: keyof typeof Ionicons.glyphMap;
  pie?: ReactNode;
};

export function CampoTexto({ etiqueta, error, esClave = false, icono, pie, className, style, ...props }: Props) {
  const [claveVisible, setClaveVisible] = useState(false);
  const iconoFinal =
    icono ??
    (esClave ? 'lock-closed-outline' : props.keyboardType === 'email-address' ? 'mail-outline' : 'person-outline');

  return (
    <View className="mb-6">
      <ThemedText type="smallBold" themeColor="primaryDark" className="mb-0.5 text-[13px]">
        {etiqueta}
      </ThemedText>
      <View
        className={cn(
          'min-h-[52px] flex-row items-center rounded-xl border bg-campo px-4',
          error ? 'border-error' : 'border-borde',
        )}>
        <View className="mr-2">
          <Ionicons name={iconoFinal} size={20} color={MedidoresColors.primary} />
        </View>
        <TextInput
          {...props}
          className={cn('flex-1 py-0 text-[16px] text-tinta', className)}
          style={style}
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
        <Animated.View key={error} entering={FadeInDown.springify().damping(15)} exiting={FadeOutUp.duration(150)}>
          <ThemedText type="small" className="mt-1 text-[13px] font-semibold text-error">
            {error}
          </ThemedText>
        </Animated.View>
      ) : null}
      {pie}
    </View>
  );
}