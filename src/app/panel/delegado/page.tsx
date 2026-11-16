import { EncabezadoPanel } from '@/components/cascaras';
import { StatusBadge } from '@/components/ds';
import { ResumenInscripciones } from '@/components/vistas/delegado/Inscripciones';
import { CajaAviso, Enlace, Pagina, Tarjeta, TarjetaAbierta, botesDelClub, textoBotes } from '@/components/vistas/delegado/Piezas';
import estilos from '@/components/vistas/delegado/delegado.module.css';
import { competenciaEnCurso, competenciasAbiertas, listarDeportistas, obtenerClub } from '@/datos';
import { rutas } from '@/lib/rutas';
import { requerirRol } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

export default async function InicioDelegadoPage() {
  const usuario = await requerirRol('delegado');
  const clubId = usuario.clubId ?? '';
  const club = obtenerClub(clubId);
  const abiertas = competenciasAbiertas();
  const vencidos = listarDeportistas({ clubId }).filter((d) => d.ficha === 'vencida');
  const enCurso = competenciaEnCurso();

  return (
    <>
      <EncabezadoPanel titulo="Inicio" subtitulo={club?.nombre ?? 'Mi club'} />
      <Pagina>
        <section aria-label="Competencias abiertas" className={estilos.pagina}>
          <h2 className={estilos.tituloMenor}>Competencias abiertas</h2>
          {abiertas.length === 0 ? (
            <p className={estilos.parrafo}>No hay competencias con inscripciones abiertas.</p>
          ) : (
            abiertas.map((c) => <TarjetaAbierta key={c.id} competencia={c} clubId={clubId} />)
          )}
        </section>

        {vencidos.length > 0 && (
          <CajaAviso>
            <span>
              <strong>
                {vencidos.length === 1
                  ? '1 deportista con la ficha médica vencida.'
                  : `${vencidos.length} deportistas con la ficha médica vencida.`}
              </strong>{' '}
              Podés inscribirlos igual, pero la Federación lo va a ver.
            </span>
            <span>{vencidos.map((d) => d.nombreCompleto).join(', ')}</span>
            <Enlace href={`${rutas.panel.delegado.deportistas()}?ficha=vencida`}>Ver deportistas</Enlace>
          </CajaAviso>
        )}

        <ResumenInscripciones clubId={clubId} />

        {enCurso && (
          <Tarjeta etiquetaAria={`${enCurso.nombre} en curso`}>
            <div className={estilos.cuerpo}>
              <div className={estilos.fila2} style={{ justifyContent: 'space-between' }}>
                <h2 className={estilos.tituloMenor}>{enCurso.nombre} · en curso</h2>
                <StatusBadge estado={enCurso.estado} />
              </div>
              <p className={estilos.parrafo}>
                {textoBotes(botesDelClub(clubId, enCurso.id))} del club en esta competencia.
              </p>
              <div>
                <Enlace href={rutas.competencia(enCurso.id)}>Seguir en el sitio público</Enlace>
              </div>
            </div>
          </Tarjeta>
        )}
      </Pagina>
    </>
  );
}
