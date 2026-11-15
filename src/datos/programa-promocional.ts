// Campeonato Nacional Promocional (Ranking Menores): finalizado. Cuatro eventos de 500 m, cada uno con una
// sola fase Final y una serie «Final A» publicada (días -110 y -109).
import { carriles, crearEvento, crearFase, crearInscripciones, crearSerie } from './construccion';
import type { Evento, Fase, Inscripcion, Serie } from './tipos';

const COMPETENCIA = 'nacional-promocional';
const evento = (codigo: string) => crearEvento(COMPETENCIA, 'pro', codigo);

const infantilM = evento('K1-500-INFANTIL-M');
const infantilF = evento('K1-500-INFANTIL-F');
const menorM = evento('K1-500-MENOR-M');
const menorF = evento('K1-500-MENOR-F');

export const eventosPromocional: Evento[] = [infantilM, infantilF, menorM, menorF];

const insInfantilM = crearInscripciones(infantilM.id, [
  ['lorenzo-barreto'],
  ['benicio-alonso'],
  ['thiago-ferreira'],
  ['dylan-pereira'],
  ['bastian-rocha'],
  ['joaquin-techera'],
  ['maximo-sena'],
  ['ian-bertola'],
]);
const insInfantilF = crearInscripciones(infantilF.id, [
  ['antonia-vidal'],
  ['amparo-perez'],
  ['constanza-lima'],
  ['zoe-villalba'],
  ['julia-estevez'],
  ['pilar-cuello'],
  ['lola-ramos'],
  ['julieta-coitino'],
]);
const insMenorM = crearInscripciones(menorM.id, [
  ['mauricio-garrido'],
  ['ciro-lombardo'],
  ['octavio-pizzorno'],
  ['genaro-silveira'],
  ['elian-cuna'],
  ['emanuel-ruiz'],
  ['valentino-ibanez'],
  ['rafael-olmos'],
]);
const insMenorF = crearInscripciones(menorF.id, [
  ['mora-cantero'],
  ['pia-fagundez'],
  ['jazmin-bruno'],
  ['aitana-vazquez'],
  ['brenda-machado'],
  ['malena-soto'],
  ['camila-nunez'],
  ['sara-beltran'],
]);

export const inscripcionesPromocional: Inscripcion[] = [
  ...insInfantilM,
  ...insInfantilF,
  ...insMenorM,
  ...insMenorF,
];

export const fasesPromocional: Fase[] = [
  crearFase(infantilM.id, 'final', -110, '10:00'),
  crearFase(infantilF.id, 'final', -110, '10:30'),
  crearFase(menorM.id, 'final', -109, '10:00'),
  crearFase(menorF.id, 'final', -109, '10:30'),
];

export const seriesPromocional: Serie[] = [
  crearSerie(
    infantilM.id,
    'final',
    'Final A',
    'publicada',
    -110,
    '10:00',
    carriles(insInfantilM, [
      [1, 'dylan-pereira', '2:44.80'],
      [2, 'benicio-alonso', '2:25.15'],
      [3, 'bastian-rocha', '2:21.40'],
      [4, 'lorenzo-barreto', '2:31.90'],
      [5, 'thiago-ferreira', '2:34.55'],
      [6, 'joaquin-techera', '2:40.20'],
      [7, 'maximo-sena', '2:52.35'],
      [8, 'ian-bertola', '3:01.10'],
    ]),
    { publicada: '10:20' },
  ),
  crearSerie(
    infantilF.id,
    'final',
    'Final A',
    'publicada',
    -110,
    '10:30',
    carriles(insInfantilF, [
      [1, 'constanza-lima', '2:47.15'],
      [2, 'zoe-villalba', '2:33.70'],
      [3, 'antonia-vidal', '2:30.05'],
      [4, 'julia-estevez', '2:38.25'],
      [5, 'amparo-perez', '2:41.90'],
      [6, 'lola-ramos', '2:53.60'],
      [7, 'pilar-cuello', '2:58.40'],
      [8, 'julieta-coitino', '3:04.20'],
    ]),
    { publicada: '10:50' },
  ),
  crearSerie(
    menorM.id,
    'final',
    'Final A',
    'publicada',
    -109,
    '10:00',
    carriles(insMenorM, [
      [1, 'octavio-pizzorno', '2:22.30'],
      [2, 'mauricio-garrido', '2:18.95'],
      [3, 'ciro-lombardo', '2:15.60'],
      [4, 'elian-cuna', '2:26.75'],
      [5, 'genaro-silveira', '2:31.10'],
      [6, 'valentino-ibanez', '2:35.45'],
      [7, 'emanuel-ruiz', '2:43.90'],
      [8, 'rafael-olmos', '2:51.25'],
    ]),
    { publicada: '10:20' },
  ),
  crearSerie(
    menorF.id,
    'final',
    'Final A',
    'publicada',
    -109,
    '10:30',
    carriles(insMenorF, [
      [1, 'aitana-vazquez', '2:37.60'],
      [2, 'jazmin-bruno', '2:33.15'],
      [3, 'pia-fagundez', '2:24.35'],
      [4, 'mora-cantero', '2:28.80'],
      [5, 'malena-soto', '2:41.05'],
      [6, 'brenda-machado', '2:46.90'],
      [7, 'camila-nunez', '2:55.20'],
      [8, 'sara-beltran', '3:03.75'],
    ]),
    { publicada: '10:50' },
  ),
];
