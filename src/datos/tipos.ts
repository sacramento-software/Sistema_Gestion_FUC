// Tipos de los registros de datos de demo (sección 6 de la spec 3).

export type FechaISO = string; // 'YYYY-MM-DD'
export type Hora = string; // 'HH:mm'
export type Sexo = 'F' | 'M';
export type Genero = 'F' | 'M' | 'X'; // X = mixto (no hay eventos mixtos en los datos)
export type Embarcacion = 'K1' | 'K2' | 'K4' | 'C1' | 'C2';
export type CategoriaId =
  | 'PRE_INFANTIL'
  | 'INFANTIL'
  | 'MENOR'
  | 'CADETE'
  | 'JUNIOR'
  | 'SUB_21'
  | 'SUB_23'
  | 'SENIOR'
  | 'MASTER_A'
  | 'MASTER_B'
  | 'MASTER_C';
export type TipoCampeonato = 'velocidad' | 'medio-fondo' | 'short-race' | 'promocional';
/** Mismos literales que StatusBadge. */
export type EstadoCompetencia = 'abiertas' | 'cerradas' | 'curso' | 'finalizada';
export type TipoFase = 'eliminatoria' | 'repechaje' | 'semifinal' | 'final';
/** Mismos literales que EstadoSerieBadge. */
export type EstadoSerie = 'armada' | 'en-vivo' | 'terminada' | 'publicada';
export type CodigoResultado = 'DSQ' | 'DNS' | 'DNF';

export interface Club {
  id: string;
  nombre: string;
  sigla: string;
  departamento?: string;
}

export type FichaMedica = { venceEnDias: number } | { enTramite: true };

export interface Deportista {
  id: string;
  nombre: string;
  apellido: string;
  sexo: Sexo;
  /** Edad deportiva hoy (año de hoy menos año de nacimiento). */
  edad: number;
  clubId: string;
  /** venceEnDias menor que 0 significa vencida. */
  fichaMedica: FichaMedica;
}

export interface Delegado {
  id: string;
  nombre: string;
  clubId: string;
  principal: boolean;
}

export interface MiembroEquipo {
  id: string;
  nombre: string;
  rol: string;
}

export interface EventoCatalogo {
  id: string;
  embarcacion: Embarcacion;
  distancia: number;
  categoriaId: CategoriaId;
  genero: Genero;
  activo: boolean;
}

export interface Competencia {
  id: string;
  nombre: string;
  sede: string;
  tipo: TipoCampeonato;
  diaInicio: number;
  diaFin: number;
  cierreInscripcion?: { dia: number; hora: Hora };
  estado: EstadoCompetencia;
  /** Una frase para tarjetas. */
  resumen: string;
}

export interface Evento {
  id: string;
  competenciaId: string;
  catalogoId: string;
}

export interface Fase {
  id: string;
  eventoId: string;
  tipo: TipoFase;
  nombre: 'Eliminatorias' | 'Repechaje' | 'Semifinal' | 'Final';
  orden: number;
  /** Horario previsto de la fase. */
  dia: number;
  hora: Hora;
  /** cantidad por serie; destino: 'la semifinal', 'la final', 'la final A', 'el repechaje'... */
  avance?: { cantidad: number; destino: string };
}

export type Resultado = { tiempoCs: number } | { codigo: CodigoResultado; motivo: string; detalle?: string };

export interface Carril {
  numero: number;
  inscripcionId: string;
  resultado?: Resultado;
}

export interface Serie {
  id: string;
  faseId: string;
  /** 'Eliminatoria 1' | 'Repechaje' | 'Semifinal 1' | 'Final A' */
  nombre: string;
  dia: number;
  hora: Hora;
  estado: EstadoSerie;
  /** Solo en vivo, terminada y publicada. */
  largada?: Hora;
  /** Solo publicada. */
  publicada?: Hora;
  carriles: Carril[];
}

export interface Inscripcion {
  id: string;
  eventoId: string;
  clubId: string;
  /** «Bote N» del club en ese evento. */
  numero: number;
  deportistaIds: string[];
}

export interface Noticia {
  id: string;
  titulo: string;
  categoria: string;
  dia: number;
  foto: string;
  alt: string;
  resumen: string;
  cuerpo: string[];
}
