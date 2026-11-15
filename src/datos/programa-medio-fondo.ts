// Campeonato Nacional de Medio Fondo: finalizado. Cada evento tiene una sola fase Final y una serie
// «Final A» publicada (días -40 y -39).
import { carriles, crearEvento, crearFase, crearInscripciones, crearSerie, dnf } from './construccion';
import type { Evento, Fase, Inscripcion, Serie } from './tipos';

const COMPETENCIA = 'nacional-medio-fondo';
const evento = (codigo: string) => crearEvento(COMPETENCIA, 'mf', codigo);

const k1SM = evento('K1-5000-SENIOR-M');
const k1SF = evento('K1-5000-SENIOR-F');
const k2JF = evento('K2-5000-JUNIOR-F');
const k1JM = evento('K1-5000-JUNIOR-M');

export const eventosMedioFondo: Evento[] = [k1SM, k1SF, k2JF, k1JM];

const insSM = crearInscripciones(k1SM.id, [
  ['nicolas-pintos'],
  ['martin-rodriguez'],
  ['gonzalo-barrios'],
  ['santiago-pereira'],
  ['diego-mendez'],
  ['facundo-techera'],
  ['lucas-fontes'],
  ['federico-sosa'],
  ['rodrigo-ferrari'],
]);
const insSF = crearInscripciones(k1SF.id, [
  ['carolina-pintos'],
  ['natalia-barrios'],
  ['daniela-pereira'],
  ['andrea-sosa'],
  ['mariana-techera'],
  ['veronica-olivera'],
  ['lorena-cardozo'],
]);
const insK2 = crearInscripciones(k2JF.id, [
  ['valentina-rios', 'camila-suarez'],
  ['agustina-silva', 'florencia-nunez'],
  ['catalina-viera', 'antonella-rosas'],
  ['victoria-pereyra', 'renata-olivera'],
  ['delfina-arias', 'bianca-sosa'],
  ['isabel-techera', 'lara-machado'],
]);
const insJM = crearInscripciones(k1JM.id, [
  ['thiago-nunez'],
  ['mateo-duarte'],
  ['ignacio-rosas'],
  ['benjamin-acosta'],
  ['felipe-ibarra'],
  ['santino-morales'],
  ['alan-benitez'],
]);

export const inscripcionesMedioFondo: Inscripcion[] = [...insSM, ...insSF, ...insK2, ...insJM];

export const fasesMedioFondo: Fase[] = [
  crearFase(k1SM.id, 'final', -40, '10:00'),
  crearFase(k1SF.id, 'final', -40, '11:30'),
  crearFase(k2JF.id, 'final', -39, '10:00'),
  crearFase(k1JM.id, 'final', -39, '11:30'),
];

export const seriesMedioFondo: Serie[] = [
  crearSerie(
    k1SM.id,
    'final',
    'Final A',
    'publicada',
    -40,
    '10:00',
    carriles(insSM, [
      [1, 'federico-sosa', '23:48.30'],
      [2, 'gonzalo-barrios', '23:02.10'],
      [3, 'martin-rodriguez', '22:12.40'],
      [4, 'santiago-pereira', '22:20.85'],
      [5, 'nicolas-pintos', '22:41.35'],
      [6, 'facundo-techera', '23:15.77'],
      [7, 'rodrigo-ferrari', '24:10.55'],
      [8, 'diego-mendez', '24:52.90'],
      [9, 'lucas-fontes', dnf('Abandonó en el kilómetro 3')],
    ]),
    { publicada: '10:52' },
  ),
  crearSerie(
    k1SF.id,
    'final',
    'Final A',
    'publicada',
    -40,
    '11:30',
    carriles(insSF, [
      [1, 'natalia-barrios', '24:55.60'],
      [2, 'andrea-sosa', '25:20.05'],
      [3, 'carolina-pintos', '24:30.15'],
      [4, 'mariana-techera', '25:44.70'],
      [5, 'daniela-pereira', '26:08.30'],
      [6, 'veronica-olivera', '26:31.95'],
      [7, 'lorena-cardozo', '26:50.20'],
    ]),
    { publicada: '12:25' },
  ),
  crearSerie(
    k2JF.id,
    'final',
    'Final A',
    'publicada',
    -39,
    '10:00',
    carriles(insK2, [
      [1, 'valentina-rios', '22:20.30'],
      [2, 'agustina-silva', '21:40.10'],
      [3, 'catalina-viera', '21:58.45'],
      [4, 'victoria-pereyra', '22:41.00'],
      [5, 'delfina-arias', '23:15.65'],
      [6, 'isabel-techera', '23:48.20'],
    ]),
    { publicada: '10:50' },
  ),
  crearSerie(
    k1JM.id,
    'final',
    'Final A',
    'publicada',
    -39,
    '11:30',
    carriles(insJM, [
      [1, 'mateo-duarte', '22:48.90'],
      [2, 'ignacio-rosas', '22:30.25'],
      [3, 'thiago-nunez', '23:05.40'],
      [4, 'benjamin-acosta', '23:30.15'],
      [5, 'felipe-ibarra', '24:01.70'],
      [6, 'santino-morales', '24:25.35'],
      [7, 'alan-benitez', '25:10.80'],
    ]),
    { publicada: '12:24' },
  ),
];
