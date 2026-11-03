import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { ProveedorSesion, useSesion } from '@/context/sesion';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ProveedorSesion>
      <Navegacion />
    </ProveedorSesion>
  );
}

function Navegacion() {
  const colorScheme = useColorScheme();
  const { usuario, verificado, cargando } = useSesion();

  useEffect(() => {
    if (!cargando) SplashScreen.hideAsync();
  }, [cargando]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!usuario && verificado}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lectura" />
          <Stack.Screen name="borradores" />
        </Stack.Protected>
        <Stack.Protected guard={!!usuario && !verificado}>
          <Stack.Screen name="verificar-correo" />
        </Stack.Protected>
        <Stack.Protected guard={!usuario}>
          <Stack.Screen name="login" />
          <Stack.Screen name="registro" />
          <Stack.Screen name="recuperar" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}