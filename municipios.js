// municipios.js
(() => {
  // Dataset compacto: "Departamento|Municipio" por línea
  const DATA = `
Alta Verapaz|Cobán
Alta Verapaz|Santa Cruz Verapaz
Alta Verapaz|San Cristóbal Verapaz
Alta Verapaz|Tactic
Alta Verapaz|Tamahú
Alta Verapaz|Tucurú
Alta Verapaz|Panzós
Alta Verapaz|Senahú
Alta Verapaz|San Pedro Carchá
Alta Verapaz|San Juan Chamelco
Alta Verapaz|Lanquín
Alta Verapaz|Santa María Cahabón
Alta Verapaz|Chisec
Alta Verapaz|Chahal
Alta Verapaz|Fray Bartolomé de las Casas
Alta Verapaz|Santa Catalina La Tinta
Alta Verapaz|Raxruhá

Baja Verapaz|Salamá
Baja Verapaz|San Miguel Chicaj
Baja Verapaz|Rabinal
Baja Verapaz|Cubulco
Baja Verapaz|Granados
Baja Verapaz|Santa Cruz El Chol
Baja Verapaz|San Jerónimo
Baja Verapaz|Purulhá

Chimaltenango|Chimaltenango
Chimaltenango|San José Poaquil
Chimaltenango|San Martín Jilotepeque
Chimaltenango|San Juan Comalapa
Chimaltenango|Santa Apolonia
Chimaltenango|Tecpán Guatemala
Chimaltenango|Patzún
Chimaltenango|San Miguel Pochuta
Chimaltenango|Patzicía
Chimaltenango|Santa Cruz Balanyá
Chimaltenango|Acatenango
Chimaltenango|San Pedro Yepocapa
Chimaltenango|San Andrés Itzapa
Chimaltenango|Parramos
Chimaltenango|Zaragoza
Chimaltenango|El Tejar

Chiquimula|Chiquimula
Chiquimula|San José La Arada
Chiquimula|San Juan Ermita
Chiquimula|Jocotán
Chiquimula|Camotán
Chiquimula|Olopa
Chiquimula|Esquipulas
Chiquimula|Concepción Las Minas
Chiquimula|Quezaltepeque
Chiquimula|San Jacinto
Chiquimula|Ipala

El Progreso|Guastatoya
El Progreso|Morazán
El Progreso|San Agustín Acasaguastlán
El Progreso|San Cristóbal Acasaguastlán
El Progreso|El Jícaro
El Progreso|Sanarate
El Progreso|San Antonio La Paz
El Progreso|San José del Golfo

Escuintla|Escuintla
Escuintla|Santa Lucía Cotzumalguapa
Escuintla|La Democracia
Escuintla|Siquinalá
Escuintla|Masagua
Escuintla|Tiquisate
Escuintla|La Gomera
Escuintla|Guanagazapa
Escuintla|San José
Escuintla|Iztapa
Escuintla|Palín
Escuintla|San Vicente Pacaya
Escuintla|Nueva Concepción

Guatemala|Guatemala
Guatemala|Santa Catarina Pinula
Guatemala|San José Pinula
Guatemala|San José del Golfo
Guatemala|Palencia
Guatemala|Chinautla
Guatemala|San Pedro Ayampuc
Guatemala|Mixco
Guatemala|San Pedro Sacatepéquez
Guatemala|San Juan Sacatepéquez
Guatemala|San Raymundo
Guatemala|Chuarrancho
Guatemala|Fraijanes
Guatemala|Amatitlán
Guatemala|Villa Nueva
Guatemala|Villa Canales
Guatemala|San Miguel Petapa

Huehuetenango|Huehuetenango
Huehuetenango|Chiantla
Huehuetenango|Malacatancito
Huehuetenango|Cuilco
Huehuetenango|Nentón
Huehuetenango|San Pedro Necta
Huehuetenango|Jacaltenango
Huehuetenango|San Pedro Soloma
Huehuetenango|Ixtahuacán
Huehuetenango|Santa Bárbara
Huehuetenango|La Libertad
Huehuetenango|La Democracia
Huehuetenango|San Miguel Acatán
Huehuetenango|San Rafael La Independencia
Huehuetenango|Tectitán
Huehuetenango|Concepción Huista
Huehuetenango|San Juan Ixcoy
Huehuetenango|San Antonio Huista
Huehuetenango|San Sebastián Coatán
Huehuetenango|Santa Cruz Barillas
Huehuetenango|Aguacatán
Huehuetenango|San Rafael Petzal
Huehuetenango|San Gaspar Ixchil
Huehuetenango|Santiago Chimaltenango
Huehuetenango|Santa Ana Huista
Huehuetenango|Unión Cantinil
Huehuetenango|Colotenango
Huehuetenango|San Sebastián Huehuetenango
Huehuetenango|San Juan Atitán
Huehuetenango|Todos Santos Cuchumatán
Huehuetenango|San Mateo Ixtatán
Huehuetenango|Santa Eulalia

Izabal|Puerto Barrios
Izabal|Livingston
Izabal|El Estor
Izabal|Morales
Izabal|Los Amates

Jalapa|Jalapa
Jalapa|San Pedro Pinula
Jalapa|San Luis Jilotepeque
Jalapa|San Manuel Chaparrón
Jalapa|San Carlos Alzatate
Jalapa|Monjas
Jalapa|Mataquescuintla

Jutiapa|Jutiapa
Jutiapa|El Progreso
Jutiapa|Santa Catarina Mita
Jutiapa|Agua Blanca
Jutiapa|Asunción Mita
Jutiapa|Yupiltepeque
Jutiapa|Atescatempa
Jutiapa|Jerez
Jutiapa|El Adelanto
Jutiapa|Zapotitlán
Jutiapa|Comapa
Jutiapa|Jalpatagua
Jutiapa|Conguaco
Jutiapa|Moyuta
Jutiapa|Pasaco
Jutiapa|San José Acatempa
Jutiapa|Quesada

Petén|Flores
Petén|San José
Petén|San Benito
Petén|San Andrés
Petén|La Libertad
Petén|San Francisco
Petén|Santa Ana
Petén|Dolores
Petén|San Luis
Petén|Sayaxché
Petén|Melchor de Mencos
Petén|Poptún
Petén|Las Cruces
Petén|El Chal

Quetzaltenango|Quetzaltenango
Quetzaltenango|Salcajá
Quetzaltenango|Olintepeque
Quetzaltenango|San Carlos Sija
Quetzaltenango|Sibilia
Quetzaltenango|Cabricán
Quetzaltenango|Cajolá
Quetzaltenango|San Miguel Sigüilá
Quetzaltenango|San Juan Ostuncalco
Quetzaltenango|San Mateo
Quetzaltenango|Concepción Chiquirichapa
Quetzaltenango|San Martín Sacatepéquez
Quetzaltenango|Almolonga
Quetzaltenango|Cantel
Quetzaltenango|Huitán
Quetzaltenango|Zunil
Quetzaltenango|Colomba Costa Cuca
Quetzaltenango|San Francisco La Unión
Quetzaltenango|El Palmar
Quetzaltenango|Coatepeque
Quetzaltenango|Génova
Quetzaltenango|San Felipe
Quetzaltenango|La Esperanza
Quetzaltenango|Palestina de Los Altos

Quiché|Santa Cruz del Quiché
Quiché|Chiché
Quiché|Chinique
Quiché|Zacualpa
Quiché|Chajul
Quiché|Santo Tomás Chichicastenango
Quiché|Patzité
Quiché|San Antonio Ilotenango
Quiché|San Pedro Jocopilas
Quiché|Cunén
Quiché|San Juan Cotzal
Quiché|Joyabaj
Quiché|Nebaj
Quiché|San Andrés Sajcabajá
Quiché|Uspantán
Quiché|Sacapulas
Quiché|San Bartolomé Jocotenango
Quiché|Canillá
Quiché|Chicamán
Quiché|Ixcán
Quiché|Pachalum

Retalhuleu|Retalhuleu
Retalhuleu|San Sebastián
Retalhuleu|Santa Cruz Muluá
Retalhuleu|San Martín Zapotitlán
Retalhuleu|San Felipe
Retalhuleu|San Andrés Villa Seca
Retalhuleu|Champerico
Retalhuleu|Nuevo San Carlos
Retalhuleu|El Asintal

Sacatepéquez|Antigua Guatemala
Sacatepéquez|Jocotenango
Sacatepéquez|Pastores
Sacatepéquez|Sumpango
Sacatepéquez|Santo Domingo Xenacoj
Sacatepéquez|Santiago Sacatepéquez
Sacatepéquez|San Bartolomé Milpas Altas
Sacatepéquez|San Lucas Sacatepéquez
Sacatepéquez|Santa Lucía Milpas Altas
Sacatepéquez|Magdalena Milpas Altas
Sacatepéquez|Santa María de Jesús
Sacatepéquez|Ciudad Vieja
Sacatepéquez|San Miguel Dueñas
Sacatepéquez|Alotenango
Sacatepéquez|San Antonio Aguas Calientes
Sacatepéquez|Santa Catarina Barahona

San Marcos|San Marcos
San Marcos|San Pedro Sacatepéquez
San Marcos|San Antonio Sacatepéquez
San Marcos|Comitancillo
San Marcos|San Miguel Ixtahuacán
San Marcos|Concepción Tutuapa
San Marcos|Tacaná
San Marcos|Sibinal
San Marcos|Tajumulco
San Marcos|Tejutla
San Marcos|San Rafael Pie de la Cuesta
San Marcos|Nuevo Progreso
San Marcos|El Tumbador
San Marcos|San José El Rodeo
San Marcos|Malacatán
San Marcos|Catarina
San Marcos|Ayutla
San Marcos|Ocos
San Marcos|San Pablo
San Marcos|El Quetzal
San Marcos|La Reforma
San Marcos|Pajapita
San Marcos|Ixchiguán
San Marcos|San José Ojetenam
San Marcos|San Cristóbal Cucho
San Marcos|Sipacapa
San Marcos|Esquipulas Palo Gordo
San Marcos|Río Blanco
San Marcos|San Lorenzo
San Marcos|La Blanca

Santa Rosa|Cuilapa
Santa Rosa|Barberena
Santa Rosa|Santa Rosa de Lima
Santa Rosa|Casillas
Santa Rosa|San Rafael Las Flores
Santa Rosa|Oratorio
Santa Rosa|San Juan Tecuaco
Santa Rosa|Chiquimulilla
Santa Rosa|Taxisco
Santa Rosa|Santa María Ixhuatán
Santa Rosa|Guazacapán
Santa Rosa|Santa Cruz Naranjo
Santa Rosa|Pueblo Nuevo Viñas
Santa Rosa|Nueva Santa Rosa

Sololá|Sololá
Sololá|San José Chacayá
Sololá|Santa María Visitación
Sololá|Santa Lucía Utatlán
Sololá|Nahualá
Sololá|Santa Catarina Ixtahuacán
Sololá|Santa Clara La Laguna
Sololá|Concepción
Sololá|San Andrés Semetabaj
Sololá|Panajachel
Sololá|Santa Catarina Palopó
Sololá|San Antonio Palopó
Sololá|San Lucas Tolimán
Sololá|Santa Cruz La Laguna
Sololá|San Pablo La Laguna
Sololá|San Marcos La Laguna
Sololá|San Juan La Laguna
Sololá|San Pedro La Laguna
Sololá|Santiago Atitlán

Suchitepéquez|Mazatenango
Suchitepéquez|Cuyotenango
Suchitepéquez|San Francisco Zapotitlán
Suchitepéquez|San Bernardino
Suchitepéquez|San José El Ídolo
Suchitepéquez|Santo Domingo Suchitepéquez
Suchitepéquez|San Lorenzo
Suchitepéquez|Samayac
Suchitepéquez|San Pablo Jocopilas
Suchitepéquez|San Antonio Suchitepéquez
Suchitepéquez|San Miguel Panán
Suchitepéquez|San Gabriel
Suchitepéquez|Chicacao
Suchitepéquez|Patulul
Suchitepéquez|Santa Bárbara
Suchitepéquez|San Juan Bautista
Suchitepéquez|Santo Tomás La Unión
Suchitepéquez|Zunilito
Suchitepéquez|Pueblo Nuevo
Suchitepéquez|Río Bravo
Suchitepéquez|San José La Máquina

Totonicapán|Totonicapán
Totonicapán|San Cristóbal Totonicapán
Totonicapán|San Francisco El Alto
Totonicapán|San Andrés Xecul
Totonicapán|Momostenango
Totonicapán|Santa María Chiquimula
Totonicapán|Santa Lucía La Reforma
Totonicapán|San Bartolo Aguas Calientes

Zacapa|Zacapa
Zacapa|Estanzuela
Zacapa|Río Hondo
Zacapa|Gualán
Zacapa|Teculután
Zacapa|Usumatlán
Zacapa|Cabañas
Zacapa|San Diego
Zacapa|La Unión
Zacapa|Huité
Zacapa|San Jorge
`.trim();

  const norm = (s) =>
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  // Construye: MUNICIPIOS { "Depto": ["Mun1","Mun2"...] } + DEPT_LOOKUP para tolerar acentos/mayúsculas
  const MUNICIPIOS = {};
  const DEPT_LOOKUP = {}; // norm(depto) -> "Depto" canonical

  for (const line of DATA.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const [d, m] = line.split("|").map((x) => x.trim());
    if (!d || !m) continue;

    if (!MUNICIPIOS[d]) {
      MUNICIPIOS[d] = [];
      DEPT_LOOKUP[norm(d)] = d;
    }
    if (!MUNICIPIOS[d].includes(m)) MUNICIPIOS[d].push(m); // dedupe
  }

  // Exporta al window
  window.MUNICIPIOS = MUNICIPIOS;
  window.DEPT_LOOKUP = DEPT_LOOKUP;
  window.normGT = norm;
})();