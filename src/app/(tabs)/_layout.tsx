import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { MedidoresColors } from '@/constants/theme';

const COLOR_ACTIVO = MedidoresColors.primary;
const COLOR_INACTIVO = '#64748B';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLOR_ACTIVO,
        tabBarInactiveTintColor: COLOR_INACTIVO,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E2E8F0' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={focused ? COLOR_ACTIVO : COLOR_INACTIVO}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={focused ? COLOR_ACTIVO : COLOR_INACTIVO}
            />
          ),
        }}
      />
    </Tabs>
  );
}