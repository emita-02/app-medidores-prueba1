import { Platform, Text, type TextProps } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { cn } from '@/lib/cn';

type Tipo = 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';

export type ThemedTextProps = TextProps & {
  type?: Tipo;
  themeColor?: ThemeColor;
};

// Las clases van completas (no armadas con texto) para que Uniwind las detecte al compilar.
const PESO_CODE = Platform.OS === 'android' ? 'font-bold' : 'font-medium';

const TIPOS: Record<Tipo, string> = {
  default: 'text-[16px] leading-6 font-medium',
  title: 'text-[48px] leading-[52px] font-semibold',
  subtitle: 'text-[32px] leading-[44px] font-semibold',
  small: 'text-[14px] leading-5 font-medium',
  smallBold: 'text-[14px] leading-5 font-bold',
  link: 'text-[14px] leading-[30px]',
  linkPrimary: 'text-[14px] leading-[30px]',
  code: `text-[12px] ${PESO_CODE}`,
};

const COLORES: Record<ThemeColor, string> = {
  text: 'text-foreground',
  background: 'text-background',
  backgroundElement: 'text-element',
  backgroundSelected: 'text-selected',
  textSecondary: 'text-muted',
  primary: 'text-primary',
  primarySecondary: 'text-primary-secondary',
  primaryDark: 'text-primary-dark',
  error: 'text-error',
  backgroundLight: 'text-canvas',
};

export function ThemedText({ type = 'default', themeColor, className, style, ...rest }: ThemedTextProps) {
  const color = type === 'linkPrimary' ? 'text-[#3c87f7]' : COLORES[themeColor ?? 'text'];

  return (
    <Text
      className={cn(TIPOS[type], color, className)}
      style={type === 'code' ? [{ fontFamily: Fonts.mono }, style] : style}
      {...rest}
    />
  );
}