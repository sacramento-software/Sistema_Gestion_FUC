'use client';

import { useId, type ChangeEventHandler, type CSSProperties } from 'react';
import { cx } from './cx';
import estilos from './Input.module.css';

export interface InputProps {
  label?: string;
  hint?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  mono?: boolean;
  type?: string;
  id?: string;
  disabled?: boolean;
  /** Muestra el valor como un campo normal, sin editar y sin aspecto de deshabilitado. */
  soloLectura?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Input({
  label,
  hint,
  error,
  value,
  defaultValue,
  placeholder,
  onChange,
  mono = false,
  type = 'text',
  id,
  disabled = false,
  soloLectura = false,
  className,
  style,
}: InputProps) {
  const auto = useId();
  const iid = id || auto;
  const ayudaId = `${iid}-ayuda`;
  // Un campo controlado sin onChange pide readOnly para no quejarse React.
  const sinEditar = soloLectura || (value !== undefined && !onChange);
  return (
    <div className={cx(estilos.campo, className)} style={style}>
      {label && (
        <label htmlFor={iid} className={estilos.etiqueta}>
          {label}
        </label>
      )}
      <input
        id={iid}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        readOnly={sinEditar || undefined}
        aria-readonly={soloLectura || undefined}
        aria-invalid={!!error}
        aria-describedby={error || hint ? ayudaId : undefined}
        className={cx(estilos.entrada, mono && estilos.mono, error && estilos.conError)}
      />
      {(error || hint) && (
        <span id={ayudaId} className={cx(estilos.ayuda, error && estilos.ayudaError)}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
