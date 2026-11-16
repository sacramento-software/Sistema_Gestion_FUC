import type { FechaISO, Hora } from '@/datos/tipos';

export const ZONA = 'America/Montevideo';

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const MS_DIA = 86_400_000;

interface PartesFecha {
  anio: number;
  mes: number;
  dia: number;
}

function partes(fecha: FechaISO): PartesFecha {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return { anio, mes, dia };
}

function utc(fecha: FechaISO): number {
  const { anio, mes, dia } = partes(fecha);
  return Date.UTC(anio, mes - 1, dia);
}

/** Fecha civil de `ahora` en Montevideo. En el servidor (UTC) no se puede usar la fecha local. */
export function hoyISO(ahora: Date = new Date()): FechaISO {
  const piezas = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(ahora);
  const valor = (tipo: string) => piezas.find((p) => p.type === tipo)?.value ?? '';
  return `${valor('year')}-${valor('month')}-${valor('day')}`;
}

/** Primer día que puede mostrar la demo como «hoy»: el Nacional de Velocidad se ve el 21 y 22 de noviembre. */
export const HOY_DEMO_MINIMO: FechaISO = '2026-11-21';

/** «Hoy» de la demo: la fecha real, pero nunca antes de `HOY_DEMO_MINIMO`. */
export function hoyDemoISO(ahora: Date = new Date()): FechaISO {
  const real = hoyISO(ahora);
  return real < HOY_DEMO_MINIMO ? HOY_DEMO_MINIMO : real;
}

export function sumarDias(fecha: FechaISO, n: number): FechaISO {
  return new Date(utc(fecha) + n * MS_DIA).toISOString().slice(0, 10);
}

export function fechaRelativa(desfase: number, hoy: FechaISO = hoyDemoISO()): FechaISO {
  return sumarDias(hoy, desfase);
}

export function diasEntre(desde: FechaISO, hasta: FechaISO): number {
  return Math.round((utc(hasta) - utc(desde)) / MS_DIA);
}

export function anioTemporada(hoy: FechaISO = hoyDemoISO()): number {
  return partes(hoy).anio;
}

export type FormatoFecha = 'larga' | 'dia' | 'dia-corto' | 'media' | 'mes-anio';

function mayuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function formatearFecha(fecha: FechaISO, formato: FormatoFecha): string {
  const { anio, mes, dia } = partes(fecha);
  const semana = new Date(utc(fecha)).getUTCDay();
  switch (formato) {
    case 'larga':
      return `${DIAS[semana]} ${dia} de ${MESES[mes - 1]} de ${anio}`;
    case 'dia':
      return `${mayuscula(DIAS[semana])} ${dia} de ${MESES[mes - 1]}`;
    case 'dia-corto':
      return `${DIAS_CORTOS[semana]} ${dia}`;
    case 'media':
      return `${dia} ${MESES_CORTOS[mes - 1]} ${anio}`;
    case 'mes-anio':
      return `${MESES_CORTOS[mes - 1]} ${anio}`;
  }
}

export type FormatoRango = 'larga' | 'media' | 'corta';

/** «15 y 16 de noviembre de 2026» | «15 y 16 nov 2026» | «15 y 16 nov». */
export function formatearRango(desde: FechaISO, hasta: FechaISO, formato: FormatoRango): string {
  const a = partes(desde);
  const b = partes(hasta);
  const de = formato === 'larga' ? ' de ' : ' ';
  const mesTexto = (mes: number) => (formato === 'larga' ? MESES[mes - 1] : MESES_CORTOS[mes - 1]);
  const anioTexto = (anio: number) => (formato === 'larga' ? ` de ${anio}` : formato === 'media' ? ` ${anio}` : '');
  const completa = (p: PartesFecha, mostrarAnio: boolean) =>
    `${p.dia}${de}${mesTexto(p.mes)}${mostrarAnio ? anioTexto(p.anio) : ''}`;

  if (desde === hasta) return completa(a, true);
  const union = diasEntre(desde, hasta) === 1 ? 'y' : 'al';
  if (a.anio !== b.anio) return `${completa(a, true)} ${union} ${completa(b, true)}`;
  if (a.mes !== b.mes) return `${completa(a, false)} ${union} ${completa(b, true)}`;
  return `${a.dia} ${union} ${b.dia}${de}${mesTexto(b.mes)}${anioTexto(b.anio)}`;
}

export function formatearHora(hora: Hora): string {
  return `${hora} h`;
}

/** «Cierra en 3 días · 18 de noviembre, 23:59», «Cierra mañana · …», «Cierra hoy · 23:59», «Cerró el 18 de noviembre». */
export function textoCierre(fecha: FechaISO, hora: Hora, hoy: FechaISO = hoyDemoISO()): string {
  const { dia, mes } = partes(fecha);
  const diaTexto = `${dia} de ${MESES[mes - 1]}`;
  const faltan = diasEntre(hoy, fecha);
  if (faltan < 0) return `Cerró el ${diaTexto}`;
  if (faltan === 0) return `Cierra hoy · ${hora}`;
  if (faltan === 1) return `Cierra mañana · ${diaTexto}, ${hora}`;
  return `Cierra en ${faltan} días · ${diaTexto}, ${hora}`;
}

/** «10:40» más 1 minuto es «10:41». */
export function sumarMinutos(hora: Hora, minutos: number): Hora {
  const [h, m] = hora.split(':').map(Number);
  const total = h * 60 + m + minutos;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}
