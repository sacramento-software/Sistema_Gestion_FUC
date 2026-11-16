import Link from 'next/link';
import { ChevronRight, Timer } from 'lucide-react';
import { Icon, StatusBadge } from '@/components/ds';
import {
  competenciaEnCurso,
  competenciasAbiertas,
  eventosDeCompetencia,
  inscripcionesDeEvento,
  jornadaDeHoy,
  listarCompetencias,
  serieEnVivo,
  type CompetenciaVista,
} from '@/datos';
import { rutas } from '@/lib/rutas';
import { armarUrl, Barra, BandaEnVivo, Etiqueta, Tarjeta } from './Bloques';
import estilos from './federacion.module.css';

/** Deportistas distintos y clubes con inscripciones en una competencia (calculado con los datos, nunca a mano). */
function participantes(competenciaId: string): { deportistas: number; clubes: number } {
  const deportistas = new Set<string>();
  const clubes = new Set<string>();
  for (const evento of eventosDeCompetencia(competenciaId)) {
    for (const bote of inscripcionesDeEvento(evento.id)) {
      clubes.add(bote.clubId);
      for (const d of bote.deportistas) deportistas.add(d.id);
    }
  }
  return { deportistas: deportistas.size, clubes: clubes.size };
}

function Metrica({ rotulo, valor, unidad }: { rotulo: string; valor: string; unidad?: string }) {
  return (
    <div className={estilos.metrica}>
      <Etiqueta>{rotulo}</Etiqueta>
      <span className={estilos.metricaValor}>{valor}</span>
      {unidad && <span className={estilos.metricaUnidad}>{unidad}</span>}
    </div>
  );
}

function InscripcionesPorCerrar({ competencia }: { competencia: CompetenciaVista }) {
  const eventos = eventosDeCompetencia(competencia.id);
  const maximo = Math.max(1, ...eventos.map((e) => e.botesInscriptos));
  return (
    <>
      <div className={estilos.tarjetaCuerpo}>
        <span className={estilos.filaTitulo}>{competencia.nombre}</span>
        {competencia.cierre && (
          <span className={estilos.cierre}>
            <Icon icono={Timer} size={20} />
            {competencia.cierre.texto}
          </span>
        )}
        <span className={estilos.subtexto}>
          {competencia.botesInscriptos} botes de {competencia.clubesInscriptos} clubes
        </span>
        <ul className={estilos.barras} aria-label={`Botes inscriptos por evento en ${competencia.nombre}`}>
          {eventos.map((e) => (
            <li key={e.id} className={estilos.barraFila}>
              <span className={estilos.barraTexto}>{e.lectura}</span>
              <Barra valor={e.botesInscriptos} total={maximo} />
              <span className={estilos.mono} style={{ textAlign: 'right' }}>
                {e.botesInscriptos}
              </span>
            </li>
          ))}
        </ul>
        <Link
          href={armarUrl(rutas.panel.federacion.competencia(competencia.id), { pestana: 'inscripciones' })}
          className={estilos.enlace}
        >
          Ver inscripciones
        </Link>
      </div>
    </>
  );
}

export function Tablero() {
  const enCurso = competenciaEnCurso();
  const vivo = serieEnVivo();
  const jornada = jornadaDeHoy();
  const publicadas = jornada.filter((s) => s.estado === 'publicada').length;
  const abiertas = competenciasAbiertas();
  const gente = enCurso ? participantes(enCurso.id) : { deportistas: 0, clubes: 0 };
  const botesAbiertos = abiertas.reduce((suma, c) => suma + c.botesInscriptos, 0);
  const todas = listarCompetencias();

  return (
    <div className={estilos.pagina}>
      {enCurso && vivo && (
        <BandaEnVivo
          serie={vivo}
          competenciaNombre={enCurso.nombre}
          enlaces={
            <>
              <Link href={rutas.serie(vivo.competenciaId, vivo.id)} className={estilos.enlace}>
                Ver en el sitio público
              </Link>
              <Link href={rutas.panel.federacion.competencia(enCurso.id)} className={estilos.enlace}>
                Ver programa
              </Link>
            </>
          }
        />
      )}

      <div className={estilos.metricas}>
        {enCurso ? (
          <Metrica rotulo="Series de hoy" valor={`${publicadas} de ${jornada.length}`} unidad="publicadas" />
        ) : (
          <Metrica rotulo="Series de hoy" valor="0" unidad="Hoy no hay regatas." />
        )}
        <Metrica rotulo="Deportistas en competencia" valor={String(gente.deportistas)} />
        <Metrica rotulo="Clubes participantes" valor={String(gente.clubes)} />
        <Metrica rotulo="Inscripciones abiertas" valor={String(botesAbiertos)} unidad="botes inscriptos" />
      </div>

      <div className={estilos.columnas}>
        <Tarjeta etiquetaAria="Inscripciones por cerrar" titulo="Inscripciones por cerrar">
          {abiertas.length === 0 ? (
            <p className={estilos.vacio}>No hay inscripciones abiertas.</p>
          ) : (
            abiertas.map((c) => <InscripcionesPorCerrar key={c.id} competencia={c} />)
          )}
        </Tarjeta>

        <Tarjeta etiquetaAria="Competencias" titulo="Competencias" meta={`${todas.length} en la temporada`}>
          <ul className={estilos.lista}>
            {todas.map((c) => (
              <li key={c.id}>
                <Link href={rutas.panel.federacion.competencia(c.id)} className={estilos.filaEnlace}>
                  <span className={estilos.filaTextos}>
                    <span className={estilos.filaTitulo}>{c.nombre}</span>
                    <span className={estilos.subtexto}>
                      {c.fechas.media} · {c.sede}
                    </span>
                    <span>
                      <StatusBadge estado={c.estado} />
                    </span>
                  </span>
                  <Icon icono={ChevronRight} size={20} className={estilos.chevron} />
                </Link>
              </li>
            ))}
          </ul>
        </Tarjeta>
      </div>
    </div>
  );
}
