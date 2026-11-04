/* Pestaña "Perfil": datos de la cuenta (editar nombre) y seguridad (cambiar contraseña). */

import { View } from 'react-native';

import { FormCambiarClave } from '@/components/form-cambiar-clave';
import { FormEditarNombre } from '@/components/form-editar-nombre';
import { PantallaHoja } from '@/components/pantalla-hoja';
import { ThemedText } from '@/components/themed-text';
import { LONGITUD_MINIMA_CLAVE } from '@/lib/validaciones';

export default function PantallaPerfil() {
    return (
        <PantallaHoja titulo="Perfil" bajada="Actualiza tus datos y la seguridad de tu cuenta.">
        <ThemedText type="smallBold" themeColor="primaryDark" className="mb-4 text-[16px]">
            Datos personales
        </ThemedText>
        <FormEditarNombre />

        <View className="my-6 h-px bg-borde" />

        <ThemedText type="smallBold" themeColor="primaryDark" className="mb-1 text-[16px]">
            Cambiar contraseña
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" className="mb-4 text-[13px]">
            Confirma la actual y elige una nueva de al menos {LONGITUD_MINIMA_CLAVE} caracteres.
        </ThemedText>
        <FormCambiarClave />
        </PantallaHoja>
    );
}
