/*Pantalla común para todas las pantallas:
- Centralizar esto en un componente hace que cada pantalla solo se ocupe
de su logica y no tenga que repetir el manejo del teclado ni de las zonas seguras */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { SOMBRA_TARJETA } from '@/constants/sombras';

type Props = { titulo: string; bajada?: string; conVolver?: boolean; children: ReactNode };

export function PantallaHoja({ titulo, bajada, conVolver = false, children }: Props) {
  return (
    <KeyboardAvoidingView className="flex-1 bg-canvas" behavior="padding">
      <ScrollView className="grow pb-16" keyboardShouldPersistTaps="handled">
        <View className="items-center bg-primary px-8 py-6">
          {conVolver && (
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Volver"
              hitSlop={12}
              className="absolute left-4 top-6 p-2">
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
          )}
          <ThemedText type="title" className="text-[24px] font-black tracking-[1px] text-white">
            EPMAPS
          </ThemedText>
          <ThemedText type="smallBold" className="mt-0.5 text-[12px] font-bold tracking-[2px] text-canvas">
            AGUA DE QUITO
          </ThemedText>
        </View>

        <Animated.View
          entering={FadeInDown.delay(100).springify().damping(18)}
          className="mx-6 mt-6 rounded-[20px] bg-white p-8"
          style={SOMBRA_TARJETA}>
          <ThemedText type="title" themeColor="primaryDark" className="text-[22px] font-bold">
            {titulo}
          </ThemedText>
          {bajada ? (
            <ThemedText type="small" themeColor="textSecondary" className="mb-6 mt-1 text-[13px]">
              {bajada}
            </ThemedText>
          ) : null}
          {children}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}