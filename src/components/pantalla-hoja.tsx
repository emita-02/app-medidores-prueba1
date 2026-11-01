/*Pantalla común para todas las pantallas:
- Centralizar esto en un componente hace que cada pantalla solo se ocupe
de su logica y no tenga que repetir el manejo del teclado ni de las zonas seguras */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type Props = { titulo: string; bajada?: string; conVolver?: boolean; children: ReactNode };

export function PantallaHoja({ titulo, bajada, conVolver = false, children }: Props) {
  return (
    <KeyboardAvoidingView style={styles.raiz} behavior="padding">
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          {conVolver && (
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Volver"
              hitSlop={12}
              style={styles.volver}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
          )}
          <ThemedText type="title" style={styles.headerCompanyTitle} themeColor="text">
            EPMAPS
          </ThemedText>
          <ThemedText type="smallBold" style={styles.headerCompanySubtitle} themeColor="textSecondary">
            AGUA DE QUITO
          </ThemedText>
        </View>

        <View style={styles.cardContainer}>
          <ThemedText type="title" style={styles.titulo} themeColor="primaryDark">
            {titulo}
          </ThemedText>
          {bajada ? (
            <ThemedText type="small" style={styles.bajada} themeColor="textSecondary">
              {bajada}
            </ThemedText>
          ) : null}
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#F2F2F2' },
  container: { flexGrow: 1, paddingBottom: Spacing.six },
  header: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    backgroundColor: '#035AA6',
  },
  headerCompanyTitle: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1 },
  headerCompanySubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F2F2F2',
    letterSpacing: 2,
    marginTop: 2,
  },
  volver: { position: 'absolute', left: Spacing.three, top: Spacing.four, padding: Spacing.two },
  cardContainer: {
    marginHorizontal: Spacing.four,
    marginTop: Spacing.four,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.five,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  bajada: { fontSize: 13, marginTop: Spacing.one, marginBottom: Spacing.four },
});