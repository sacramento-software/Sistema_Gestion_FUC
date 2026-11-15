import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { PuntoEnVivo } from '@/components/ds/PuntoEnVivo';
import type { SerieDetalle } from '@/datos';
import { rutas } from '@/lib/rutas';
import estilos from './TarjetaEnVivo.module.css';

/** Tarjeta «EN VIVO» de la home y de la competencia. */
export function TarjetaEnVivo({ serie, conCompetencia = false }: { serie: SerieDetalle; conCompetencia?: boolean }) {
  return (
    <section aria-label="Serie en vivo" className={estilos.tarjeta}>
      <span className={estilos.marca}>
        <PuntoEnVivo tamano={14} />
        <span className={estilos.enVivo}>EN VIVO</span>
      </span>
      <div className={estilos.cuerpo}>
        <span className={estilos.titulo}>{serie.titulo}</span>
        <span className={estilos.detalle}>
          {serie.categoriaGenero} · <span className={estilos.mono}>{serie.horaTexto}</span>
          {serie.largada && (
            <>
              {' '}
              · largó a las <span className={estilos.mono}>{serie.largada} h</span>
            </>
          )}
        </span>
        {conCompetencia && (
          <span className={estilos.detalle}>
            {serie.competencia.nombre} · {serie.competencia.sede}
          </span>
        )}
      </div>
      <Button iconRight={ArrowRight} href={rutas.serie(serie.competenciaId, serie.id)} className={estilos.boton}>
        Seguir en vivo
      </Button>
    </section>
  );
}
