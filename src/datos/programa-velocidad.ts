// Campeonato Nacional de Velocidad: en curso (hoy y mañana). Los tiempos son literales; posiciones,
// diferencias y clasificados se calculan en `consultas.ts` con las funciones de dominio.
import {
  carriles,
  crearEvento,
  crearFase,
  crearInscripciones,
  crearSerie,
  dns,
  dsq,
} from './construccion';
import type { Evento, Fase, Inscripcion, Serie } from './tipos';

const COMPETENCIA = 'nacional-velocidad';
const evento = (codigo: string) => crearEvento(COMPETENCIA, 'vel', codigo);

const k1500m = evento('K1-500-SENIOR-M');
const k1500f = evento('K1-500-SENIOR-F');
const c1200 = evento('C1-200-JUNIOR-M');
const k4500 = evento('K4-500-SENIOR-M');
const k2500 = evento('K2-500-JUNIOR-F');
const k1200 = evento('K1-200-JUNIOR-M');

export const eventosVelocidad: Evento[] = [k1500m, k1500f, c1200, k4500, k2500, k1200];

// --- Inscripciones ---------------------------------------------------------------------------------------

const insK1500m = crearInscripciones(k1500m.id, [
  ['nicolas-pintos'],
  ['bruno-correa'],
  ['facundo-olivera'],
  ['martin-rodriguez'],
  ['gonzalo-barrios'],
  ['tomas-arias'],
  ['ramiro-delgado'],
  ['santiago-pereira'],
  ['diego-mendez'],
  ['ariel-sequeira'],
  ['facundo-techera'],
  ['lucas-fontes'],
  ['andres-pellegrino'],
  ['federico-sosa'],
  ['joaquin-cabrera'],
  ['maximiliano-lemos'],
  ['matias-olivera'],
  ['rodrigo-ferrari'],
]);

const insK1500f = crearInscripciones(k1500f.id, [
  ['carolina-pintos'],
  ['florencia-rivero'],
  ['natalia-barrios'],
  ['silvana-ortiz'],
  ['daniela-pereira'],
  ['gabriela-menendez'],
  ['andrea-sosa'],
  ['paola-bonilla'],
  ['mariana-techera'],
  ['romina-ledesma'],
  ['veronica-olivera'],
  ['lorena-cardozo'],
]);

const insC1200 = crearInscripciones(c1200.id, [
  ['mateo-gonzalez'],
  ['valentin-ramos'],
  ['agustin-peralta'],
  ['lautaro-gimenez'],
  ['ezequiel-caceres'],
  ['julian-sanchez'],
  ['alan-benitez'],
]);

const insK4500 = crearInscripciones(k4500.id, [
  ['nicolas-pintos', 'bruno-correa', 'facundo-olivera', 'hernan-pastorino'],
  ['martin-rodriguez', 'gonzalo-barrios', 'tomas-arias', 'ramiro-delgado'],
  ['santiago-pereira', 'diego-mendez', 'ariel-sequeira', 'leonardo-ibanez'],
  ['facundo-techera', 'lucas-fontes', 'andres-pellegrino', 'sebastian-acuna'],
  ['federico-sosa', 'joaquin-cabrera', 'maximiliano-lemos', 'cristian-maidana'],
]);

const insK2500 = crearInscripciones(k2500.id, [
  ['valentina-rios', 'camila-suarez'],
  ['lucia-mendez', 'sofia-cabrera'],
  ['martina-acosta', 'julieta-ferreira'],
  ['agustina-silva', 'florencia-nunez'],
  ['paula-gomez', 'micaela-duarte'],
  ['rocio-ibarra', 'sol-martinez'],
  ['catalina-viera', 'antonella-rosas'],
  ['emilia-castro', 'josefina-bentancor'],
  ['victoria-pereyra', 'renata-olivera'],
  ['guadalupe-leites', 'mia-correa'],
  ['delfina-arias', 'bianca-sosa'],
  ['abril-morales', 'candela-piriz'],
  ['isabel-techera', 'lara-machado'],
  ['clara-fontes', 'ana-laura-brum'],
]);

const insK1200 = crearInscripciones(k1200.id, [
  ['thiago-nunez'],
  ['bruno-cabrera'],
  ['mateo-duarte'],
  ['valentin-ramos'],
  ['ignacio-rosas'],
  ['agustin-peralta'],
  ['benjamin-acosta'],
  ['julian-sanchez'],
  ['felipe-ibarra'],
  ['lautaro-gimenez'],
  ['santino-morales'],
  ['ezequiel-caceres'],
  ['alan-benitez'],
  ['franco-ledesma'],
]);

export const inscripcionesVelocidad: Inscripcion[] = [
  ...insK1500m,
  ...insK1500f,
  ...insC1200,
  ...insK4500,
  ...insK2500,
  ...insK1200,
];

// --- Fases -----------------------------------------------------------------------------------------------

export const fasesVelocidad: Fase[] = [
  crearFase(k1500m.id, 'eliminatoria', 0, '09:00', { cantidad: 4, destino: 'la semifinal' }),
  crearFase(k1500m.id, 'repechaje', 0, '10:10', { cantidad: 4, destino: 'la semifinal' }),
  crearFase(k1500m.id, 'semifinal', 0, '10:40', { cantidad: 3, destino: 'la final' }),
  crearFase(k1500m.id, 'final', 1, '10:40'),

  crearFase(k1500f.id, 'eliminatoria', 0, '09:40', { cantidad: 4, destino: 'la final' }),
  crearFase(k1500f.id, 'final', 0, '11:00'),

  crearFase(c1200.id, 'final', 0, '09:30'),

  crearFase(k4500.id, 'final', 0, '10:00'),

  crearFase(k2500.id, 'eliminatoria', 0, '11:20', { cantidad: 4, destino: 'la final A' }),
  crearFase(k2500.id, 'final', 1, '10:00'),

  crearFase(k1200.id, 'eliminatoria', 1, '09:30', { cantidad: 4, destino: 'la final' }),
  crearFase(k1200.id, 'final', 1, '11:00'),
];

// --- Series ----------------------------------------------------------------------------------------------

export const seriesVelocidad: Serie[] = [
  // K1 500 m · Senior · Masculino: 18 inscriptos.
  crearSerie(
    k1500m.id,
    'eliminatoria',
    'Serie A',
    'publicada',
    0,
    '09:00',
    carriles(insK1500m, [
      [1, 'federico-sosa', '1:42.95'],
      [2, 'matias-olivera', '1:42.30'],
      [3, 'nicolas-pintos', '1:41.88'],
      [4, 'ramiro-delgado', '1:44.10'],
      [5, 'rodrigo-ferrari', '1:46.22'],
      [6, 'lucas-fontes', '1:47.10'],
    ]),
    { publicada: '09:14' },
  ),
  crearSerie(
    k1500m.id,
    'eliminatoria',
    'Serie B',
    'publicada',
    0,
    '09:10',
    carriles(insK1500m, [
      [1, 'gonzalo-barrios', '1:42.74'],
      [2, 'bruno-correa', '1:43.20'],
      [3, 'santiago-pereira', '1:41.55'],
      [4, 'facundo-olivera', '1:44.35'],
      [5, 'ariel-sequeira', '1:47.40'],
      [6, 'diego-mendez', '1:45.91'],
    ]),
    { publicada: '09:24' },
  ),
  crearSerie(
    k1500m.id,
    'eliminatoria',
    'Serie C',
    'publicada',
    0,
    '09:20',
    carriles(insK1500m, [
      [1, 'facundo-techera', '1:42.18'],
      [2, 'tomas-arias', '1:43.04'],
      [3, 'martin-rodriguez', '1:40.62'],
      [4, 'joaquin-cabrera', '1:44.77'],
      [5, 'andres-pellegrino', dsq('Invadió otro carril', 'Carril 5, después de los 250 m')],
      [6, 'maximiliano-lemos', '1:46.50'],
    ]),
    { publicada: '09:36' },
  ),
  crearSerie(
    k1500m.id,
    'repechaje',
    'Repechaje',
    'terminada',
    0,
    '10:10',
    carriles(insK1500m, [
      [2, 'lucas-fontes', '1:45.10'],
      [3, 'rodrigo-ferrari', '1:43.80'],
      [4, 'diego-mendez', '1:44.52'],
      [5, 'maximiliano-lemos', '1:45.74'],
      [6, 'ariel-sequeira', '1:46.90'],
    ]),
  ),
  crearSerie(
    k1500m.id,
    'semifinal',
    'Semifinal 1',
    'en-vivo',
    0,
    '10:40',
    carriles(insK1500m, [
      [1, 'matias-olivera'],
      [2, 'federico-sosa'],
      [3, 'gonzalo-barrios', '1:43.40'],
      [4, 'martin-rodriguez', '1:41.27'],
      [5, 'santiago-pereira', '1:42.05'],
      [6, 'nicolas-pintos', '1:42.91'],
      [7, 'facundo-techera', '1:44.62'],
      [8, 'rodrigo-ferrari'],
    ]),
    { largada: '10:41' },
  ),
  crearSerie(
    k1500m.id,
    'semifinal',
    'Semifinal 2',
    'armada',
    0,
    '10:50',
    carriles(insK1500m, [
      [1, 'tomas-arias'],
      [2, 'bruno-correa'],
      [3, 'joaquin-cabrera'],
      [4, 'diego-mendez'],
      [5, 'lucas-fontes'],
      [6, 'maximiliano-lemos'],
      [7, 'facundo-olivera'],
      [8, 'ramiro-delgado'],
    ]),
  ),

  // K1 500 m · Senior · Femenino: 12 inscriptas.
  crearSerie(
    k1500f.id,
    'eliminatoria',
    'Serie A',
    'publicada',
    0,
    '09:40',
    carriles(insK1500f, [
      [1, 'andrea-sosa', '1:55.80'],
      [2, 'natalia-barrios', '1:54.45'],
      [3, 'carolina-pintos', '1:53.20'],
      [4, 'mariana-techera', '1:57.10'],
      [5, 'lorena-cardozo', '1:58.60'],
      [6, 'romina-ledesma', '2:00.20'],
    ]),
    { publicada: '09:55' },
  ),
  crearSerie(
    k1500f.id,
    'eliminatoria',
    'Serie B',
    'publicada',
    0,
    '09:50',
    carriles(insK1500f, [
      [1, 'veronica-olivera', '1:54.98'],
      [2, 'florencia-rivero', '1:56.40'],
      [3, 'daniela-pereira', '1:52.90'],
      [4, 'silvana-ortiz', '1:57.85'],
      [5, 'gabriela-menendez', '1:59.75'],
      [6, 'paola-bonilla', dns('No se presentó a la largada')],
    ]),
    { publicada: '10:04' },
  ),
  crearSerie(
    k1500f.id,
    'final',
    'Final A',
    'armada',
    0,
    '11:00',
    carriles(insK1500f, [
      [1, 'silvana-ortiz'],
      [2, 'veronica-olivera'],
      [3, 'natalia-barrios'],
      [4, 'carolina-pintos'],
      [5, 'daniela-pereira'],
      [6, 'andrea-sosa'],
      [7, 'florencia-rivero'],
      [8, 'mariana-techera'],
    ]),
  ),

  // C1 200 m · Junior · Masculino: final directa.
  crearSerie(
    c1200.id,
    'final',
    'Final A',
    'publicada',
    0,
    '09:30',
    carriles(insC1200, [
      [1, 'julian-sanchez', '44.82'],
      [2, 'lautaro-gimenez', '43.90'],
      [3, 'valentin-ramos', '43.12'],
      [4, 'mateo-gonzalez', '43.75'],
      [5, 'alan-benitez', '46.30'],
      [6, 'agustin-peralta', '44.01'],
      [7, 'ezequiel-caceres', '45.58'],
    ]),
    { publicada: '09:42' },
  ),

  // K4 500 m · Senior · Masculino: final directa de 5 botes.
  crearSerie(
    k4500.id,
    'final',
    'Final A',
    'publicada',
    0,
    '10:00',
    carriles(insK4500, [
      [1, 'federico-sosa', '1:32.08'],
      [2, 'santiago-pereira', '1:31.55'],
      [3, 'martin-rodriguez', '1:29.40'],
      [4, 'nicolas-pintos', '1:30.12'],
      [5, 'facundo-techera', '1:34.60'],
    ]),
    { publicada: '10:15' },
  ),

  // K2 500 m · Junior · Femenino: los 14 botes, armados en dos eliminatorias.
  crearSerie(
    k2500.id,
    'eliminatoria',
    'Serie A',
    'armada',
    0,
    '11:20',
    carriles(insK2500, [
      [1, 'valentina-rios'],
      [2, 'agustina-silva'],
      [3, 'delfina-arias'],
      [4, 'catalina-viera'],
      [5, 'isabel-techera'],
      [6, 'victoria-pereyra'],
      [7, 'lucia-mendez'],
    ]),
  ),
  crearSerie(
    k2500.id,
    'eliminatoria',
    'Serie B',
    'armada',
    0,
    '11:30',
    carriles(insK2500, [
      [1, 'paula-gomez'],
      [2, 'martina-acosta'],
      [3, 'emilia-castro'],
      [4, 'guadalupe-leites'],
      [5, 'abril-morales'],
      [6, 'rocio-ibarra'],
      [7, 'clara-fontes'],
    ]),
  ),

  // K1 200 m · Junior · Masculino: eliminatorias de mañana.
  crearSerie(
    k1200.id,
    'eliminatoria',
    'Serie A',
    'armada',
    1,
    '09:30',
    carriles(insK1200, [
      [1, 'ignacio-rosas'],
      [2, 'mateo-duarte'],
      [3, 'thiago-nunez'],
      [4, 'benjamin-acosta'],
      [5, 'felipe-ibarra'],
      [6, 'santino-morales'],
      [7, 'alan-benitez'],
    ]),
  ),
  crearSerie(
    k1200.id,
    'eliminatoria',
    'Serie B',
    'armada',
    1,
    '09:40',
    carriles(insK1200, [
      [1, 'bruno-cabrera'],
      [2, 'valentin-ramos'],
      [3, 'agustin-peralta'],
      [4, 'lautaro-gimenez'],
      [5, 'ezequiel-caceres'],
      [6, 'julian-sanchez'],
      [7, 'franco-ledesma'],
    ]),
  ),
];
