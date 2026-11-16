// Campeonato Nacional Short Race: inscripciones abiertas. Ocho eventos de 3600 m, cada uno con una sola
// fase Final prevista (día 6) y sin series.
import { crearEvento, crearFase, crearInscripciones } from './construccion';
import type { Evento, Fase, Inscripcion, Serie } from './tipos';

const COMPETENCIA = 'nacional-short-race';
const evento = (codigo: string) => crearEvento(COMPETENCIA, 'sr', codigo);

const k1JF = evento('K1-3600-JUNIOR-F');
const k2JF = evento('K2-3600-JUNIOR-F');
const k4JF = evento('K4-3600-JUNIOR-F');
const k1CF = evento('K1-3600-CADETE-F');
const k2SF = evento('K2-3600-SENIOR-F');
const k1JM = evento('K1-3600-JUNIOR-M');
const k2JM = evento('K2-3600-JUNIOR-M');
const c1CM = evento('C1-3600-CADETE-M');

export const eventosShortRace: Evento[] = [k1JF, k2JF, k4JF, k1CF, k2SF, k1JM, k2JM, c1CM];

export const inscripcionesShortRace: Inscripcion[] = [
  ...crearInscripciones(k1JF.id, [['isabel-techera'], ['paula-gomez'], ['guadalupe-leites'], ['clara-fontes']]),
  // Las de ACAL son las que ve el delegado en D3.
  ...crearInscripciones(k2JF.id, [
    ['lucia-fernandez', 'agustina-rodriguez'],
    ['agustina-silva', 'florencia-nunez'],
    ['catalina-viera', 'antonella-rosas'],
    ['victoria-pereyra', 'renata-olivera'],
    ['delfina-arias', 'bianca-sosa'],
  ]),
  ...crearInscripciones(k4JF.id, [
    ['agustina-silva', 'florencia-nunez', 'paula-gomez', 'micaela-duarte'],
    ['catalina-viera', 'antonella-rosas', 'emilia-castro', 'josefina-bentancor'],
  ]),
  ...crearInscripciones(k1CF.id, [['martina-silva'], ['emma-tejera'], ['alma-rivas'], ['olivia-maidana']]),
  ...crearInscripciones(k2SF.id, [
    ['natalia-barrios', 'silvana-ortiz'],
    ['daniela-pereira', 'gabriela-menendez'],
    ['andrea-sosa', 'paola-bonilla'],
    ['mariana-techera', 'romina-ledesma'],
  ]),
  ...crearInscripciones(k1JM.id, [
    ['mateo-gonzalez'],
    ['mateo-duarte'],
    ['ignacio-rosas'],
    ['benjamin-acosta'],
    ['felipe-ibarra'],
  ]),
  ...crearInscripciones(k2JM.id, [
    ['mateo-duarte', 'valentin-ramos'],
    ['ignacio-rosas', 'agustin-peralta'],
    ['santino-morales', 'ezequiel-caceres'],
    ['alan-benitez', 'franco-ledesma'],
  ]),
  ...crearInscripciones(c1CM.id, [['bautista-cardozo'], ['gael-martinez'], ['dante-correa'], ['lisandro-vera']]),
];

export const fasesShortRace: Fase[] = [
  crearFase(k1JF.id, 'final', 6, '09:00'),
  crearFase(k1CF.id, 'final', 6, '09:30'),
  crearFase(k2JF.id, 'final', 6, '10:00'),
  crearFase(k4JF.id, 'final', 6, '10:30'),
  crearFase(k2SF.id, 'final', 6, '11:00'),
  crearFase(k1JM.id, 'final', 6, '11:30'),
  crearFase(k2JM.id, 'final', 6, '12:00'),
  crearFase(c1CM.id, 'final', 6, '12:30'),
];

/** Todavía no se armó ninguna serie. */
export const seriesShortRace: Serie[] = [];
