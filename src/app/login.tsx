import React from 'react';
import { Pressable, ScrollView, TextInput, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { SOMBRA_BOTON, SOMBRA_TARJETA } from '@/constants/sombras';

import { router } from 'expo-router';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { useSesion } from '@/context/sesion';
import { useSacudida } from '@/hooks/use-sacudida'; // el hook del mensaje anterior
import { cn } from '@/lib/cn';
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
      className="flex-1 bg-canvas"
      contentContainerClassName="grow pb-16"
      keyboardShouldPersistTaps="handled">

      {/* Cabecera institucional */}
      <View className="items-center bg-primary px-8 py-6">
        <ThemedText type="title" className="text-[24px] font-black tracking-[1px] text-white" themeColor="text">
          EPMAPS
        </ThemedText>
        <ThemedText type="smallBold" className="mt-0.5 text-[12px] tracking-[2px] text-canvas" themeColor="textSecondary">
          AGUA DE QUITO
        </ThemedText>
      </View>
      {/* Logo y Nombre de la App */}
        <Animated.View entering={FadeInDown.delay(100).springify().damping(18)} className="mb-8 items-center">
          <Image
            source={require('@/assets/images/icono_app_aquauio.png')}
            className="mb-2 h-[72px] w-[72px] rounded-2xl"
            resizeMode="contain"
          />
          <ThemedText type="title" className="text-[26px] font-bold text-primary" themeColor="primaryDark">
            AquaUIO
          </ThemedText>
          <ThemedText type="small" className="mt-0.5 text-center text-[13px]" themeColor="textSecondary">
            Sistema Móvil de Registro de Lecturas
          </ThemedText>
        </Animated.View>

      {/* Contenedor principal estilo Tarjeta */}
      <Animated.View entering={FadeInDown.delay(250).springify().damping(18)} className="mx-6 -mt-4 rounded-[20px] bg-white p-8" style={SOMBRA_TARJETA}>

        <Animated.View style={estiloSacudida}>
          <View className="mb-6">
            <ThemedText type="smallBold" className="mb-0.5 text-[13px]" themeColor="primaryDark">
              Correo electrónico
            </ThemedText>
            <View className="min-h-[52px] flex-row items-center rounded-xl border border-borde bg-campo px-4">
              <View className="mr-2">
                <Ionicons name="mail-outline" size={20} color="#035AA6" />
              </View>
              <TextInput
                className="flex-1 py-0 text-[16px] text-tinta"
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

          <View className="mb-6">
            <ThemedText type="smallBold" className="mb-0.5 text-[13px]" themeColor="primaryDark">
              Contraseña
            </ThemedText>
            <View className="min-h-[52px] flex-row items-center rounded-xl border border-borde bg-campo px-4">
              <View className="mr-2">
                <Ionicons name="lock-closed-outline" size={20} color="#035AA6" />
              </View>
              <TextInput
                className="flex-1 py-0 text-[16px] text-tinta"
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
              <View className="mb-6 rounded-[10px] border border-error bg-error-suave px-4 py-2">
                <ThemedText type="small" className="text-[13px] font-semibold text-error">
                  {error}
                </ThemedText>
              </View>
            </Animated.View>
          )}
        </Animated.View>

        <Pressable
          className={cn(
            'mt-1 min-h-[52px] items-center justify-center rounded-xl bg-primary py-4',
            loading && 'bg-deshabilitado',
          )}
          style={SOMBRA_BOTON}
          disabled={loading}
          onPress={handleLogin}>
          <ThemedText type="smallBold" className="text-[16px] font-bold text-white">
            {loading? 'Ingresando...' : 'Iniciar sesión'}
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.push({ pathname: '/recuperar', params: { correo } })}
          hitSlop={8}
          className="mt-6 items-center">
          <ThemedText type="smallBold" className="text-primary underline">
            ¿Olvidaste tu contraseña?
          </ThemedText>
        </Pressable>
        <View className="mt-4 flex-row items-center justify-center gap-2">
          <ThemedText type="small" themeColor="textSecondary">
            ¿Aún no tienes cuenta?
          </ThemedText>
          <Pressable onPress={() => router.push('/registro')} hitSlop={8}>
            <ThemedText type="smallBold" className="text-primary underline">
              Crear cuenta
            </ThemedText>
          </Pressable>
        </View>
      </Animated.View>
      <ThemedText type="code" className="mt-6 text-center text-[13px]" themeColor="textSecondary">
        © 2026 EPMAPS - Distrito Metropolitano de Quito
      </ThemedText>
    </ScrollView>
  );
}
