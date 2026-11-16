// Datos propios de la spec 8 (contabilidad y estadísticas de la Federación). Lo que se puede calcular con los
// datos de la demo (botes, deportistas, series) no está acá: se calcula en las vistas.

/** Arancel por bote inscripto, en pesos uruguayos. */
export const ARANCEL_POR_BOTE = 400;

export interface CuotaClub {
  clubId: string;
  /** Cuota anual a la Federación, en pesos. */
  monto: number;
  /** Con `alDia`, `dias` es el desfase (negativo) del pago; si no, el desfase del vencimiento (negativo = vencida). */
  alDia: boolean;
  dias: number;
}

/** Diez clubes: ACAL y otros seis al día; tres pendientes (uno ya vencido). */
export const cuotasClubes: CuotaClub[] = [
  { clubId: 'acal-nautico-club', monto: 18000, alDia: true, dias: -62 },
  { clubId: 'club-nautico-montevideo', monto: 18000, alDia: true, dias: -75 },
  { clubId: 'remeros-de-colonia', monto: 12000, alDia: true, dias: -48 },
  { clubId: 'club-remeros-salto', monto: 12000, alDia: false, dias: -9 },
  { clubId: 'canoas-del-plata', monto: 15000, alDia: true, dias: -33 },
  { clubId: 'club-kayak-maldonado', monto: 12000, alDia: true, dias: -21 },
  { clubId: 'club-nautico-paysandu', monto: 12000, alDia: false, dias: 6 },
  { clubId: 'club-nautico-santa-lucia', monto: 9000, alDia: true, dias: -40 },
  { clubId: 'club-nautico-mercedes', monto: 9000, alDia: true, dias: -17 },
  { clubId: 'kayak-club-rocha', monto: 9000, alDia: false, dias: 14 },
];

/** Botes inscriptos en las cuatro temporadas anteriores, de la más vieja a la más reciente. */
export const botesTemporadasAnteriores: number[] = [58, 79, 104, 131];
