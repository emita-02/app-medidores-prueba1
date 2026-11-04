import type { ViewStyle } from 'react-native';

/* Sombras exactas de AquaUIO. Se mantienen como objetos (con elevation para Android)
porque las clases shadow-* de Tailwind producen un resultado distinto. */

export const SOMBRA_TARJETA: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 5,
};

export const SOMBRA_BOTON: ViewStyle = {
  shadowColor: '#035AA6',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 3,
};

export const SOMBRA_CARD_RESULTADO: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 2,
};