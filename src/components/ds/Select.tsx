'use client';

import { ChevronDown } from 'lucide-react';
import { useId, type ChangeEventHandler, type CSSProperties } from 'react';
import { cx } from './cx';
import { Icon } from './Icon';
import estilos from './Select.module.css';

type Opcion = string | { value: string; label: string };

export interface SelectProps {
  label?: string;
  options?: Opcion[];
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  placeholder?: string;
  hint?: string;
  error?: string;
  id?: string;
  disabled?: boolean;
  /** Muestra la opción elegida como campo, sin poder abrirlo. */
  soloLectura?: boolean;
  className?: string;
  style?: CSSProperties;
}

const valorDe = (o: Opcion) => (typeof o === 'string' ? o : o.value);
const textoDe = (o: Opcion) => (typeof o === 'string' ? o : o.label);

export function Select({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder,
  hint,
  error,
  id,
  disabled = false,
  soloLectura = false,
  className,
  style,
}: SelectProps) {
  const auto = useId();
  const iid = id || auto;
  const ayudaId = `${iid}-ayuda`;
  const elegido = options.find((o) => valorDe(o) === (value ?? defaultValue));

  return (
    <div className={cx(estilos.campo, className)} style={style}>
      {label && (
        <label htmlFor={iid} className={estilos.etiqueta}>
          {label}
        </label>
      )}
      <div className={estilos.envoltorio}>
        {soloLectura ? (
          <input
            id={iid}
            type="text"
            readOnly
            aria-readonly="true"
            value={elegido ? textoDe(elegido) : ''}
            placeholder={placeholder}
            aria-describedby={error || hint ? ayudaId : undefined}
            className={cx(estilos.control, error && estilos.conError)}
          />
        ) : (
          <select
            id={iid}
            value={value}
            defaultValue={value === undefined ? (defaultValue ?? '') : undefined}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error || hint ? ayudaId : undefined}
            className={cx(estilos.control, error && estilos.conError)}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((o) => (
              <option key={valorDe(o)} value={valorDe(o)}>
                {textoDe(o)}
              </option>
            ))}
          </select>
        )}
        <Icon icono={ChevronDown} size={20} color="var(--color-texto-sec)" className={estilos.chevron} />
      </div>
      {(error || hint) && (
        <span id={ayudaId} className={cx(estilos.ayuda, error && estilos.ayudaError)}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
