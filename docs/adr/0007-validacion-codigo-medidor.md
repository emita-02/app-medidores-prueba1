# ADR-0007: Validación del código de medidor

## Estado
Aceptado

## Número y título
0007 - Validación del código de medidor

## Contexto
El requisito R2 establece que se debe validar el formato del código de medidor antes de consultarlo. El formato aceptado es exactamente `MED-` seguido de seis dígitos. Si el código es inválido, no se debe consultar la API ni mostrar información del medidor.

## Decisión
Validar el código de medidor con la expresión regular `^MED-\\d{6}$` (en código JavaScript/TypeScript: `"^MED-\\d{6}$"`). Si el campo no coincide exactamente, se muestra un mensaje de error al técnico y se bloquea la consulta a MockAPI y la visualización de datos del medidor.

## Alternativas consideradas
- Validación más permisiva (por ejemplo, aceptar letras después de los dígitos): descartado porque no cumple el formato exacto exigido por R2.
- Validar solo que empiece con `MED-`: insuficiente, porque permitiría códigos sin los seis dígitos requeridos.
- Validar solo en el backend: insuficiente, porque se enviaría una petición inválida a MockAPI y se violaría el requisito de no consultar si el código es inválido.

## Consecuencias positivas
- Cumple estrictamente R2: no se consulta la API con códigos inválidos.
- Evita peticiones innecesarias a MockAPI y reduce errores del servidor por datos mal formados.
- Brinda retroalimentación inmediata al técnico cuando el código está mal escrito.

## Consecuencias negativas
- Ninguna identificada por ahora; la expresión regular es simple y no afecta el rendimiento.

## Requisitos funcionales relacionados
R2.