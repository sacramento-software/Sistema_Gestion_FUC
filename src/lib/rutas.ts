/** Todas las URLs internas salen de acá. Ninguna spec escribe una URL a mano. */
const enc = encodeURIComponent;

export const rutas = {
  inicio: () => '/',
  ingresar: () => '/ingresar',
  salir: () => '/salir',
  competencias: () => '/competencias',
  competencia: (competenciaId: string) => `/competencias/${enc(competenciaId)}`,
  evento: (competenciaId: string, eventoId: string) =>
    `/competencias/${enc(competenciaId)}/eventos/${enc(eventoId)}`,
  serie: (competenciaId: string, serieId: string) =>
    `/competencias/${enc(competenciaId)}/series/${enc(serieId)}`,
  enVivo: () => '/en-vivo',
  deportistas: () => '/deportistas',
  deportista: (deportistaId: string) => `/deportistas/${enc(deportistaId)}`,
  rankings: () => '/rankings',
  noticias: () => '/noticias',
  noticia: (noticiaId: string) => `/noticias/${enc(noticiaId)}`,
  panel: {
    federacion: {
      tablero: () => '/panel/federacion',
      competencias: () => '/panel/federacion/competencias',
      competencia: (competenciaId: string) => `/panel/federacion/competencias/${enc(competenciaId)}`,
      catalogo: () => '/panel/federacion/catalogo',
      clubes: () => '/panel/federacion/clubes',
      jueces: () => '/panel/federacion/jueces',
      configuracion: () => '/panel/federacion/configuracion',
      contabilidad: () => '/panel/federacion/contabilidad',
      estadisticas: () => '/panel/federacion/estadisticas',
    },
    delegado: {
      inicio: () => '/panel/delegado',
      competencias: () => '/panel/delegado/competencias',
      competencia: (competenciaId: string) => `/panel/delegado/competencias/${enc(competenciaId)}`,
      deportistas: () => '/panel/delegado/deportistas',
      inscripciones: () => '/panel/delegado/inscripciones',
    },
    juez: {
      jornada: () => '/panel/juez',
      armado: () => '/panel/juez/armado',
      resultados: () => '/panel/juez/resultados',
    },
  },
} as const;
