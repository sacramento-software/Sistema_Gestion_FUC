import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Icon } from '@/components/ds/Icon';
import estilos from './BarraGestion.module.css';

export interface FiltroBarra {
  /** Nombre del parámetro de la URL. */
  nombre: string;
  etiqueta: string;
  opciones: { value: string; label: string }[];
  actual?: string;
}

export interface BarraGestionProps {
  /** Ruta a la que se envía el formulario (GET). */
  accion: string;
  placeholder: string;
  q?: string;
  filtro?: FiltroBarra;
  /** Parámetros de la URL que se conservan al buscar. */
  conservar?: Record<string, string | undefined>;
  /** Botón de alta (componente de acción no disponible): va al final de la misma línea. */
  alta?: ReactNode;
}

/** Línea de herramientas de una lista de gestión: buscador, filtro y botón de agregar. Funciona sin JavaScript. */
export function BarraGestion({ accion, placeholder, q, filtro, conservar, alta }: BarraGestionProps) {
  return (
    <div className={estilos.barra}>
      <form method="get" action={accion} role="search" className={estilos.formulario}>
        <label className={estilos.campo}>
          <span className={estilos.icono}>
            <Icon icono={Search} size={18} />
          </span>
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder={placeholder}
            aria-label={placeholder}
            className={estilos.entrada}
          />
        </label>
        {filtro && (
          <select name={filtro.nombre} defaultValue={filtro.actual ?? ''} aria-label={filtro.etiqueta} className={estilos.selector}>
            <option value="">{filtro.etiqueta}</option>
            {filtro.opciones.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
        {Object.entries(conservar ?? {}).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
        <Button type="submit" variant="secundario">
          Buscar
        </Button>
      </form>
      {alta && <div className={estilos.alta}>{alta}</div>}
    </div>
  );
}
