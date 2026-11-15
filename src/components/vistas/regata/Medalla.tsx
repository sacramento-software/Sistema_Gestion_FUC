import type { MedallaVista } from '@/datos';
import { cx } from '@/components/ds/cx';
import base from './base.module.css';

/** Punto de medalla (solo finales). */
export function Medalla({ medalla }: { medalla: MedallaVista }) {
  if (!medalla) return null;
  return <span aria-hidden="true" className={cx(base.medalla, base[medalla])} />;
}
