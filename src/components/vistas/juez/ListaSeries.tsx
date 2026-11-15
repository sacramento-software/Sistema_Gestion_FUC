import Link from 'next/link';
import { EstadoSerieBadge } from '@/components/ds';
import type { SerieResumen } from '@/datos';
import { rutas } from '@/lib/rutas';
import { Filete } from '@/components/ds';
import { Etiqueta } from './Bloques';
import estilos from './juez.module.css';
import disposicion from './disposicion.module.css';

export function ListaSeries({ series, activaId }: { series: SerieResumen[]; activaId: string }) {
  const publicadas = series.filter((s) => s.estado === 'publicada').length;
  return (
    <section aria-label="Series del día" className={estilos.tarjeta}>
      <Filete />
      <div className={estilos.tarjetaCabecera} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 16 }}>
        <h3 className={estilos.tarjetaTitulo} style={{ fontSize: 20 }}>
          Series del día
        </h3>
        <Etiqueta>
          {publicadas} de {series.length} publicadas
        </Etiqueta>
      </div>
      <ol className={disposicion.listaSeries}>
        {series.map((s) => {
          const activa = s.id === activaId;
          return (
            <li key={s.id}>
              <Link
                href={`${rutas.panel.juez.jornada()}?serie=${encodeURIComponent(s.id)}`}
                aria-current={activa ? 'true' : undefined}
                className={`${disposicion.itemSerie} ${activa ? disposicion.itemActivo : ''}`}
              >
                <span className={disposicion.itemHora}>{s.hora}</span>
                <span className={disposicion.itemTextos}>
                  <span className={disposicion.itemTitulo} style={{ fontWeight: activa ? 700 : 400 }}>
                    {s.titulo}
                  </span>
                  <span className={estilos.subtexto}>{s.categoriaGenero}</span>
                </span>
                <span className={disposicion.itemBadge}>
                  <EstadoSerieBadge estado={s.estado} />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
