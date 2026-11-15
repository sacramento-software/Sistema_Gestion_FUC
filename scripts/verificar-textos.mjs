// Verificador de textos prohibidos (sección 13 de la spec 1).
// Recorre src/**/*.{ts,tsx,css} y termina con código 1, listando archivo y línea, si encuentra algo.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const carpetaSrc = path.join(raiz, 'src');
const esteArchivo = fileURLToPath(import.meta.url);

/** Minúsculas y sin acentos, para comparar sin distinguir mayúsculas ni tildes. */
const normalizar = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const PROHIBIDOS_GENERALES = [
  /proximamente/,
  /disponible en la version completa/,
  /reiniciar demo/,
  /ver como (federacion|delegado|juez|publico)/,
  /cambiar de rol/,
  /duplicar competencia/,
  /datos de ejemplo/,
  /cotizacion/,
  /vista piloto/,
  /vista previa del rol/,
  /contenido de la vista/,
  /lorem/,
  // Marcadores de relleno de Claude Design.
  /\[nombre/,
  /\[club/,
  /\[tripulacion/,
  /\[fecha/,
  /\[sede/,
  /\[categoria/,
];

const PROHIBIDOS_PUBLICO = [/cedula/, /fecha de nacimiento/, /\bci:/];

const EMOJI = /\p{Extended_Pictographic}/u;
const SIMBOLOS_PERMITIDOS = /[©®™]/gu;

function* archivos(carpeta) {
  for (const nombre of readdirSync(carpeta)) {
    const ruta = path.join(carpeta, nombre);
    if (statSync(ruta).isDirectory()) yield* archivos(ruta);
    else if (/\.(ts|tsx|css)$/.test(nombre)) yield ruta;
  }
}

const hallazgos = [];

for (const ruta of archivos(carpetaSrc)) {
  if (ruta === esteArchivo) continue;
  const relativa = path.relative(raiz, ruta).split(path.sep).join('/');
  const esPublico = relativa.startsWith('src/app/(publico)/');
  const lineas = readFileSync(ruta, 'utf8').split(/\r?\n/);

  lineas.forEach((linea, i) => {
    const normal = normalizar(linea);
    const reglas = esPublico ? [...PROHIBIDOS_GENERALES, ...PROHIBIDOS_PUBLICO] : PROHIBIDOS_GENERALES;
    for (const regla of reglas) {
      if (regla.test(normal)) hallazgos.push(`${relativa}:${i + 1}  texto prohibido (${regla.source})`);
    }
    if (EMOJI.test(linea.replace(SIMBOLOS_PERMITIDOS, ''))) {
      hallazgos.push(`${relativa}:${i + 1}  emoji`);
    }
  });
}

if (hallazgos.length > 0) {
  console.error('verificar:textos encontró textos prohibidos:\n');
  for (const h of hallazgos) console.error(`  ${h}`);
  process.exit(1);
}

console.log('verificar:textos: sin textos prohibidos.');
