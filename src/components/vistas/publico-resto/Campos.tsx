import { ChevronDown } from 'lucide-react';
import { Icon } from '@/components/ds';
import estilos from './Campos.module.css';

/**
 * Campos nativos con `name`, para formularios GET. Los `Input` y `Select` del DS no reciben `name`
 * (contrato congelado), así que acá se repite su aspecto con los mismos tokens.
 */
export function CampoTexto({
  nombre,
  etiqueta,
  valor,
  placeholder,
}: {
  nombre: string;
  etiqueta: string;
  valor?: string;
  placeholder?: string;
}) {
  const id = `campo-${nombre}`;
  return (
    <div className={estilos.campo}>
      <label htmlFor={id} className={estilos.etiqueta}>
        {etiqueta}
      </label>
      <input
        id={id}
        name={nombre}
        type="search"
        defaultValue={valor}
        placeholder={placeholder}
        autoComplete="off"
        className={estilos.control}
      />
    </div>
  );
}

export function CampoSelect({
  nombre,
  etiqueta,
  valor,
  opciones,
}: {
  nombre: string;
  etiqueta: string;
  valor?: string;
  opciones: { value: string; label: string }[];
}) {
  const id = `campo-${nombre}`;
  return (
    <div className={estilos.campo}>
      <label htmlFor={id} className={estilos.etiqueta}>
        {etiqueta}
      </label>
      <div className={estilos.envoltorio}>
        <select id={id} name={nombre} defaultValue={valor ?? ''} className={`${estilos.control} ${estilos.select}`}>
          {opciones.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon icono={ChevronDown} size={20} color="var(--color-texto-sec)" className={estilos.chevron} />
      </div>
    </div>
  );
}
