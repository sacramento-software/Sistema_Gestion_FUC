import type { CSSProperties, ReactNode } from 'react';
import { cx } from './cx';
import { StatusBadge, type EstadoCompetencia } from './StatusBadge';
import { Time } from './Time';
import estilos from './ResultsTable.module.css';

export interface FilaResultado {
  pos: number | string;
  carril: number;
  nombre: string;
  club: string;
  /** Tiempo ya formateado, o un código (DNS, DNF, DSQ). */
  tiempo: string;
  diferencia?: string;
}

export interface ResultsTableProps {
  titulo?: string;
  estado?: EstadoCompetencia;
  filas?: FilaResultado[];
  /** Solo en finales se marca el podio. */
  final?: boolean;
  compacto?: boolean;
  nota?: ReactNode;
  destacado?: number;
  className?: string;
  style?: CSSProperties;
}

const MEDALLAS = ['var(--medalla-oro)', 'var(--medalla-plata)', 'var(--medalla-bronce)'];

const esCodigo = (valor: string) => /^[A-Z]{3}$/.test(valor);

export function ResultsTable({
  titulo,
  estado,
  filas = [],
  final = false,
  compacto = false,
  nota,
  destacado,
  className,
  style,
}: ResultsTableProps) {
  const medalla = (f: FilaResultado) => (final && /^[123]$/.test(String(f.pos)) ? MEDALLAS[Number(f.pos) - 1] : null);
  const punto = (f: FilaResultado, tamano: number) => {
    const color = medalla(f);
    return color ? (
      <span
        role="img"
        aria-label={`Puesto ${f.pos}`}
        className={estilos.medalla}
        style={{ width: tamano, height: tamano, background: color }}
      />
    ) : null;
  };

  return (
    <section className={cx(estilos.tabla, compacto && estilos.tablaCompacta, className)} style={style}>
      {(titulo || estado) && (
        <div className={cx(estilos.cabecera, compacto && estilos.cabeceraCompacta)}>
          <h3 className={cx(estilos.titulo, compacto && estilos.tituloCompacto)}>{titulo}</h3>
          {estado && <StatusBadge estado={estado} />}
        </div>
      )}
      {!compacto && (
        <div role="row" className={cx(estilos.fila, estilos.encabezado)}>
          <span>Pos</span>
          <span>Carril</span>
          <span>Deportista</span>
          <span>Club</span>
          <span className={estilos.derecha}>Tiempo</span>
        </div>
      )}
      {filas.map((f, i) => {
        const resaltada = destacado != null && f.carril === destacado;
        if (compacto) {
          return (
            <div key={i} role="row" className={cx(estilos.filaCompacta, resaltada && estilos.resaltadaCompacta)}>
              <span className={estilos.posCompacta}>
                {punto(f, 8)}
                {f.pos}
              </span>
              <div className={estilos.persona}>
                <span className={estilos.nombre}>{f.nombre}</span>
                <span className={estilos.detalle}>
                  {f.club} · Carril {f.carril}
                </span>
              </div>
              <Time valor={f.tiempo} tamano="m" apagado={esCodigo(f.tiempo)} />
            </div>
          );
        }
        return (
          <div key={i} role="row" className={cx(estilos.fila, estilos.datos, resaltada && estilos.resaltada)}>
            <span className={estilos.pos}>
              {punto(f, 10)}
              {f.pos}
            </span>
            <span className={estilos.carril}>{f.carril}</span>
            <span className={estilos.nombre}>{f.nombre}</span>
            <span className={estilos.club}>{f.club}</span>
            <span className={estilos.derecha}>
              <Time valor={f.tiempo} diferencia={f.diferencia} tamano="m" apagado={esCodigo(f.tiempo)} />
            </span>
          </div>
        );
      })}
      {nota && <div className={cx(estilos.nota, compacto && estilos.notaCompacta)}>{nota}</div>}
    </section>
  );
}
