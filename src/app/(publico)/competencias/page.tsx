import type { Metadata } from 'next';
import Link from 'next/link';
import { Contenedor } from '@/components/cascaras';
import { CategoryTag } from '@/components/ds';
import { EncabezadoPagina } from '@/components/vistas/publico-resto/EncabezadoPagina';
import { FilaChips } from '@/components/vistas/publico-resto/FilaChips';
import { TarjetaCompetencia } from '@/components/vistas/publico-resto/TarjetaCompetencia';
import { armarUrl, primero } from '@/components/vistas/publico-resto/url';
import { listarCompetencias, serieEnVivo, type CompetenciaVista } from '@/datos';
import { anioTemporada, formatearFecha } from '@/dominio';
import { rutas } from '@/lib/rutas';
import estilos from '@/components/vistas/publico-resto/Paginas.module.css';
import grilla from './competencias.module.css';

export const metadata: Metadata = { title: 'Competencias' };

const ESTADOS = [
  { id: 'todas', texto: 'Todas' },
  { id: 'abiertas', texto: 'Inscripciones abiertas' },
  { id: 'curso', texto: 'En curso' },
  { id: 'finalizada', texto: 'Finalizadas' },
] as const;

/** Meses (YYYY-MM) que toca una competencia, de su inicio a su fin. */
function mesesDe(c: CompetenciaVista): string[] {
  const inicio = c.fechaInicio.slice(0, 7);
  const fin = c.fechaFin.slice(0, 7);
  return inicio === fin ? [inicio] : [inicio, fin];
}

export default async function CompetenciasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const consulta = await searchParams;
  const estadoPedido = primero(consulta.estado);
  const estado = ESTADOS.some((e) => e.id === estadoPedido) ? (estadoPedido as string) : 'todas';
  const mesPedido = primero(consulta.mes);
  const mes = mesPedido && /^\d{4}-\d{2}$/.test(mesPedido) ? mesPedido : undefined;

  const todas = listarCompetencias();
  const meses = [...new Set(todas.flatMap(mesesDe))].sort();
  const vivo = serieEnVivo();

  const visibles = todas.filter(
    (c) => (estado === 'todas' || c.estado === estado) && (!mes || mesesDe(c).includes(mes)),
  );
  const grupos = [
    { titulo: 'En curso', items: visibles.filter((c) => c.estado === 'curso') },
    { titulo: 'Próximas', items: visibles.filter((c) => c.estado === 'abiertas' || c.estado === 'cerradas') },
    { titulo: 'Finalizadas', items: visibles.filter((c) => c.estado === 'finalizada') },
  ].filter((g) => g.items.length > 0);

  const urlConEstado = (id: string) =>
    armarUrl(rutas.competencias(), { estado: id === 'todas' ? undefined : id, mes });
  const urlConMes = (valor?: string) =>
    armarUrl(rutas.competencias(), { estado: estado === 'todas' ? undefined : estado, mes: valor });

  return (
    <Contenedor ancho="amplio" as="main" className={estilos.pagina}>
      <EncabezadoPagina titulo="Competencias" bajada={`Calendario de la temporada ${anioTemporada()}`} />

      <div className={estilos.filtros}>
        <FilaChips etiqueta="Filtrar por estado">
          {ESTADOS.map((e) => (
            <CategoryTag key={e.id} href={urlConEstado(e.id)} seleccionado={estado === e.id}>
              {e.texto}
            </CategoryTag>
          ))}
        </FilaChips>
        <FilaChips etiqueta="Filtrar por mes">
          <CategoryTag href={urlConMes()} seleccionado={!mes}>
            Todos los meses
          </CategoryTag>
          {meses.map((m) => (
            <CategoryTag key={m} href={urlConMes(m)} seleccionado={mes === m}>
              {formatearFecha(`${m}-01`, 'mes-anio')}
            </CategoryTag>
          ))}
        </FilaChips>
      </div>

      {grupos.length === 0 ? (
        <div className={estilos.vacio}>
          <p>No hay competencias para este filtro.</p>
          <Link href={rutas.competencias()} className={estilos.enlaceTexto}>
            Ver todas
          </Link>
        </div>
      ) : (
        grupos.map((g) => (
          <section key={g.titulo} className={estilos.seccion}>
            <h2 className={estilos.seccionTitulo}>{g.titulo}</h2>
            <div className={grilla.grilla}>
              {g.items.map((c) => (
                <TarjetaCompetencia
                  key={c.id}
                  competencia={c}
                  enVivo={vivo && vivo.competenciaId === c.id ? vivo.titulo : undefined}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </Contenedor>
  );
}
