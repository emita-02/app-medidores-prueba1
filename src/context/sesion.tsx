import { auth } from "@/config/firebase";
import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    reload,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    updateProfile,
    type User,
} from "firebase/auth";
import { createContext, use, useEffect, useState, type ReactNode } from "react";

type ValorSesion = {
  /** Usuario conectado, o null si nadie ha iniciado sesión. */
  usuario: User | null;
  /** Nombre del perfil (displayName), siempre actualizado tras el registro. */
  nombre: string | null;
  /** true mientras Firebase revisa si hay una sesión guardada. */
  cargando: boolean;
  iniciarSesion: (correo: string, clave: string) => Promise<void>;
  registrarse: (nombre: string, correo: string, clave: string) => Promise<void>;
  enviarCorreoRecuperacion: (correo: string) => Promise<void>;
  cambiarClave: (claveActual: string, claveNueva: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;

  verificado: boolean;
  reenviarVerificacion: () => Promise<void>;
  comprobarVerificacion: () => Promise<boolean>;
  //Nuevo campo para actualizar el nombre del usuario en el perfil de Firebase
  actualizarNombre: (nuevoNombre: string) => Promise<void>;
};

const ContextoSesion = createContext<ValorSesion | null>(null);

//Hook para leer la sesion desde cualquier pantalla
export function useSesion(): ValorSesion {
  //'use' es la forma moderna (React 19) de leer un contexto
  const valor = use(ContextoSesion);
  if (!valor) {
    throw new Error("useSesion debe usarse dentro de un <ProveedorSesion>.");
  }
  return valor;
}

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);
  // Nombre del perfil guardado aparte: updateProfile modifica el mismo objeto
  // `user` sin cambiar su referencia, así que React no detectaría el cambio
  // si las pantallas leyeran usuario.displayName directamente.
  const [nombre, setNombre] = useState<string | null>(null);
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    // onAuthStateChanged se dispara al arrancar (con la sesión guardada o null)
    // y cada vez que alguien inicia o cierra sesión. Es la fuente de verdad:
    // la navegación (Stack.Protected en _layout.tsx) depende de este estado.
    const cancelarSuscripcion = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      setNombre(usuarioFirebase?.displayName ?? null);
      setCargando(false);
      setVerificado(usuarioFirebase?.emailVerified ?? false);
    });
    // Al desmontar el proveedor dejamos de escuchar para no fugar memoria.
    return cancelarSuscripcion;
  }, []);

  async function iniciarSesion(correo: string, clave: string) {
    await signInWithEmailAndPassword(auth, correo.trim(), clave);
    // No navegamos aquí: onAuthStateChanged actualiza `usuario` y el
    // Stack.Protected muestra automáticamente la pantalla de bienvenida.
  }

  async function registrarse(
    nombreCompleto: string,
    correo: string,
    clave: string,
  ) {
    // Crear la cuenta también inicia la sesión.
    const credencial = await createUserWithEmailAndPassword(
      auth,
      correo.trim(),
      clave,
    );
    // Guardamos el nombre en el perfil de Firebase (campo displayName).
    const nombreLimpio = nombreCompleto.trim();
    await updateProfile(credencial.user, { displayName: nombreLimpio });
    // La bienvenida ya se mostró (onAuthStateChanged corre al crear la cuenta,
    // antes de updateProfile), así que actualizamos el nombre en el estado.
    setNombre(nombreLimpio);
    try {
      await sendEmailVerification(credencial.user);
    } catch {
      /* se puede reenviar luego */
    }
  }

  async function reenviarVerificacion() {
    if (!auth.currentUser) throw new Error("No hay una sesión activa.");
    await sendEmailVerification(auth.currentUser);
  }

  async function comprobarVerificacion() {
    const actual = auth.currentUser;
    if (!actual) return false;
    await reload(actual); // emailVerified no se actualiza solo
    setVerificado(actual.emailVerified);
    return actual.emailVerified;
  }

  async function enviarCorreoRecuperacion(correo: string) {
    // Firebase envía un correo con un enlace a su página de restablecimiento.
    // Si el correo no existe, por la protección de enumeración NO lanza error:
    // por eso la pantalla muestra un mensaje neutro.
    await sendPasswordResetEmail(auth, correo.trim());
  }

  async function cambiarClave(claveActual: string, claveNueva: string) {
    const actual = auth.currentUser;
    if (!actual?.email) throw new Error("No hay una sesión activa.");

    // updatePassword es una operación sensible: Firebase la rechaza con
    // "auth/requires-recent-login" si la sesión no es reciente. Por eso
    // primero confirmamos la identidad con la contraseña actual.
    const credencial = EmailAuthProvider.credential(actual.email, claveActual);
    await reauthenticateWithCredential(actual, credencial);
    await updatePassword(actual, claveNueva);
  }

    async function actualizarNombre(nuevoNombre: string) {
      const actual = auth.currentUser;
      if (!actual) throw new Error("No hay una sesión activa.");
      const nombreLimpio = nuevoNombre.trim();
      await updateProfile(actual, { displayName: nombreLimpio });
      // updateProfile modifica el mismo objeto `user` sin cambiar su referencia;
      // por eso actualizamos también el estado, para que Inicio y Perfil se redibujen.
      setNombre(nombreLimpio);
    }

  async function cerrarSesion() {
    await signOut(auth);
  }

  return (
    <ContextoSesion
      value={{
        usuario,
        nombre,
        cargando,
        iniciarSesion,
        registrarse,
        enviarCorreoRecuperacion,
        cambiarClave,
        cerrarSesion,
        verificado,
        reenviarVerificacion,
        comprobarVerificacion,
        actualizarNombre,
      }}
    >
      {children}
    </ContextoSesion>
  );
}
