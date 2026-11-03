/* Indicador de seguridad de la contraseña: barra de 3 segmentos + etiqueta + sugerencia.
Es solo informativo: la validación real sigue siendo validarClave(). */

import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { evaluarFortaleza, type NivelFortaleza } from '@/lib/validaciones';

const NIVELES: Record<NivelFortaleza, { etiqueta: string; color: string; segmentos: number }> = {
    debil: { etiqueta: 'Débil', color: '#D93030', segmentos: 1 },
    media: { etiqueta: 'Media', color: '#9A6200', segmentos: 2 },
    fuerte: { etiqueta: 'Fuerte', color: '#22704F', segmentos: 3 },
};

export function IndicadorFortaleza({ clave }: { clave: string }) {
    if (!clave) return null;

    const { nivel, sugerencia } = evaluarFortaleza(clave);
    const { etiqueta, color, segmentos } = NIVELES[nivel];

    return (
        <View style={styles.contenedor} accessibilityLiveRegion="polite">
        <View style={styles.barra} importantForAccessibility="no-hide-descendants">
            {[1, 2, 3].map((n) => (
            <View
                key={n}
                style={[styles.segmento, { backgroundColor: n <= segmentos ? color : '#E2E8F0' }]}
            />
            ))}
        </View>
        <ThemedText type="small" style={[styles.etiqueta, { color }]}>
            Seguridad: {etiqueta}
        </ThemedText>
        {sugerencia ? (
            <ThemedText type="small" themeColor="textSecondary" style={styles.sugerencia}>
            {sugerencia}
            </ThemedText>
        ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: { marginTop: Spacing.two, gap: Spacing.one },
    barra: { flexDirection: 'row', gap: Spacing.one },
    segmento: { flex: 1, height: 6, borderRadius: 3 },
    etiqueta: { fontSize: 13, fontWeight: '700' },
    sugerencia: { fontSize: 12 },
});
