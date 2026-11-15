import { inscripcionesMedioFondo } from './programa-medio-fondo';
import { inscripcionesPromocional } from './programa-promocional';
import { inscripcionesShortRace } from './programa-short-race';
import { inscripcionesVelocidad } from './programa-velocidad';
import type { Inscripcion } from './tipos';

export const inscripciones: Inscripcion[] = [
  ...inscripcionesVelocidad,
  ...inscripcionesShortRace,
  ...inscripcionesMedioFondo,
  ...inscripcionesPromocional,
];
