import React from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { router } from 'expo-router';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { useSesion } from '@/context/sesion';
import { useSacudida } from '@/hooks/use-sacudida'; // el hook del mensaje anterior
import { mensajeDeError } from '@/lib/errores-firebase';
import { validarCorreo } from '@/lib/validaciones';


export default function LoginScreen() {
  const { iniciarSesion } = useSesion();
  const { estiloSacudida, sacudir } = useSacudida();
  const [correo, setCorreo] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [verPassword, setVerPassword] = React.useState(false);

  const handleLogin = async () => {
    setError(null);

    const errorCorreo = validarCorreo(correo);
    if (errorCorreo) { setError(errorCorreo); sacudir(); return; }
    if (!password) { setError('Ingrese su contraseña.'); sacudir(); return; }

    setLoading(true);
    try {
      await iniciarSesion(correo, password);
      // Sin router.replace: Stack.Protected cambia de pantalla solo.
    } catch (e) {
      setError(mensajeDeError(e));
      sacudir();
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
        <Animated.View entering={FadeInDown.delay(100).springify().damping(18)} style={styles.appBrandContainer}>
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
        </Animated.View>

      {/* Contenedor principal estilo Tarjeta */}
      <Animated.View entering={FadeInDown.delay(250).springify().damping(18)} style={styles.cardContainer}>
        
        <Animated.View style={estiloSacudida}>
          <View style={styles.formGroup}>
            <ThemedText type="smallBold" style={styles.label} themeColor="primaryDark">
              Correo electrónico
            </ThemedText>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#035AA6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={correo}
                onChangeText={setCorreo}
                placeholder="nombre@correo.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
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
                secureTextEntry = {!verPassword}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                spellCheck={false}
              />
              <Pressable
                onPress={() => setVerPassword((v) => !v)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                <Ionicons name={verPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#035AA6" />
              </Pressable>
            </View>
          </View>

          {error && (
            <Animated.View key={error} entering={FadeInDown.springify().damping(15)} exiting={FadeOutUp.duration(200)}>
              <View style={styles.errorBanner}>
                <ThemedText type="small" style={styles.errorText}>
                  {error}
                </ThemedText>
              </View>
            </Animated.View>
          )}
        </Animated.View>

        <Pressable
          style={[styles.button, (loading) && styles.buttonDisabled]}
          disabled={loading}
          onPress={handleLogin}>
          <ThemedText type="smallBold" style={styles.buttonText}>
            {loading? 'Ingresando...' : 'Iniciar sesión'}
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.push({ pathname: '/recuperar', params: { correo } })}
          hitSlop={8}
          style={styles.enlaceCentrado}>
          <ThemedText type="smallBold" style={styles.enlace}>
            ¿Olvidaste tu contraseña?
          </ThemedText>
        </Pressable>
        <View style={styles.pie}>
          <ThemedText type="small" themeColor="textSecondary">
            ¿Aún no tienes cuenta?
          </ThemedText>
          <Pressable onPress={() => router.push('/registro')} hitSlop={8}>
            <ThemedText type="smallBold" style={styles.enlace}>
              Crear cuenta
            </ThemedText>
          </Pressable>
        </View>
      </Animated.View>
      <ThemedText type="code" style={styles.demoHint} themeColor="textSecondary">
        © 2026 EPMAPS - Distrito Metropolitano de Quito
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  enlace: { 
    color: '#035AA6', 
    textDecorationLine: 'underline' 
  },
  enlaceCentrado: { 
    alignItems: 'center', 
    marginTop: Spacing.four 
  },
  pie: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: Spacing.two, 
    marginTop: Spacing.three 
  },
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