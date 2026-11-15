'use client';

import { Check } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { cx } from './cx';
import { Icon } from './Icon';
import estilos from './Opcion.module.css';

export interface CheckboxProps {
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (marcado: boolean) => void;
  disabled?: boolean;
  hint?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Checkbox({ label, checked, defaultChecked = false, onChange, disabled = false, hint, className, style }: CheckboxProps) {
  return (
    <label className={cx(estilos.opcion, disabled && estilos.deshabilitada, className)} style={style}>
      <input
        type="checkbox"
        className={estilos.nativo}
        checked={checked}
        defaultChecked={checked === undefined ? defaultChecked : undefined}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span aria-hidden="true" className={cx(estilos.marca, estilos.casilla)}>
        <Icon icono={Check} size={16} color="var(--color-accion-texto)" className={estilos.tilde} />
      </span>
      <span className={estilos.textos}>
        <span className={estilos.etiqueta}>{label}</span>
        {hint && <span className={estilos.pista}>{hint}</span>}
      </span>
    </label>
  );
}
