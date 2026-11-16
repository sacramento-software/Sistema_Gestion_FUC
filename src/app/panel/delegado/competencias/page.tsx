import Link from 'next/link';
import { EncabezadoPanel } from '@/components/cascaras';
import { StatusBadge } from '@/components/ds';
import { Pagina, Tarjeta, TarjetaAbierta } from '@/components/vistas/delegado/Piezas';
import estilos from '@/components/vistas/delegado/delegado.module.css';
import { competenciasAbiertas, listarCompetencias } from '@/datos';
import { rutas } from '@/lib/rutas';
import { requerirRol } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

export default async function CompetenciasDelegadoPage() {
  const usuario = await requerirRol('delegado');
  const clubId = usuario.clubId ?? '';
  const abiertas = competenciasAbiertas();
  const otras = listarCompetencias().filter((c) => c.estado !== 'abiertas');

  return (
    <>
      <EncabezadoPanel titulo="Competencias abiertas" />
      <Pagina>
        {abiertas.length === 0 ? (
          <p className={estilos.parrafo}>No hay competencias con inscripciones abiertas.</p>
        ) : (
          abiertas.map((c) => <TarjetaAbierta key={c.id} competencia={c} clubId={clubId} />)
        )}

        {otras.length > 0 && (
          <Tarjeta etiquetaAria="Otras competencias" titulo="Otras competencias" nivel="h2">
            <ul className={estilos.lista}>
              {otras.map((c) => (
                <li key={c.id}>
                  <Link
                    href={rutas.panel.delegado.competencia(c.id)}
                    className={estilos.itemLista}
                    style={{ minHeight: 56, color: 'inherit', textDecoration: 'none' }}
                  >
                    <span className={estilos.itemTextos}>
                      <span className={estilos.nombre}>{c.nombre}</span>
                      <span className={estilos.subtexto}>
                        {c.sede} · {c.fechas.media}
                      </span>
                    </span>
                    <StatusBadge estado={c.estado} />
                  </Link>
                </li>
              ))}
            </ul>
          </Tarjeta>
        )}
      </Pagina>
    </>
  );
}
