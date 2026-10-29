# Contexto Completo del Proyecto CV-CREATOR-APP


================================================
ðŸ“„ ARCHIVO: .gitignore
================================================

# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

example

# generated native folders
/ios
/android


================================================
ðŸ“„ ARCHIVO: .kilo\skills\medidores-ui\SKILL.md
================================================

---
  name : medidores-ui
  description: usarla para definir colores, tipografia y estilos dentro de la aplicación
---

# Identidad visual
- La aplicación registra lecturas de medidores de agua en campo.
-  Su interfaz debe transmitir profesionalismo, seguridad, claridad y eficiencia. 
- El estilo elegido es industrial y operativo, moderno y cuidado, sin parecer una plantilla genérica de administración.

# Paleta de colores
- Azul principal: #035AA6
- Azul secundario: #0367A6
- Azul oscuro: #175073
- Rojo de alerta: #D93030
- Gris claro: #F2F2F2

Utilizar la paleta de colores para botones, encabezados, iconos, bordes, fondos y elementos de alerta. Teniendo en cuenta que todo debe estar correctamente combinado y contrastado para garantizar la legibilidad y accesibilidad.

# Uso semántico del color
- Azul principal: acciones primarias y elementos destacados.
- Azul secundario: elementos interactivos y detalles de navegación.
- Azul oscuro: encabezados y textos destacados cuando exista contraste suficiente.
- Rojo: errores, situaciones críticas, medidores dañados y acciones destructivas. No lo uses como color indiscriminado.
- Gris claro: fondos y superficies secundarias.

Los estados de conexión, sincronización, éxito y advertencia deben distinguirse claramente, usando colores semánticos adicionales solo si son necesarios. Nunca comuniques un estado únicamente mediante el color: acompáñalo con texto o un icono.

# Componentes y estilo
- Mantén una apariencia consistente en todas las pantallas.
- Utiliza componentes reutilizables para botones, campos de texto, tarjetas, mensajes de error, indicadores de conexión y estados de sincronización.
- Prioriza una jerarquía visual clara, espaciado consistente, tipografía legible y áreas táctiles cómodas.
- Los formularios deben tener etiquetas claras, validación visible y mensajes comprensibles en español.
- Las alertas de consumo anómalo y los medidores dañados deben llamar la atención sin confundir al usuario.
- La conexión y el número de lecturas pendientes deben ser fáciles de localizar.
- Evita pantallas recargadas, emojis decorativos, exceso de sombras, gradientes innecesarios y diseños genéricos.
- Verifica el contraste del texto y de los botones, especialmente sobre fondos azules y rojos.



================================================
ðŸ“„ ARCHIVO: AGENTS.md
================================================

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md


================================================
ðŸ“„ ARCHIVO: app.json
================================================

{
  "expo": {
    "name": "AquaUIO",
    "slug": "app-medidores-prueba1",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icono_app_aquauio.png",
    "scheme": "app-medidores-prueba1",
    "userInterfaceStyle": "automatic",
    "ios": {
      "icon": "./assets/expo.icon"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/icono_app_aquauio.png",
        "backgroundImage": "./assets/images/icono_app_aquauio.png",
        "monochromeImage": "./assets/images/icono_app_aquauio.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "server",
      "favicon": "./assets/images/icono_app_aquauio.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#208AEF",
          "image": "./assets/images/icono_app_aquauio.png",
          "imageWidth": 76
        }
      ],
      "expo-secure-store",
      "expo-sqlite",
      [
        "expo-image-picker",
        {
          "photosPermission": "La aplicación necesita acceso a tus fotos para guardar evidencia del medidor.",
          "cameraPermission": "La aplicación necesita acceso a la cámara para tomar fotos del medidor cuando sea obligatorio."
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "La aplicación necesita acceso a la cámara para tomar fotos del medidor cuando sea obligatorio."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}


================================================
ðŸ“„ ARCHIVO: docs\adr\0001-version-expo.md
================================================

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

================================================
ðŸ“„ ARCHIVO: docs\adr\0002-persistencia-local.md
================================================

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

================================================
ðŸ“„ ARCHIVO: docs\adr\0003-captura-fotografias.md
================================================

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

================================================
ðŸ“„ ARCHIVO: docs\adr\0004-sincronizacion-y-duplicados.md
================================================

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

================================================
ðŸ“„ ARCHIVO: docs\adr\0005-autenticacion-y-sesion.md
================================================

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

================================================
ðŸ“„ ARCHIVO: docs\adr\0006-persistencia-de-fotografias.md
================================================

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

================================================
ðŸ“„ ARCHIVO: docs\adr\0007-validacion-codigo-medidor.md
================================================

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

================================================
ðŸ“„ ARCHIVO: eslint.config.js
================================================

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);


================================================
ðŸ“„ ARCHIVO: expo-env.d.ts
================================================

/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

================================================
ðŸ“„ ARCHIVO: package.json
================================================

{
  "name": "AquaUIO",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "dependencies": {
    "@expo/ui": "~58.0.23",
    "@expo/vector-icons": "^15.0.2",
    "@react-native-community/netinfo": "11.4.1",
    "expo": "~58.0.19",
    "expo-camera": "~16.1.11",
    "expo-constants": "~58.0.13",
    "expo-crypto": "~58.0.7",
    "expo-device": "~58.0.5",
    "expo-file-system": "~18.1.11",
    "expo-font": "~58.0.10",
    "expo-glass-effect": "~58.0.5",
    "expo-image": "~58.0.17",
    "expo-image-picker": "~58.0.10",
    "expo-linking": "~58.0.14",
    "expo-media-library": "~17.1.7",
    "expo-router": "~58.0.26",
    "expo-secure-store": "~58.0.2",
    "expo-splash-screen": "~58.0.11",
    "expo-sqlite": "~58.0.14",
    "expo-status-bar": "~58.0.4",
    "expo-symbols": "~58.0.4",
    "expo-system-ui": "~58.0.6",
    "expo-web-browser": "~58.0.6",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-native": "0.88.0",
    "react-native-gesture-handler": "~3.3.0",
    "react-native-reanimated": "4.7.1",
    "react-native-safe-area-context": "~5.10.1",
    "react-native-screens": "~4.30.0",
    "react-native-web": "~0.21.4",
    "react-native-worklets": "0.13.0"
  },
  "devDependencies": {
    "@types/react": "~19.3.0",
    "eslint": "^9.0.0",
    "eslint-config-expo": "~58.0.4",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "private": true
}


================================================
ðŸ“„ ARCHIVO: README.md
================================================

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


================================================
ðŸ“„ ARCHIVO: scripts\reset-project.js
================================================

#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /src and /scripts directories to /example based on user input and creates a new /src/app directory with an index.tsx and _layout.tsx file.
 * Demo images in /assets/images are deleted or moved along with them.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["src", "scripts"];
const exampleDir = "example";
const newAppDir = "src/app";
const exampleDirPath = path.join(root, exampleDir);
// Demo images and folders used only by the files in /src
const exampleAssets = [
  "expo-badge.png",
  "expo-badge-white.png",
  "expo-logo.png",
  "logo-glow.png",
  "react-logo.png",
  "react-logo@2x.png",
  "react-logo@3x.png",
  "tutorial-web.png",
  "tabIcons",
];

const indexContent = `import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      await fs.promises.mkdir(path.join(exampleDirPath, "assets/images"), { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Move demo assets to /example or delete them
    for (const asset of exampleAssets) {
      const assetPath = path.join(root, "assets/images", asset);
      if (fs.existsSync(assetPath)) {
        if (userInput === "y") {
          const newAssetPath = path.join(exampleDirPath, "assets/images", asset);
          await fs.promises.rename(assetPath, newAssetPath);
          console.log(
            `➡️ /assets/images/${asset} moved to /${exampleDir}/assets/images/${asset}.`
          );
        } else {
          await fs.promises.rm(assetPath, { recursive: true, force: true });
          console.log(`❌ /assets/images/${asset} deleted.`);
        }
      }
    }

    // Create new /src/app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /src/app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 src/app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 src/app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit src/app/index.tsx to edit the main screen.\n3. Put all your application code in /src, only screens and layout files should be in /src/app.${
        userInput === "y"
          ? `\n4. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);


================================================
ðŸ“„ ARCHIVO: src\app\borradores.tsx
================================================

import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { obtenerLecturasPorEstado, eliminarLectura, type Lectura } from '@/database/repository';
import { useConnectionStatus } from '@/hooks/use-connection';
import { sincronizarPendientes } from '@/services/sync.service';

export default function BorradoresScreen() {
  const router = useRouter();
  const [borradores, setBorradores] = useState<Lectura[]>([]);
  const [cargando, setCargando] = useState(true);
  const { isConnected, pendingCount, actualizarContador } = useConnectionStatus();

  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const lista = obtenerLecturasPorEstado('borrador');
        setBorradores(lista);
      } catch {
        setBorradores([]);
      } finally {
        setCargando(false);
      }
    });
  }, []);

  const formatearFecha = (iso: string): string => {
    return new Date(iso).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDescartar = (idLocal: string) => {
    Alert.alert(
      'Descartar borrador',
      '¿Está seguro de que desea descartar este borrador? Los datos se perderán y el medidor quedará disponible para una nueva lectura del mismo mes.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: () => {
            try {
              const resultado = eliminarLectura(idLocal);
              if (resultado.ok) {
                setBorradores((prev) => prev.filter((b) => b.id_local !== idLocal));
              } else {
                Alert.alert('Error al descartar', resultado.error);
              }
            } catch {
              Alert.alert('Error', 'No se pudo descartar el borrador.');
            }
          },
        },
      ]
    );
  };

  const handleContinuar = (idLocal: string, codigo: string) => {
    router.push(`/lectura?borradorId=${encodeURIComponent(idLocal)}&codigo=${encodeURIComponent(codigo)}`);
  };

  if (cargando) {
    return (
      <ThemedView type="background" style={styles.container}>
        <ThemedText type="default" themeColor="text" style={styles.loadingText}>
          Cargando borradores...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.scrollView}
      keyboardShouldPersistTaps="handled">
      
      {/* Cabecera institucional moderna */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <ThemedText type="title" style={styles.headerTitle} themeColor="text">
              EPMAPS
            </ThemedText>
            <ThemedText type="smallBold" style={styles.headerSubtitle} themeColor="textSecondary">
              Borradores pendientes
            </ThemedText>
          </View>
        </View>
        <View style={styles.statusRowContainer}>
          <View style={styles.statusRow}>
            <ThemedText type="small" style={styles.statusText} themeColor="text">
              {isConnected === false ? '● Sin conexión' : '● Conectado'}
            </ThemedText>
            {pendingCount > 0 && (
              <ThemedText type="small" style={styles.statusText} themeColor="text">
                | Pendientes: {pendingCount}
              </ThemedText>
            )}
          </View>
          {isConnected !== false && pendingCount > 0 && (
            <Pressable
              style={styles.syncButton}
              onPress={() => {
                sincronizarPendientes()
                  .then(() => actualizarContador())
                  .catch(() => actualizarContador());
              }}>
              <ThemedText type="smallBold" style={styles.syncButtonText} themeColor="text">
                Sincronizar ahora
              </ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="document-text-outline" size={20} color="#035AA6" />
          <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
            Registros incompletos
          </ThemedText>
        </View>

        {borradores.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={48} color="#035AA6" style={{ marginBottom: 8 }} />
            <ThemedText type="smallBold" style={styles.emptyTitle} themeColor="text">
              No hay borradores pendientes
            </ThemedText>
            <ThemedText type="small" style={styles.emptyText} themeColor="textSecondary">
              No existen registros incompletos para continuar.
            </ThemedText>
          </View>
        ) : (
          borradores.map((b) => (
            <View key={b.id_local} style={styles.item}>
              <View style={styles.itemInfo}>
                <View style={styles.codeRow}>
                  <Ionicons name="barcode-outline" size={16} color="#035AA6" />
                  <ThemedText type="smallBold" style={styles.itemCode} themeColor="primaryDark">
                    {b.codigo_medidor}
                  </ThemedText>
                </View>
                <ThemedText type="small" style={styles.itemMeta} themeColor="textSecondary">
                  Periodo: {b.mes}/{b.anio} &bull; Estado: <ThemedText style={{ fontWeight: '600', color: '#1E293B' }}>{b.estado_medidor}</ThemedText>
                </ThemedText>
                <ThemedText type="code" style={styles.itemDate} themeColor="textSecondary">
                  Modificado: {formatearFecha(b.fecha_creacion)}
                </ThemedText>
              </View>
              <View style={styles.itemActions}>
                <Pressable style={styles.btnContinuar} onPress={() => handleContinuar(b.id_local, b.codigo_medidor)}>
                  <ThemedText type="smallBold" style={styles.btnTexto} themeColor="text">
                    Continuar
                  </ThemedText>
                </Pressable>
                <Pressable style={styles.btnDescartar} onPress={() => handleDescartar(b.id_local)}>
                  <ThemedText type="smallBold" style={styles.btnTextoDescartar} themeColor="error">
                    Descartar
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          ))
        )}

        <Pressable style={styles.buttonSecundario} onPress={() => router.back()}>
          <ThemedText type="smallBold" style={styles.buttonTextoSecundario} themeColor="primarySecondary">
            Volver al inicio
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2', 
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#F2F2F2', 
  },
  contentContainer: {
    paddingBottom: Spacing.six,
    backgroundColor: '#F2F2F2',
  },
  header: {
    paddingTop: 50, 
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.five,
    backgroundColor: '#035AA6',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backIconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 12,
  },
  cardContainer: {
    marginHorizontal: Spacing.four,
    marginTop: -Spacing.three,
    backgroundColor: '#FFFFFF', 
    borderRadius: 20,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    gap: Spacing.three,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F2F2F2',
    letterSpacing: 2,
    marginTop: 2,
  },
  statusRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  syncButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 8,
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    marginBottom: Spacing.two,
  },
  itemInfo: {
    flex: 1,
    gap: 4,
    paddingRight: Spacing.two,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#035AA6',
  },
  itemMeta: {
    fontSize: 12,
    color: '#64748B',
  },
  itemDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  itemActions: {
    gap: Spacing.two,
    width: 100,
  },
  btnContinuar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#035AA6',
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
  },
  btnTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#035AA6',
  },
  btnDescartar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D93030',
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
  },
  btnTextoDescartar: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D93030',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#0F172A',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  buttonSecundario: {
    borderWidth: 1.5,
    borderColor: '#035AA6',
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
    minHeight: 52,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonTextoSecundario: {
    color: '#035AA6',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.six,
    color: '#64748B',
  },
});

================================================
ðŸ“„ ARCHIVO: src\app\index.tsx
================================================

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing } from "@/constants/theme";
import {
  eliminarLectura,
  inicializarBaseDeDatos,
  obtenerLecturasPorEstado,
  type Lectura
} from "@/database/repository";
import { useConnectionStatus } from "@/hooks/use-connection";
import { useAuth } from "@/services/auth-context";
import {
  consultarMedidor,
  type ConsultaResult,
} from "@/services/medidor.service";
import { sincronizarPendientes } from "@/services/sync.service";

const CODIGO_REGEX = new RegExp("^MED-\\d{6}$");

export default function HomeScreen() {
  const router = useRouter();
  const { session, loading: authLoading, logout } = useAuth();
  const { isConnected, pendingCount, actualizarContador } =
    useConnectionStatus();

  const [codigo, setCodigo] = useState("");
  const [consulta, setConsulta] = useState<ConsultaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consultando, setConsultando] = useState(false);
  const [verificando, setVerificando] = useState<
    "idle" | "ok" | "fallo" | null
  >(null);
  const [borradorPendiente, setBorradorPendiente] = useState<Lectura | null>(
    null,
  );

  useEffect(() => {
    inicializarBaseDeDatos();
    try {
      const borradores = obtenerLecturasPorEstado("borrador");
      if (borradores && borradores.length > 0) {
        const masReciente = [...borradores].sort((a, b) => {
          if (b.fecha_modificacion > a.fecha_modificacion) return 1;
          if (b.fecha_modificacion < a.fecha_modificacion) return -1;
          return 0;
        })[0];
        setBorradorPendiente(masReciente);
      } else {
        setBorradorPendiente(null);
      }
    } catch {
      setBorradorPendiente(null);
    }
  }, []);

  useEffect(() => {
    actualizarContador();
  }, [actualizarContador]);

  const handleDescartarBorrador = () => {
    if (!borradorPendiente) return;
    Alert.alert(
      "Descartar borrador",
      `¿Desea descartar el borrador del medidor ${borradorPendiente.codigo_medidor} (${borradorPendiente.mes}/${borradorPendiente.anio})?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Descartar",
          style: "destructive",
          onPress: () => {
            try {
              const res = eliminarLectura(borradorPendiente.id_local);
              if (res && res.ok) {
                setBorradorPendiente(null);
              } else if (res && res.error) {
                Alert.alert("Error", res.error);
              } else {
                setBorradorPendiente(null);
              }
            } catch {
              Alert.alert("Error", "No se pudo descartar el borrador.");
            }
          },
        },
      ],
    );
  };

  const handleContinuarBorrador = () => {
    if (!borradorPendiente) return;
    router.push(
      `/lectura?borradorId=${encodeURIComponent(borradorPendiente.id_local)}&codigo=${encodeURIComponent(
        borradorPendiente.codigo_medidor,
      )}`,
    );
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleConsultar = async () => {
    inicializarBaseDeDatos();
    setError(null);
    setConsulta(null);

    const valor = codigo.trim();
    if (!CODIGO_REGEX.test(valor)) {
      setError(
        "El código del medidor debe tener el formato MED-XXXXXX (MED- seguido de exactamente seis dígitos).",
      );
      return;
    }

    setConsultando(true);
    try {
      const resultado = await consultarMedidor(valor);
      setConsulta(resultado);
      if (resultado.estado === "error") {
        setError(resultado.mensaje);
      }
    } catch {
      setError("Error inesperado al consultar el medidor.");
    } finally {
      setConsultando(false);
    }
  };

  const chipTexto = (): string => {
    if (!consulta) return "Sin consulta realizada.";
    if (consulta.estado === "exito") {
      return consulta.origen === "api"
        ? "En línea — datos de MockAPI"
        : "Sin conexión — datos de caché";
    }
    if (consulta.estado === "sin_conexion") {
      return consulta.medidor
        ? "Sin conexión — datos de caché"
        : "Sin conexión — sin datos guardados";
    }
    if (consulta.estado === "error") return "Error de consulta.";
    return "Medidor no encontrado.";
  };

  const formatearFecha = (iso: string | null | undefined): string => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filaDato = (
    etiqueta: string,
    valor: string | number | null | undefined,
  ) => (
    <View style={styles.fila} key={etiqueta}>
      <ThemedText type="smallBold" style={styles.etiqueta} themeColor="text">
        {etiqueta}
      </ThemedText>
      <ThemedText type="code" style={styles.valor} themeColor="text">
        {valor == null || valor === "" ? "—" : String(valor)}
      </ThemedText>
    </View>
  );

  const renderResultado = () => {
    if (!consulta) return null;

    if (consulta.estado === "no_encontrado") {
      return (
        <ThemedView style={styles.cardResultado}>
          <ThemedText
            type="smallBold"
            style={styles.tituloResultado}
            themeColor="text"
          >
            Medidor no encontrado
          </ThemedText>
          <ThemedText
            type="small"
            style={styles.mensajeResultado}
            themeColor="textSecondary"
          >
            No existe un medidor registrado con el código consultado en MockAPI.
          </ThemedText>
        </ThemedView>
      );
    }

    if (consulta.estado === "error") {
      return (
        <ThemedView style={[styles.cardResultado, styles.cardError]}>
          <ThemedText
            type="smallBold"
            style={styles.tituloResultado}
            themeColor="error"
          >
            Error al consultar
          </ThemedText>
          <ThemedText
            type="small"
            style={styles.mensajeResultado}
            themeColor="text"
          >
            {consulta.mensaje}
          </ThemedText>
        </ThemedView>
      );
    }

    if (consulta.estado === "sin_conexion") {
      if (!consulta.medidor) {
        return (
          <ThemedView style={styles.cardResultado}>
            <ThemedText
              type="smallBold"
              style={styles.tituloResultado}
              themeColor="text"
            >
              Sin conexión y sin datos guardados
            </ThemedText>
            <ThemedText
              type="small"
              style={styles.mensajeResultado}
              themeColor="textSecondary"
            >
              No hay conexión y no existe información previa de este medidor en
              SQLite.
            </ThemedText>
          </ThemedView>
        );
      }

      const medidor = consulta.medidor;
      const vencida = !consulta.vigente;
      return (
        <ThemedView style={[styles.cardResultado, styles.cardAlmacenado]}>
          <ThemedView style={styles.badgeAlmacenado}>
            <ThemedText
              type="smallBold"
              style={styles.textoBadge}
              themeColor="text"
            >
              {vencida ? "CACHÉ VENCIDA" : "DATOS ALMACENADOS"}
            </ThemedText>
          </ThemedView>
          <ThemedText
            type="smallBold"
            style={styles.tituloResultado}
            themeColor="text"
          >
            Medidor (consulta offline)
          </ThemedText>
          <ThemedText
            type="small"
            style={styles.mensajeResultado}
            themeColor="textSecondary"
          >
            Sin conexión. Mostrando datos guardados en SQLite, consultados el{" "}
            {formatearFecha(medidor.fecha_consulta)}.
            {vencida ? " La caché superó un día de vigencia." : ""}
          </ThemedText>
          <View style={styles.datos}>
            {filaDato("Código", medidor.codigo)}
            {filaDato("Dirección", medidor.direccion)}
            {filaDato("Sector", medidor.sector)}
            {filaDato("Número de cuenta", medidor.numero_cuenta)}
            {filaDato("Estado", medidor.estado)}
            {filaDato("Última lectura", medidor.ultima_lectura)}
            {filaDato(
              "Fecha última lectura",
              formatearFecha(medidor.fecha_ultima_lectura),
            )}
            {filaDato(
              "Consumo promedio mensual",
              medidor.consumo_promedio_mensual,
            )}
          </View>

          <Pressable
            style={styles.button}
            onPress={() =>
              router.push(
                `/lectura?codigo=${encodeURIComponent(medidor.codigo)}`,
              )
            }
          >
            <ThemedText
              type="smallBold"
              style={styles.buttonText}
              themeColor="text"
            >
              Registrar lectura
            </ThemedText>
          </Pressable>
        </ThemedView>
      );
    }

    const medidor = consulta.medidor;
    const origenTexto =
      consulta.origen === "api"
        ? "Consultado en línea (MockAPI)"
        : "Consultado desde caché";
    return (
      <ThemedView style={[styles.cardResultado, styles.cardDatos]}>
        <ThemedView style={styles.badgeOnline}>
          <ThemedText
            type="smallBold"
            style={styles.textoBadge}
            themeColor="text"
          >
            {consulta.vigente ? "CACHÉ VIGENTE" : "CACHÉ VENCIDA"}
          </ThemedText>
        </ThemedView>
        <ThemedText
          type="smallBold"
          style={styles.tituloResultado}
          themeColor="text"
        >
          Medidor encontrado
        </ThemedText>
        <ThemedText
          type="small"
          style={styles.mensajeResultado}
          themeColor="textSecondary"
        >
          {origenTexto}. Consulta realizada:{" "}
          {formatearFecha(medidor.fecha_consulta)}.
        </ThemedText>
        <View style={styles.datos}>
          {filaDato("Código", medidor.codigo)}
          {filaDato("Dirección", medidor.direccion)}
          {filaDato("Sector", medidor.sector)}
          {filaDato("Número de cuenta", medidor.numero_cuenta)}
          {filaDato("Estado", medidor.estado)}
          {filaDato("Última lectura", medidor.ultima_lectura)}
          {filaDato(
            "Fecha última lectura",
            formatearFecha(medidor.fecha_ultima_lectura),
          )}
          {filaDato(
            "Consumo promedio mensual",
            medidor.consumo_promedio_mensual,
          )}
        </View>

        <Pressable
          style={styles.button}
          onPress={() =>
            router.push(`/lectura?codigo=${encodeURIComponent(medidor.codigo)}`)
          }
        >
          <ThemedText
            type="smallBold"
            style={styles.buttonText}
            themeColor="text"
          >
            Registrar lectura
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.scrollView}
      keyboardShouldPersistTaps="handled"
    >
      {/* Cabecera institucional moderna */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <ThemedText
              type="title"
              style={styles.headerTitle}
              themeColor="text"
            >
              EPMAPS
            </ThemedText>
            <ThemedText
              type="smallBold"
              style={styles.headerSubtitle}
              themeColor="textSecondary"
            >
              AGUA DE QUITO
            </ThemedText>
            <ThemedText
              type="smallBold"
              style={styles.headerSubtitle}
              themeColor="textSecondary"
            >
              Registro de lecturas de medidores
            </ThemedText>
          </View>
          <Pressable style={styles.logoutIconButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.statusRowContainer}>
          <View style={styles.statusRow}>
            <ThemedText
              type="small"
              style={styles.statusText}
              themeColor="text"
            >
              {isConnected === false ? "● Sin conexión" : "● Conectado"}
            </ThemedText>
            {pendingCount > 0 && (
              <ThemedText
                type="small"
                style={styles.statusText}
                themeColor="text"
              >
                | Pendientes: {pendingCount}
              </ThemedText>
            )}
          </View>
          {isConnected !== false && pendingCount > 0 && (
            <Pressable
              style={styles.syncButton}
              onPress={() => {
                sincronizarPendientes()
                  .then(() => actualizarContador())
                  .catch(() => actualizarContador());
              }}
            >
              <ThemedText
                type="smallBold"
                style={styles.syncButtonText}
                themeColor="text"
              >
                Sincronizar ahora
              </ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      {/* Tarjeta de bienvenida / Sesión de la operadora */}
      <View style={styles.cardContainer}>
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={24} color="#035AA6" />
            </View>
            <View>
              <ThemedText type="small" style={styles.welcomeLabel}>
                ¡Buen día,
              </ThemedText>
              <ThemedText type="smallBold" style={styles.userName}>
                Emily Pazmiño
              </ThemedText>
              <ThemedText type="code" style={styles.empleadoCode}>
                Código: {session?.employeeCode ?? "EMP-001"}
              </ThemedText>
            </View>
          </View>
        </View>

        {borradorPendiente ? (
          <ThemedView
            type="backgroundLight"
            style={[styles.cardBorradorContainer]}
          >
            <View style={styles.borradorHeaderRow}>
              <Ionicons name="alert-circle-outline" size={20} color="#D93030" />
              <ThemedText
                type="smallBold"
                style={styles.sectionTitleBorrador}
                themeColor="text"
              >
                Borrador incompleto detectado
              </ThemedText>
            </View>
            <ThemedText
              type="small"
              style={styles.mensajeResultado}
              themeColor="textSecondary"
            >
              Hay un registro sin terminar para el medidor{" "}
              {borradorPendiente.codigo_medidor} ({borradorPendiente.mes}/
              {borradorPendiente.anio}). Estado:{" "}
              {borradorPendiente.estado_medidor}.
            </ThemedText>
            <View style={styles.borradorActions}>
              <Pressable
                style={styles.button}
                onPress={handleContinuarBorrador}
              >
                <ThemedText
                  type="smallBold"
                  style={styles.buttonText}
                  themeColor="text"
                >
                  Continuar registro
                </ThemedText>
              </Pressable>
              <Pressable
                style={styles.buttonSecundario}
                onPress={handleDescartarBorrador}
              >
                <ThemedText
                  type="smallBold"
                  style={styles.buttonTextoSecundario}
                  themeColor="primarySecondary"
                >
                  Descartar borrador
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        ) : null}

        <View style={styles.consultaSection}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="search-outline" size={20} color="#035AA6" />
            <ThemedText
              type="smallBold"
              style={styles.sectionTitle}
              themeColor="primaryDark"
            >
              Consulta de medidor
            </ThemedText>
          </View>

          <ThemedText
            type="smallBold"
            style={styles.label}
            themeColor="primaryDark"
          >
            Código del medidor
          </ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons
              name="barcode-outline"
              size={20}
              color="#035AA6"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={codigo}
              onChangeText={setCodigo}
              placeholder="MED-000001"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              editable={!consultando}
            />
          </View>

          {error && (
            <ThemedView style={styles.errorBanner}>
              <ThemedText
                type="small"
                style={styles.errorText}
                themeColor="text"
              >
                {error}
              </ThemedText>
            </ThemedView>
          )}

          <Pressable
            style={[styles.button, consultando && styles.buttonDisabled]}
            disabled={consultando}
            onPress={handleConsultar}
          >
            <ThemedText
              type="smallBold"
              style={styles.buttonText}
              themeColor="text"
            >
              {consultando ? "Consultando..." : "Consultar medidor"}
            </ThemedText>
          </Pressable>

          {consultando && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.light.primary} />
            </View>
          )}

          <ThemedText
            type="small"
            style={styles.chip}
            themeColor="textSecondary"
          >
            {chipTexto()}
          </ThemedText>

          {renderResultado()}
        </View>

        <View style={styles.divisor} />

        <View style={styles.borradoresSection}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="document-text-outline" size={20} color="#035AA6" />
            <ThemedText
              type="smallBold"
              style={styles.sectionTitle}
              themeColor="primaryDark"
            >
              Borradores y registros
            </ThemedText>
          </View>
          <Pressable
            style={styles.buttonSecundario}
            onPress={() => router.push("/borradores")}
          >
            <ThemedText
              type="smallBold"
              style={styles.buttonTextoSecundario}
              themeColor="primarySecondary"
            >
              Consultar borradores pendientes
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  contentContainer: {
    paddingBottom: Spacing.six,
  },
  header: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.five,
    backgroundColor: "#035AA6",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F2F2F2",
    letterSpacing: 2,
    marginTop: 2,
  },
  logoutIconButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 12,
  },
  statusRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.three,
  },
  statusRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  statusText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
  },
  syncButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 8,
  },
  syncButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  cardContainer: {
    marginHorizontal: Spacing.four,
    marginTop: -Spacing.three,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: Spacing.four,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  userCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: Spacing.four,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
  },
  empleadoCode: {
    fontSize: 13,
    color: "#035AA6",
    fontWeight: "700",
    marginTop: 2,
  },
  consultaSection: {
    marginTop: Spacing.two,
  },
  borradoresSection: {
    marginTop: Spacing.two,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    justifyContent: "center",
  },
  sectionTitleBorrador: {
    fontSize: 15,
    fontWeight: "700",
    color: "#D93030",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: Spacing.half,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    paddingVertical: 0,
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#D93030",
    borderRadius: 10,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
  errorText: {
    color: "#D93030",
    fontSize: 13,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#035AA6",
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.three,
    minHeight: 52,
    justifyContent: "center",
    shadowColor: "#035AA6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#9CC3E6",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonSecundario: {
    borderWidth: 1.5,
    borderColor: "#035AA6",
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.two,
    minHeight: 52,
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  buttonTextoSecundario: {
    color: "#035AA6",
    fontSize: 15,
    fontWeight: "700",
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: Spacing.two,
  },
  chip: {
    marginTop: Spacing.two,
    fontSize: 12,
    fontStyle: "italic",
  },
  cardResultado: {
    padding: Spacing.four,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    marginTop: Spacing.three,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardAlmacenado: {
    borderColor: "#D97706",
  },
  cardError: {
    borderColor: "#D93030",
  },
  cardDatos: {
    borderColor: "#035AA6",
  },
  badgeOnline: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#E0F2FE",
    marginBottom: Spacing.two,
  },
  badgeAlmacenado: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FEF3C7",
    marginBottom: Spacing.two,
  },
  textoBadge: {
    fontSize: 11,
    textTransform: "uppercase",
    color: "#035AA6",
  },
  tituloResultado: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Spacing.half,
  },
  mensajeResultado: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.three,
  },
  divisor: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: Spacing.five,
  },
  datos: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F1F5F9",
  },
  etiqueta: {
    color: "#64748B",
    flex: 1,
    paddingRight: Spacing.two,
    fontSize: 13,
  },
  valor: {
    fontSize: 13,
    color: "#0F172A",
    flexShrink: 1,
    textAlign: "right",
    fontWeight: "600",
  },
  cardBorradorContainer: {
    borderColor: "#D93030",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  borradorHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginBottom: Spacing.one,
  },
  borradorActions: {
    gap: Spacing.one,
  },
});


================================================
ðŸ“„ ARCHIVO: src\app\lectura.tsx
================================================

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
let ImagePicker: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ImagePicker = require('expo-image-picker');
} catch {
  ImagePicker = null;
}
let FileSystem: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  FileSystem = require('expo-file-system');
} catch {
  FileSystem = null;
}

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import {
  crearLecturaBorrador,
  actualizarLecturaCompleta,
  obtenerMedidorPorCodigo,
  obtenerLecturaPorId,
  obtenerLecturaPorCodigoYMes,
  inicializarBaseDeDatos,
  guardarFotoLectura,
  marcarLecturaComoPendiente,
  type Lectura,
} from '@/database/repository';
import { hayConexion } from '@/services/medidor.service';
import { useConnectionStatus } from '@/hooks/use-connection';
import { sincronizarPendientes } from '@/services/sync.service';

type EstadoMedidor = 'normal' | 'inaccesible' | 'dano';

function generarUUID(): Promise<string> {
  return Crypto.getRandomBytesAsync(16).then((bytes) => {
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      '4' + hex.slice(13, 16),
      '89ab'[Math.floor(Math.random() * 4)] + hex.slice(17, 20),
      hex.slice(20, 32),
    ].join('-');
  });
}

export default function LecturaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const codigo = typeof params.codigo === 'string' ? params.codigo : undefined;
  const { isConnected, pendingCount, actualizarContador } = useConnectionStatus();

  const [estado, setEstado] = useState<EstadoMedidor>('normal');
  const [lecturaActual, setLecturaActual] = useState('');
  const [motivoInaccesibilidad, setMotivoInaccesibilidad] = useState('');
  const [descripcionDano, setDescripcionDano] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [idLocal, setIdLocal] = useState<string | null>(null);
  const [esBorradorExistente, setEsBorradorExistente] = useState(false);
  const [formularioModificado, setFormularioModificado] = useState(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [confirmacionRevisada, setConfirmacionRevisada] = useState(false);
  const [consumoMensual, setConsumoMensual] = useState<number | null>(null);
  const [esAnomalia, setEsAnomalia] = useState(false);
  const [umbralAnomalia, setUmbralAnomalia] = useState<number | null>(null);
  const [lecturaMenorAnterior, setLecturaMenorAnterior] = useState(false);
  const [datosInsuficientes, setDatosInsuficientes] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const ahora = new Date();
  const mes = ahora.getMonth() + 1;
  const anio = ahora.getFullYear();

  const borradorId = typeof params.borradorId === 'string' ? params.borradorId : undefined;

  const medidor = codigo ? obtenerMedidorPorCodigo(codigo) : null;

  const esNormal = estado === 'normal';
  const esInaccesible = estado === 'inaccesible';
  const esDano = estado === 'dano';

  const construirCampos = useCallback((): {
    lectura_actual?: number;
    estado_medidor: string;
    motivo_inaccesibilidad?: string;
    descripcion_dano?: string;
    confirmacion_revision?: number;
  } => {
    const campos: {
      lectura_actual?: number;
      estado_medidor: string;
      motivo_inaccesibilidad?: string;
      descripcion_dano?: string;
      confirmacion_revision?: number;
    } = {
      estado_medidor: estado,
      confirmacion_revision: confirmacionRevisada ? 1 : 0,
    };

    if (esNormal && lecturaActual.trim() !== '') {
      const num = parseFloat(lecturaActual);
      if (!isNaN(num)) campos.lectura_actual = num;
    }

    if (esInaccesible && motivoInaccesibilidad.trim() !== '') {
      campos.motivo_inaccesibilidad = motivoInaccesibilidad.trim();
    }

    if (esDano) {
      if (descripcionDano.trim() !== '') {
        campos.descripcion_dano = descripcionDano.trim();
      }
      if (lecturaActual.trim() !== '') {
        const num = parseFloat(lecturaActual);
        if (!isNaN(num)) campos.lectura_actual = num;
      }
    }

    return campos;
  }, [estado, lecturaActual, motivoInaccesibilidad, descripcionDano, esNormal, esInaccesible, esDano, confirmacionRevisada]);

  useEffect(() => {
    let montado = true;

    async function inicializar() {
      if (!codigo) return;
      inicializarBaseDeDatos();

      if (borradorId) {
        const existente = obtenerLecturaPorId(borradorId);
        if (!existente) {
          setError('El borrador ya no existe.');
          return;
        }
        if (existente.estado_sincronizacion !== 'borrador') {
          setError('No se puede modificar una lectura ya enviada.');
          return;
        }
        setIdLocal(existente.id_local);
        setEstado(existente.estado_medidor as EstadoMedidor);
        setLecturaActual(String(existente.lectura_actual ?? ''));
        setMotivoInaccesibilidad(existente.motivo_inaccesibilidad ?? '');
        setDescripcionDano(existente.descripcion_dano ?? '');
        setConfirmacionRevisada(existente.confirmacion_revision === 1);
        setFotoUri(existente.uri_fotografia ?? null);
        setEsBorradorExistente(true);
        return;
      }

      const existente = obtenerLecturaPorCodigoYMes(codigo, mes, anio);
      if (existente && existente.estado_sincronizacion === 'borrador') {
        setIdLocal(existente.id_local);
        setEstado(existente.estado_medidor as EstadoMedidor);
        setLecturaActual(String(existente.lectura_actual ?? ''));
        setMotivoInaccesibilidad(existente.motivo_inaccesibilidad ?? '');
        setDescripcionDano(existente.descripcion_dano ?? '');
        setConfirmacionRevisada(existente.confirmacion_revision === 1);
        setFotoUri(existente.uri_fotografia ?? null);
        setEsBorradorExistente(true);
      } else if (!existente) {
        try {
          const id = await generarUUID();
          if (!montado) return;
          const resultado = crearLecturaBorrador(codigo, mes, anio, id);
          if (resultado.ok) {
            setIdLocal(resultado.lectura.id_local);
            setEsBorradorExistente(true);
          } else {
            setError(resultado.error);
          }
        } catch {
          setError('No se pudo inicializar el borrador.');
        }
      }
    }

    inicializar();
    return () => {
      montado = false;
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [codigo, borradorId, mes, anio]);

  useEffect(() => {
    if (!idLocal || !formularioModificado) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      try {
        const campos = construirCampos();
        actualizarLecturaCompleta(idLocal, campos);
      } catch {
        // Auto-guardado silencioso
      }
      setFormularioModificado(false);
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [
    idLocal,
    formularioModificado,
    construirCampos,
  ]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setConsumoMensual(null);
      setEsAnomalia(false);
      setUmbralAnomalia(null);
      setLecturaMenorAnterior(false);
      setDatosInsuficientes(false);

      if (!medidor) return;

      const ultimaLectura = medidor.ultima_lectura;
      const promedioMensual = medidor.consumo_promedio_mensual;
      const lecturaNum = parseFloat(lecturaActual);
      const lecturaValida = !isNaN(lecturaNum) && lecturaActual.trim() !== '' && lecturaNum >= 0;
      const esNormalOConLectura = esNormal || (esDano && lecturaValida);

      if (!esNormalOConLectura || !lecturaValida) {
        return;
      }

      if (ultimaLectura == null || !Number.isFinite(ultimaLectura)) {
        setDatosInsuficientes(true);
        return;
      }

      if (lecturaNum < ultimaLectura) {
        setLecturaMenorAnterior(true);
        return;
      }

      setLecturaMenorAnterior(false);

      const consumo = lecturaNum - ultimaLectura;
      setConsumoMensual(consumo);

      if (promedioMensual == null || !Number.isFinite(promedioMensual)) {
        setDatosInsuficientes(true);
        return;
      }

      const umbral = 3 * promedioMensual;
      setUmbralAnomalia(umbral);

      if (consumo > umbral) {
        setEsAnomalia(true);
      }
    });
  }, [medidor, estado, lecturaActual, esNormal, esDano, esInaccesible]);

  const fotoObligatoria = esDano || esAnomalia;

  const solicitarPermisoCamara = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso de cámara requerido',
        'Para cumplir con el requerimiento, la aplicación necesita acceso a la cámara para tomar la foto del medidor cuando es obligatoria.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir configuración', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
    return true;
  };

  const tomarFoto = async () => {
    if (!idLocal) {
      setError('Guarda el borrador primero antes de tomar la foto.');
      return;
    }
    setError(null);
    const tienePermiso = await solicitarPermisoCamara();
    if (!tienePermiso) {
      if (fotoObligatoria) {
        setError('No es posible continuar sin foto cuando el consumo es anómalo o el medidor está dañado.');
      }
      return;
    }
    setSubiendoFoto(true);
    try {
      const ImagePickerMod: any = ImagePicker;
      const result = await ImagePickerMod.launchCameraAsync?.({
        mediaTypes: ImagePickerMod.MediaTypeOptions?.Images || ['images'],
        allowsEditing: false,
        quality: 0.7,
        exif: false,
      });
      if (!result || result.canceled || !result.assets || result.assets.length === 0) {
        setSubiendoFoto(false);
        return;
      }
      const asset = result.assets[0];
      const uri = asset.uri;
      let finalUri = uri;
      try {
        const FS: any = FileSystem;
        if (FS) {
          const baseDir = FS.documentDirectory || FS.cacheDirectory;
          if (baseDir) {
            const destDir = baseDir.endsWith('/') ? baseDir + 'fotos_medidores/' : baseDir + '/fotos_medidores/';
            if (FS.makeDirectoryAsync) {
              await FS.makeDirectoryAsync(destDir, { intermediates: true });
            }
            const fileName = `medidor_${codigo || 'x'}_${Date.now()}_${idLocal}.jpg`;
            const destUri = destDir + fileName;
            if (FS.copyAsync) {
              await FS.copyAsync({ from: uri, to: destUri });
              finalUri = destUri;
            } else if (FS.moveAsync) {
              await FS.moveAsync({ from: uri, to: destUri });
              finalUri = destUri;
            }
          }
        }
      } catch {
        finalUri = uri;
      }
      setFotoUri(finalUri);
      const guardado = guardarFotoLectura(idLocal, finalUri);
      if (!guardado.ok) {
        setError(guardado.error);
      } else {
        setFormularioModificado(true);
      }
    } catch (e: any) {
      setError(e?.message || 'No se pudo tomar o guardar la foto.');
    } finally {
      setSubiendoFoto(false);
    }
  };

  const filaDato = (etiqueta: string, valor: string | number | null | undefined) => (
    <View style={styles.fila} key={etiqueta}>
      <ThemedText type="smallBold" style={styles.etiqueta} themeColor="textSecondary">
        {etiqueta}
      </ThemedText>
      <ThemedText type="code" style={styles.valor} themeColor="text">
        {valor == null || valor === '' ? '—' : String(valor)}
      </ThemedText>
    </View>
  );

  const handleSeleccionarEstado = (valor: EstadoMedidor) => {
    setEstado(valor);
    setError(null);
    setFormularioModificado(true);
    if (valor === 'inaccesible') {
      setLecturaActual('');
    } else if (valor === 'normal') {
      setMotivoInaccesibilidad('');
      setDescripcionDano('');
    } else if (valor === 'dano') {
      setMotivoInaccesibilidad('');
    }
  };

  const handleGuardar = async () => {
    setError(null);
    setExito(null);

    if (!codigo) {
      setError('No se especificó el código del medidor.');
      return;
    }

    if (!medidor) {
      setError('No se encontró la información del medidor.');
      return;
    }

    if (esNormal) {
      const lecturaNum = parseFloat(lecturaActual);
      if (lecturaActual.trim() === '' || isNaN(lecturaNum) || lecturaNum < 0) {
        setError('Para estado normal, ingrese una lectura actual válida.');
        return;
      }
      const ultimaLectura = medidor.ultima_lectura;
      if (ultimaLectura != null && Number.isFinite(ultimaLectura) && lecturaNum < ultimaLectura) {
        setError('La lectura actual no puede ser inferior a la última lectura registrada.');
        return;
      }
    }

    if (esInaccesible && !motivoInaccesibilidad.trim()) {
      setError('Para estado inaccesible, debe indicar el motivo de inaccesibilidad.');
      return;
    }

    if (esDano && !descripcionDano.trim()) {
      setError('Para estado dañado, debe indicar la descripción del daño.');
      return;
    }

    if (esDano && lecturaActual.trim() !== '') {
      const lecturaNum = parseFloat(lecturaActual);
      if (isNaN(lecturaNum) || lecturaNum < 0) {
        setError('La lectura ingresada debe ser un número válido no negativo.');
        return;
      }
      const ultimaLectura = medidor.ultima_lectura;
      if (ultimaLectura != null && Number.isFinite(ultimaLectura) && lecturaNum < ultimaLectura) {
        setError('La lectura actual no puede ser inferior a la última lectura registrada.');
        return;
      }
    }

    if (esAnomalia && !confirmacionRevisada) {
      setError('Se detectó consumo anómalo. Confirme que ha revisado el medidor antes de guardar.');
      return;
    }

    if ((esDano || esAnomalia) && !fotoUri) {
      setError('La foto del medidor es obligatoria cuando el medidor está dañado o cuando hay consumo anómalo.');
      return;
    }

    setGuardando(true);
    try {
      inicializarBaseDeDatos();
      let idLocalParaGuardar = idLocal;

      if (!idLocalParaGuardar) {
        const id = await generarUUID();
        const borrador = crearLecturaBorrador(medidor.codigo, mes, anio, id);

        if (!borrador.ok) {
          setError(borrador.error);
          setGuardando(false);
          return;
        }

        idLocalParaGuardar = borrador.lectura.id_local;
        setIdLocal(idLocalParaGuardar);
        setEsBorradorExistente(true);
      }

      const campos = construirCampos();
      const actualizada = actualizarLecturaCompleta(idLocalParaGuardar, campos);

      if (!actualizada.ok) {
        setError(actualizada.error);
        setGuardando(false);
        return;
      }

      if (fotoUri) {
        guardarFotoLectura(idLocalParaGuardar, fotoUri);
      }

      try {
        const conectado = await hayConexion();
        marcarLecturaComoPendiente(idLocalParaGuardar);
        if (conectado) {
          setExito('Lectura guardada y marcada como pendiente de verificar (con conexión).');
        } else {
          setExito('Lectura guardada sin conexión. Marcada como pendiente de verificar.');
        }
      } catch {
        marcarLecturaComoPendiente(idLocalParaGuardar);
        setExito('Lectura guardada como pendiente de verificar.');
      }
      actualizarContador();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error inesperado al guardar la lectura.';
      setError(`Error al guardar: ${mensaje}`);
    } finally {
      setGuardando(false);
    }
  };

  const handleVolver = () => {
    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.scrollView}
      keyboardShouldPersistTaps="handled">
      
      {/* Cabecera institucional moderna */}
      <View style={styles.header}>
        <View>
          <ThemedText type="title" style={styles.headerTitle} themeColor="text">
            EPMAPS
          </ThemedText>
          <ThemedText type="smallBold" style={styles.headerSubtitle} themeColor="textSecondary">
            Registro de lectura de medidor
          </ThemedText>
        </View>
        <View style={styles.statusRowContainer}>
          <View style={styles.statusRow}>
            <ThemedText type="small" style={styles.statusText} themeColor="text">
              {isConnected === false ? '● Sin conexión' : '● Conectado'}
            </ThemedText>
            {pendingCount > 0 && (
              <ThemedText type="small" style={styles.statusText} themeColor="text">
                | Pendientes: {pendingCount}
              </ThemedText>
            )}
          </View>
          {isConnected !== false && pendingCount > 0 && (
            <Pressable
              style={styles.syncButton}
              onPress={() => {
                sincronizarPendientes()
                  .then(() => actualizarContador())
                  .catch(() => actualizarContador());
              }}>
              <ThemedText type="smallBold" style={styles.syncButtonText} themeColor="text">
                Sincronizar ahora
              </ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.cardContainer}>
        {/* Tarjeta Detalle del Medidor */}
        <View style={styles.subCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="information-circle-outline" size={20} color="#035AA6" />
            <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
              Detalle del medidor
            </ThemedText>
          </View>
          {medidor && (
            <View style={styles.datos}>
              {filaDato('Código', medidor.codigo)}
              {filaDato('Dirección', medidor.direccion)}
              {filaDato('Sector', medidor.sector)}
              {filaDato('Número de cuenta', medidor.numero_cuenta)}
              {filaDato('Estado', medidor.estado)}
            </View>
          )}
          {!medidor && codigo && (
            <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
              No hay información detallada del código {codigo} en caché local.
            </ThemedText>
          )}
        </View>

        {esBorradorExistente && idLocal && (
          <View style={[styles.subCard, styles.cardBorradorExistente]}>
            <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
              Borrador recuperado
            </ThemedText>
            <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
              Se cargaron los valores guardados previamente para este medidor. Puede modificarlos y guardar los cambios.
            </ThemedText>
          </View>
        )}
      
        {/* Tarjeta Datos de Lectura */}
        <View style={styles.subCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="create-outline" size={20} color="#035AA6" />
            <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
              Datos de la lectura
            </ThemedText>
          </View>

          <ThemedText type="smallBold" style={styles.label} themeColor="primaryDark">
            Estado del medidor
          </ThemedText>
          <View style={styles.estadoRow}>
            <Pressable
              style={[styles.estadoBoton, estado === 'normal' && styles.estadoBotonActivo]}
              onPress={() => handleSeleccionarEstado('normal')}>
              <ThemedText type="smallBold" style={[styles.estadoTexto, estado === 'normal' && styles.estadoTextoActivo]}>
                Normal
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.estadoBoton, estado === 'inaccesible' && styles.estadoBotonActivo]}
              onPress={() => handleSeleccionarEstado('inaccesible')}>
              <ThemedText type="smallBold" style={[styles.estadoTexto, estado === 'inaccesible' && styles.estadoTextoActivo]}>
                Inaccesible
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.estadoBoton, estado === 'dano' && styles.estadoBotonActivo]}
              onPress={() => handleSeleccionarEstado('dano')}>
              <ThemedText type="smallBold" style={[styles.estadoTexto, estado === 'dano' && styles.estadoTextoActivo]}>
                Dañado
              </ThemedText>
            </Pressable>
          </View>

          {esNormal && (
            <>
              <ThemedText type="smallBold" style={[styles.label, styles.mt]} themeColor="primaryDark">
                Lectura actual
              </ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons name="speedometer-outline" size={20} color="#035AA6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={lecturaActual}
                  onChangeText={(valor) => {
                    setLecturaActual(valor);
                    setFormularioModificado(true);
                  }}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  autoComplete="off"
                  spellCheck={false}
                />
              </View>
              {esNormal && lecturaActual.trim() === '' && (
                <ThemedText type="small" style={styles.campoRequerido} themeColor="error">
                  Campo obligatorio para estado normal.
                </ThemedText>
              )}
            </>
          )}

          {esInaccesible && (
            <>
              <ThemedText type="smallBold" style={[styles.label, styles.mt]} themeColor="primaryDark">
                Motivo de inaccesibilidad
              </ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={motivoInaccesibilidad}
                  onChangeText={(valor) => {
                    setMotivoInaccesibilidad(valor);
                    setFormularioModificado(true);
                  }}
                  placeholder="Ej. cerradura bloqueada, acceso denegado"
                  placeholderTextColor="#999"
                  autoComplete="off"
                  spellCheck={false}
                />
              </View>
              {!motivoInaccesibilidad.trim() && (
                <ThemedText type="small" style={styles.campoRequerido} themeColor="error">
                  Campo obligatorio para estado inaccesible.
                </ThemedText>
              )}
            </>
          )}

          {esDano && (
            <>
              <ThemedText type="smallBold" style={[styles.label, styles.mt]} themeColor="primaryDark">
                Descripción del daño
              </ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={descripcionDano}
                  onChangeText={(valor) => {
                    setDescripcionDano(valor);
                    setFormularioModificado(true);
                  }}
                  placeholder="Ej. medidor roto, fuga en la conexión"
                  placeholderTextColor="#999"
                  autoComplete="off"
                  spellCheck={false}
                />
              </View>
              {!descripcionDano.trim() && (
                <ThemedText type="small" style={styles.campoRequerido} themeColor="error">
                  Campo obligatorio para estado dañado.
                </ThemedText>
              )}
              <ThemedText type="smallBold" style={[styles.label, styles.mt]} themeColor="primaryDark">
                Lectura actual (opcional)
              </ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={lecturaActual}
                  onChangeText={(valor) => {
                    setLecturaActual(valor);
                    setFormularioModificado(true);
                  }}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  autoComplete="off"
                  spellCheck={false}
                />
              </View>
            </>
          )}

          {!esInaccesible && (
            <>
              {(consumoMensual !== null || lecturaMenorAnterior || datosInsuficientes) && (
                <View style={[styles.subCard, styles.cardConsumo]}>
                  <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="text">
                    Consumo mensual
                  </ThemedText>
                  {lecturaMenorAnterior && (
                    <View style={styles.warningBanner}>
                      <ThemedText type="small" style={styles.warningText} themeColor="text">
                        La lectura actual es menor que la última lectura registrada. Verifique el valor ingresado.
                      </ThemedText>
                    </View>
                  )}
                  {datosInsuficientes && (
                    <View style={styles.warningBanner}>
                      <ThemedText type="small" style={styles.warningText} themeColor="text">
                        No se puede determinar el consumo con certeza: faltan datos de referencia.
                      </ThemedText>
                    </View>
                  )}
                  {consumoMensual !== null && !lecturaMenorAnterior && !datosInsuficientes && (
                    <>
                      <ThemedText type="small" style={styles.consumoTexto} themeColor="text">
                        Consumo mensual: {consumoMensual.toFixed(2)} M³
                      </ThemedText>
                      {esAnomalia && (
                        <View style={styles.alertBanner}>
                          <ThemedText type="smallBold" style={styles.alertTitle} themeColor="error">
                            ⚠ Consumo anómalo detectado
                          </ThemedText>
                          <ThemedText type="small" style={styles.alertDetail} themeColor="text">
                            Consumo: {consumoMensual.toFixed(2)} | Promedio: {medidor?.consumo_promedio_mensual?.toFixed(2) ?? '—'}
                          </ThemedText>
                          <Pressable style={styles.confirmRow} onPress={() => setConfirmacionRevisada(!confirmacionRevisada)}>
                            <ThemedText type="small" style={styles.confirmTexto} themeColor="text">
                              {confirmacionRevisada ? '✔ ' : '☐ '}He revisado el medidor y confirmo la lectura.
                            </ThemedText>
                          </Pressable>
                          {!confirmacionRevisada && (
                            <ThemedText type="small" style={styles.alertRequired} themeColor="error">
                              Debe confirmar la revisión antes de guardar.
                            </ThemedText>
                          )}
                        </View>
                      )}
                    </>
                  )}
                </View>
              )}
            </>
          )}
        </View>

        {/* Tarjeta Foto del Medidor */}
        <View style={styles.subCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="camera-outline" size={20} color="#035AA6" />
            <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
              Foto del medidor
            </ThemedText>
          </View>
          <ThemedText type="small" style={styles.mensajeResultado} themeColor="textSecondary">
            {fotoObligatoria
              ? 'Obligatoria (medidor dañado o consumo anómalo).'
              : 'Opcional en este caso.'}
          </ThemedText>
          {fotoUri ? (
            <View style={styles.fotoContainer}>
              <Image source={{ uri: fotoUri }} style={styles.fotoPreview} resizeMode="cover" />
              <Pressable style={styles.buttonSecundario} onPress={tomarFoto} disabled={subiendoFoto}>
                <ThemedText type="smallBold" style={styles.buttonTextoSecundario} themeColor="primarySecondary">
                  {subiendoFoto ? 'Guardando...' : 'Tomar otra foto'}
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            <Pressable style={[styles.button, subiendoFoto && styles.buttonDisabled]} disabled={subiendoFoto} onPress={tomarFoto}>
              <ThemedText type="smallBold" style={styles.buttonText} themeColor="text">
                {subiendoFoto ? 'Abriendo cámara...' : 'Tomar foto del medidor'}
              </ThemedText>
            </Pressable>
          )}
          {fotoObligatoria && !fotoUri && (
            <ThemedText type="small" style={styles.campoRequerido} themeColor="error">
              Se requiere foto para guardar esta lectura.
            </ThemedText>
          )}
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <ThemedText type="small" style={styles.errorText} themeColor="text">
              {error}
            </ThemedText>
          </View>
        )}

        {exito && (
          <View style={styles.exitoBanner}>
            <ThemedText type="small" style={styles.exitoText} themeColor="text">
              {exito}
            </ThemedText>
          </View>
        )}

        <Pressable
          style={[styles.button, guardando && styles.buttonDisabled]}
          disabled={guardando}
          onPress={handleGuardar}>
          <ThemedText type="smallBold" style={styles.buttonText} themeColor="text">
            {guardando ? 'Guardando...' : 'Guardar lectura'}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.buttonSecundario} onPress={handleVolver}>
          <ThemedText type="smallBold" style={styles.buttonTextoSecundario} themeColor="primarySecondary">
            Volver a la consulta
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  contentContainer: {
    paddingBottom: Spacing.six,
  },
  header: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.five,
    backgroundColor: '#035AA6',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F2F2F2',
    letterSpacing: 2,
    marginTop: 2,
  },
  statusRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  syncButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 8,
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardContainer: {
    marginHorizontal: Spacing.four,
    marginTop: -Spacing.three,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    gap: Spacing.four,
  },
  subCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  etiqueta: {
    color: '#64748B',
    flex: 1,
    paddingRight: Spacing.two,
    fontSize: 13,
  },
  valor: {
    fontSize: 13,
    color: '#0F172A',
    flexShrink: 1,
    textAlign: 'right',
    fontWeight: '600',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: Spacing.half,
  },
  mt: {
    marginTop: Spacing.three,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 0,
  },
  campoRequerido: {
    marginTop: Spacing.half,
    fontSize: 12,
    fontWeight: '600',
  },
  estadoRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  estadoBoton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  estadoBotonActivo: {
    backgroundColor: '#035AA6',
    borderColor: '#035AA6',
  },
  estadoTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  estadoTextoActivo: {
    color: '#FFFFFF',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#D93030',
    borderRadius: 12,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  errorText: {
    color: '#D93030',
    fontSize: 13,
    fontWeight: '600',
  },
  exitoBanner: {
    backgroundColor: '#E7F4EA',
    borderWidth: 1,
    borderColor: '#2E8B57',
    borderRadius: 12,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  exitoText: {
    color: '#1E6B43',
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#035AA6',
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    shadowColor: '#035AA6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#9CC3E6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonSecundario: {
    borderWidth: 1.5,
    borderColor: '#035AA6',
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonTextoSecundario: {
    color: '#035AA6',
    fontSize: 15,
    fontWeight: '700',
  },
  mensajeResultado: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardBorradorExistente: {
    borderColor: '#D97706',
    backgroundColor: '#FEF3C7',
  },
  cardConsumo: {
    borderColor: '#035AA6',
    backgroundColor: '#E0F2FE',
    marginTop: Spacing.three,
  },
  fotoContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  fotoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  warningBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#D97706',
    borderRadius: 10,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
  warningText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  consumoTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: '#035AA6',
    marginBottom: Spacing.two,
  },
  alertBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#D93030',
    borderRadius: 10,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
  alertTitle: {
    color: '#D93030',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
  alertDetail: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: Spacing.two,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  confirmTexto: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  alertRequired: {
    color: '#D93030',
    fontSize: 12,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
  datos: {
    gap: Spacing.one,
  },
});

================================================
ðŸ“„ ARCHIVO: src\app\login.tsx
================================================

import React from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/services/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();
  const [employeeCode, setEmployeeCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setError(null);

    if (!employeeCode.trim()) {
      setError('Ingrese su código de empleado.');
      return;
    }

    if (!password.trim()) {
      setError('Ingrese su contraseña.');
      return;
    }

    setLoading(true);

    try {
      await login(employeeCode.trim(), password);
      router.replace('/');
    } catch {
      setError('Código de empleado o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.scrollView}
      keyboardShouldPersistTaps="handled">
      
      {/* Cabecera institucional */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerCompanyTitle} themeColor="text">
          EPMAPS
        </ThemedText>
        <ThemedText type="smallBold" style={styles.headerCompanySubtitle} themeColor="textSecondary">
          AGUA DE QUITO
        </ThemedText>
      </View>
      {/* Logo y Nombre de la App */}
        <View style={styles.appBrandContainer}>
          <Image 
            source={require('@/assets/images/icono_app_aquauio.png')} 
            style={styles.appIcon}
            resizeMode="contain"
          />
          <ThemedText type="title" style={styles.appName} themeColor="primaryDark">
            AquaUIO
          </ThemedText>
          <ThemedText type="small" style={styles.appSubDescription} themeColor="textSecondary">
            Sistema Móvil de Registro de Lecturas
          </ThemedText>
        </View>

      {/* Contenedor principal estilo Tarjeta */}
      <View style={styles.cardContainer}>
        

        <View style={styles.formGroup}>
          <ThemedText type="smallBold" style={styles.label} themeColor="primaryDark">
            Código de empleado
          </ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#035AA6" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={employeeCode}
              onChangeText={setEmployeeCode}
              placeholder="EMP-001"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="smallBold" style={styles.label} themeColor="primaryDark">
            Contraseña
          </ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#035AA6" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#999"
              secureTextEntry
              autoComplete="off"
              spellCheck={false}
            />
          </View>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <ThemedText type="small" style={styles.errorText}>
              {error}
            </ThemedText>
          </View>
        )}

        <Pressable
          style={[styles.button, (loading || authLoading) && styles.buttonDisabled]}
          disabled={loading || authLoading}
          onPress={handleLogin}>
          <ThemedText type="smallBold" style={styles.buttonText}>
            {loading || authLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </ThemedText>
        </Pressable>

        <ThemedText type="small" style={styles.demoHint} themeColor="textSecondary">
          Credenciales de demostración:{' '}
          <ThemedText type="code" style={styles.demoCode} themeColor="textSecondary">
            EMP-001 / clave123
          </ThemedText>
        </ThemedText>
      </View>
      <ThemedText type="code" style={styles.demoHint} themeColor="textSecondary">
        © 2026 EPMAPS - Distrito Metropolitano de Quito
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  container: {
    flexGrow: 1,
    paddingBottom: Spacing.six,
  },
  header: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    backgroundColor: '#035AA6',
  },
  headerCompanyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerCompanySubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F2F2F2',
    letterSpacing: 2,
    marginTop: 2,
  },
  cardContainer: {
    marginHorizontal: Spacing.four,
    marginTop: -Spacing.three,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.five,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  appBrandContainer: {
    alignItems: 'center',
    marginBottom: Spacing.five,
  },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: Spacing.two,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#035AA6',
  },
  appSubDescription: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  formGroup: {
    marginBottom: Spacing.four,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: Spacing.half,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 0,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#D93030',
    borderRadius: 10,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.four,
  },
  errorText: {
    color: '#D93030',
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#035AA6',
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.one,
    minHeight: 52,
    justifyContent: 'center',
    shadowColor: '#035AA6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#9CC3E6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  demoHint: {
    marginTop: Spacing.four,
    textAlign: 'center',
    fontSize: 13,
  },
  demoCode: {
    fontWeight: '700',
  },
});

================================================
ðŸ“„ ARCHIVO: src\app\_layout.tsx
================================================

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import LoginScreen from './login';
import { AuthProvider, useAuth } from '@/services/auth-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootContent />
    </AuthProvider>
  );
}

function RootContent() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
      </ThemeProvider>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {/* Agregamos screenOptions={{ headerShown: false }} aquí */}
      <Stack screenOptions={{ headerShown: false }}>
        <AppTabs />
      </Stack>
    </ThemeProvider>
  );
}

================================================
ðŸ“„ ARCHIVO: src\components\animated-icon.tsx
================================================

import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const INITIAL_SCALE_FACTOR = Dimensions.get('screen').height / 90;
const DURATION = 600;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
    20: {
      opacity: 1,
    },
    70: {
      opacity: 0,
      easing: Easing.elastic(0.7),
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1 }],
      easing: Easing.elastic(0.7),
    },
  });

  const image = <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />;

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.splashOverlay}>
      {image}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={styles.splashOverlay}>
      {image}
    </View>
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: Easing.elastic(0.7),
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '0deg' }],
  },
  100: {
    transform: [{ rotateZ: '7200deg' }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <Animated.View entering={keyframe.duration(DURATION)} style={styles.background} />
      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
    zIndex: 100,
  },
  image: {
    width: 76,
    height: 71,
  },
  background: {
    borderRadius: 40,
    experimental_backgroundImage: `linear-gradient(180deg, #3C9FFE, #0274DF)`,
    width: 128,
    height: 128,
    position: 'absolute',
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\animated-icon.web.tsx
================================================

import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, { Keyframe, Easing } from 'react-native-reanimated';

import classes from './animated-icon.module.css';
const DURATION = 300;

export function AnimatedSplashOverlay() {
  return null;
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: 0 }],
  },
  60: {
    transform: [{ scale: 1.2 }],
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(1.2),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    opacity: 0,
  },
  60: {
    transform: [{ scale: 1.2 }],
    opacity: 0,
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(1.2),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '-180deg' }, { scale: 0.8 }],
    opacity: 0,
  },
  [DURATION / 1000]: {
    transform: [{ rotateZ: '0deg' }, { scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(0.7),
  },
  100: {
    transform: [{ rotateZ: '7200deg' }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <Animated.View style={styles.background} entering={keyframe.duration(DURATION)}>
        <div className={classes.expoLogoBackground} />
      </Animated.View>

      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    zIndex: 1000,
    position: 'absolute',
    top: 128 / 2 + 138,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
  },
  image: {
    position: 'absolute',
    width: 76,
    height: 71,
  },
  background: {
    width: 128,
    height: 128,
    position: 'absolute',
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\app-tabs.tsx
================================================

import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}


================================================
ðŸ“„ ARCHIVO: src\components\app-tabs.web.tsx
================================================

import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          Expo Starter
        </ThemedText>

        {props.children}

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">Docs</ThemedText>
            <SymbolView
              tintColor={colors.text}
              name={{ ios: 'arrow.up.right.square', web: 'link' }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\external-link.tsx
================================================

import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}


================================================
ðŸ“„ ARCHIVO: src\components\hint-row.tsx
================================================

import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <View style={styles.stepRow}>
      <ThemedText type="small">{title}</ThemedText>
      <ThemedView type="backgroundSelected" style={styles.codeSnippet}>
        <ThemedText themeColor="textSecondary">{hint}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeSnippet: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\themed-text.tsx
================================================

import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  title: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 600,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\themed-view.tsx
================================================

import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
}


================================================
ðŸ“„ ARCHIVO: src\components\ui\collapsible.tsx
================================================

import { SymbolView } from 'expo-symbols';
import { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <ThemedView>
      <Pressable
        style={({ pressed }) => [styles.heading, pressed && styles.pressedHeading]}
        onPress={() => setIsOpen((value) => !value)}>
        <ThemedView type="backgroundElement" style={styles.button}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={14}
            weight="bold"
            tintColor={theme.text}
            style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }}
          />
        </ThemedView>

        <ThemedText type="small">{title}</ThemedText>
      </Pressable>
      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <ThemedView type="backgroundElement" style={styles.content}>
            {children}
          </ThemedView>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pressedHeading: {
    opacity: 0.7,
  },
  button: {
    width: Spacing.four,
    height: Spacing.four,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: Spacing.three,
    borderRadius: Spacing.three,
    marginLeft: Spacing.four,
    padding: Spacing.four,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\web-badge.tsx
================================================

import { version } from 'expo/package.json';
import { Image } from 'expo-image';
import { useColorScheme, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';

export function WebBadge() {
  const scheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.versionText}>
        v{version}
      </ThemedText>
      <Image
        source={
          scheme === 'dark'
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')
        }
        style={styles.badgeImage}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  versionText: {
    textAlign: 'center',
  },
  badgeImage: {
    width: 123,
    aspectRatio: 123 / 24,
  },
});


================================================
ðŸ“„ ARCHIVO: src\constants\api.ts
================================================

export const API = {
  baseUrl: 'https://6ae183c8be3bc8fead989cfe.mockapi.io',
  resource: 'medidores',
  timeoutMs: 15000,
  cacheVigenciaMs: 24 * 60 * 60 * 1000,
} as const;

export function urlMedidores(codigo: string): string {
  return `${API.baseUrl}/${API.resource}?codigo=${encodeURIComponent(codigo)}`;
}


================================================
ðŸ“„ ARCHIVO: src\constants\theme.ts
================================================

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const MedidoresColors = {
  primary: '#035AA6',
  primarySecondary: '#0367A6',
  primaryDark: '#175073',
  error: '#D93030',
  backgroundLight: '#F2F2F2',
} as const;

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    primary: MedidoresColors.primary,
    primarySecondary: MedidoresColors.primarySecondary,
    primaryDark: MedidoresColors.primaryDark,
    error: MedidoresColors.error,
    backgroundLight: MedidoresColors.backgroundLight,
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    primary: MedidoresColors.primary,
    primarySecondary: MedidoresColors.primarySecondary,
    primaryDark: MedidoresColors.primaryDark,
    error: MedidoresColors.error,
    backgroundLight: MedidoresColors.backgroundLight,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;


================================================
ðŸ“„ ARCHIVO: src\database\connection.ts
================================================

import { openDatabaseSync } from 'expo-sqlite';

export const db = openDatabaseSync('medidores.db');

export function initDatabase(): void {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS medidores (
      codigo TEXT PRIMARY KEY,
      direccion TEXT NOT NULL,
      sector TEXT NOT NULL,
      numero_cuenta TEXT NOT NULL,
      estado TEXT NOT NULL,
      ultima_lectura REAL,
      fecha_ultima_lectura TEXT,
      consumo_promedio_mensual REAL,
      fecha_consulta TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lecturas (
      id_local TEXT PRIMARY KEY,
      codigo_medidor TEXT NOT NULL,
      mes INTEGER NOT NULL,
      anio INTEGER NOT NULL,
      lectura_actual REAL,
      estado_medidor TEXT NOT NULL,
      motivo_inaccesibilidad TEXT,
      descripcion_dano TEXT,
      confirmacion_revision INTEGER DEFAULT 0,
      uri_fotografia TEXT,
      estado_sincronizacion TEXT NOT NULL DEFAULT 'borrador',
      fecha_creacion TEXT NOT NULL,
      fecha_modificacion TEXT NOT NULL,
      UNIQUE(codigo_medidor, mes, anio)
    );
  `);
}


================================================
ðŸ“„ ARCHIVO: src\database\repository.ts
================================================

import { db, initDatabase } from './connection';

export type Medidor = {
  codigo: string;
  direccion: string;
  sector: string;
  numero_cuenta: string;
  estado: string;
  ultima_lectura?: number | null;
  fecha_ultima_lectura?: string | null;
  consumo_promedio_mensual?: number | null;
  fecha_consulta: string;
};

export type Lectura = {
  id_local: string;
  codigo_medidor: string;
  mes: number;
  anio: number;
  lectura_actual?: number | null;
  estado_medidor: string;
  motivo_inaccesibilidad?: string | null;
  descripcion_dano?: string | null;
  confirmacion_revision?: number | null;
  uri_fotografia?: string | null;
  estado_sincronizacion: EstadoSincronizacion;
  fecha_creacion: string;
  fecha_modificacion: string;
};

export type EstadoSincronizacion = 'borrador' | 'pendiente' | 'enviado' | 'error';

function ahora(): string {
  return new Date().toISOString();
}

export function inicializarBaseDeDatos(): void {
  initDatabase();
}

export function guardarMedidor(medidor: Medidor): void {
  db.runSync(
    `INSERT OR REPLACE INTO medidores (
      codigo, direccion, sector, numero_cuenta, estado,
      ultima_lectura, fecha_ultima_lectura,
      consumo_promedio_mensual, fecha_consulta
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      medidor.codigo,
      medidor.direccion,
      medidor.sector,
      medidor.numero_cuenta,
      medidor.estado,
      medidor.ultima_lectura ?? null,
      medidor.fecha_ultima_lectura ?? null,
      medidor.consumo_promedio_mensual ?? null,
      medidor.fecha_consulta,
    ]
  );
}

export function obtenerMedidorPorCodigo(codigo: string): Medidor | null {
  const result = db.getFirstSync<Medidor | null>(
    `SELECT * FROM medidores WHERE codigo = ?`,
    [codigo]
  );
  return result ?? null;
}

export function eliminarMedidor(codigo: string): void {
  db.runSync(`DELETE FROM medidores WHERE codigo = ?`, [codigo]);
}

export function crearLecturaBorrador(
  codigoMedidor: string,
  mes: number,
  anio: number,
  idLocal: string
): { ok: true; lectura: Lectura } | { ok: false; error: string } {
  if (mes < 1 || mes > 12) {
    return {
      ok: false,
      error: 'El mes debe estar entre 1 y 12.',
    };
  }

  if (anio < 2000 || anio > 2100) {
    return {
      ok: false,
      error: 'El año no es válido.',
    };
  }

  const existente = obtenerLecturaPorCodigoYMes(codigoMedidor, mes, anio);
  if (existente) {
    return {
      ok: false,
      error: 'Ya existe una lectura para este medidor en el mes y año indicados.',
    };
  }

  const fecha = ahora();

  db.runSync(
    `INSERT INTO lecturas (
      id_local, codigo_medidor, mes, anio,
      estado_medidor, estado_sincronizacion,
      fecha_creacion, fecha_modificacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [idLocal, codigoMedidor, mes, anio, 'borrador', 'borrador', fecha, fecha]
  );

  return {
    ok: true,
    lectura: {
      id_local: idLocal,
      codigo_medidor: codigoMedidor,
      mes,
      anio,
      estado_medidor: 'borrador',
      estado_sincronizacion: 'borrador',
      fecha_creacion: fecha,
      fecha_modificacion: fecha,
    },
  };
}

export function obtenerLecturaPorCodigoYMes(
  codigoMedidor: string,
  mes: number,
  anio: number
): Lectura | null {
  const result = db.getFirstSync<Lectura | null>(
    `SELECT * FROM lecturas WHERE codigo_medidor = ? AND mes = ? AND anio = ?`,
    [codigoMedidor, mes, anio]
  );
  return result ?? null;
}

export function obtenerLecturasPorEstado(
  estado: EstadoSincronizacion
): Lectura[] {
  const rows = db.getAllSync<Lectura>(
    `SELECT * FROM lecturas WHERE estado_sincronizacion = ? ORDER BY fecha_creacion DESC`,
    [estado]
  );
  return rows;
}

export function obtenerTodasLasLecturas(): Lectura[] {
  return db.getAllSync<Lectura>(
    `SELECT * FROM lecturas ORDER BY fecha_creacion DESC`
  );
}

// Transiciones de estado permitidas:
// - borrador → pendiente (al intentar enviar)
// - borrador → error (si falla validación previa al envío)
// - pendiente → enviado (éxito en sincronización)
// - pendiente → error (fallo en sincronización)
// - error → pendiente (reintento tras error)
// No se permite modificar una lectura con estado 'enviado'.
const transicionesValidas: Record<EstadoSincronizacion, EstadoSincronizacion[]> = {
  borrador: ['pendiente', 'error'],
  pendiente: ['enviado', 'error'],
  error: ['pendiente'],
  enviado: [],
};

export function actualizarEstadoLectura(
  idLocal: string,
  estado: EstadoSincronizacion
): { ok: true } | { ok: false; error: string } {
  const existente = obtenerLecturaPorId(idLocal);
  if (!existente) {
    return { ok: false, error: 'No se encontró la lectura.' };
  }

  if (existente.estado_sincronizacion === estado) {
    return { ok: true };
  }

  const permitidas = transicionesValidas[existente.estado_sincronizacion];
  if (!permitidas.includes(estado)) {
    return {
      ok: false,
      error: `No se puede pasar de '${existente.estado_sincronizacion}' a '${estado}'.`,
    };
  }

  const fecha = ahora();
  db.runSync(
    `UPDATE lecturas
     SET estado_sincronizacion = ?, fecha_modificacion = ?
     WHERE id_local = ?`,
    [estado, fecha, idLocal]
  );

  return { ok: true };
}

export function actualizarLecturaCompleta(
  idLocal: string,
  campos: Partial<{
    lectura_actual: number | null;
    estado_medidor: string;
    motivo_inaccesibilidad: string | null;
    descripcion_dano: string | null;
    confirmacion_revision: number | null;
    uri_fotografia: string | null;
  }>
): { ok: true; lectura: Lectura } | { ok: false; error: string } {
  const existente = obtenerLecturaPorId(idLocal);
  if (!existente) {
    return { ok: false, error: 'No se encontró la lectura.' };
  }

  if (existente.estado_sincronizacion === 'enviado') {
    return {
      ok: false,
      error: 'No se puede modificar una lectura ya enviada.',
    };
  }

  const fecha = ahora();
  const sets: string[] = [];
  const valores: (string | number | null)[] = [];

  if (campos.lectura_actual !== undefined) {
    sets.push('lectura_actual = ?');
    valores.push(campos.lectura_actual);
  }
  if (campos.estado_medidor !== undefined) {
    sets.push('estado_medidor = ?');
    valores.push(campos.estado_medidor);
  }
  if (campos.motivo_inaccesibilidad !== undefined) {
    sets.push('motivo_inaccesibilidad = ?');
    valores.push(campos.motivo_inaccesibilidad);
  }
  if (campos.descripcion_dano !== undefined) {
    sets.push('descripcion_dano = ?');
    valores.push(campos.descripcion_dano);
  }
  if (campos.confirmacion_revision !== undefined) {
    sets.push('confirmacion_revision = ?');
    valores.push(campos.confirmacion_revision);
  }
  if ((campos as any).uri_fotografia !== undefined) {
    sets.push('uri_fotografia = ?');
    valores.push((campos as any).uri_fotografia);
  }

  sets.push('fecha_modificacion = ?');
  valores.push(fecha);
  valores.push(idLocal);

  if (sets.length === 0) {
    const actualizada = obtenerLecturaPorId(idLocal);
    return {
      ok: true,
      lectura: actualizada!,
    };
  }

  db.runSync(
    `UPDATE lecturas SET ${sets.join(', ')} WHERE id_local = ?`,
    valores
  );

  const actualizada = obtenerLecturaPorId(idLocal);
  return {
    ok: true,
    lectura: actualizada!,
  };
}

export function marcarLecturaComoPendiente(
  idLocal: string
): { ok: true } | { ok: false; error: string } {
  return actualizarEstadoLectura(idLocal, 'pendiente');
}

export function marcarLecturaComoError(
  idLocal: string
): { ok: true } | { ok: false; error: string } {
  return actualizarEstadoLectura(idLocal, 'error');
}

export function guardarFotoLectura(
  idLocal: string,
  uri: string
): { ok: true; lectura: Lectura } | { ok: false; error: string } {
  return actualizarLecturaCompleta(idLocal, { uri_fotografia: uri } as any);
}

export function obtenerLecturaPorId(idLocal: string): Lectura | null {
  const result = db.getFirstSync<Lectura | null>(
    `SELECT * FROM lecturas WHERE id_local = ?`,
    [idLocal]
  );
  return result ?? null;
}

export function eliminarLectura(idLocal: string): { ok: true } | { ok: false; error: string } {
  const existente = obtenerLecturaPorId(idLocal);
  if (!existente) {
    return { ok: false, error: 'No se encontró la lectura.' };
  }

  if (existente.estado_sincronizacion === 'enviado') {
    return {
      ok: false,
      error: 'No se puede eliminar una lectura ya enviada.',
    };
  }

  db.runSync(`DELETE FROM lecturas WHERE id_local = ?`, [idLocal]);
  return { ok: true };
}


================================================
ðŸ“„ ARCHIVO: src\hooks\use-color-scheme.ts
================================================

export { useColorScheme } from 'react-native';


================================================
ðŸ“„ ARCHIVO: src\hooks\use-color-scheme.web.ts
================================================

import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}


================================================
ðŸ“„ ARCHIVO: src\hooks\use-connection.ts
================================================

import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

import { obtenerLecturasPorEstado } from '@/database/repository';
import { sincronizarPendientes } from '@/services/sync.service';

export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [pendingCount, setPendingCount] = useState<number>(0);

  const actualizarContador = () => {
    try {
      const pendientes = obtenerLecturasPorEstado('pendiente');
      const conError = obtenerLecturasPorEstado('error');
      setPendingCount(pendientes.length + conError.length);
    } catch {
      setPendingCount(0);
    }
  };

  useEffect(() => {
    actualizarContador();

    let estabaConectadoActual = true;

    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected =
        state.isConnected !== false && state.isInternetReachable !== false;
      const estabaConectado = estabaConectadoActual;
      setIsConnected(connected);

      if (connected && !estabaConectado) {
        sincronizarPendientes().catch(() => {
          // Ignorar errores en auto-sincronización
        });
      }
      estabaConectadoActual = connected;
      actualizarContador();
    });

    const intervalo = setInterval(actualizarContador, 30000);

    return () => {
      unsubscribe();
      clearInterval(intervalo);
    };
  }, []);

  return { isConnected, pendingCount, actualizarContador };
}

export async function obtenerConteoPendientes(): Promise<number> {
  try {
    const pendientes = obtenerLecturasPorEstado('pendiente');
    const conError = obtenerLecturasPorEstado('error');
    return pendientes.length + conError.length;
  } catch {
    return 0;
  }
}


================================================
ðŸ“„ ARCHIVO: src\hooks\use-theme.ts
================================================

/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? 'dark' : 'light';

  return Colors[theme];
}


================================================
ðŸ“„ ARCHIVO: src\services\auth-context.tsx
================================================

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { authService, type SessionData } from '@/services/auth.service';

type AuthContextType = {
  session: SessionData | null;
  loading: boolean;
  login: (employeeCode: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getSession().then((sessionData) => {
      setSession(sessionData);
      setLoading(false);
    });
  }, []);

  const login = async (employeeCode: string, password: string): Promise<void> => {
    const isValid = await authService.validateCredentials(employeeCode, password);
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    await authService.saveSession(employeeCode);
    const sessionData = await authService.getSession();
    setSession(sessionData);
  };

  const logout = async (): Promise<void> => {
    await authService.clearSession();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}


================================================
ðŸ“„ ARCHIVO: src\services\auth.service.ts
================================================

import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'medidores_session';

export const DEMO_CREDENTIALS = {
  employeeCode: 'EMP-001',
  password: 'clave123',
};

export type SessionData = {
  employeeCode: string;
  authenticatedAt: number;
};

export const authService = {
  async saveSession(employeeCode: string): Promise<void> {
    const session: SessionData = {
      employeeCode,
      authenticatedAt: Date.now(),
    };
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  },

  async getSession(): Promise<SessionData | null> {
    const value = await SecureStore.getItemAsync(SESSION_KEY);
    if (!value) return null;
    try {
      return JSON.parse(value) as SessionData;
    } catch {
      return null;
    }
  },

  async clearSession(): Promise<void> {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  },

  async validateCredentials(
    employeeCode: string,
    password: string,
  ): Promise<boolean> {
    return (
      employeeCode === DEMO_CREDENTIALS.employeeCode &&
      password === DEMO_CREDENTIALS.password
    );
  },
};


================================================
ðŸ“„ ARCHIVO: src\services\medidor.service.ts
================================================

import { API } from '@/constants/api';
import { Medidor, guardarMedidor, obtenerMedidorPorCodigo } from '@/database/repository';
let NetInfo: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  NetInfo = require('@react-native-community/netinfo').default || require('@react-native-community/netinfo');
} catch {
  NetInfo = null;
}

const CACHE_DIA_MS = API.cacheVigenciaMs;

export type ConsultaExitosa = {
  estado: 'exito';
  medidor: Medidor;
  origen: 'api' | 'cache';
  vigente: boolean;
};

export type ConsultaNoEncontrado = {
  estado: 'no_encontrado';
};

export type ConsultaSinConexion = {
  estado: 'sin_conexion';
  medidor: Medidor | null;
  vigente: boolean;
};

export type ConsultaError = {
  estado: 'error';
  mensaje: string;
};

export type ConsultaResult =
  | ConsultaExitosa
  | ConsultaNoEncontrado
  | ConsultaSinConexion
  | ConsultaError;

export async function hayConexion(): Promise<boolean> {
  try {
    if (NetInfo && typeof NetInfo.fetch === 'function') {
      const state = await NetInfo.fetch();
      if (state?.isConnected === false) return false;
      if (state?.isInternetReachable === false) return false;
      return true;
    }
    return true;
  } catch {
    return true;
  }
}

function estaVigente(fechaConsulta: string | null | undefined): boolean {
  if (!fechaConsulta) return false;
  return Date.now() - new Date(fechaConsulta).getTime() <= CACHE_DIA_MS;
}

type MedidorCrudo = Record<string, unknown>;

function obtenerCampo(crudo: MedidorCrudo, claves: string[]): unknown {
  for (const clave of claves) {
    if (clave in crudo && crudo[clave] !== undefined && crudo[clave] !== null) {
      return crudo[clave];
    }
  }
  return undefined;
}

function texto(valor: unknown): string {
  return valor == null ? '' : String(valor);
}

function numerico(valor: unknown): number | null {
  if (valor == null) return null;
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

function mapearMedidor(crudo: MedidorCrudo, codigoSolicitado: string): Medidor {
  const campo = (claves: string[]) => obtenerCampo(crudo, claves);

  const codigoTexto = texto(campo(['codigo', 'id', 'code'])) || codigoSolicitado;

  return {
    codigo: codigoTexto,
    direccion: texto(campo(['direccion', 'dirección', 'address', 'direccionCompleta'])),
    sector: texto(campo(['sector', 'zona', 'zone'])),
    numero_cuenta: texto(
      campo(['numero_cuenta', 'numeroCuenta', 'accountNumber', 'cuenta', 'numero_de_cuenta'])
    ),
    estado: texto(campo(['estado', 'status'])),
    ultima_lectura: numerico(campo(['ultima_lectura', 'ultimaLectura', 'lastReading', 'lecturaActual', 'lectura'])),
    fecha_ultima_lectura:
      texto(campo(['fecha_ultima_lectura', 'fechaUltimaLectura', 'fechaUltima', 'lastReadingDate'])) || null,
    consumo_promedio_mensual: numerico(
      campo([
        'consumo_promedio_mensual',
        'consumoPromedioMensual',
        'averageMonthlyConsumption',
        'consumoPromedio',
        'consumo',
      ])
    ),
    fecha_consulta: new Date().toISOString(),
  };
}

function esErrorDeRed(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') return true;
  if (error instanceof TypeError) return true;
  const mensaje = (error as { message?: string })?.message ?? '';
  const nombre = (error as { name?: string })?.name ?? '';
  return /network|fetch|connection|failed|timeout|unreachable|refused/i.test(mensaje) || nombre === 'TypeError';
}

export async function consultarMedidor(codigo: string): Promise<ConsultaResult> {
  const url = `${API.baseUrl}/${API.resource}?codigo=${encodeURIComponent(codigo)}`;
  const controller = new AbortController();
  const temporizador = setTimeout(() => controller.abort(), API.timeoutMs);

  try {
    const respuesta = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!respuesta.ok) {
      return {
        estado: 'error',
        mensaje: `Error del servidor (${respuesta.status}). Intente nuevamente.`,
      };
    }

    const datos = await respuesta.json();
    const registros = Array.isArray(datos) ? datos : [];
    const registro = registros.find(
      (item: Record<string, unknown>) => String(item.codigo ?? item.id ?? '') === codigo
    );

    if (!registro) {
      return { estado: 'no_encontrado' };
    }

    const medidor = mapearMedidor(registro as MedidorCrudo, codigo);

    try {
      guardarMedidor(medidor);
    } catch {
      // No se bloquea la entrega de datos por un fallo de escritura en caché.
    }

    return { estado: 'exito', medidor, origen: 'api', vigente: true };
  } catch (error) {
    const medidorGuardado = obtenerMedidorPorCodigo(codigo);

    if (!esErrorDeRed(error)) {
      return {
        estado: 'error',
        mensaje: 'Respuesta inválida del servidor. Intente nuevamente.',
      };
    }

    // Sin conexión: devolvemos lo que haya en caché local, aunque la petición
    // a MockAPI haya fallado por falta de red o timeout.
    const vigente = medidorGuardado ? estaVigente(medidorGuardado.fecha_consulta) : false;
    return { estado: 'sin_conexion', medidor: medidorGuardado ?? null, vigente };
  } finally {
    clearTimeout(temporizador);
  }
}


================================================
ðŸ“„ ARCHIVO: src\services\sync.service.ts
================================================

import { API } from '@/constants/api';
import {
  obtenerLecturaPorId,
  obtenerLecturasPorEstado,
  actualizarEstadoLectura,
  type Lectura,
} from '@/database/repository';
import { hayConexion } from '@/services/medidor.service';

let envioEnCurso = false;
const enviosActivos = new Set<string>();

function construirPayloadLectura(lectura: Lectura): Record<string, unknown> {
  return {
    id_local: lectura.id_local,
    codigo_medidor: lectura.codigo_medidor,
    mes: lectura.mes,
    anio: lectura.anio,
    lectura_actual: lectura.lectura_actual ?? null,
    estado_medidor: lectura.estado_medidor,
    motivo_inaccesibilidad: lectura.motivo_inaccesibilidad ?? null,
    descripcion_dano: lectura.descripcion_dano ?? null,
    confirmacion_revision: lectura.confirmacion_revision ?? 0,
    uri_fotografia: lectura.uri_fotografia ?? null,
    fecha_creacion: lectura.fecha_creacion,
    fecha_modificacion: lectura.fecha_modificacion,
  };
}

async function enviarLectura(lectura: Lectura): Promise<{ ok: boolean; error?: string }> {
  if (enviosActivos.has(lectura.id_local)) {
    return { ok: false, error: 'Envío ya en curso para esta lectura.' };
  }

  if (lectura.estado_sincronizacion === 'enviado') {
    return { ok: true };
  }

  const conectado = await hayConexion();
  if (!conectado) {
    return { ok: false, error: 'Sin conexión.' };
  }

  enviosActivos.add(lectura.id_local);

  const controller = new AbortController();
  const temporizador = setTimeout(() => controller.abort(), API.timeoutMs);

  try {
    const payload = construirPayloadLectura(lectura);
    const url = `${API.baseUrl}/lecturas`;

    const respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!respuesta.ok) {
      const actualizada = obtenerLecturaPorId(lectura.id_local);
      if (actualizada && actualizada.estado_sincronizacion !== 'enviado') {
        actualizarEstadoLectura(lectura.id_local, 'error');
      }
      return { ok: false, error: `Error del servidor (${respuesta.status}).` };
    }

    // Verificar estado actual antes de marcar como enviado para evitar condiciones de carrera
    const actualizada = obtenerLecturaPorId(lectura.id_local);
    if (!actualizada) {
      return { ok: false, error: 'Lectura no encontrada tras envío.' };
    }
    if (actualizada.estado_sincronizacion === 'enviado') {
      return { ok: true };
    }

    const marcado = actualizarEstadoLectura(lectura.id_local, 'enviado');
    if (!marcado.ok) {
      return { ok: false, error: marcado.error };
    }

    return { ok: true };
  } catch (error) {
    const actualizada = obtenerLecturaPorId(lectura.id_local);
    if (actualizada && actualizada.estado_sincronizacion !== 'enviado') {
      try {
        actualizarEstadoLectura(lectura.id_local, 'error');
      } catch {
        // Ignorar fallo al marcar error
      }
    }
    const mensaje = error instanceof Error ? error.message : 'Error de red al enviar lectura.';
    return { ok: false, error: mensaje };
  } finally {
    clearTimeout(temporizador);
    enviosActivos.delete(lectura.id_local);
  }
}

export async function sincronizarPendientes(): Promise<{
  enviados: number;
  errores: number;
  omitidos: number;
}> {
  if (envioEnCurso) {
    return { enviados: 0, errores: 0, omitidos: 0 };
  }

  envioEnCurso = true;
  let enviados = 0;
  let errores = 0;
  let omitidos = 0;

  try {
    const conectado = await hayConexion();
    if (!conectado) {
      return { enviados: 0, errores: 0, omitidos: 0 };
    }

    const pendientes = obtenerLecturasPorEstado('pendiente');
    const conError = obtenerLecturasPorEstado('error');

    // Reintentar pendientes primero, luego errores (transición error -> pendiente válida)
    const aEnviar: Lectura[] = [];

    for (const lectura of pendientes) {
      if (lectura.estado_sincronizacion === 'pendiente') {
        aEnviar.push(lectura);
      }
    }
    for (const lectura of conError) {
      // Solo reintentar si la transición es válida (error -> pendiente)
      const actual = obtenerLecturaPorId(lectura.id_local);
      if (actual && actual.estado_sincronizacion === 'error') {
        const marcado = actualizarEstadoLectura(lectura.id_local, 'pendiente');
        if (marcado.ok) {
          const actualizada = obtenerLecturaPorId(lectura.id_local);
          if (actualizada) {
            aEnviar.push(actualizada);
          }
        } else {
          omitidos++;
        }
      } else {
        omitidos++;
      }
    }

    for (const lectura of aEnviar) {
      const resultado = await enviarLectura(lectura);
      if (resultado.ok) {
        enviados++;
      } else {
        errores++;
      }
    }

    return { enviados, errores, omitidos };
  } finally {
    envioEnCurso = false;
  }
}

export function estaSincronizando(): boolean {
  return envioEnCurso;
}

/**
 * LIMITACIÓN DE IDEMPOTENCIA (MockAPI):
 * - id_local se incluye en el payload, pero MockAPI no garantiza idempotencia por defecto.
 * - Si la aplicación pierde la conexión justo después de que el servidor procese la petición
 *   pero antes de recibir la respuesta HTTP 2xx, la lectura quedará marcada como error localmente
 *   y al reintentar se enviará nuevamente, pudiendo crear un duplicado en MockAPI.
 * - Alternativa mínima segura: verificar antes de enviar si ya existe una lectura enviada para
 *   el mismo (codigo_medidor, mes, anio). Si existe y está enviada, marcar la lectura local
 *   como enviada sin reenviarla. También considerar que MockAPI podría tener restricciones;
 *   si el recurso no soporta búsqueda por id_local, esta verificación es limitada.
 */
export function obtenerLimitacionIdempotencia(): string {
  return 'MockAPI no garantiza idempotencia por id_local. Se recomienda verificar duplicados por (codigo_medidor, mes, anio) antes de reintentar y documentar el comportamiento.';
}


================================================
ðŸ“„ ARCHIVO: tsconfig.json
================================================

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@/assets/*": [
        "./assets/*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
