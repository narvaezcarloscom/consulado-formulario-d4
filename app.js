// app.js
// Requiere en index.html (en este orden):
// 1) pdf-lib
// 2) municipios.js
// 3) app.js

const PDF_PATH = encodeURI("./formularioD4.pdf");
const $ = (id) => document.getElementById(id);

const DEFAULT_MISION = "ESTADO DE WASHINGTON";
const DEFAULT_LUGAR_EMISION = "GUATEMALA/GUATEMALA";
const STORAGE_KEY_ENTREVISTADOR = "d4_entrevistador";
const STORAGE_KEY_PASAPORTES = "registro_pasaportes_dia";

let entrevistaYaRegistrada = false;

document.addEventListener("DOMContentLoaded", () => {
  initAutoFechaHoy();
  initDefaults();
  wireInputMasks();
  seedDepartamentosYMunicipios();
  seedIdiomasMayas();
  seedOcupaciones();
  initEntrevistadorPersistente();

  const btnListar = $("btnListar");
  const btnNuevo = $("btnNuevo");
  const btnGenerar = $("btnGenerar");
  const btnRegistrarEntrevista = $("btnRegistrarEntrevista");
  const btnCopiarLista = $("btnCopiarLista");

  if (btnListar) btnListar.addEventListener("click", listarCamposPDF);
  if (btnNuevo) btnNuevo.addEventListener("click", limpiarFormulario);
  if (btnGenerar) btnGenerar.addEventListener("click", generarPDF);
  if (btnRegistrarEntrevista) btnRegistrarEntrevista.addEventListener("click", registrarEntrevista);
  if (btnCopiarLista) btnCopiarLista.addEventListener("click", copiarListaPasaportes);

  renderListaPasaportesPreview();
});

// =========================
// Defaults / UX
// =========================

function initAutoFechaHoy() {
  const el = $("fecha");
  if (!el) return;

  if (!el.value.trim()) {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    el.value = `${dd}/${mm}/${yy}`;
  }
}

function initDefaults() {
  const mision = $("mision");
  const depMun = $("depMun");

  if (mision && !mision.value.trim()) {
    mision.value = DEFAULT_MISION;
  }

  if (depMun && !depMun.value.trim()) {
    depMun.value = DEFAULT_LUGAR_EMISION;
  }
}

function initEntrevistadorPersistente() {
  const el = $("entrevistador");
  if (!el) return;

  try {
    const saved = localStorage.getItem(STORAGE_KEY_ENTREVISTADOR);
    if (saved) el.value = saved.toUpperCase();
  } catch (_) {}

  el.addEventListener("input", () => {
    el.value = (el.value || "").toUpperCase();
    try {
      localStorage.setItem(STORAGE_KEY_ENTREVISTADOR, el.value);
    } catch (_) {}
  });

  el.addEventListener("change", () => {
    el.value = (el.value || "").toUpperCase();
    try {
      localStorage.setItem(STORAGE_KEY_ENTREVISTADOR, el.value);
    } catch (_) {}
  });
}

function wireInputMasks() {
  // MAYÚSCULAS
  const forceUpperIds = [
    "mision",
    "depMun",
    "entrevistador",
    "nombre1", "nombre2", "nombre3",
    "apellido1", "apellido2", "apellidoCasada",
    "deptNac", "munNac",
    "idioma",
    "ocupacion",
    "padre", "madre",
    "dirEnv", "aptEnv", "ciudadEnv", "estadoEnv",
    "documentoPadre", "documentoMadre",
    "obs1", "obs2",
  ];

  forceUpperIds.forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", () => {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      el.value = (el.value || "").toUpperCase();
      try { el.setSelectionRange(start, end); } catch (_) {}
    });
  });

  // CUI DPI -> 1234 12345 1234
  const cui = $("CuiDPI");
  if (cui) {
    cui.addEventListener("input", (e) => {
      const digits = (e.target.value || "").replace(/\D/g, "").slice(0, 13);
      const part1 = digits.slice(0, 4);
      const part2 = digits.slice(4, 9);
      const part3 = digits.slice(9, 13);
      e.target.value = [part1, part2, part3].filter(Boolean).join(" ");
    });
  }

  // Teléfonos -> (206) 555 1212
  function formatPhone(value) {
    const d = (value || "").replace(/\D/g, "").slice(0, 10);
    const a = d.slice(0, 3);
    const b = d.slice(3, 6);
    const c = d.slice(6, 10);

    if (!d) return "";
    if (d.length <= 3) return `(${a}`;
    if (d.length <= 6) return `(${a}) ${b}`;
    return `(${a}) ${b} ${c}`;
  }

  ["celularRes", "telRes"].forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", (e) => {
      e.target.value = formatPhone(e.target.value);
    });
  });

  // Nacimiento + edad
  const dia = $("nacDia");
  const mes = $("nacMes");
  const anio = $("nacAnio");
  const edad = $("edad");

  const clamp2 = (v) => v.replace(/\D/g, "").slice(0, 2);
  const clamp4 = (v) => v.replace(/\D/g, "").slice(0, 4);

  if (dia) dia.addEventListener("input", (e) => (e.target.value = clamp2(e.target.value)));
  if (mes) mes.addEventListener("input", (e) => (e.target.value = clamp2(e.target.value)));
  if (anio) anio.addEventListener("input", (e) => (e.target.value = clamp4(e.target.value)));

  if (edad) edad.readOnly = true;

  const recalcEdad = () => {
    const dd = parseInt((dia?.value || "").trim(), 10);
    const mm = parseInt((mes?.value || "").trim(), 10);
    const yyyy = parseInt((anio?.value || "").trim(), 10);
    const out = $("edad");
    if (!out) return;

    if (!dd || !mm || !yyyy || String(yyyy).length !== 4) {
      out.value = "";
      return;
    }

    if (mm < 1 || mm > 12 || dd < 1 || dd > 31 || yyyy < 1900) {
      out.value = "";
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - yyyy;

    const hasHadBirthday =
      (today.getMonth() + 1 > mm) ||
      (today.getMonth() + 1 === mm && today.getDate() >= dd);

    if (!hasHadBirthday) age -= 1;
    if (age < 0 || age > 130) {
      out.value = "";
      return;
    }

    out.value = String(age);
  };

  if (dia) dia.addEventListener("change", recalcEdad);
  if (mes) mes.addEventListener("change", recalcEdad);
  if (anio) anio.addEventListener("change", recalcEdad);
  if (dia) dia.addEventListener("input", recalcEdad);
  if (mes) mes.addEventListener("input", recalcEdad);
  if (anio) anio.addEventListener("input", recalcEdad);

  // Numéricos
  ["estatura", "peso"].forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^\d]/g, "").slice(0, 3);
    });
  });

  const zip = $("zipEnv");
  if (zip) {
    zip.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
    });
  }
}

// =========================
// Datalists
// =========================

function seedIdiomasMayas() {
  const dl = $("listaIdiomas");
  if (!dl) return;

  const idiomas = [
    "Achi",
    "Akateko",
    "Awakateko",
    "Ch’orti’",
    "Chuj",
    "Itza",
    "Ixil",
    "Jakalteco",
    "Kaqchikel",
    "K’iche’",
    "Mam",
    "Mopan",
    "Poqomam",
    "Poqomchi’",
    "Q’anjob’al",
    "Q’eqchi’",
    "Sakapulteko",
    "Sipakapense",
    "Tektiteko",
    "Tz’utujil",
    "Uspanteko",
    "Español",
    "Inglés",
  ].map((s) => s.toUpperCase());

  dl.innerHTML = idiomas.map((x) => `<option value="${escapeHtml(x)}"></option>`).join("");
}

function seedOcupaciones() {
  const dl = $("listaOcupaciones");
  if (!dl) return;

  const ocupaciones = [
    "OPERARIO",
    "AMA DE CASA",
    "JARDINERO",
    "CONSTRUCCION",
    "AGRICULTOR",
    "COCINERO(A)",
    "LAVAPLATOS",
    "OFICINISTA",
    "EMPAQUETADOR(A)",
    "CHOFER",
    "LIMPIEZA",
  ];

  dl.innerHTML = ocupaciones
    .map((x) => `<option value="${escapeHtml(x)}"></option>`)
    .join("");
}

// =========================
// Municipios (Lugar de nacimiento)
// =========================

function seedDepartamentosYMunicipios() {
  const depDl = $("listaDepartamentos");
  const munDl = $("listaMunicipios");
  const deptInput = $("deptNac");
  const munInput = $("munNac");

  if (!depDl || !munDl || !deptInput || !munInput) return;

  const map = window.MUNICIPIOS;
  const lookup = window.DEPT_LOOKUP || {};
  const norm = window.normGT || ((s) => (s || "").toLowerCase().trim());

  if (!map || typeof map !== "object") {
    console.warn("municipios.js no expone window.MUNICIPIOS");
    munInput.disabled = true;
    munInput.placeholder = "PRIMERO ELIGE DEPARTAMENTO";
    return;
  }

  const departamentos = Object.keys(map)
    .sort((a, b) => a.localeCompare(b))
    .map((d) => d.toUpperCase());

  depDl.innerHTML = departamentos
    .map((d) => `<option value="${escapeHtml(d)}"></option>`)
    .join("");

  function resolveDeptCanonical(rawUpper) {
    const raw = (rawUpper || "").trim();
    if (!raw) return "";

    const key = lookup[norm(raw)];
    if (key && map[key]) return key;

    const found = Object.keys(map).find((k) => k.toUpperCase() === raw);
    return found || "";
  }

  function refreshMunicipios() {
    const rawDept = (deptInput.value || "").trim().toUpperCase();
    const canonicalDept = resolveDeptCanonical(rawDept);
    if (canonicalDept) deptInput.value = canonicalDept.toUpperCase();

    const muns = canonicalDept ? (map[canonicalDept] || []) : [];

    if (!canonicalDept) {
      munInput.disabled = true;
      munInput.value = "";
      munInput.placeholder = "PRIMERO ELIGE DEPARTAMENTO";
      munDl.innerHTML = "";
      return;
    }

    munInput.disabled = false;
    munInput.placeholder = "ESCRIBE EL MUNICIPIO…";

    const sorted = muns
      .slice()
      .sort((a, b) => a.localeCompare(b))
      .map((m) => m.toUpperCase());

    munDl.innerHTML = sorted
      .map((m) => `<option value="${escapeHtml(m)}"></option>`)
      .join("");

    if (munInput.value) {
      const upperVal = munInput.value.toUpperCase();
      if (!sorted.includes(upperVal)) munInput.value = "";
      else munInput.value = upperVal;
    }
  }

  deptInput.addEventListener("input", refreshMunicipios);
  deptInput.addEventListener("change", refreshMunicipios);
  munInput.addEventListener("input", () => {
    munInput.value = (munInput.value || "").toUpperCase();
  });

  refreshMunicipios();
}

// =========================
// Debug PDF fields
// =========================

async function listarCamposPDF() {
  const bytes = await fetch(PDF_PATH).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFLib.PDFDocument.load(bytes);
  const form = pdfDoc.getForm();

  console.log("=== CAMPOS EN EL PDF (name / type) ===");
  form.getFields().forEach((f) => console.log(f.getName(), "-", f.constructor.name));
  console.log("TIP: si algún nombre no coincide, lo ajustamos en safeSetText/safeCheck.");
}

// =========================
// Limpiar / Nuevo
// =========================

function limpiarFormulario() {
  const ids = [
    "fecha", "CuiDPI",

    "pago100", "pago65", "pago15", "pago6",

    "estatusNuevo", "estatusRenovar", "estatusReponer",

    "docDpi", "docCertificado", "docPasaporte",

    "nombre1", "nombre2", "nombre3",
    "apellido1", "apellido2", "apellidoCasada",

    "deptNac", "munNac",
    "nacDia", "nacMes", "nacAnio", "edad",
    "estatura", "peso", "ocupacion",

    "sexoM", "sexoF", "civilCasado", "civilSoltero",
    "etniaMaya", "etniaLadino", "idioma",

    "padre", "madre",

    "celularRes", "telRes",

    "dirEnv", "aptEnv", "ciudadEnv", "estadoEnv", "zipEnv",

    "documentoPadre", "documentoMadre",

    "obs1", "obs2",
  ];

  ids.forEach((id) => {
    const el = $(id);
    if (!el) return;
    if (el.type === "checkbox" || el.type === "radio") el.checked = false;
    else el.value = "";
  });

  initAutoFechaHoy();
  seedDepartamentosYMunicipios();
  seedIdiomasMayas();
  seedOcupaciones();

  const mision = $("mision");
  if (mision) mision.value = DEFAULT_MISION;

  const depMun = $("depMun");
  if (depMun) depMun.value = DEFAULT_LUGAR_EMISION;

  // mantener entrevistador persistente
  const entrevistador = $("entrevistador");
  if (entrevistador) {
    try {
      entrevistador.value = (localStorage.getItem(STORAGE_KEY_ENTREVISTADOR) || "").toUpperCase();
    } catch (_) {}
  }

  entrevistaYaRegistrada = false;

  const btnRegistrar = $("btnRegistrarEntrevista");
  if (btnRegistrar) btnRegistrar.disabled = false;

  renderListaPasaportesPreview();
}

// =========================
// Generar PDF
// =========================

async function generarPDF() {
  const data = readFormData();

  const bytes = await fetch(PDF_PATH).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFLib.PDFDocument.load(bytes);
  const form = pdfDoc.getForm();

  safeSetText(form, "Primer nombre", data.nombre1);
  safeSetText(form, "Segundo nombre", data.nombre2);
  safeSetText(form, "Tercer nombre", data.nombre3);
  safeSetText(form, "Primer apellido", data.apellido1);
  safeSetText(form, "Segundo apellido", data.apellido2);
  safeSetText(form, "Apellido de casada", data.apellidoCasada);

  safeSetText(form, "Fecha", data.fecha);
  safeSetText(form, "Misión", data.mision);
  safeSetText(form, "CuiDPI", data.cuiDpi);
  safeSetText(form, "Departamento -Municipio", data.depMun);
  safeSetText(form, "entrevistador", data.entrevistador);

  safeSetText(form, "Departamento Lugar de Nacimiento", data.deptNac);
  safeSetText(form, "Municipio", data.munNac);

  safeSetText(form, "Text95", data.nacDia);
  safeSetText(form, "Text96", data.nacMes);
  safeSetText(form, "Text97", data.nacAnio);

  safeSetText(form, "años", data.edad);
  safeSetText(form, "centímetros", data.estatura);
  safeSetText(form, "libras", data.peso);
  safeSetText(form, "ocupación", data.ocupacion);

  safeSetText(form, "Padre", data.padre);
  safeSetText(form, "Madre", data.madre);

  safeSetText(form, "Teléfono celular", data.celular);
  safeSetText(form, "Teléfono", data.telefono);

  safeSetText(form, "Dirección_2", data.dirEnv);
  safeSetText(form, "APT_2", data.aptEnv);
  safeSetText(form, "Ciudad_2", data.ciudadEnv);
  safeSetText(form, "Estado otro_2", data.estadoEnv);
  safeSetText(form, "Código postal_2", data.zipEnv);

  safeSetText(form, "idioma", data.idioma);

  safeSetText(form, "DocumentoPadre", data.documentoPadre);
  safeSetText(form, "DocumentoMadre", data.documentoMadre);

  safeSetText(form, "Observacion1", data.obs1);
  safeSetText(form, "Observacion2", data.obs2);

  safeCheck(form, "Check$100", data.pagoPasaporte === "100");
  safeCheck(form, "Check$65", data.pagoPasaporte === "65");
  safeCheck(form, "Check$15", data.pago15);
  safeCheck(form, "Check$6", data.pago6);

  safeCheck(form, "CheckNuevo", data.estatus === "nuevo");
  safeCheck(form, "CheckRenovar", data.estatus === "renovar");
  safeCheck(form, "CheckReponer", data.estatus === "reponer");

  safeCheck(form, "CheckDpi", data.docPresentado === "dpi");
  safeCheck(form, "CheckCertificado", data.docPresentado === "certificado");
  safeCheck(form, "CheckPasaporte", data.docPresentado === "pasaporte");

  safeCheck(form, "CheckM", data.sexo === "M");
  safeCheck(form, "CheckF", data.sexo === "F");

  safeCheck(form, "CheckCasado", data.estadoCivil === "casado");
  safeCheck(form, "CheckSoltero", data.estadoCivil === "soltero");

  safeCheck(form, "CheckMaya", data.etnia === "maya");
  safeCheck(form, "CheckLadino", data.etnia === "ladino");

  form.flatten();

  const out = await pdfDoc.save();
  const blob = new Blob([out], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

// =========================
// Lectura del formulario
// =========================

function readFormData() {
  const getVal = (id) => ($(id)?.value || "").trim();
  const getChecked = (id) => !!$(id)?.checked;

  const pagoPasaporte =
    ($("pago100")?.checked && "100") ||
    ($("pago65")?.checked && "65") ||
    "";

  return {
    fecha: getVal("fecha").toUpperCase(),
    mision: getVal("mision").toUpperCase(),
    cuiDpi: getVal("CuiDPI"),
    depMun: getVal("depMun").toUpperCase(),
    entrevistador: getVal("entrevistador").toUpperCase(),

    pagoPasaporte,
    pago15: getChecked("pago15"),
    pago6: getChecked("pago6"),

    estatus:
      ($("estatusNuevo")?.checked && "nuevo") ||
      ($("estatusRenovar")?.checked && "renovar") ||
      ($("estatusReponer")?.checked && "reponer") ||
      "",

    docPresentado:
      ($("docDpi")?.checked && "dpi") ||
      ($("docCertificado")?.checked && "certificado") ||
      ($("docPasaporte")?.checked && "pasaporte") ||
      "",

    nombre1: getVal("nombre1").toUpperCase(),
    nombre2: getVal("nombre2").toUpperCase(),
    nombre3: getVal("nombre3").toUpperCase(),
    apellido1: getVal("apellido1").toUpperCase(),
    apellido2: getVal("apellido2").toUpperCase(),
    apellidoCasada: getVal("apellidoCasada").toUpperCase(),

    deptNac: getVal("deptNac").toUpperCase(),
    munNac: getVal("munNac").toUpperCase(),

    nacDia: getVal("nacDia"),
    nacMes: getVal("nacMes"),
    nacAnio: getVal("nacAnio"),
    edad: getVal("edad"),
    estatura: getVal("estatura"),
    peso: getVal("peso"),
    ocupacion: getVal("ocupacion").toUpperCase(),

    sexo:
      ($("sexoM")?.checked && "M") ||
      ($("sexoF")?.checked && "F") ||
      "",

    estadoCivil:
      ($("civilCasado")?.checked && "casado") ||
      ($("civilSoltero")?.checked && "soltero") ||
      "",

    etnia:
      ($("etniaMaya")?.checked && "maya") ||
      ($("etniaLadino")?.checked && "ladino") ||
      "",

    idioma: getVal("idioma").toUpperCase(),

    padre: getVal("padre").toUpperCase(),
    madre: getVal("madre").toUpperCase(),

    celular: getVal("celularRes"),
    telefono: getVal("telRes"),

    dirEnv: getVal("dirEnv").toUpperCase(),
    aptEnv: getVal("aptEnv").toUpperCase(),
    ciudadEnv: getVal("ciudadEnv").toUpperCase(),
    estadoEnv: getVal("estadoEnv").toUpperCase(),
    zipEnv: getVal("zipEnv"),

    documentoPadre: getVal("documentoPadre").toUpperCase(),
    documentoMadre: getVal("documentoMadre").toUpperCase(),

    obs1: getVal("obs1").toUpperCase(),
    obs2: getVal("obs2").toUpperCase(),
  };
}

// =========================
// Registro de pasaportes del día
// =========================

function getRegistroPasaportes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_PASAPORTES) || "[]");
  } catch (_) {
    return [];
  }
}

function saveRegistroPasaportes(data) {
  try {
    localStorage.setItem(STORAGE_KEY_PASAPORTES, JSON.stringify(data));
  } catch (e) {
    throw new Error("No se pudo guardar en localStorage");
  }
}

function buildNombres(data) {
  return [data.nombre1, data.nombre2, data.nombre3].filter(Boolean).join(" ");
}

function buildApellidos(data) {
  return [data.apellido1, data.apellido2, data.apellidoCasada].filter(Boolean).join(" ");
}

function getCostoPasaporte(data) {
  if (data.pagoPasaporte === "100") return "$100";
  if (data.pagoPasaporte === "65") return "$65";
  return "";
}

function registrarEntrevista() {
  if (entrevistaYaRegistrada) {
    alert("Esta entrevista ya fue registrada. Presiona 'Nuevo' para comenzar otra.");
    return;
  }

  const data = readFormData();
  const costoPasaporte = getCostoPasaporte(data);

  if (!costoPasaporte) {
    alert("Solo se registran entrevistas de pasaporte ($100 o $65).");
    return;
  }

  const nombres = buildNombres(data);
  const apellidos = buildApellidos(data);

  if (!nombres || !apellidos) {
    alert("Faltan nombres o apellidos para registrar la entrevista.");
    return;
  }

  try {
    const registro = getRegistroPasaportes();

    registro.push({
      fecha: data.fecha,
      nombres,
      apellidos,
      costoPasaporte,
      _id: Date.now()
    });

    saveRegistroPasaportes(registro);
    renderListaPasaportesPreview();

    entrevistaYaRegistrada = true;

    const btnRegistrar = $("btnRegistrarEntrevista");
    if (btnRegistrar) btnRegistrar.disabled = true;

    alert("Entrevista registrada correctamente.");
  } catch (e) {
    alert("Error al registrar entrevista: " + e.message);
  }
}

function buildListaPasaportesTexto() {
  const registro = getRegistroPasaportes();

  const rows = [
    ["Fecha", "Nombres", "Apellidos", "Costo de pasaporte"].join("\t")
  ];

  registro.forEach((item) => {
    rows.push([
      item.fecha || "",
      item.nombres || "",
      item.apellidos || "",
      item.costoPasaporte || ""
    ].join("\t"));
  });

  return rows.join("\n");
}

function renderListaPasaportesPreview() {
  const preview = $("listaPasaportesPreview");
  if (!preview) return;

  preview.value = buildListaPasaportesTexto();
}

async function copiarListaPasaportes() {
  const texto = buildListaPasaportesTexto();

  try {
    await navigator.clipboard.writeText(texto);
    alert("Lista copiada. Ya puedes pegarla en Excel.");
  } catch (_) {
    const preview = $("listaPasaportesPreview");
    if (preview) {
      preview.focus();
      preview.select();
    }
    alert("No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.");
  }
}

// =========================
// PDF safe setters
// =========================

function safeSetText(form, fieldName, value) {
  if (!value) return;
  try {
    form.getTextField(fieldName).setText(String(value));
  } catch (e) {
    console.warn(`No se pudo setear "${fieldName}". Revisa nombre real en consola.`);
  }
}

function safeCheck(form, fieldName, shouldCheck) {
  if (!shouldCheck) return;
  try {
    form.getCheckBox(fieldName).check();
  } catch (e) {
    console.warn(`No se pudo marcar "${fieldName}". Revisa nombre real en consola.`);
  }
}

// =========================
// Utils
// =========================

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}