import type { Metadata } from 'next';
import Link from 'next/link';
import { Contenedor } from '@/components/cascaras';
import { CategoryTag, StatusBadge, Tabs } from '@/components/ds';
import { EncabezadoPagina } from '@/components/vistas/publico-resto/EncabezadoPagina';
import { FilaChips } from '@/components/vistas/publico-resto/FilaChips';
import { armarUrl, primero } from '@/components/vistas/publico-resto/url';
import { campeonatos, obtenerCompetencia, tablaCampeonato, type CampeonatoVista, type FilaCampeonato } from '@/datos';
import { anioTemporada } from '@/dominio';
import { rutas } from '@/lib/rutas';
import comunes from '@/components/vistas/publico-resto/Paginas.module.css';
import estilos from './rankings.module.css';

export const metadata: Metadata = { title: 'Rankings' };

const ESTADO_CAMPEONATO: Record<CampeonatoVista['estado'], { estado: 'curso' | 'finalizada' | 'cerradas'; texto: string }> = {
  'en-curso': { estado: 'curso', texto: 'En curso' },
  finalizado: { estado: 'finalizada', texto: 'Finalizado' },
  proximo: { estado: 'cerradas', texto: 'Próximo' },
};

const COLOR_MEDALLA = ['var(--medalla-oro)', 'var(--medalla-plata)', 'var(--medalla-bronce)'];

function Tabla({ filas, conClub }: { filas: FilaCampeonato[]; conClub: boolean }) {
  return (
    <div className={estilos.tabla} role="table" aria-label={conClub ? 'Ranking de deportistas' : 'Ranking de clubes'}>
      <div role="row" className={`${estilos.fila} ${estilos.encabezado} ${conClub ? '' : estilos.sinClub}`}>
        <span role="columnheader">Pos</span>
        <span role="columnheader">{conClub ? 'Deportista' : 'Club'}</span>
        {conClub && (
          <span role="columnheader" className={estilos.soloEscritorio}>
            Club
          </span>
        )}
        <span role="columnheader" className={estilos.derecha}>
          Finales
        </span>
        <span role="columnheader" className={estilos.derecha}>
          Puntos
        </span>
      </div>
      {filas.map((f) => (
        <div key={f.id} role="row" className={`${estilos.fila} ${conClub ? '' : estilos.sinClub}`}>
          <span role="cell" className={estilos.pos}>
            {f.posicion <= 3 && (
              <span
                role="img"
                aria-label={`Puesto ${f.posicion}`}
                className={estilos.medalla}
                style={{ background: COLOR_MEDALLA[f.posicion - 1] }}
              />
            )}
            {f.posicion}
          </span>
          <span role="cell" className={estilos.persona}>
            {conClub ? (
              <Link href={rutas.deportista(f.id)} className={estilos.enlace}>
                {f.nombre}
              </Link>
            ) : (
              <span className={estilos.nombre}>{f.nombre}</span>
            )}
            {conClub && <span className={`${estilos.detalle} ${estilos.soloCelular}`}>{f.club}</span>}
          </span>
          {conClub && (
            <span role="cell" className={`${estilos.club} ${estilos.soloEscritorio}`}>
              {f.club}
            </span>
          )}
          <span role="cell" className={`${estilos.numero} ${estilos.derecha}`}>
            {f.finales}
          </span>
          <span role="cell" className={`${estilos.numero} ${estilos.derecha} ${estilos.puntos}`}>
            {f.puntos}
          </span>
        </div>
      ))}
    </div>
  );
}

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const consulta = await searchParams;
  const todos = campeonatos();
  const porDefecto = todos.find((c) => c.grupos.length > 0) ?? todos[0];
  const campeonato = todos.find((c) => c.tipo === primero(consulta.campeonato)) ?? porDefecto;
  const vista = primero(consulta.vista) === 'clubes' ? 'clubes' : 'deportistas';
  const grupo = campeonato.grupos.find((g) => g.filtro === primero(consulta.grupo)) ?? campeonato.grupos[0];

  const tabla = tablaCampeonato(campeonato.tipo, grupo?.filtro);
  const empezo = campeonato.grupos.length > 0;
  const primeraFecha = obtenerCompetencia(campeonato.competenciaIds[0])?.fechas.larga;

  const url = (params: { campeonato?: string; vista?: string; grupo?: string }) =>
    armarUrl(rutas.rankings(), {
      campeonato: params.campeonato === porDefecto.tipo ? undefined : params.campeonato,
      vista: params.vista === 'clubes' ? 'clubes' : undefined,
      grupo: params.grupo,
    });

  return (
    <Contenedor ancho="amplio" as="main" className={comunes.pagina}>
      <EncabezadoPagina
        titulo="Rankings"
        bajada={`Puntos acumulados en las finales de cada campeonato de la temporada ${anioTemporada()}.`}
      />

      <FilaChips etiqueta="Campeonato">
        {todos.map((c) => {
          const e = ESTADO_CAMPEONATO[c.estado];
          const activo = c.tipo === campeonato.tipo;
          return (
            <Link
              key={c.tipo}
              href={url({ campeonato: c.tipo, vista })}
              aria-current={activo ? 'true' : undefined}
              className={`${estilos.campeonato} ${activo ? estilos.campeonatoActivo : ''}`}
            >
              <span className={estilos.campeonatoNombre}>{c.nombre}</span>
              <StatusBadge estado={e.estado}>{e.texto}</StatusBadge>
            </Link>
          );
        })}
      </FilaChips>

      {!empezo ? (
        <div className={comunes.vacio}>
          <p>
            Este campeonato todavía no empezó.
            {primeraFecha ? ` La primera fecha es el ${primeraFecha}.` : ''}
          </p>
        </div>
      ) : (
        <>
          <Tabs
            className={estilos.pestanas}
            value={vista}
            items={[
              { id: 'deportistas', label: 'Deportistas', href: url({ campeonato: campeonato.tipo, grupo: grupo?.filtro }) },
              { id: 'clubes', label: 'Clubes', href: url({ campeonato: campeonato.tipo, vista: 'clubes' }) },
            ]}
          />

          {vista === 'deportistas' && (
            <div className={comunes.filtros}>
              <FilaChips etiqueta="Grupo">
                {campeonato.grupos.map((g) => (
                  <CategoryTag
                    key={g.filtro}
                    href={url({ campeonato: campeonato.tipo, vista, grupo: g.filtro })}
                    seleccionado={g.filtro === grupo?.filtro}
                  >
                    {g.grupo}
                  </CategoryTag>
                ))}
              </FilaChips>
            </div>
          )}

          <Tabla filas={vista === 'deportistas' ? tabla.deportistas : tabla.clubes} conClub={vista === 'deportistas'} />

          <p className={estilos.nota}>
            Solo las finales dan puntos: 10-8-6-5-4-3-2-1. En K2 y K4, los puntos del bote cuentan para cada integrante
            y una sola vez para el club.
          </p>
        </>
      )}
    </Contenedor>
  );
}
