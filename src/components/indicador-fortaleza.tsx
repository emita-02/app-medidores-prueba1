/* Indicador de seguridad de la contraseña: barra de 3 segmentos + etiqueta + sugerencia.
Es solo informativo: la validación real sigue siendo validarClave(). */

import { Text, View } from 'react-native';

import { evaluarFortaleza, type NivelFortaleza } from '@/lib/validaciones';

// Las clases van escritas completas (no armadas con texto) para que Uniwind las detecte al compilar.
const NIVELES: Record<NivelFortaleza, { etiqueta: string; barra: string; texto: string; segmentos: number }> = {
  debil: { etiqueta: 'Débil', barra: 'bg-error', texto: 'text-error', segmentos: 1 },
  media: { etiqueta: 'Media', barra: 'bg-advertencia', texto: 'text-advertencia', segmentos: 2 },
  fuerte: { etiqueta: 'Fuerte', barra: 'bg-exito', texto: 'text-exito', segmentos: 3 },
};

export function IndicadorFortaleza({ clave }: { clave: string }) {
  if (!clave) return null;

  const { nivel, sugerencia } = evaluarFortaleza(clave);
  const { etiqueta, barra, texto, segmentos } = NIVELES[nivel];

  return (
    <View className="mt-2 gap-1" accessibilityLiveRegion="polite">
      <View className="flex-row gap-1" importantForAccessibility="no-hide-descendants">
        {[1, 2, 3].map((n) => (
          <View key={n} className={`h-1.5 flex-1 rounded-[3px] ${n <= segmentos ? barra : 'bg-borde'}`} />
        ))}
      </View>
      <Text className={`text-[13px] leading-5 font-bold ${texto}`}>Seguridad: {etiqueta}</Text>
      {sugerencia ? <Text className="text-[12px] leading-5 font-medium text-muted">{sugerencia}</Text> : null}
    </View>
  );
}