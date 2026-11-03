/* Pestaña "Perfil": datos de la cuenta (editar nombre) y seguridad (cambiar contraseña). */

import { StyleSheet, View } from 'react-native';

import { FormCambiarClave } from '@/components/form-cambiar-clave';
import { FormEditarNombre } from '@/components/form-editar-nombre';
import { PantallaHoja } from '@/components/pantalla-hoja';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { LONGITUD_MINIMA_CLAVE } from '@/lib/validaciones';

export default function PantallaPerfil() {
    return (
        <PantallaHoja titulo="Perfil" bajada="Actualiza tus datos y la seguridad de tu cuenta.">
        <ThemedText type="smallBold" themeColor="primaryDark" style={styles.seccion}>
            Datos personales
        </ThemedText>
        <FormEditarNombre />

        <View style={styles.divisor} />

        <ThemedText type="smallBold" themeColor="primaryDark" style={[styles.seccion, styles.seccionConTexto]}>
            Cambiar contraseña
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.descripcion}>
            Confirma la actual y elige una nueva de al menos {LONGITUD_MINIMA_CLAVE} caracteres.
        </ThemedText>
        <FormCambiarClave />
        </PantallaHoja>
    );
}

const styles = StyleSheet.create({
    seccion: { fontSize: 16, marginBottom: Spacing.three },
    seccionConTexto: { marginBottom: Spacing.one },
    descripcion: { fontSize: 13, marginBottom: Spacing.three },
    divisor: { height: 1, backgroundColor: '#E2E8F0', marginVertical: Spacing.four },
});