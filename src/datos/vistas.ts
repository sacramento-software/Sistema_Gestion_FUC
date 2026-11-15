// Tipos de lo que devuelven las consultas (sección 10.1 de la spec 3). Las vistas pintan esto sin calcular nada.
import type { Categoria } from '@/dominio/categorias';
import type {
  CategoriaId,
  CodigoResultado,
  Embarcacion,
  EstadoCompetencia,
  EstadoSerie,
  FechaISO,
  Genero,
  Hora,
  Sexo,
  TipoCampeonato,
  TipoFase,
} from './tipos';

export type EstadoFichaVista = 'vigente' | 'vencida' | 'en-tramite';
export type MedallaVista = 'oro' | 'plata' | 'bronce' | null;

export interface CompetenciaVista {
  id: string;
  nombre: string;
  sede: string;
  tipo: TipoCampeonato;
  /** «Velocidad», «Medio Fondo»... */
  tipoTexto: string;
  estado: EstadoCompetencia;
  fechaInicio: FechaISO;
  fechaFin: FechaISO;
  /** '15 y 16 de noviembre de 2026' | '15 y 16 nov 2026' | '15 y 16 nov' */
  fechas: { larga: string; media: string; corta: string };
  cierre?: { fecha: FechaISO; hora: Hora; texto: string; diasRestantes: number };
  resumen: string;
  embarcaciones: Embarcacion[];
  cantidadEventos: number;
  botesInscriptos: number;
  clubesInscriptos: number;
}

export interface BoteVista {
  inscripcionId: string;
  /** «Bote N» del club en ese evento. */
  numero: number;
  clubId: string;
  clubNombre: string;
  clubSigla: string;
  deportistas: {
    id: string;
    nombreCompleto: string;
    categoriaTexto: string;
    sexo: Sexo;
    ficha: EstadoFichaVista;
  }[];
  /** «Valentina Ríos y Camila Suárez». */
  nombre: string;
  /** «Ríos / Suárez» (K1: el nombre completo). */
  nombreCorto: string;
  embarcacion: Embarcacion;
}

export interface EventoVista {
  id: string;
  competenciaId: string;
  /** 'K2-500-JUNIOR-F' */
  codigo: string;
  /** 'K2 500 m · Junior · Femenino' */
  lectura: string;
  embarcacion: Embarcacion;
  distancia: number;
  categoriaId: CategoriaId;
  categoriaTexto: string;
  genero: Genero;
  generoTexto: string;
  /** 'Junior · Femenino' */
  categoriaGenero: string;
  /** Slug para filtros: 'junior-f'. */
  filtroCategoria: string;
  botesInscriptos: number;
  clubesInscriptos: number;
  /** finalizado = su Final A publicada. */
  estado: 'programado' | 'en-vivo' | 'finalizado';
  fases: FaseVista[];
}

export interface FaseVista {
  id: string;
  tipo: TipoFase;
  nombre: string;
  fecha: FechaISO;
  hora: Hora;
  horaTexto: string;
  avanceTexto?: string;
  /** Prevista = sin series todavía. */
  prevista: boolean;
  series: SerieResumen[];
}

export interface SerieResumen {
  id: string;
  competenciaId: string;
  eventoId: string;
  faseId: string;
  nombre: string;
  /** 'Semifinal 1 · K1 500 m' */
  titulo: string;
  categoriaGenero: string;
  fecha: FechaISO;
  hora: Hora;
  horaTexto: string;
  estado: EstadoSerie;
  esFinal: boolean;
  cantidadCarriles: number;
}

export interface FilaResultado {
  posicion: number | null;
  carril: number;
  bote: BoteVista;
  /** '1:42.05' */
  tiempo: string | null;
  /** '+0.78' */
  diferencia: string | null;
  codigo?: CodigoResultado;
  motivo?: string;
  detalle?: string;
  puntos: number | null;
  medalla: MedallaVista;
  clasificado: boolean;
}

export interface SerieDetalle extends SerieResumen {
  competencia: CompetenciaVista;
  evento: Omit<EventoVista, 'fases'>;
  /** avanceDestino: 'la final', 'la semifinal'... (para «Avanza a la final»). */
  fase: { tipo: TipoFase; nombre: string; avanceTexto?: string; avanceDestino?: string };
  /** Para PhaseTrack. */
  fasesDelEvento: string[];
  indiceFase: number;
  largada?: Hora;
  publicada?: Hora;
  carriles: {
    numero: number;
    bote: BoteVista;
    tiempo?: string;
    codigo?: CodigoResultado;
    motivo?: string;
    detalle?: string;
  }[];
  tiemposCargados: number;
  /** `null` salvo en terminada y publicada. */
  resultados: FilaResultado[] | null;
  /** 'DSQ: descalificado. Diferencias respecto del primero.' */
  leyenda: string | null;
}

export interface DeportistaVista {
  id: string;
  nombreCompleto: string;
  nombre: string;
  apellido: string;
  sexo: Sexo;
  sexoTexto: string;
  edad: number;
  clubId: string;
  clubNombre: string;
  categoriaId: CategoriaId;
  categoriaTexto: string;
  ficha: EstadoFichaVista;
  fichaTexto: string;
  fichaVence?: FechaISO;
}

export interface FichaDeportista {
  deportista: DeportistaVista;
  embarcaciones: Embarcacion[];
  tripulaciones: { eventoLectura: string; companeros: { id: string; nombreCompleto: string }[] }[];
  /** 'K1 500 m' · '1:41.27' · 'Eliminatoria 2 · Campeonato Nacional de Velocidad · 15 nov 2026' */
  mejoresTiempos: {
    etiqueta: string;
    tiempo: string;
    contexto: string;
    serieId: string;
    competenciaId: string;
  }[];
  /** Hasta 5, de la más reciente a la más vieja. */
  ultimasCarreras: {
    serieId: string;
    competenciaId: string;
    titulo: string;
    competenciaNombre: string;
    fechaTexto: string;
    posicion: number | null;
    tiempo: string | null;
    codigo?: CodigoResultado;
    medalla: MedallaVista;
    esFinal: boolean;
  }[];
  campeonatos: {
    tipo: TipoCampeonato;
    nombre: string;
    estado: 'finalizado' | 'en-curso' | 'proximo';
    fechasTexto: string;
    posicion: number | null;
    puntos: number | null;
    grupo: string | null;
  }[];
}

export interface FilaCampeonato {
  posicion: number;
  id: string;
  nombre: string;
  club?: string;
  puntos: number;
  finales: number;
  primeros: number;
}

export interface ClubVista {
  id: string;
  nombre: string;
  sigla: string;
  departamento?: string;
  delegados: { id: string; nombre: string; principal: boolean }[];
  cantidadDeportistas: number;
  fichasVencidas: number;
}

export interface CatalogoVista {
  id: string;
  codigo: string;
  lectura: string;
  embarcacion: Embarcacion;
  distancia: number;
  categoriaId: CategoriaId;
  categoriaTexto: string;
  genero: Genero;
  generoTexto: string;
  activo: boolean;
  usos: number;
}

export interface NoticiaVista {
  id: string;
  titulo: string;
  categoria: string;
  fecha: FechaISO;
  fechaTexto: string;
  foto: string;
  alt: string;
  resumen: string;
  cuerpo: string[];
}

export interface ItemPrograma {
  fecha: FechaISO;
  hora: Hora;
  horaTexto: string;
  eventoId: string;
  eventoLectura: string;
  filtroCategoria: string;
  fase: string;
  /** 'Eliminatoria 1 · K1 500 m' o, si está prevista, 'Final · K2 500 m'. */
  titulo: string;
  categoriaGenero: string;
  estado: EstadoSerie | 'prevista';
  serieId?: string;
}

export interface DiaPrograma {
  fecha: FechaISO;
  /** 'Sábado 15 de noviembre' */
  titulo: string;
  /** 'Sáb 15' */
  tituloCorto: string;
  items: ItemPrograma[];
}

export interface ArmadoDeFase {
  evento: Omit<EventoVista, 'fases'>;
  fase: FaseVista;
  fasesDelEvento: FaseVista[];
  series: SerieDetalle[];
  /** Inscriptos sin carril en esta fase (vacío si todos tienen). */
  disponibles: { clubId: string; clubNombre: string; botes: BoteVista[] }[];
  /** En fases posteriores: todos, con la marca. */
  inscriptos: { bote: BoteVista; clasificado: boolean; serieId?: string; carril?: number }[];
  botesConCarril: number;
  botesTotales: number;
}

export interface CampeonatoVista {
  tipo: TipoCampeonato;
  nombre: string;
  estado: 'finalizado' | 'en-curso' | 'proximo';
  competenciaIds: string[];
  grupos: { grupo: string; filtro: string }[];
}

export interface ConfiguracionFederacion {
  categorias: Categoria[];
  tablaPuntos: number[];
  avancePorDefecto: { cantidad: 3; texto: string };
  cierreAutomatico: string;
}
