# MiPymeSmart - Sitio web

Estructura lista para GitHub y Netlify.

## Archivos principales

- `index.html`: estructura de la página.
- `css/style.css`: estilos visuales.
- `js/main.js`: interacciones, menú, chatbot demo, QR, fondo dinámico y formularios.
- `assets/`: imagen, QR y videos.

## Cómo subir a GitHub

1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos y carpetas manteniendo esta estructura:
   - index.html
   - css/style.css
   - js/main.js
   - assets/
3. Guarda los cambios en la rama principal.

## Cómo publicar en Netlify

1. Entra a Netlify.
2. Elige "Add new site" > "Import an existing project".
3. Conecta tu repositorio de GitHub.
4. Build command: dejar vacío.
5. Publish directory: dejar vacío o usar `/`.
6. Publicar.

## Nota

El chatbot incluido es demostrativo con JavaScript. Para conectarlo a IA real se debe agregar backend/API y proteger la clave.
