# Formulario D4 - Consulado de Guatemala (Washington, DC)

Aplicacion web para llenar digitalmente el Formulario D4 (solicitud de pasaporte) y generar PDF listo para imprimir.

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **PDF**: pdf-lib v1 (via CDN unpkg)
- **Storage**: localStorage del navegador
- **Build**: Ninguno - archivos estaticos, abrir `index.html` directamente o con servidor local

## Estructura

```
index.html          # UI del formulario (SPA)
app.js              # Logica principal: validacion, formateo, generacion PDF, registro entrevistas
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
- localStorage: guarda iniciales del entrevistador y registro diario de pasaportes

## Funcionalidades clave

- Generacion de PDF desde template
- Registro de entrevistas con calculo de costos ($100, $65, $15, $6)
- Copiar datos al portapapeles para Excel
- Soporte de idiomas Maya en ocupaciones
- Responsive design

## Deploy

Hosting estatico (GitHub Pages, Netlify, Vercel, nginx). No requiere Node.js ni build.
