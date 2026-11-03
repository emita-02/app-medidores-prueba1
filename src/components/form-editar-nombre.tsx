/* Formulario para editar el nombre (displayName) con updateProfile de Firebase. */

import { useState } from 'react';

import { Aviso } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { CampoTexto } from '@/components/campo-texto';
import { ThemedText } from '@/components/themed-text';
import { useSesion } from '@/context/sesion';
import { mensajeDeError } from '@/lib/errores-firebase';
import { validarNombre } from '@/lib/validaciones';

export function FormEditarNombre() {
    const { usuario, nombre: nombreActual, actualizarNombre } = useSesion();

    const [nombre, setNombre] = useState(nombreActual ?? '');
    const [error, setError] = useState<string | null>(null);
    const [aviso, setAviso] = useState<{ tipo: 'error' | 'exito'; mensaje: string } | null>(null);
    const [guardando, setGuardando] = useState(false);

    const sinCambios = nombre.trim() === (nombreActual ?? '');

    async function manejarGuardado() {
        setAviso(null);
        const errorNombre = validarNombre(nombre);
        setError(errorNombre);
        if (errorNombre) return;

        setGuardando(true);
        try {
        await actualizarNombre(nombre);
        setNombre(nombre.trim());
        setAviso({ tipo: 'exito', mensaje: 'Nombre actualizado.' });
        } catch (e) {
        setAviso({ tipo: 'error', mensaje: mensajeDeError(e) });
        } finally {
        setGuardando(false);
        }
    }

    return (
        <>
        {aviso ? <Aviso tipo={aviso.tipo} mensaje={aviso.mensaje} /> : null}

        <CampoTexto
            etiqueta="Nombre"
            value={nombre}
            onChangeText={(texto) => {
            setNombre(texto);
            setAviso(null);
            }}
            error={error}
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
            onSubmitEditing={manejarGuardado}
        />

        <CampoTexto
            etiqueta="Correo"
            value={usuario?.email ?? ''}
            editable={false}
            keyboardType="email-address"
            style={{ color: '#64748B' }}
            pie={
            <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: 4, fontSize: 12 }}>
                El correo no se puede cambiar desde aquí.
            </ThemedText>
            }
        />

        <Boton
            texto="Guardar nombre"
            onPress={manejarGuardado}
            cargando={guardando}
            deshabilitado={sinCambios}
        />
        </>
    );
}