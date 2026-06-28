# D4 — Consular passport-form filler

A single-page web app that fills a national passport application form (a *"D4"*) and
generates a print-ready PDF. No build step, no backend, no stored data.

**Live:** https://narvaezcarloscom.github.io/consulado-formulario-d4/
First published to GitHub in March 2026 · MIT licensed

> 🇬🇧 English below · 🇪🇸 [Versión en español](#-español)

---

## Why this exists

I built this while working at a consular office, where filling passport application
forms by hand was part of the daily routine — 20 to 30 of the same PDF, every day.
The same friction repeated on every form: re-typing today's date, spelling out the
same department and municipality names, selecting the same indigenous languages, and
double-checking that the age a person stated actually matched their date of birth.

So I encoded the routine into a tool. The repetition became defaults and dependent
dropdowns; the error-prone parts became validations. What was minutes of careful
typing per applicant became a few fields and a button.

This repository is two things at once: a working tool, and a record of how I work —
turning a manual, high-volume process into software that removes the repetition
without losing the rigor.

## What it does

- Fills a fillable PDF template with [pdf-lib](https://pdf-lib.js.org/) and downloads a
  flattened, print-ready file
- Auto-fills today's date
- **Dependent dropdowns** — pick a department, get its municipalities (a catalog of 22
  departments and 330+ municipalities)
- **Real-time input masks** — national ID, phone, automatic uppercase (consular standard)
- **Age check** — computes age from date of birth, so a stated age can be verified
  against the document
- Indigenous-language support in the occupation and ethnicity fields
- Runs entirely in the browser

## Privacy

No applicant data is stored or transmitted. Data lives only in the open form, is
written into the PDF, and is gone when you close or clear the form. No localStorage,
no cookies, no analytics, no backend.

## Adapting it to another office or form

The architecture is generic; only the data is specific. To retarget it:

1. **Replace the PDF template** (`formularioD4.pdf`) with your own. Keep it a *fillable*
   PDF (named AcroForm fields), not a flat scan.
2. **Remap the field names** in `app.js` — the keys passed to pdf-lib must match the
   field names in your PDF. The built-in "list PDF fields" helper prints them for you.
3. **Swap the locality dataset** (`municipios.js`) for your own country's catalog, or
   drop it if your form has no dependent dropdowns.
4. **Adjust** masks, defaults and validations in `app.js` to your form's rules.

Everything is vanilla JS — no framework, no build — so a fork is editable by hand.

## Run locally

```bash
python3 -m http.server 8000
open http://localhost:8000
```

Or just open `index.html` in any browser.

## Tech

Vanilla JavaScript · HTML · CSS · pdf-lib · no build step · static hosting (GitHub Pages)

## License

[MIT](LICENSE) — use it, fork it, adapt it for your own office.

## Author

Built by **Carlos A. Narvaez Urbina** — informatics engineer and founder of Narvaez
Digital Marketing, a boutique studio based in Seattle, WA. I build tools and systems
for real operational problems.
More work at [narvaezcarlos.com](https://narvaezcarlos.com) ·
GitHub [@narvaezcarloscom](https://github.com/narvaezcarloscom)

---

## 🇪🇸 Español

Aplicación web de una sola página que llena un formulario nacional de solicitud de
pasaporte (un *"D4"*) y genera un PDF listo para imprimir. Sin build, sin backend, sin
datos almacenados.

**En línea:** https://narvaezcarloscom.github.io/consulado-formulario-d4/
Publicado en GitHub en marzo de 2026 · Licencia MIT

### Por qué existe

Lo construí mientras trabajaba en una oficina consular, donde llenar formularios de
solicitud de pasaporte a mano era parte de la rutina diaria — entre 20 y 30 del mismo
PDF, todos los días. La misma fricción se repetía en cada formulario: volver a escribir
la fecha de hoy, teclear los mismos nombres de departamentos y municipios, seleccionar
las mismas lenguas indígenas, y verificar que la edad que la persona decía coincidiera
con su fecha de nacimiento.

Así que codifiqué la rutina en una herramienta. La repetición se volvió valores por
defecto y listas dependientes; las partes propensas a error se volvieron validaciones.
Lo que eran minutos de tecleo cuidadoso por solicitante pasó a ser unos campos y un botón.

Este repositorio es dos cosas a la vez: una herramienta funcional y un registro de cómo
trabajo — convertir un proceso manual y de alto volumen en software que elimina la
repetición sin perder el rigor.

### Qué hace

- Llena una plantilla PDF con [pdf-lib](https://pdf-lib.js.org/) y descarga un archivo
  aplanado, listo para imprimir
- Autocompleta la fecha de hoy
- **Listas dependientes** — eliges un departamento y obtienes sus municipios (catálogo de
  22 departamentos y 330+ municipios)
- **Máscaras en tiempo real** — identificación nacional, teléfono, mayúscula automática
  (estándar consular)
- **Verificación de edad** — calcula la edad desde la fecha de nacimiento, para contrastar
  la edad declarada con el documento
- Soporte de lenguas indígenas en los campos de ocupación y etnia
- Corre por completo en el navegador

### Privacidad

No se almacena ni se transmite ningún dato del solicitante. Los datos viven solo en el
formulario abierto, se vuelcan al PDF y desaparecen al cerrar o limpiar el formulario. Sin
localStorage, sin cookies, sin analytics, sin backend.

### Cómo adaptarlo a otra oficina o formulario

La arquitectura es genérica; solo los datos son específicos. Para reorientarlo:

1. **Reemplaza la plantilla PDF** (`formularioD4.pdf`) por la tuya. Que sea un PDF *con
   campos* (AcroForm con nombres), no un escaneo plano.
2. **Re-mapea los nombres de campo** en `app.js` — las claves que se pasan a pdf-lib deben
   coincidir con los nombres de campo de tu PDF. El ayudante "listar campos del PDF" te los
   imprime.
3. **Cambia el dataset de localidades** (`municipios.js`) por el catálogo de tu país, o
   quítalo si tu formulario no usa listas dependientes.
4. **Ajusta** máscaras, valores por defecto y validaciones en `app.js` a las reglas de tu
   formulario.

Todo es JavaScript plano — sin framework, sin build — así que un fork se edita a mano.

### Correr localmente

```bash
python3 -m http.server 8000
open http://localhost:8000
```

O simplemente abre `index.html` en cualquier navegador.

### Autor

Construido por **Carlos A. Narvaez Urbina** — ingeniero en informática y fundador de
Narvaez Digital Marketing, un estudio boutique con base en Seattle, WA. Construyo
herramientas y sistemas para problemas operativos reales.
Más trabajo en [narvaezcarlos.com](https://narvaezcarlos.com) ·
GitHub [@narvaezcarloscom](https://github.com/narvaezcarloscom)
