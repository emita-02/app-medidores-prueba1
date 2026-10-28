import React from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/services/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();
  const [employeeCode, setEmployeeCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setError(null);

    if (!employeeCode.trim()) {
      setError('Ingrese su código de empleado.');
      return;
    }

    if (!password.trim()) {
      setError('Ingrese su contraseña.');
      return;
    }

    setLoading(true);

    try {
      await login(employeeCode);
      router.replace('/');
    } catch {
      setError('No se pudo iniciar sesión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.scrollView}
      keyboardShouldPersistTaps="handled">
      <ThemedView type="primaryDark" style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle} themeColor="text">
          EPMAPS
        </ThemedText>
        <ThemedText type="smallBold" style={styles.headerSubtitle} themeColor="textSecondary">
          Registro de lecturas de medidores
        </ThemedText>
      </ThemedView>

      <ThemedView type="backgroundLight" style={styles.card}>
        <ThemedText type="smallBold" style={styles.label} themeColor="text">
          Código de empleado
        </ThemedText>
        <TextInput
          style={styles.input}
          value={employeeCode}
          onChangeText={setEmployeeCode}
          placeholder="EMP-001"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
        />

        <ThemedText type="smallBold" style={[styles.label, styles.mt]} themeColor="text">
          Contraseña
        </ThemedText>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          autoComplete="off"
          spellCheck={false}
        />

        {error && (
          <ThemedView style={styles.errorBanner}>
            <ThemedText type="small" style={styles.errorText} themeColor="text">
              {error}
            </ThemedText>
          </ThemedView>
        )}

        <Pressable
          style={[styles.button, (loading || authLoading) && styles.buttonDisabled]}
          disabled={loading || authLoading}
          onPress={handleLogin}>
          <ThemedText type="smallBold" style={styles.buttonText} themeColor="text">
            {loading || authLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </ThemedText>
        </Pressable>

        <ThemedText type="small" style={styles.demoHint} themeColor="textSecondary">
          Credenciales de demostración:{' '}
          <ThemedText type="code" style={styles.demoCode} themeColor="textSecondary">
            EMP-001 / clave123
          </ThemedText>
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundLight,
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 800,
  },
  headerSubtitle: {
    marginTop: Spacing.half,
    fontSize: 14,
  },
  card: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  label: {
    fontSize: 14,
    fontWeight: 800,
    marginBottom: Spacing.half,
  },
  mt: {
    marginTop: Spacing.four,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    color: '#000000',
    minHeight: 52,
  },
  errorBanner: {
    backgroundColor: '#fdecea',
    borderWidth: 1,
    borderColor: Colors.light.error,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.one,
    minHeight: 52,
  },
  buttonDisabled: {
    backgroundColor: '#9cc3e6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 700,
  },
  demoHint: {
    marginTop: Spacing.three,
    textAlign: 'center',
    fontSize: 14,
  },
  demoCode: {
    fontWeight: 700,
  },
});
