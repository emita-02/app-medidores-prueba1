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

// ---------- Indicador de seguridad ----------

export type NivelFortaleza = 'debil' | 'media' | 'fuerte';

export type ResultadoFortaleza = {
    nivel: NivelFortaleza;
    /** De 0 a 5 */
    puntaje: number;
    /** Qué mejorar a continuación, o null si ya es fuerte. */
    sugerencia: string | null;
};

// Contraseñas muy usadas: aunque cumplan el largo, nunca se consideran seguras.
const CLAVES_COMUNES = [
    '12345678', '123456789', '1234567890', 'password', 'password1',
    'contraseña', 'contrasena', 'qwerty123', 'admin123', 'abcd1234', '11111111',
];

export function evaluarFortaleza(clave: string): ResultadoFortaleza {
    const tieneMinuscula = /[a-záéíóúüñ]/.test(clave);
    const tieneMayuscula = /[A-ZÁÉÍÓÚÜÑ]/.test(clave);
    const tieneNumero = /\d/.test(clave);
    const tieneSimbolo = /[^A-Za-z0-9áéíóúüñÁÉÍÓÚÜÑ\s]/.test(clave);
    const tieneMezcla = tieneMinuscula && tieneMayuscula;
    const esComun = CLAVES_COMUNES.includes(clave.toLowerCase());

    let puntaje = 0;
    if (clave.length >= LONGITUD_MINIMA_CLAVE) puntaje++;
    if (clave.length >= 12) puntaje++;
    if (tieneMezcla) puntaje++;
    if (tieneNumero) puntaje++;
    if (tieneSimbolo) puntaje++;

    let nivel: NivelFortaleza = puntaje <= 2 ? 'debil' : puntaje === 3 ? 'media' : 'fuerte';
    if (clave.length < LONGITUD_MINIMA_CLAVE || esComun) nivel = 'debil';

    let sugerencia: string | null = null;
    if (esComun) sugerencia = 'Es una contraseña muy común, elige otra.';
    else if (clave.length < LONGITUD_MINIMA_CLAVE) sugerencia = `Usa al menos ${LONGITUD_MINIMA_CLAVE} caracteres.`;
    else if (!tieneMezcla) sugerencia = 'Combina mayúsculas y minúsculas.';
    else if (!tieneNumero) sugerencia = 'Agrega un número.';
    else if (!tieneSimbolo) sugerencia = 'Agrega un símbolo, por ejemplo ! # $ %.';
    else if (clave.length < 12) sugerencia = 'Con 12 o más caracteres será más segura.';
    if (nivel === 'fuerte') sugerencia = null;

    return { nivel, puntaje, sugerencia };
}
