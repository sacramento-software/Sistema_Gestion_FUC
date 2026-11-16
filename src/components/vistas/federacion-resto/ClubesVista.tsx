import Link from 'next/link';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { AccionNoDisponible } from '@/components/demo';
import {
  inscripcionesDeClub,
  listarDeportistas,
  obtenerCompetencia,
  type ClubVista,
  type EstadoFichaVista,
} from '@/datos';
import { rutas } from '@/lib/rutas';
import { Chip, Etiqueta, Metrica, Tarjeta } from './Bloques';
import { cantidadDe } from './formato';
import estilos from './federacion-resto.module.css';

const TONO_FICHA: Record<EstadoFichaVista, 'exito' | 'peligro' | 'info'> = {
  vigente: 'exito',
  vencida: 'peligro',
  'en-tramite': 'info',
};

export function ListaClubes({ clubes, activoId }: { clubes: ClubVista[]; activoId: string }) {
  return (
    <Tarjeta titulo="Clubes" meta={String(clubes.length)}>
      <nav aria-label="Clubes afiliados">
        <ul className={estilos.lista}>
          {clubes.map((club) => {
            const activo = club.id === activoId;
            return (
              <li key={club.id}>
                <Link
                  href={`${rutas.panel.federacion.clubes()}?club=${encodeURIComponent(club.id)}`}
                  aria-current={activo ? 'page' : undefined}
                  className={`${estilos.itemLista} ${activo ? estilos.itemListaActivo : ''}`}
                >
                  <span className={estilos.itemNombre}>
                    {club.nombre} · {club.sigla}
                  </span>
                  <span className={estilos.itemMeta}>
                    {club.departamento ? `${club.departamento} · ` : ''}
                    {cantidadDe(club.cantidadDeportistas, 'deportista', 'deportistas')}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </Tarjeta>
  );
}

function Inscripciones({ clubId }: { clubId: string }) {
  const grupos = inscripcionesDeClub(clubId);
  const porCompetencia = new Map<string, typeof grupos>();
  for (const grupo of grupos) {
    const lista = porCompetencia.get(grupo.evento.competenciaId) ?? [];
    lista.push(grupo);
    porCompetencia.set(grupo.evento.competenciaId, lista);
  }
  return (
    <Tarjeta titulo="Inscripciones" meta={cantidadDe(grupos.reduce((n, g) => n + g.botes.length, 0), 'bote', 'botes')}>
      {porCompetencia.size === 0 && <p className={estilos.sinDatos}>El club todavía no inscribió botes.</p>}
      {[...porCompetencia.entries()].map(([competenciaId, eventos]) => (
        <div key={competenciaId} className={estilos.grupoInscripcion}>
          <h4>{obtenerCompetencia(competenciaId)?.nombre ?? competenciaId}</h4>
          <ul className={estilos.botes}>
            {eventos.map(({ evento, botes }) => (
              <li key={evento.id}>
                <strong>{evento.lectura}</strong>
                {' · '}
                {botes.map((b) => b.nombreCorto).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Tarjeta>
  );
}

function Plantel({ clubId }: { clubId: string }) {
  const plantel = listarDeportistas({ clubId });
  return (
    <Tarjeta titulo="Deportistas" meta={String(plantel.length)}>
      <ul className={estilos.lista}>
        {plantel.map((d) => (
          <li key={d.id} className={estilos.fila}>
            <span className={estilos.filaTexto}>
              <span className={estilos.filaNombre}>{d.nombreCompleto}</span>
              <span className={estilos.itemMeta}>
                {d.categoriaTexto} · {d.sexoTexto}
              </span>
            </span>
            <Chip tono={TONO_FICHA[d.ficha]}>{d.fichaTexto}</Chip>
          </li>
        ))}
      </ul>
    </Tarjeta>
  );
}

export function DetalleClub({ club, plantel }: { club: ClubVista; plantel: boolean }) {
  const base = `${rutas.panel.federacion.clubes()}?club=${encodeURIComponent(club.id)}`;
  return (
    <div className={estilos.detalle}>
      <div className={estilos.clubTitulo}>
        <h2 className={estilos.clubNombre}>{club.nombre}</h2>
        <Etiqueta>
          {club.sigla}
          {club.departamento ? ` · ${club.departamento}` : ''}
        </Etiqueta>
      </div>

      <div className={`${estilos.metricas} ${estilos.metricas3}`}>
        <Metrica etiqueta="Deportistas" valor={club.cantidadDeportistas} />
        <Metrica etiqueta="Delegados" valor={club.delegados.length} />
        <Metrica etiqueta="Fichas médicas vencidas" valor={club.fichasVencidas} />
      </div>

      <Tarjeta titulo="Delegados">
        <ul className={estilos.lista}>
          {club.delegados.map((d) => (
            <li key={d.id} className={estilos.fila}>
              <span className={estilos.filaTexto}>
                <span className={estilos.filaNombre}>{d.nombre}</span>
                {d.principal && <Chip tono="info">Principal</Chip>}
              </span>
              <AccionNoDisponible variant="icono" icon={Trash2} label={`Quitar a ${d.nombre}`} />
            </li>
          ))}
        </ul>
        <div className={estilos.pie}>
          <AccionNoDisponible variant="secundario" icon={UserPlus}>
            Agregar delegado
          </AccionNoDisponible>
        </div>
      </Tarjeta>

      <Inscripciones clubId={club.id} />

      <div className={estilos.acciones}>
        <AccionNoDisponible variant="secundario" icon={Pencil}>
          Editar club
        </AccionNoDisponible>
        {plantel ? (
          <Link href={base} className={estilos.enlace}>
            Ocultar deportistas
          </Link>
        ) : (
          <Link href={`${base}&plantel=1`} className={estilos.enlace}>
            Ver deportistas
          </Link>
        )}
      </div>

      {plantel && <Plantel clubId={club.id} />}
    </div>
  );
}
