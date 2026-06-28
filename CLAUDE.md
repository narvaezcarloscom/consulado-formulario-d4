# Formulario D4 - Consulado de Guatemala (Washington, DC)

Aplicacion web para llenar digitalmente el Formulario D4 (solicitud de pasaporte) y generar PDF listo para imprimir.

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **PDF**: pdf-lib v1 (via CDN unpkg)
- **Almacenamiento**: Ninguno - los datos viven solo en memoria del navegador mientras el formulario esta abierto
- **Build**: Ninguno - archivos estaticos, abrir `index.html` directamente o con servidor local

## Estructura

```
index.html          # UI del formulario (SPA)
app.js              # Logica principal: validacion, formateo, generacion PDF
municipios.js       # Dataset de 22 departamentos y 330+ municipios de Guatemala
formularioD4.pdf    # Template PDF con campos de formulario
```

## Ejecutar

```bash
python3 -m http.server 8000   # o cualquier servidor estatico
open http://localhost:8000
```

## Arquitectura

- SPA event-driven sin framework
- Input masking en tiempo real: CUI (`1234 12345 1234`), telefono (`(206) 555 1212`), auto-uppercase
- Calculo automatico de edad desde fecha de nacimiento
- Municipios dinamicos segun departamento seleccionado
- PDF: lee template con pdf-lib, llena campos, aplana y descarga

## Privacidad

No se almacena ni se transmite ningun dato del solicitante. Los datos se capturan en el
formulario, se vuelcan al PDF y se descargan; al cerrar o limpiar el formulario no queda
ningun registro. Sin localStorage, sin cookies, sin analytics, sin backend.

## Funcionalidades clave

- Generacion de PDF desde template
- Casillas de monto de pago en el PDF (`$100` / `$65`)
- Soporte de idiomas Maya en ocupaciones y etnia
- Boton "Nuevo" para limpiar el formulario
- Responsive design

## Deploy

Hosting estatico (GitHub Pages, Netlify, Vercel, nginx). No requiere Node.js ni build.
