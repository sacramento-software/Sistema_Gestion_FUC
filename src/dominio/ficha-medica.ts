import type { FichaMedica } from '@/datos/tipos';

export type EstadoFicha = 'vigente' | 'vencida' | 'en-tramite';

export const TEXTO_FICHA: Record<EstadoFicha, string> = {
  vigente: 'Vigente',
  vencida: 'Vencida',
  'en-tramite': 'En trámite',
};

export function estadoFicha(ficha: FichaMedica): EstadoFicha {
  if ('enTramite' in ficha) return 'en-tramite';
  return ficha.venceEnDias < 0 ? 'vencida' : 'vigente';
}
