import Link from 'next/link';
import { FileUp, Pencil, Search, UserPlus } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { Button } from '@/components/ds';
import { AccionNoDisponible } from '@/components/demo';
import { CajaAviso, ChipFicha, Pagina, Tarjeta } from '@/components/vistas/delegado/Piezas';
import estilos from '@/components/vistas/delegado/delegado.module.css';
import { listarDeportistas, obtenerClub, type DeportistaVista } from '@/datos';
import { formatearFecha } from '@/dominio/fechas';
import { rutas } from '@/lib/rutas';
import { requerirRol } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const FILTROS = [
  { id: 'todas', texto: 'Todas' },
  { id: 'vigente', texto: 'Vigente' },
  { id: 'vencida', texto: 'Vencida' },
  { id: 'en-tramite', texto: 'En trámite' },
] as const;
type FiltroFicha = (typeof FILTROS)[number]['id'];

function primero(valor: string | string[] | undefined): string {
  return (Array.isArray(valor) ? valor[0] : valor) ?? '';
}

function urlFiltro(ficha: FiltroFicha, q: string): string {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (ficha !== 'todas') params.set('ficha', ficha);
  const texto = params.toString();
  return texto ? `${rutas.panel.delegado.deportistas()}?${texto}` : rutas.panel.delegado.deportistas();
}

function textoVence(d: DeportistaVista): string | null {
  if (!d.fichaVence) return null;
  const fecha = formatearFecha(d.fichaVence, 'media');
  return d.ficha === 'vencida' ? `venció ${fecha}` : `vence ${fecha}`;
}

function Fila({ d }: { d: DeportistaVista }) {
  const vence = textoVence(d);
  return (
    <li className={`${estilos.filaDeportista} ${d.ficha === 'vencida' ? estilos.filaVencida : ''}`}>
      <span className={estilos.nombre}>{d.nombreCompleto}</span>
      <span className={estilos.celdaMeta}>
        <span>{d.categoriaTexto}</span>
        <span>{d.sexoTexto}</span>
        <span>{d.edad} años</span>
      </span>
      <span className={estilos.fila2} style={{ gap: 8 }}>
        <ChipFicha ficha={d.ficha} />
        {vence && <span className={estilos.subtexto}>{vence}</span>}
      </span>
      <span className={estilos.celdaAccion}>
        <AccionNoDisponible variant="icono" icon={Pencil} label={`Editar a ${d.nombreCompleto}`} />
      </span>
    </li>
  );
}

export default async function DeportistasDelegadoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; ficha?: string | string[] }>;
}) {
  const usuario = await requerirRol('delegado');
  const clubId = usuario.clubId ?? '';
  const parametros = await searchParams;
  const q = primero(parametros.q).trim();
  const fichaPedida = primero(parametros.ficha);
  const ficha: FiltroFicha = FILTROS.some((f) => f.id === fichaPedida) ? (fichaPedida as FiltroFicha) : 'todas';

  const club = obtenerClub(clubId);
  const plantel = listarDeportistas({ clubId });
  const vencidos = plantel.filter((d) => d.ficha === 'vencida').length;
  const lista = listarDeportistas({ clubId, texto: q || undefined }).filter(
    (d) => ficha === 'todas' || d.ficha === ficha,
  );

  return (
    <>
      <EncabezadoPanel
        titulo="Mis deportistas"
        subtitulo={`${club?.nombre ?? 'Mi club'} · ${plantel.length} deportistas`}
        acciones={
          <>
            <AccionNoDisponible icon={UserPlus}>Agregar deportista</AccionNoDisponible>
            <AccionNoDisponible variant="secundario" icon={FileUp}>
              Importar planilla
            </AccionNoDisponible>
          </>
        }
      />
      <Pagina>
        {vencidos > 0 && ficha === 'todas' && !q && (
          <CajaAviso>
            <span>
              <strong>
                {vencidos === 1 ? '1 deportista con la ficha médica vencida.' : `${vencidos} deportistas con la ficha médica vencida.`}
              </strong>{' '}
              Pedile a cada uno que la renueve antes del cierre de inscripciones.
            </span>
          </CajaAviso>
        )}

        <div className={estilos.filtros}>
          <form method="get" action={rutas.panel.delegado.deportistas()} className={estilos.buscador} role="search">
            <div className={estilos.campoBusqueda}>
              <label htmlFor="buscar-deportista" className={estilos.etiquetaCampo}>
                Buscar por nombre
              </label>
              <input
                id="buscar-deportista"
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Nombre o apellido"
                className={estilos.campo}
              />
            </div>
            <Button type="submit" variant="secundario" icon={Search}>
              Buscar
            </Button>
            {ficha !== 'todas' && <input type="hidden" name="ficha" value={ficha} />}
          </form>
          <nav aria-label="Filtrar por ficha médica" className={estilos.chipsFiltro}>
            {FILTROS.map((f) => (
              <Link
                key={f.id}
                href={urlFiltro(f.id, q)}
                aria-current={f.id === ficha ? 'true' : undefined}
                className={`${estilos.chipFiltro} ${f.id === ficha ? estilos.chipFiltroActivo : ''}`}
              >
                {f.id === 'todas' ? 'Ficha: todas' : f.texto}
              </Link>
            ))}
          </nav>
        </div>

        <Tarjeta etiquetaAria="Deportistas del club">
          {lista.length === 0 ? (
            <div className={estilos.cuerpo}>
              <p className={estilos.parrafo}>
                {q ? `No encontramos deportistas con «${q}».` : 'No hay deportistas con ese filtro.'}
              </p>
              <div>
                <Link href={rutas.panel.delegado.deportistas()} className={estilos.enlace}>
                  Ver todos
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className={estilos.encabezadoTabla} aria-hidden="true">
                <span>Nombre</span>
                <span>Categoría</span>
                <span>Sexo</span>
                <span>Edad</span>
                <span>Ficha médica</span>
                <span />
              </div>
              <ul className={estilos.lista}>
                {lista.map((d) => (
                  <Fila key={d.id} d={d} />
                ))}
              </ul>
            </>
          )}
        </Tarjeta>
      </Pagina>
    </>
  );
}
