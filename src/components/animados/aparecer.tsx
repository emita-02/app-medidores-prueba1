import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';

type Props = {
  children: ReactNode;
  retraso?: number;
  /** 'subir' = sube con resorte; 'fade' = solo fundido (para bandas pegadas al borde). */
  tipo?: 'subir' | 'fade';
  conLayout?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Aparecer({ children, retraso = 0, tipo = 'subir', conLayout = false, style }: Props) {
  const entrada =
    tipo === 'fade'
      ? FadeIn.delay(retraso).duration(400)
      : FadeInDown.delay(retraso).springify().damping(18);

  return (
    <Animated.View entering={entrada} layout={conLayout ? LinearTransition : undefined} style={style}>
      {children}
    </Animated.View>
  );
}