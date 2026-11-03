/* Formulario de cambio de contraseña (antes era la pantalla cambiar-clave.tsx; ahora vive en Perfil).

Pedimos la contraseña actual por dos razones:
1. Firebase exige un inicio de sesión reciente para cambiar la clave
   (si no, lanza auth/requires-recent-login). Con la clave actual reautenticamos.
2. Si alguien toma un teléfono desbloqueado, no puede cambiar la clave sin conocer la actual. */

import { useState } from 'react';

import { Aviso } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { CampoTexto } from '@/components/campo-texto';
import { IndicadorFortaleza } from '@/components/indicador-fortaleza';
import { useSesion } from '@/context/sesion';
import { mensajeDeError } from '@/lib/errores-firebase';
import { validarClave, validarConfirmacion } from '@/lib/validaciones';

type Errores = Partial<Record<'actual' | 'nueva' | 'confirmacion', string | null>>;

export function FormCambiarClave() {
    const { cambiarClave } = useSesion();

    const [actual, setActual] = useState('');
    const [nueva, setNueva] = useState('');
    const [confirmacion, setConfirmacion] = useState('');
    const [errores, setErrores] = useState<Errores>({});
    const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
    const [listo, setListo] = useState(false);
    const [enviando, setEnviando] = useState(false);

    async function manejarCambio() {
        const nuevosErrores: Errores = {
            actual: actual ? null : 'Escribe tu contraseña actual.',
            nueva:
                validarClave(nueva) ??
                (nueva === actual ? 'La nueva contraseña debe ser distinta de la actual.' : null),
            confirmacion: validarConfirmacion(nueva, confirmacion),
        };
        setErrores(nuevosErrores);
        setErrorGeneral(null);
        setListo(false);

        if (Object.values(nuevosErrores).some(Boolean)) return;

        setEnviando(true);
        try {
            await cambiarClave(actual, nueva);
            setListo(true);
            // Limpiamos los campos: no conviene dejar contraseñas en memoria visible.
            setActual('');
            setNueva('');
            setConfirmacion('');
        } catch (error) {
            setErrorGeneral(
                // En esta pantalla, "credencial inválida" significa clave actual incorrecta.
                mensajeDeError(error, {
                'auth/invalid-credential': 'La contraseña actual no es correcta.',
                'auth/wrong-password': 'La contraseña actual no es correcta.',
                }),
            );
        } finally {
            setEnviando(false);
        }
    }

    return (
        <>
        {listo ? (
            <Aviso
            tipo="exito"
            mensaje="Contraseña actualizada. La próxima vez que inicies sesión usa la nueva."
            />
        ) : null}
        {errorGeneral ? <Aviso tipo="error" mensaje={errorGeneral} /> : null}

        <CampoTexto
            etiqueta="Contraseña actual"
            value={actual}
            onChangeText={setActual}
            error={errores.actual}
            esClave
            textContentType="password"
            autoComplete="current-password"
        />

        <CampoTexto
            etiqueta="Contraseña nueva"
            value={nueva}
            onChangeText={setNueva}
            error={errores.nueva}
            esClave
            textContentType="newPassword"
            autoComplete="new-password"
            pie={<IndicadorFortaleza clave={nueva} />}
        />

        <CampoTexto
            etiqueta="Repite la contraseña nueva"
            value={confirmacion}
            onChangeText={setConfirmacion}
            error={errores.confirmacion}
            esClave
            textContentType="newPassword"
            autoComplete="new-password"
            onSubmitEditing={manejarCambio}
        />

        <Boton texto="Guardar contraseña" onPress={manejarCambio} cargando={enviando} />
        </>
    );
}