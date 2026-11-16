'use client';

import type { CSSProperties, ReactNode } from 'react';
import { cx } from './cx';
import estilos from './Opcion.module.css';

export interface RadioProps {
  label: ReactNode;
  name?: string;
  value?: string;
  checked?: boolean;
  onChange?: (valor: string | undefined) => void;
  disabled?: boolean;
  hint?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Radio({ label, name, value, checked, onChange, disabled = false, hint, className, style }: RadioProps) {
  return (
    <label className={cx(estilos.opcion, disabled && estilos.deshabilitada, className)} style={style}>
      <input
        type="radio"
        className={estilos.nativo}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange?.(value)}
      />
      <span aria-hidden="true" className={cx(estilos.marca, estilos.circulo)}>
        <span className={estilos.punto} />
      </span>
      <span className={estilos.textos}>
        <span className={estilos.etiqueta}>{label}</span>
        {hint && <span className={estilos.pista}>{hint}</span>}
      </span>
    </label>
  );
}
