# ADR-0002: Persistencia local de datos

## Estado
Aceptado

## Número y título
0002 - Persistencia local de datos

## Contexto
La aplicación debe funcionar sin conexión (R4, R8), mantener caché de medidores consultados (R3), guardar borradores de lecturas (R8) y evitar duplicados al sincronizar (R9, R10). Además, la sesión de usuario debe persistir al cerrar y abrir la aplicación (R1). Se necesita una base de datos local estructurada y un almacenamiento seguro para credenciales.

## Decisión
Utilizar `expo-sqlite` para datos estructurados (medidores en caché, lecturas pendientes, borradores) y `expo-secure-store` para la sesión (token o credenciales de empleado). Ambas se instalarán con `npx expo install` para garantizar versiones compatibles con Expo SDK 58.

## Alternativas consideradas
- `AsyncStorage`: más simple, pero no ofrece consultas estructuradas ni integridad transaccional, lo que complica evitar duplicados y gestionar borradores.
- Solo `expo-secure-store`: insuficiente para volúmenes de datos como lecturas y medidores.
- Una base de datos remota únicamente: incumple el requisito de funcionamiento sin conexión.

## Consecuencias positivas
- Permite consultar medidores en caché sin red (R3).
- Soporta borradores que sobreviven al cierre de la aplicación (R8).
- Permite marcar lecturas como pendientes y sincronizarlas después (R4, R9).
- `expo-secure-store` protege mejor la sesión que almacenarla en texto plano.

## Consecuencias negativas
- Añade complejidad inicial: hay que definir esquemas de tablas y manejar migraciones simples.
- `expo-secure-store` y `expo-sqlite` son módulos con código nativo; si se usa Expo Go sin development build, algunos módulos pueden no estar disponibles. Se debe verificar en el entorno de desarrollo.

## Requisitos funcionales relacionados
R1, R3, R4, R8, R9, R10.