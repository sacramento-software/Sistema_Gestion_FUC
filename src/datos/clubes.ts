import type { Club } from './tipos';

/** ACAL Náutico Club es el único dato real: no se inventa ningún dato institucional suyo. */
export const clubes: Club[] = [
  { id: 'acal-nautico-club', nombre: 'ACAL Náutico Club', sigla: 'ACAL' },
  { id: 'club-nautico-montevideo', nombre: 'Club Náutico Montevideo', sigla: 'CNM', departamento: 'Montevideo' },
  { id: 'remeros-de-colonia', nombre: 'Remeros de Colonia', sigla: 'RCO', departamento: 'Colonia' },
  { id: 'club-remeros-salto', nombre: 'Club Remeros Salto', sigla: 'CRS', departamento: 'Salto' },
  { id: 'canoas-del-plata', nombre: 'Canoas del Plata', sigla: 'CDP', departamento: 'Canelones' },
  { id: 'club-kayak-maldonado', nombre: 'Club Kayak Maldonado', sigla: 'CKM', departamento: 'Maldonado' },
  { id: 'club-nautico-paysandu', nombre: 'Club Náutico Paysandú', sigla: 'CNP', departamento: 'Paysandú' },
  { id: 'club-nautico-santa-lucia', nombre: 'Club Náutico Santa Lucía', sigla: 'CNSL', departamento: 'Canelones' },
  { id: 'club-nautico-mercedes', nombre: 'Club Náutico Mercedes', sigla: 'CNME', departamento: 'Soriano' },
  { id: 'kayak-club-rocha', nombre: 'Kayak Club Rocha', sigla: 'KCR', departamento: 'Rocha' },
];

/** Id del club a partir de su sigla. */
export function clubPorSigla(sigla: string): string {
  const club = clubes.find((c) => c.sigla === sigla);
  if (!club) throw new Error(`Club inexistente: ${sigla}`);
  return club.id;
}
