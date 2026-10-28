# ADR-0003: Captura de fotografías

## Estado
Propuesta

## Número y título
0003 - Captura de fotografías

## Contexto
El requisito R7 establece que la fotografía es obligatoria para consumos anómalos y medidores dañados, y opcional en los demás casos. Si se deniega el permiso de cámara, se debe explicar su necesidad y permitir continuar cuando la foto sea opcional. Se debe decidir entre integrar una cámara dentro de la app o usar el selector de imágenes del sistema.

## Decisión
Usar `expo-image-picker` para capturar o seleccionar fotografías. Esta decisión está marcada como Propuesta porque depende de confirmar si el estudiante puede generar un development build o si debe limitarse a Expo Go. `expo-image-picker` se instalará con `npx expo install` para garantizar compatibilidad con Expo SDK 58.

## Alternativas consideradas
- `expo-camera`: permite mostrar una vista de cámara embebida en la app, pero es más compleja de integrar y puede requerir development build, lo que dificulta la prueba en Expo Go.
- `expo-image-picker`: abre la cámara del sistema o la galería, devuelve la URI de la imagen, y suele funcionar en Expo Go sin necesidad de development build. Es más simple para el alcance de esta prueba.

## Consecuencias positivas
- Menor complejidad de implementación: una sola llamada abre la cámara o galería del sistema.
- Mejor compatibilidad con Expo Go, lo que facilita la demostración en el dispositivo del estudiante.
- Maneja los permisos de cámara de forma estándar en Android e iOS.

## Consecuencias negativas
- Menos control sobre la interfaz de cámara (no se puede personalizar la vista previa dentro de la app).
- La decisión depende de verificar que `expo-image-picker` funcione en el entorno final de demostración; si solo se permite Expo Go y el módulo no está incluido, habrá que buscar otra alternativa.

## Requisitos funcionales relacionados
R7.