# ADR-0006: Persistencia de fotografías pendientes

## Estado
Aceptado

## Número y título
0006 - Persistencia de fotografías pendientes

## Contexto
El requisito R7 establece que la fotografía debe conservarse localmente hasta enviar la lectura. Las imágenes no deben eliminarse hasta confirmar que su envío fue exitoso. Inicialmente se consideró `cacheDirectory`, pero ese directorio puede ser limpiado por el sistema operativo en cualquier momento, lo que pone en riesgo las fotos pendientes de envío.

## Decisión
Almacenar las fotografías en un directorio persistente de la aplicación (por ejemplo, `FileSystem.documentDirectory` o un subdirectorio propio bajo `FileSystem.cacheDirectory` solo si se confirma que no se limpia automáticamente; se prefiere `documentDirectory` por persistencia). La URI local de cada imagen se guarda en SQLite junto al borrador o lectura asociada. El archivo físico solo se elimina después de recibir confirmación exitosa (2xx) del envío de la lectura y, si corresponde, de la fotografía.

## Alternativas consideradas
- `cacheDirectory`: más simple, pero el sistema operativo puede borrar archivos en cualquier momento sin aviso, lo que provocaría pérdida de fotos pendientes.
- Almacenar la imagen en memoria (estado de React): se perdería al cerrar o recargar la aplicación, incumpliendo R8.
- Subir la imagen inmediatamente al tomar la foto: no funciona sin conexión y no permite reintentar después.

## Consecuencias positivas
- Las fotos sobreviven al cierre y reinicio de la aplicación (R8).
- No se pierden imágenes si el envío falla por falta de conexión.
- La URI en SQLite permite asociar cada foto con su lectura y borrador.

## Consecuencias negativas
- Ocupa espacio en el almacenamiento del dispositivo hasta que el envío se confirme.
- Requiere una rutina de limpieza para borrar fotos de lecturas descartadas o fallidas definitivamente, evitando acumular archivos huérfanos.
- Se debe verificar la API exacta de `expo-file-system` compatible con Expo SDK 58 antes de implementar (`FileSystem.documentDirectory`, `FileSystem.getInfoAsync`, `FileSystem.deleteAsync`, `FileSystem.uploadAsync`).

## Requisitos funcionales relacionados
R7, R8.