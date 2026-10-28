# ADR-0005: Autenticación y sesión

## Estado
Aceptado

## Número y título
0005 - Autenticación y sesión

## Contexto
El requisito R1 exige inicio de sesión con código de empleado y clave, mantener la sesión al cerrar y abrir la aplicación, y permitir cerrar sesión. Se permiten credenciales quemadas para esta primera etapa. No se dispone aún de un backend real de autenticación.

## Decisión
Implementar un formulario de login con credenciales quemadas (código de empleado y clave predefinidos en el código). Al iniciar sesión exitosamente, guardar un identificador de sesión o token en `expo-secure-store`. Al abrir la aplicación, verificar si existe un dato en `expo-secure-store` para decidir si mostrar el login o la pantalla principal. Proveer una opción de cierre de sesión que borre el dato de `expo-secure-store`.

## Alternativas consideradas
- Backend real con JWT y refresh token: descartado para esta etapa, porque no hay servidor de autenticación definido y el enunciado permite credenciales quemadas.
- Almacenar la sesión en `AsyncStorage` o `expo-sqlite`: menos seguro que `expo-secure-store`, que está diseñado para datos sensibles.

## Consecuencias positivas
- Cumple R1 con la mínima complejidad para un MVP académico.
- La sesión persiste al cerrar y abrir la aplicación.
- `expo-secure-store` ofrece cifrado nativo para el dato de sesión.

## Consecuencias negativas
- Las credenciales quemadas son una solución temporal; antes de un uso real se deberá reemplazar por autenticación contra un servidor.
- Si el dispositivo no soporta `expo-secure-store` en el entorno de prueba (por ejemplo, Expo Go sin development build), habrá que evaluar una alternativa de almacenamiento.

## Requisitos funcionales relacionados
R1.