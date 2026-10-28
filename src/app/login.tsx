import React from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
      await login(employeeCode.trim(), password);
      router.replace('/');
    } catch {
      setError('Código de empleado o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.scrollView}
      keyboardShouldPersistTaps="handled">
      
      {/* Cabecera institucional */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerCompanyTitle} themeColor="text">
          EPMAPS
        </ThemedText>
        <ThemedText type="smallBold" style={styles.headerCompanySubtitle} themeColor="textSecondary">
          AGUA DE QUITO
        </ThemedText>
      </View>
      {/* Logo y Nombre de la App */}
        <View style={styles.appBrandContainer}>
          <Image 
            source={require('@/assets/images/icono_app_aquauio.png')} 
            style={styles.appIcon}
            resizeMode="contain"
          />
          <ThemedText type="title" style={styles.appName} themeColor="primaryDark">
            AquaUIO
          </ThemedText>
          <ThemedText type="small" style={styles.appSubDescription} themeColor="textSecondary">
            Sistema Móvil de Registro de Lecturas
          </ThemedText>
        </View>

      {/* Contenedor principal estilo Tarjeta */}
      <View style={styles.cardContainer}>
        

        <View style={styles.formGroup}>
          <ThemedText type="smallBold" style={styles.label} themeColor="primaryDark">
            Código de empleado
          </ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#035AA6" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={employeeCode}
              onChangeText={setEmployeeCode}
              placeholder="EMP-001"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="smallBold" style={styles.label} themeColor="primaryDark">
            Contraseña
          </ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#035AA6" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#999"
              secureTextEntry
              autoComplete="off"
              spellCheck={false}
            />
          </View>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <ThemedText type="small" style={styles.errorText}>
              {error}
            </ThemedText>
          </View>
        )}

        <Pressable
          style={[styles.button, (loading || authLoading) && styles.buttonDisabled]}
          disabled={loading || authLoading}
          onPress={handleLogin}>
          <ThemedText type="smallBold" style={styles.buttonText}>
            {loading || authLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </ThemedText>
        </Pressable>

        <ThemedText type="small" style={styles.demoHint} themeColor="textSecondary">
          Credenciales de demostración:{' '}
          <ThemedText type="code" style={styles.demoCode} themeColor="textSecondary">
            EMP-001 / clave123
          </ThemedText>
        </ThemedText>
      </View>
      <ThemedText type="code" style={styles.demoHint} themeColor="textSecondary">
        © 2026 EPMAPS - Distrito Metropolitano de Quito
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  container: {
    flexGrow: 1,
    paddingBottom: Spacing.six,
  },
  header: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    backgroundColor: '#035AA6',
  },
  headerCompanyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerCompanySubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F2F2F2',
    letterSpacing: 2,
    marginTop: 2,
  },
  cardContainer: {
    marginHorizontal: Spacing.four,
    marginTop: -Spacing.three,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.five,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  appBrandContainer: {
    alignItems: 'center',
    marginBottom: Spacing.five,
  },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: Spacing.two,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#035AA6',
  },
  appSubDescription: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  formGroup: {
    marginBottom: Spacing.four,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: Spacing.half,
  },
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
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 0,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#D93030',
    borderRadius: 10,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.four,
  },
  errorText: {
    color: '#D93030',
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#035AA6',
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.one,
    minHeight: 52,
    justifyContent: 'center',
    shadowColor: '#035AA6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#9CC3E6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  demoHint: {
    marginTop: Spacing.four,
    textAlign: 'center',
    fontSize: 13,
  },
  demoCode: {
    fontWeight: '700',
  },
});