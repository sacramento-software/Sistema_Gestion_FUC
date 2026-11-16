import Image from 'next/image';
import type { CSSProperties, MouseEventHandler } from 'react';
import { Button } from './Button';
import { CategoryTag } from './CategoryTag';
import { cx } from './cx';
import { Filete } from './Filete';
import { StatusBadge, type EstadoCompetencia } from './StatusBadge';
import estilos from './CompetitionCard.module.css';

const CTA: Record<EstadoCompetencia, string> = {
  abiertas: 'Inscribir club',
  cerradas: 'Ver inscriptos',
  curso: 'Ver series en vivo',
  finalizada: 'Ver resultados',
};

export interface CompetitionCardProps {
  nombre: string;
  /** Si falta un dato, no se muestra. */
  fecha?: string;
  sede?: string;
  disciplina?: string;
  estado?: EstadoCompetencia;
  categorias?: string[];
  cierre?: string;
  ctaLabel?: string;
  onCta?: () => void;
  onClick?: MouseEventHandler<HTMLElement>;
  /** Ruta de una imagen local, ej. `/imagenes/canotaje5.jpg`. */
  imagen?: string;
  /** Si viene, el botón de acción es un enlace. */
  href?: string;
  className?: string;
  style?: CSSProperties;
}

export function CompetitionCard({
  nombre,
  fecha,
  sede = 'Lago Calcagno, Ciudad de la Costa',
  disciplina = 'Velocidad',
  estado = 'abiertas',
  categorias = ['K1', 'K2', 'K4', 'C1', 'C2'],
  cierre,
  ctaLabel,
  onCta,
  onClick,
  imagen,
  href,
  className,
  style,
}: CompetitionCardProps) {
  return (
    <article className={cx(estilos.tarjeta, onClick && estilos.clicable, className)} style={style} onClick={onClick}>
      {imagen && (
        <div className={estilos.imagen}>
          <Image src={imagen} alt="" fill sizes="(max-width: 640px) 100vw, 400px" className={estilos.foto} />
        </div>
      )}
      <Filete />
      <div className={estilos.cuerpo}>
        <div className={estilos.fila}>
          <StatusBadge estado={estado} />
          <span className={estilos.disciplina}>{disciplina}</span>
        </div>
        <h3 className={estilos.nombre}>{nombre}</h3>
        {(fecha || sede) && (
          <div className={estilos.datos}>
            {fecha && <span>{fecha}</span>}
            {sede && <span>{sede}</span>}
          </div>
        )}
        {categorias.length > 0 && (
          <div className={estilos.categorias}>
            {categorias.map((c) => (
              <CategoryTag key={c}>{c}</CategoryTag>
            ))}
          </div>
        )}
        {cierre && (
          <div className={estilos.cierre}>
            <span>Cierre de inscripción</span>
            <span className={estilos.cierreValor}>{cierre}</span>
          </div>
        )}
        <div className={estilos.accion}>
          <Button
            fullWidth
            variant={estado === 'abiertas' || estado === 'curso' ? 'primario' : 'secundario'}
            href={href}
            onClick={
              onCta
                ? (e) => {
                    e.stopPropagation();
                    onCta();
                  }
                : undefined
            }
          >
            {ctaLabel || CTA[estado]}
          </Button>
        </div>
      </div>
    </article>
  );
}
