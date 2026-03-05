const PDF_PATH = encodeURI("./formularioD4.pdf");

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  // --- helpers seguros para evitar null errors
  const on = (id, evt, fn) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener(evt, fn);
  };

  // 1) Fecha auto dd/mm/aa (hoy)
  const setFechaHoy = () => {
    const el = $("fecha");
    if (!el) return;
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    el.value = `${dd}/${mm}/${yy}`;
  };
  setFechaHoy();

  // 2) Normalización CUI DPI (13 dígitos)
  on("CuiDPI", "input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 13);
  });

  // 3) Normalización fecha nacimiento
  ["nacDia","nacMes","nacAnio"].forEach((id) => {
    on(id, "input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "");
    });
  });

  // 4) Cálculo de edad automático (y lo coloca en el input edad)
  const calcularEdad = () => {
    const dia = parseInt(($("nacDia")?.value || "").trim(), 10);
    const mes = parseInt(($("nacMes")?.value || "").trim(), 10);
    const anio = parseInt(($("nacAnio")?.value || "").trim(), 10);
    if (!dia || !mes || !anio) return;

    // Validación simple
    if (anio < 1900 || anio > new Date().getFullYear()) return;
    if (mes < 1 || mes > 12) return;
    if (dia < 1 || dia > 31) return;

    const hoy = new Date();
    const nac = new Date(anio, mes - 1, dia);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;

    const edadEl = $("edad");
    if (edadEl) edadEl.value = String(Math.max(0, edad));
  };

  on("nacDia", "input", calcularEdad);
  on("nacMes", "input", calcularEdad);
  on("nacAnio", "input", calcularEdad);

  // 5) Listar campos PDF
  on("btnListar", "click", async () => {
    const bytes = await fetch(PDF_PATH).then(r => r.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(bytes);
    const form = pdfDoc.getForm();

    console.log("=== CAMPOS EN EL PDF (name / type) ===");
    form.getFields().forEach((f) => {
      console.log(f.getName(), "-", f.constructor.name);
    });
  });

  // 6) Nuevo
  on("btnNuevo", "click", () => {
    const ids = [
      "fecha","mision",
      "CuiDPI","depMun",
      "nombre1","nombre2","nombre3","apellido1","apellido2","apellidoCasada",
      "nacDia","nacMes","nacAnio","edad","estatura","peso","ocupacion",
      "idioma","padre","madre",
      "celularRes","telRes",
      "dirEnv","aptEnv","ciudadEnv","estadoEnv","zipEnv",
      "documentoPadre","documentoMadre",
      "obs1","obs2",
    ];
    ids.forEach((id) => { const el = $(id); if (el) el.value = ""; });

    // reset radios/checkboxes
    const toUncheck = [
      "pago100","pago65","pago15","pago6",
      "estatusNuevo","estatusRenovar","estatusReponer",
      "docDpi","docCertificado","docPasaporte",
      "sexoM","sexoF","civilCasado","civilSoltero","etniaMaya","etniaLadino"
    ];
    toUncheck.forEach((id) => { const el = $(id); if (el) el.checked = false; });

    // vuelve a fecha de hoy
    setFechaHoy();
  });

  // 7) Generar PDF
  on("btnGenerar", "click", async () => {
    // Lee valores del HTML
    const data = {
      fecha: ($("fecha")?.value || "").trim(),
      mision: ($("mision")?.value || "").trim(),

      // IMPORTANTES (estos eran el bug)
      cuiDpi: ($("CuiDPI")?.value || "").trim(),
      depMun: ($("depMun")?.value || "").trim(),

      nombre1: ($("nombre1")?.value || "").trim(),
      nombre2: ($("nombre2")?.value || "").trim(),
      nombre3: ($("nombre3")?.value || "").trim(),
      apellido1: ($("apellido1")?.value || "").trim(),
      apellido2: ($("apellido2")?.value || "").trim(),
      apellidoCasada: ($("apellidoCasada")?.value || "").trim(),

      nacDia: ($("nacDia")?.value || "").trim(),
      nacMes: ($("nacMes")?.value || "").trim(),
      nacAnio: ($("nacAnio")?.value || "").trim(),

      edad: ($("edad")?.value || "").trim(),
      estatura: ($("estatura")?.value || "").trim(),
      peso: ($("peso")?.value || "").trim(),
      ocupacion: ($("ocupacion")?.value || "").trim(),

      idioma: ($("idioma")?.value || "").trim(),

      padre: ($("padre")?.value || "").trim(),
      madre: ($("madre")?.value || "").trim(),

      celularRes: ($("celularRes")?.value || "").trim(),
      telRes: ($("telRes")?.value || "").trim(),

      dirEnv: ($("dirEnv")?.value || "").trim(),
      aptEnv: ($("aptEnv")?.value || "").trim(),
      ciudadEnv: ($("ciudadEnv")?.value || "").trim(),
      estadoEnv: ($("estadoEnv")?.value || "").trim(),
      zipEnv: ($("zipEnv")?.value || "").trim(),

      documentoPadre: ($("documentoPadre")?.value || "").trim(),
      documentoMadre: ($("documentoMadre")?.value || "").trim(),

      obs1: ($("obs1")?.value || "").trim(),
      obs2: ($("obs2")?.value || "").trim(),

      // checks / radios (por ahora los dejo listos para que luego los conectemos si quieres)
      pago100: !!$("pago100")?.checked,
      pago65: !!$("pago65")?.checked,
      pago15: !!$("pago15")?.checked,
      pago6: !!$("pago6")?.checked,

      estatusNuevo: !!$("estatusNuevo")?.checked,
      estatusRenovar: !!$("estatusRenovar")?.checked,
      estatusReponer: !!$("estatusReponer")?.checked,

      docDpi: !!$("docDpi")?.checked,
      docCertificado: !!$("docCertificado")?.checked,
      docPasaporte: !!$("docPasaporte")?.checked,

      sexoM: !!$("sexoM")?.checked,
      sexoF: !!$("sexoF")?.checked,

      civilCasado: !!$("civilCasado")?.checked,
      civilSoltero: !!$("civilSoltero")?.checked,

      etniaMaya: !!$("etniaMaya")?.checked,
      etniaLadino: !!$("etniaLadino")?.checked,
    };

    // Abre PDF plantilla
    const bytes = await fetch(PDF_PATH).then(r => r.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(bytes);
    const form = pdfDoc.getForm();

    // -------------------------
    // SET TEXT FIELDS (PDF)
    // -------------------------

    // Datos del solicitante (si ya los tienes así en PDF, se llenan)
    safeSetText(form, "Primer nombre", data.nombre1);
    safeSetText(form, "Segundo nombre", data.nombre2);
    safeSetText(form, "Tercer nombre", data.nombre3);
    safeSetText(form, "Primer apellido", data.apellido1);
    safeSetText(form, "Segundo apellido", data.apellido2);
    safeSetText(form, "Apellido de casada", data.apellidoCasada);

    // Fecha nacimiento (confirmaste: Text95/96/97)
    safeSetText(form, "Text95", data.nacDia);
    safeSetText(form, "Text96", data.nacMes);
    safeSetText(form, "Text97", data.nacAnio);

    // Edad / Estatura / Peso / Ocupación (según tu PDF)
    safeSetText(form, "años", data.edad);
    safeSetText(form, "centímetros", data.estatura);
    safeSetText(form, "libras", data.peso);
    safeSetText(form, "ocupación", data.ocupacion);

    // Idioma (campo editable del PDF: “idioma” en minúscula según tu captura)
    safeSetText(form, "idioma", data.idioma);
    // si en tu PDF en realidad está como “Idioma” (por si acaso), lo intento también:
    safeSetText(form, "Idioma", data.idioma);

    // Padres
    safeSetText(form, "Padre", data.padre);
    safeSetText(form, "Madre", data.madre);

    // Teléfonos (si tus campos en PDF son esos mismos nombres)
    safeSetText(form, "Teléfono celular", data.celularRes);
    safeSetText(form, "Teléfono", data.telRes);

    // Dirección envío (según tu PDF con _2 en otros casos, aquí tú estás usando envío como principal en el HTML actual)
    safeSetText(form, "Dirección_2", data.dirEnv);
    safeSetText(form, "APT_2", data.aptEnv);
    safeSetText(form, "Ciudad_2", data.ciudadEnv);
    safeSetText(form, "Estado u otro_2", data.estadoEnv);
    safeSetText(form, "Código postal_2", data.zipEnv);

    // Autorización menor
    safeSetText(form, "DocumentoPadre", data.documentoPadre);
    safeSetText(form, "DocumentoMadre", data.documentoMadre);

    // Observaciones
    safeSetText(form, "Observacion1", data.obs1);
    safeSetText(form, "Observacion2", data.obs2);

    // -------------------------
    // FIX PRINCIPAL (los que NO se estaban cargando)
    // -------------------------
    // CUI DPI -> campo PDF confirmado: CuiDPI
    safeSetText(form, "CuiDPI", data.cuiDpi);

    // Lugar de emisión -> campo PDF confirmado: Departamento -Municipio (con espacio)
    safeSetText(form, "Departamento -Municipio", data.depMun);

    // -------------------------
    // CHECKBOXES (los dejamos listos para conectar cuando me confirmes los nombres exactos)
    // -------------------------
    // Si ya tienes estos nombres en tu PDF, se van a marcar. Si no existen, no rompe.
    safeSetCheck(form, "Check$100", data.pago100);
    safeSetCheck(form, "Check$65", data.pago65);
    safeSetCheck(form, "Check$15", data.pago15);
    safeSetCheck(form, "Check$6", data.pago6);

    safeSetCheck(form, "CheckNuevo", data.estatusNuevo);
    safeSetCheck(form, "CheckRenovar", data.estatusRenovar);
    safeSetCheck(form, "CheckReponer", data.estatusReponer);

    safeSetCheck(form, "CheckDpi", data.docDpi);
    safeSetCheck(form, "CheckCertificado", data.docCertificado);
    safeSetCheck(form, "CheckPasaporte", data.docPasaporte);

    safeSetCheck(form, "CheckM", data.sexoM);
    safeSetCheck(form, "CheckF", data.sexoF);

    safeSetCheck(form, "CheckCasado", data.civilCasado);
    safeSetCheck(form, "CheckSoltero", data.civilSoltero);

    safeSetCheck(form, "CheckMaya", data.etniaMaya);
    safeSetCheck(form, "CheckLadino", data.etniaLadino);

    // Aplana para impresión
    form.flatten();

    // Genera y abre PDF
    const out = await pdfDoc.save();
    const blob = new Blob([out], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  });
});

function safeSetText(form, fieldName, value) {
  if (value === undefined || value === null) return;
  const v = String(value).trim();
  if (!v) return;
  try {
    const f = form.getTextField(fieldName);
    f.setText(v);
  } catch (e) {
    // no rompe, solo avisa
    // console.warn(`No se pudo setear "${fieldName}".`);
  }
}

function safeSetCheck(form, fieldName, checked) {
  try {
    const cb = form.getCheckBox(fieldName);
    if (checked) cb.check();
    else cb.uncheck();
  } catch (e) {
    // no rompe
  }
}