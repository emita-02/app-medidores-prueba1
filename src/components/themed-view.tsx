import { View, type ViewProps } from 'react-native';

import { type ThemeColor } from '@/constants/theme';
import { cn } from '@/lib/cn';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

const FONDOS: Record<ThemeColor, string> = {
  text: 'bg-foreground',
  background: 'bg-background',
  backgroundElement: 'bg-element',
  backgroundSelected: 'bg-selected',
  textSecondary: 'bg-muted',
  primary: 'bg-primary',
  primarySecondary: 'bg-primary-secondary',
  primaryDark: 'bg-primary-dark',
  error: 'bg-error',
  backgroundLight: 'bg-canvas',
};

export function ThemedView({ className, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  return <View className={cn(FONDOS[type ?? 'background'], className)} {...otherProps} />;
}