import { ActivityIndicator, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SOMBRA_BOTON } from '@/constants/sombras';
import { MedidoresColors } from '@/constants/theme';
import { cn } from '@/lib/cn';

type Props = {
  texto: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'enlace';
  cargando?: boolean;
  deshabilitado?: boolean;
};

export function Boton({ texto, onPress, variante = 'primario', cargando = false, deshabilitado = false }: Props) {
  const inactivo = cargando || deshabilitado;

  if (variante === 'enlace') {
    return (
      <Pressable onPress={onPress} disabled={inactivo} hitSlop={8} accessibilityRole="link">
        <ThemedText type="smallBold" className={cn('text-primary underline', inactivo && 'opacity-50')}>
          {texto}
        </ThemedText>
      </Pressable>
    );
  }

  const primario = variante === 'primario';
  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      className={cn(
        'mt-2 min-h-[52px] items-center justify-center rounded-xl py-4',
        primario ? (inactivo ? 'bg-deshabilitado' : 'bg-primary') : 'border-[1.5px] border-primary bg-transparent',
        !primario && inactivo && 'opacity-60',
      )}
      style={primario ? SOMBRA_BOTON : undefined}>
      {cargando ? (
        <ActivityIndicator color={primario ? '#FFFFFF' : MedidoresColors.primary} />
      ) : (
        <ThemedText type="smallBold" className={cn('text-[16px] font-bold', primario ? 'text-white' : 'text-primary')}>
          {texto}
        </ThemedText>
      )}
    </Pressable>
  );
}