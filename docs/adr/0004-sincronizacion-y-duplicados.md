# ADR-0004: Sincronización y prevención de duplicados

## Estado
Aceptado

## Número y título
0004 - Sincronización y prevención de duplicados

## Contexto
El requisito R9 exige sincronizar automáticamente cuando haya conexión, evitando duplicados incluso si la conexión se interrumpe durante un envío. El requisito R10 impide registrar una segunda lectura del mismo medidor en el mismo mes. MockAPI se usa para simular el sistema de oficina, pero no se asume que garantice idempotencia automática; la aplicación debe encargarse de no reenviar lecturas ya enviadas.

## Decisión
Cada lectura recibe un `id_local` (UUID generado en el dispositivo) al crear el borrador. Antes de enviar, la aplicación verifica en SQLite si ya existe una lectura `enviada` o `pendiente` para ese medidor y mes/año, y rechaza el registro si lo hay (R10). Al enviar a MockAPI, se incluye el `id_local` en el payload. La lectura solo se marca como `enviada` en SQLite después de recibir una respuesta exitosa (2xx) del servidor, tanto para los datos como para la fotografía si corresponde. Si la red se interrumpe, la lectura queda como `pendiente` o `error` y se reintenta con backoff exponencial al recuperar la conexión, detectada mediante el módulo de conectividad de Expo.

## Alternativas consideradas
- Confiar en que MockAPI rechace automáticamente duplicados: descartado, porque no se garantiza que MockAPI tenga lógica de idempotencia.
- Usar solo timestamp como identificador: insuficiente, porque dos lecturas del mismo medidor en el mismo mes podrían tener timestamps distintos y seguirse considerando duplicados lógicos.
- Marcar como enviada antes de recibir respuesta del servidor: riesgoso, porque si la red falla después, se perdería la lectura sin saber si llegó al servidor.

## Consecuencias positivas
- Evita duplicados incluso si el envío se interrumpe a mitad de camino.
- Permite reintentos seguros sin riesgo de enviar la misma lectura dos veces.
- El `id_local` permite rastrear cada borrador desde su creación hasta su envío exitoso.

## Consecuencias negativas
- Requiere lógica adicional en el cliente para gestionar estados de sincronización (`borrador`, `pendiente`, `enviado`, `error`).
- No se puede verificar con certeza si MockAPI recibió la lectura hasta que se reciba una respuesta 2xx.
- La detección de conexión depende de un módulo de Expo cuya versión exacta debe confirmarse con `npx expo install`.

## Requisitos funcionales relacionados
R4, R9, R10.