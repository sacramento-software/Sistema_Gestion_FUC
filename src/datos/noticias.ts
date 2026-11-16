import { slug } from './texto';
import type { Noticia } from './tipos';

function noticia(datos: Omit<Noticia, 'id'>): Noticia {
  return { id: slug(datos.titulo), ...datos };
}

/** Los textos no inventan resultados: lo que nombran sale de los datos (lo verifica el test de integridad). */
export const noticias: Noticia[] = [
  noticia({
    titulo: 'Arranca el Campeonato Nacional de Velocidad en el Lago Calcagno',
    categoria: 'Velocidad',
    dia: -1,
    foto: '/imagenes/canotaje5.jpg',
    alt: 'Deportistas de canotaje en el agua durante una competencia',
    resumen: 'Dos jornadas de carreras con seis eventos, desde las eliminatorias hasta las finales.',
    cuerpo: [
      'El Lago Calcagno recibe el Campeonato Nacional de Velocidad, con dos jornadas de competencia y seis eventos en el programa: K1 500 m, K2 500 m, K4 500 m, C1 200 m y K1 200 m.',
      'La primera jornada reúne eliminatorias, repechajes, semifinales y las primeras finales. La segunda cierra el campeonato con las finales restantes.',
      'Podés seguir cada carrera en vivo desde la página de la competencia: los resultados se publican apenas los jueces los confirman.',
    ],
  }),
  noticia({
    titulo: 'Abren las inscripciones para el Campeonato Nacional Short Race',
    categoria: 'Regatas',
    dia: -9,
    foto: '/imagenes/canotaje4.jpg',
    alt: 'Kayaks avanzando juntos sobre el río',
    resumen: 'Ocho eventos de 3600 m sobre el Río Negro; los delegados inscriben a sus botes hasta el cierre.',
    cuerpo: [
      'Quedó abierta la inscripción al Campeonato Nacional Short Race, que se corre en San Gregorio de Polanco, sobre el Río Negro. El programa tiene ocho eventos de 3600 m para distintas categorías y embarcaciones.',
      'Cada delegado inscribe a los botes de su club desde su panel. El sistema avisa si una ficha médica está vencida o si la categoría o el sexo de un deportista no coinciden con los del evento.',
      'La inscripción cierra a las 23:59 del día de cierre que figura en la ficha de la competencia.',
    ],
  }),
  noticia({
    titulo: 'Convocatoria de la selección nacional para el Sudamericano de Velocidad',
    categoria: 'Selección',
    dia: -20,
    foto: '/imagenes/seleccion-equipo.jpg',
    alt: 'Integrantes de la selección nacional de canotaje',
    resumen: 'La Federación publicó el criterio de convocatoria para el Sudamericano de Velocidad.',
    cuerpo: [
      'La Federación Uruguaya de Canotaje dio a conocer los criterios de convocatoria de la selección nacional para el Sudamericano de Velocidad.',
      'La nómina se define a partir del desempeño en las competencias nacionales de la temporada. Los clubes recibirán el detalle de plazos y documentación a través de sus delegados.',
    ],
  }),
  noticia({
    titulo: 'Nuevo ciclo de escuelas de kayak en el Lago Calcagno',
    categoria: 'Escuelas',
    dia: -28,
    foto: '/imagenes/canotaje6.jpg',
    alt: 'Niños y niñas con kayaks en la orilla del lago',
    resumen: 'Empieza un nuevo ciclo de escuelas para quienes se acercan por primera vez al canotaje.',
    cuerpo: [
      'Arranca un nuevo ciclo de escuelas de kayak en el Lago Calcagno, pensado para niñas y niños que se acercan por primera vez al deporte.',
      'Las clases son grupales, con instructores de los clubes y material de seguridad para cada participante. Quienes quieran sumarse pueden consultar en su club o en la Federación.',
      'Las escuelas son la puerta de entrada al Promocional, el campeonato que ordena el ranking de menores.',
    ],
  }),
  noticia({
    titulo: 'Mejoras en la pista de velocidad del Lago Calcagno',
    categoria: 'Federación',
    dia: -35,
    foto: '/imagenes/lago-calcagno.jpg',
    alt: 'Vista del Lago Calcagno y su pista de velocidad',
    resumen: 'La Federación terminó trabajos de balizado y mantenimiento antes del Campeonato Nacional de Velocidad.',
    cuerpo: [
      'La Federación completó trabajos de balizado y mantenimiento en la pista de velocidad del Lago Calcagno, con vistas al Campeonato Nacional de Velocidad.',
      'La pista cuenta con nueve carriles señalizados, que es el máximo que admiten las series del campeonato.',
    ],
  }),
  noticia({
    titulo: 'Así terminó el Campeonato Nacional de Medio Fondo',
    categoria: 'Medio Fondo',
    dia: -38,
    foto: '/imagenes/k4-dorsales.jpg',
    alt: 'Botes de canotaje con deportistas que llevan dorsales',
    resumen: 'Martín Rodríguez y Carolina Pintos ganaron las finales de K1 5000 m senior.',
    cuerpo: [
      'El Campeonato Nacional de Medio Fondo se disputó en el Lago Calcagno con cuatro finales de 5000 m, y todos sus resultados ya están publicados.',
      'En K1 senior masculino ganó Martín Rodríguez, del Club Náutico Montevideo; en senior femenino, Carolina Pintos, de ACAL Náutico Club. En K1 junior masculino se impuso Ignacio Rosas, de Remeros de Colonia.',
      'En K2 junior femenino la victoria fue para Agustina Silva y Florencia Núñez, del Club Náutico Montevideo.',
      'Los puntos de cada final se suman a la tabla del campeonato de Medio Fondo.',
    ],
  }),
  noticia({
    titulo: 'Encuentro de clubes infantiles: fechas y categorías',
    categoria: 'Clubes',
    dia: -60,
    foto: '/imagenes/k2-mixto.jpg',
    alt: 'Dos palistas en un K2 durante un entrenamiento',
    resumen: 'Se definió el calendario del encuentro de clubes infantiles para las categorías de menores.',
    cuerpo: [
      'La Federación definió las fechas y las categorías del encuentro de clubes infantiles, una instancia de formación para las categorías Pre infantil, Infantil y Menor.',
      'Participan los diez clubes afiliados. Cada delegado recibirá la planilla con los horarios por categoría.',
    ],
  }),
  noticia({
    titulo: 'Balance del Promocional: récord de participación de menores',
    categoria: 'Promocional',
    dia: -105,
    foto: '/imagenes/canotaje7.jpg',
    alt: 'Grupo de menores con kayaks antes de una largada',
    resumen: 'Treinta y dos deportistas de los diez clubes corrieron las cuatro finales del Promocional.',
    cuerpo: [
      'El Campeonato Nacional Promocional (Ranking Menores) cerró con la mayor participación de su historia: treinta y dos deportistas de los diez clubes corrieron las cuatro finales de 500 m para las categorías Infantil y Menor.',
      'Los puntos de cada final alimentan el ranking de menores, que se actualiza con cada campeonato de la temporada.',
      'La Federación agradeció a los clubes y a los jueces que hicieron posible la jornada.',
    ],
  }),
];
