# ADR-0001: Versión de Expo SDK

## Estado
Aceptado

## Número y título
0001 - Versión de Expo SDK

## Contexto
El enunciado original de la prueba solicita Expo SDK 57. Sin embargo, el proyecto `app-medidores-prueba1` fue inicializado con Expo SDK 58 instalado (`expo` versión `~58.0.19`, `react-native` `0.88.0`, `expo-router` `~58.0.26`), como se confirma en `package.json`. El dispositivo del estudiante tiene instalada una versión de Expo Go compatible con SDK 58, no con SDK 57.

## Decisión
Utilizar Expo SDK 58, que es la versión ya instalada en el proyecto, en lugar de reiniciar el proyecto con SDK 57. Esta diferencia entre el enunciado (SDK 57) y la instalación real (SDK 58) se documenta aquí por transparencia. No se afirma que el docente haya aprobado el cambio; se registra como una observación del estado actual del proyecto.

## Alternativas consideradas
- Reinstalar el proyecto desde cero con Expo SDK 57: descartado porque requeriría volver a configurar dependencias y podría incompatibilizar con el Expo Go disponible en el dispositivo del estudiante.
- Mantener SDK 58 y documentar la diferencia: aceptado, porque permite avanzar sin bloquear el desarrollo.

## Consecuencias positivas
- El proyecto puede ejecutarse inmediatamente en el dispositivo del estudiante con Expo Go.
- No se pierde tiempo en reinstalar dependencias ni en configurar un entorno distinto al ya disponible.

## Consecuencias negativas
- Hay una discrepancia con el enunciado original (SDK 57) que debe quedar registrada para evitar confusiones durante la evaluación.
- Algunas guías o ejemplos del estudiante que asuman SDK 57 podrían no funcionar exactamente igual en SDK 58.

## Requisitos funcionales relacionados
Todos (R1 a R10), porque la versión de Expo afecta a cualquier dependencia nativa que se añada después.