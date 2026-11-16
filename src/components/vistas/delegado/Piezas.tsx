import Link from 'next/link';
import type { ReactNode } from 'react';
import { Timer, TriangleAlert } from 'lucide-react';
import { Button, Filete, Icon, StatusBadge } from '@/components/ds';
import { inscripcionesDeClub, type CompetenciaVista, type EstadoFichaVista } from '@/datos';
import { rutas } from '@/lib/rutas';
import estilos from './delegado.module.css';

export function Etiqueta({ children }: { children: ReactNode }) {
  return <span className={estilos.etiqueta}>{children}</span>;
}

export function Pagina({ children }: { children: ReactNode }) {
  return <div className={estilos.pagina}>{children}</div>;
}

const CLASE_FICHA: Record<EstadoFichaVista, string> = {
  vigente: estilos.chipVigente,
  vencida: estilos.chipVencida,
  'en-tramite': estilos.chipTramite,
};
const TEXTO_FICHA: Record<EstadoFichaVista, string> = {
  vigente: 'Vigente',
  vencida: 'Vencida',
  'en-tramite': 'En trámite',
};

export function ChipFicha({ ficha }: { ficha: EstadoFichaVista }) {
  return <span className={`${estilos.chip} ${CLASE_FICHA[ficha]}`}>{TEXTO_FICHA[ficha]}</span>;
}

/** Tarjeta con filete doble y, si hay título, su cabecera. */
export function Tarjeta({
  etiquetaAria,
  titulo,
  meta,
  nivel = 'h3',
  children,
}: {
  etiquetaAria: string;
  titulo?: string;
  meta?: ReactNode;
  nivel?: 'h2' | 'h3' | 'h4';
  children: ReactNode;
}) {
  const Titulo = nivel;
  return (
    <section aria-label={etiquetaAria} className={estilos.tarjeta}>
      <Filete />
      {titulo && (
        <div className={estilos.cabecera}>
          <Titulo className={estilos.tituloMenor}>{titulo}</Titulo>
          {meta && <Etiqueta>{meta}</Etiqueta>}
        </div>
      )}
      {children}
    </section>
  );
}

/** Caja de aviso que no bloquea: ícono de alerta y texto. */
export function CajaAviso({ children }: { children: ReactNode }) {
  return (
    <div className={estilos.aviso}>
      <span className={estilos.avisoIcono}>
        <Icon icono={TriangleAlert} size={20} />
      </span>
      <div className={estilos.avisoTextos}>{children}</div>
    </div>
  );
}

export function textoBotes(n: number): string {
  return n === 1 ? '1 bote' : `${n} botes`;
}

/** Cantidad de botes que el club inscribió en una competencia. */
export function botesDelClub(clubId: string, competenciaId: string): number {
  return inscripcionesDeClub(clubId, competenciaId).reduce((suma, g) => suma + g.botes.length, 0);
}

/** Tarjeta de una competencia con inscripciones abiertas (D1 y «Competencias abiertas»). */
export function TarjetaAbierta({ competencia, clubId }: { competencia: CompetenciaVista; clubId: string }) {
  const botes = botesDelClub(clubId, competencia.id);
  return (
    <Tarjeta etiquetaAria={competencia.nombre}>
      <div className={estilos.cuerpo}>
        <div className={estilos.fila2} style={{ justifyContent: 'space-between' }}>
          <div className={estilos.itemTextos}>
            <h3 className={estilos.titulo}>{competencia.nombre}</h3>
            <span className={estilos.subtexto}>
              {competencia.sede} · {competencia.fechas.media}
            </span>
          </div>
          <StatusBadge estado={competencia.estado} />
        </div>
        {competencia.cierre && (
          <div className={estilos.cuenta}>
            <Icon icono={Timer} size={22} />
            <span>{competencia.cierre.texto}</span>
          </div>
        )}
        <p className={estilos.parrafo}>
          {botes === 1 ? '1 bote inscripto' : `${botes} botes inscriptos`} por el club
        </p>
        <div>
          <Button href={rutas.panel.delegado.competencia(competencia.id)}>Inscribir en un evento</Button>
        </div>
      </div>
    </Tarjeta>
  );
}

/** Enlace de texto con zona táctil de 48 px. */
export function Enlace({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={estilos.enlace}>
      {children}
    </Link>
  );
}
