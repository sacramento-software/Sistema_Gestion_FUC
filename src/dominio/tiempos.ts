import type { CodigoResultado } from '@/datos/tipos';

const dos = (n: number) => String(n).padStart(2, '0');

/** Centésimas a `m:ss.cc` desde el minuto, `ss.cc` por debajo (sin «0:»). */
export function formatearTiempo(cs: number): string {
  const minutos = Math.floor(cs / 6000);
  const segundos = Math.floor((cs % 6000) / 100);
  const centesimas = cs % 100;
  if (minutos === 0) return `${segundos}.${dos(centesimas)}`;
  return `${minutos}:${dos(segundos)}.${dos(centesimas)}`;
}

/** Diferencia con el primero: «+0.78», «+1:02.10». Cero o negativa: `null`. */
export function formatearDiferencia(cs: number): string | null {
  if (cs <= 0) return null;
  return `+${formatearTiempo(cs)}`;
}

/** Inversa de `formatearTiempo`: «1:41.27» da 10127 y «38.92» da 3892. */
export function parsearTiempo(texto: string): number {
  const coincide = /^(?:(\d+):(\d{2})|(\d{1,2}))\.(\d{2})$/.exec(texto);
  if (!coincide) throw new Error(`Tiempo inválido: ${texto}`);
  const [, minutos, segundosConMinutos, segundosSolos, centesimas] = coincide;
  const segundos = Number(segundosConMinutos ?? segundosSolos);
  return Number(minutos ?? 0) * 6000 + segundos * 100 + Number(centesimas);
}

export const SIGNIFICADO_CODIGO: Record<CodigoResultado, string> = {
  DSQ: 'descalificado',
  DNS: 'no largó',
  DNF: 'no terminó',
};

const ORDEN_CODIGOS: CodigoResultado[] = ['DSQ', 'DNS', 'DNF'];

/** «DSQ: descalificado · DNS: no largó». Cada código aparece una sola vez. */
export function leyendaCodigos(codigos: CodigoResultado[]): string {
  return ORDEN_CODIGOS.filter((c) => codigos.includes(c))
    .map((c) => `${c}: ${SIGNIFICADO_CODIGO[c]}`)
    .join(' · ');
}
