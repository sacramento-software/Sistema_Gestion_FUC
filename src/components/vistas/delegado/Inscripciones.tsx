import { Button, StatusBadge } from '@/components/ds';
import { inscripcionesDeClub, listarCompetencias, type CompetenciaVista } from '@/datos';
import { rutas } from '@/lib/rutas';
import { Enlace, Etiqueta, Tarjeta, textoBotes } from './Piezas';
import estilos from './delegado.module.css';

const ORDEN_ESTADO = { abiertas: 0, cerradas: 1, curso: 2, finalizada: 3 } as const;

/** Competencias en las que el club tiene inscripciones: abiertas primero, después en curso y finalizadas. */
export function competenciasConInscripciones(clubId: string) {
  return listarCompetencias()
    .map((competencia) => ({ competencia, grupos: inscripcionesDeClub(clubId, competencia.id) }))
    .filter((c) => c.grupos.length > 0)
    .sort((a, b) => ORDEN_ESTADO[a.competencia.estado] - ORDEN_ESTADO[b.competencia.estado]);
}

function totalBotes(grupos: { botes: unknown[] }[]): number {
  return grupos.reduce((suma, g) => suma + g.botes.length, 0);
}

function textoEventos(n: number): string {
  return n === 1 ? '1 evento' : `${n} eventos`;
}

/** Resumen de D1: por competencia, cuántos botes y eventos inscribió el club. */
export function ResumenInscripciones({ clubId }: { clubId: string }) {
  const filas = competenciasConInscripciones(clubId);
  return (
    <Tarjeta etiquetaAria="Mis inscripciones" titulo="Mis inscripciones" nivel="h2">
      {filas.length === 0 ? (
        <p className={estilos.vacio}>El club todavía no tiene inscripciones.</p>
      ) : (
        <ul className={estilos.lista}>
          {filas.map(({ competencia, grupos }) => (
            <li key={competencia.id} className={estilos.itemLista}>
              <div className={estilos.itemTextos}>
                <span className={estilos.nombre}>{competencia.nombre}</span>
                <span className={estilos.subtexto}>
                  {textoBotes(totalBotes(grupos))} · {textoEventos(grupos.length)}
                </span>
              </div>
              <StatusBadge estado={competencia.estado} />
            </li>
          ))}
        </ul>
      )}
      {filas.length > 0 && (
        <div style={{ padding: '0 20px' }}>
          <Enlace href={rutas.panel.delegado.inscripciones()}>Ver inscripciones</Enlace>
        </div>
      )}
    </Tarjeta>
  );
}

function AccionCompetencia({ competencia }: { competencia: CompetenciaVista }) {
  if (competencia.estado === 'abiertas') {
    return <Button href={rutas.panel.delegado.competencia(competencia.id)}>Inscribir en un evento</Button>;
  }
  if (competencia.estado === 'curso') {
    return (
      <Button variant="secundario" href={rutas.competencia(competencia.id)}>
        Seguir en el sitio público
      </Button>
    );
  }
  return null;
}

/** Página «Mis inscripciones»: por competencia, sus eventos y los botes del club como unidad. */
export function ListaInscripciones({ clubId }: { clubId: string }) {
  const filas = competenciasConInscripciones(clubId);
  if (filas.length === 0) {
    return <p className={estilos.parrafo}>El club todavía no tiene inscripciones.</p>;
  }
  return (
    <>
      {filas.map(({ competencia, grupos }) => (
        <Tarjeta key={competencia.id} etiquetaAria={competencia.nombre}>
          <div className={estilos.cuerpo}>
            <div className={estilos.fila2} style={{ justifyContent: 'space-between' }}>
              <div className={estilos.itemTextos}>
                <h2 className={estilos.titulo}>{competencia.nombre}</h2>
                <span className={estilos.subtexto}>{competencia.fechas.media}</span>
              </div>
              <StatusBadge estado={competencia.estado} />
            </div>
            <AccionCompetencia competencia={competencia} />
          </div>
          <ul className={estilos.lista}>
            {grupos.map(({ evento, botes }) => (
              <li key={evento.id} className={estilos.itemLista} style={{ alignItems: 'flex-start' }}>
                <span className={estilos.nombre}>{evento.lectura}</span>
                <div className={estilos.itemTextos} style={{ flex: '1 1 260px' }}>
                  {botes.map((bote) => (
                    <span key={bote.inscripcionId} className={estilos.parrafo}>
                      <Etiqueta>Bote {bote.numero}</Etiqueta> {bote.nombre}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Tarjeta>
      ))}
    </>
  );
}
