import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { Aviso } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { PantallaHoja } from '@/components/pantalla-hoja';
import { useSesion } from '@/context/sesion';
import { mensajeDeError } from '@/lib/errores-firebase';

const ESPERA_REENVIO_S = 60;

export default function PantallaVerificarCorreo() {
  const { usuario, reenviarVerificacion, comprobarVerificacion, cerrarSesion } = useSesion();
  const [aviso, setAviso] = useState<{ tipo: 'error' | 'exito'; mensaje: string } | null>(null);
  const [comprobando, setComprobando] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [espera, setEspera] = useState(0);

  // Cuenta regresiva para no spamear a Firebase (auth/too-many-requests).
  useEffect(() => {
    if (espera <= 0) return;
    const id = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [espera]);

  // Al volver del navegador tras abrir el enlace, se comprueba solo.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') comprobarVerificacion().catch(() => {});
    });
    return () => sub.remove();
  }, [comprobarVerificacion]);

  async function manejarComprobacion() {
    setAviso(null);
    setComprobando(true);
    try {
      const ok = await comprobarVerificacion();
      if (!ok) {
        setAviso({ tipo: 'error', mensaje: 'Todavía no vemos tu correo verificado. Abre el enlace del mensaje y vuelve a intentarlo.' });
      } // si ok, el layout te lleva solo a la bienvenida
    } catch (e) {
      setAviso({ tipo: 'error', mensaje: mensajeDeError(e) });
    } finally {
      setComprobando(false);
    }
  }

  async function manejarReenvio() {
    setAviso(null);
    setReenviando(true);
    try {
      await reenviarVerificacion();
      setAviso({ tipo: 'exito', mensaje: `Enviamos un nuevo correo a ${usuario?.email}. Revisa también el spam.` });
      setEspera(ESPERA_REENVIO_S);
    } catch (e) {
      setAviso({ tipo: 'error', mensaje: mensajeDeError(e) });
    } finally {
      setReenviando(false);
    }
  }

  return (
    <PantallaHoja
      titulo={'Verifica\ntu correo'}
      bajada={`Enviamos un enlace a ${usuario?.email}. Ábrelo y luego vuelve aquí.`}>
      {aviso ? <Aviso tipo={aviso.tipo} mensaje={aviso.mensaje} /> : null}
      <Boton texto="Ya verifiqué mi correo" onPress={manejarComprobacion} cargando={comprobando} />
      <Boton
        variante="secundario"
        texto={espera > 0 ? `Reenviar correo (${espera} s)` : 'Reenviar correo'}
        onPress={manejarReenvio}
        cargando={reenviando}
        deshabilitado={espera > 0}
      />
      <Boton variante="enlace" texto="Usar otra cuenta" onPress={cerrarSesion} />
    </PantallaHoja>
  );
}