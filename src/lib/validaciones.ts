/*
Validaciones del lado del cliente
sirven para dar respuesta inmediatamente sin gastar una peticion a Firebase
No reemplazan la validación del servidor: Firebase vuelve a validar todo.
Cada función devuelve un mensaje de error o null si el valor es válido.
*/

//Patrón simple: algo@algo.dominio. La validación estricta la hace Firebase
const PATRON_CORREO=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

//Firebase exige 6 caracteres como minimo; pero vamos a pedir 8
export const LONGITUD_MINIMA_CLAVE=8;

export function validarCorreo(correo: string): string | null {
    if (!correo.trim()) return 'Escribe tu correo electrónico.';
    if (!PATRON_CORREO.test(correo.trim())) return 'Revisa el formato de tu correo.';
    return null;
}

export function validarClave(clave:string): string | null {
    if (!clave) return 'Escribe tu contraseña.';
    if (clave.length < LONGITUD_MINIMA_CLAVE) {
        return `La contraseña debe tener al menos ${LONGITUD_MINIMA_CLAVE} caracteres.`;
    };
    return null;
}

export function validarConfirmacion(clave:string, confirmacion:string): string | null {
    if (!confirmacion) return 'Confirma tu contraseña.';
    if (clave !== confirmacion) return 'Las contraseñas no coinciden.';
    return null;
}

export function validarNombre(nombre:string): string | null {
    if (nombre.trim().length < 3) return 'Escribe tu nombre (mínimo 3 letras).';
    return null;
}

