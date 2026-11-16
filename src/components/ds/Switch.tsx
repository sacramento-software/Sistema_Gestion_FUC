'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from './cx';
import estilos from './Switch.module.css';

export interface SwitchProps {
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (activo: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Switch({ label, checked, defaultChecked = false, onChange, disabled = false, className, style }: SwitchProps) {
  const [interno, setInterno] = useState(defaultChecked);
  const activo = checked !== undefined ? checked : interno;

  const alternar = () => {
    if (disabled) return;
    if (checked === undefined) setInterno(!activo);
    onChange?.(!activo);
  };

  return (
    <label className={cx(estilos.fila, disabled && estilos.deshabilitado, className)} style={style}>
      <span className={estilos.etiqueta}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={activo}
        disabled={disabled}
        onClick={alternar}
        className={cx(estilos.pista, activo && estilos.activo)}
      >
        <span className={estilos.perilla} />
      </button>
    </label>
  );
}
