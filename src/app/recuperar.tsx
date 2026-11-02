/*Recuperar Contraseña
Flujo completo:
-El usuario escribe su correo y toca "Enviar enlace"
-Firebase envía un correo (plantilla editale en la consola:
    Authentication > Templates > Password Reset)
-El enlace abre una página de Firebase donde se escribe la contraseña nueva
-El estudiante vuelve a la app e inicia sesión con esa contraseña */

import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Aviso } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { CampoTexto } from '@/components/campo-texto';
import { PantallaHoja } from '@/components/pantalla-hoja';
import { useSesion } from '@/context/sesion';
import { mensajeDeError } from '@/lib/errores-firebase';
import { validarCorreo } from '@/lib/validaciones';

export default function PantallaRecuperar() {
    const {enviarCorreoRecuperacion} = useSesion();
    //Recibimos el correo que el usuario ya habia escrito en el login (si lo hizo).
    const param = useLocalSearchParams<{correo?: string}>();
    const [correo, setCorreo] = useState(param.correo ?? '');
    const [errorCampo, setErrorCampo] = useState<string | null>(null);
    const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
    const [enviado, setEnviado] = useState(false);
    const [enviando, setEnviando] = useState(false);

    async function manejarEnvio() {
        const error = validarCorreo(correo);
        setErrorCampo(error);
        setErrorGeneral(null);
        if (error) return;

        setEnviando(true);
        try {
            await enviarCorreoRecuperacion(correo);
            setEnviado(true);
        } catch (e) {
            setErrorGeneral(mensajeDeError(e));
        } finally {
            //Aqui si usamos finally: la pantalla sigue montada en ambos casos
            setEnviando(false);
        }
    }

    return (
        <PantallaHoja 
            conVolver
            titulo={'Recupera\ntu acceso'}
            bajada="Te enviaremos un enlace para que crees una contraseña nueva.">
        {/*
            Mensaje neutro a propósito: no confirmamos si el correo existe.
        */}
            {enviado ? (
                <Aviso
                tipo="exito"
                mensaje={`Si ${correo.trim()} tiene una cuenta, en unos minutos recibirás el enlace. Revisa también la carpeta de spam.`}
                />
            ) : null}
            {errorGeneral ? <Aviso tipo="error" mensaje={errorGeneral} /> : null}
            
            <CampoTexto
                etiqueta="Correo de tu cuenta"
                placeholder="nombre.apellido@gmail.com"
                value={correo}
                onChangeText={(texto) => {
                    setCorreo(texto);
                    setEnviado(false); //si cambia el correo, el aviso anterior ya no aplica
                }}
                error={errorCampo}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                onSubmitEditing={manejarEnvio}
            />
            {enviado ? (
                <>
                    <Boton texto="Volver a iniciar sesión" onPress={() => router.back()} />
                    <Boton variante="secundario" texto="Enviar otravez" onPress={manejarEnvio} cargando={enviando} />
                </>
            ) : (
                <Boton texto="Enviar enlace" onPress={manejarEnvio} cargando={enviando} />
            )}
        </PantallaHoja>
    );
}
