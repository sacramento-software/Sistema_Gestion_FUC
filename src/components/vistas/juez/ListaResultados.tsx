import Link from 'next/link';
import { CircleCheck, ExternalLink, Hourglass } from 'lucide-react';
import { EstadoSerieBadge, Filete, Icon } from '@/components/ds';
import type { SerieDetalle } from '@/datos';
import { rutas } from '@/lib/rutas';
import estilos from './juez.module.css';
import disposicion from './disposicion.module.css';

function resumenDe(serie: SerieDetalle): string {
  const filas = serie.resultados ?? [];
  if (serie.estado === 'publicada') {
    return filas
      .filter((f) => f.posicion !== null)
      .slice(0, 3)
      .map((f) => `${f.posicion}. ${f.bote.nombre}`)
      .join(' · ');
  }
  return `${filas.filter((f) => f.tiempo).length} llegaron`;
}

function Grupo({ titulo, series, tono }: { titulo: string; series: SerieDetalle[]; tono: 'revision' | 'publicada' }) {
  if (series.length === 0) return null;
  return (
    <section aria-label={titulo} className={`${estilos.tarjeta} ${tono === 'revision' ? disposicion.grupoRevision : disposicion.grupoPublicada}`}>
      <Filete />
      <div className={`${estilos.tarjetaCabecera} ${disposicion.grupoCabecera}`}>
        <span className={disposicion.grupoIcono}>
          <Icon icono={tono === 'revision' ? Hourglass : CircleCheck} size={22} />
        </span>
        <h3 className={disposicion.grupoTitulo}>{titulo}</h3>
        <span className={disposicion.grupoCuenta}>
          {series.length} {series.length === 1 ? 'serie' : 'series'}
        </span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {series.map((s) => (
          <li key={s.id} className={disposicion.itemResultado}>
            <Link href={`${rutas.panel.juez.jornada()}?serie=${encodeURIComponent(s.id)}`} className={disposicion.itemResultadoLink}>
              <span className={estilos.mono} style={{ fontWeight: 600, fontSize: 15 }}>
                {s.hora}
              </span>
              <span className={estilos.nombreDoble} style={{ flex: '1 1 200px' }}>
                <span className={estilos.nombre}>{s.titulo}</span>
                <span className={estilos.subtexto}>{s.categoriaGenero}</span>
                <span className={estilos.subtexto}>{resumenDe(s)}</span>
              </span>
              <EstadoSerieBadge estado={s.estado} />
            </Link>
            {s.estado === 'publicada' && (
              <Link href={rutas.serie(s.competenciaId, s.id)} className={estilos.enlaceAccion}>
                Ver en el sitio público
                <Icon icono={ExternalLink} size={16} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ListaResultados({ series }: { series: SerieDetalle[] }) {
  const enRevision = series.filter((s) => s.estado === 'terminada');
  const publicadas = series.filter((s) => s.estado === 'publicada');
  if (series.length === 0) {
    return <div className={estilos.tarjeta} style={{ padding: '16px 20px' }}>Todavía no hay series terminadas hoy.</div>;
  }
  return (
    <div className={estilos.pagina}>
      <Grupo titulo="En revisión" series={enRevision} tono="revision" />
      <Grupo titulo="Publicadas" series={publicadas} tono="publicada" />
    </div>
  );
}
