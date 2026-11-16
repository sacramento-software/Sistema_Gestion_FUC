import { eventosMedioFondo, fasesMedioFondo, seriesMedioFondo } from './programa-medio-fondo';
import { eventosPromocional, fasesPromocional, seriesPromocional } from './programa-promocional';
import { eventosShortRace, fasesShortRace, seriesShortRace } from './programa-short-race';
import { eventosVelocidad, fasesVelocidad, seriesVelocidad } from './programa-velocidad';
import type { Competencia, Evento, Fase, Serie } from './tipos';

/** Los desfases son en días respecto de hoy: 0 = hoy, 1 = mañana, -40 = hace 40 días. */
export const competencias: Competencia[] = [
  {
    id: 'nacional-promocional',
    nombre: 'Campeonato Nacional Promocional (Ranking Menores)',
    sede: 'Lago Calcagno',
    tipo: 'promocional',
    diaInicio: -110,
    diaFin: -109,
    estado: 'finalizada',
    resumen: 'Cuatro finales de 500 m para infantiles y menores, con récord de participación.',
  },
  {
    id: 'nacional-medio-fondo',
    nombre: 'Campeonato Nacional de Medio Fondo',
    sede: 'Lago Calcagno',
    tipo: 'medio-fondo',
    diaInicio: -40,
    diaFin: -39,
    estado: 'finalizada',
    resumen: 'Cuatro finales de 5000 m en el Lago Calcagno, ya con resultados publicados.',
  },
  {
    id: 'nacional-velocidad',
    nombre: 'Campeonato Nacional de Velocidad',
    sede: 'Lago Calcagno',
    tipo: 'velocidad',
    diaInicio: 0,
    diaFin: 1,
    estado: 'curso',
    resumen: 'Dos jornadas de carreras con seis eventos: eliminatorias, semifinales y finales.',
  },
  {
    id: 'nacional-short-race',
    nombre: 'Campeonato Nacional Short Race',
    sede: 'San Gregorio de Polanco, Río Negro',
    tipo: 'short-race',
    diaInicio: 6,
    diaFin: 7,
    cierreInscripcion: { dia: 3, hora: '23:59' },
    estado: 'abiertas',
    resumen: 'Ocho eventos de 3600 m sobre el Río Negro, con inscripciones abiertas.',
  },
];

export const eventos: Evento[] = [
  ...eventosVelocidad,
  ...eventosShortRace,
  ...eventosMedioFondo,
  ...eventosPromocional,
];

export const fases: Fase[] = [...fasesVelocidad, ...fasesShortRace, ...fasesMedioFondo, ...fasesPromocional];

export const series: Serie[] = [
  ...seriesVelocidad,
  ...seriesShortRace,
  ...seriesMedioFondo,
  ...seriesPromocional,
];
