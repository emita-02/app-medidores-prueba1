/*Mensaje de resultado (error o éxito) que aparece sobre el formulario.
El color y el ícono permiten distinguir el tipo sin leer el texto. */

import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutUp, ZoomIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { MedidoresColors } from '@/constants/theme';
import { cn } from '@/lib/cn';

export function Aviso({ tipo, mensaje }: { tipo: 'error' | 'exito'; mensaje: string }) {
  const esError = tipo === 'error';
  const color = esError ? MedidoresColors.error : MedidoresColors.exito;
  return (
    <Animated.View
      key={`${tipo}-${mensaje}`}
      entering={FadeInDown.springify().damping(15)}
      exiting={FadeOutUp.duration(200)}
      accessibilityRole="alert"
      className={cn(
        'mb-6 flex-row items-start gap-2 rounded-[10px] border px-4 py-2',
        esError ? 'border-error bg-error-suave' : 'border-exito bg-exito-suave',
      )}>
      <Animated.View entering={ZoomIn.delay(150).springify().damping(10)}>
        <Ionicons name={esError ? 'alert-circle-outline' : 'checkmark-circle-outline'} size={18} color={color} />
      </Animated.View>
      <ThemedText type="small" className={cn('flex-1 text-[13px] font-semibold', esError ? 'text-error' : 'text-exito')}>
        {mensaje}
      </ThemedText>
    </Animated.View>
  );
}