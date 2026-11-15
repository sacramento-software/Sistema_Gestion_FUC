import { ChevronRight, Search } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Contenedor } from '@/components/cascaras';
import { Button, CategoryTag, Icon } from '@/components/ds';
import { CampoSelect, CampoTexto } from '@/components/vistas/publico-resto/Campos';
import { EncabezadoPagina } from '@/components/vistas/publico-resto/EncabezadoPagina';
import { FilaChips } from '@/components/vistas/publico-resto/FilaChips';
import { armarUrl, primero } from '@/components/vistas/publico-resto/url';
import { listarClubes, listarDeportistas } from '@/datos';
import { CATEGORIAS } from '@/dominio';
import { rutas } from '@/lib/rutas';
import comunes from '@/components/vistas/publico-resto/Paginas.module.css';
import estilos from './deportistas.module.css';

export const metadata: Metadata = { title: 'Deportistas' };

const POR_PAGINA = 30;

export default async function DeportistasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const consulta = await searchParams;
  const q = primero(consulta.q);
  const clubes = listarClubes();
  const clubPedido = primero(consulta.club);
  const club = clubes.some((c) => c.id === clubPedido) ? clubPedido : undefined;
  const categoriaPedida = primero(consulta.categoria);
  const categoria = CATEGORIAS.some((c) => c.id === categoriaPedida) ? categoriaPedida : undefined;

  const resultados = listarDeportistas({ texto: q, clubId: club, categoriaId: categoria });
  const paginas = Math.max(1, Math.ceil(resultados.length / POR_PAGINA));
  const paginaPedida = Number.parseInt(primero(consulta.pagina) ?? '1', 10);
  const pagina = Number.isFinite(paginaPedida) ? Math.min(Math.max(paginaPedida, 1), paginas) : 1;
  const visibles = resultados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const filtros = { q, club, categoria };
  const urlPagina = (n: number) => armarUrl(rutas.deportistas(), { ...filtros, pagina: n > 1 ? String(n) : undefined });
  const urlCategoria = (id?: string) => armarUrl(rutas.deportistas(), { q, club, categoria: id });
  const hayFiltros = Boolean(q || club || categoria);

  return (
    <Contenedor ancho="amplio" as="main" className={comunes.pagina}>
      <EncabezadoPagina
        titulo="Deportistas"
        bajada="Buscá a un deportista para ver sus resultados y campeonatos."
      />

      <form method="get" action={rutas.deportistas()} className={estilos.formulario} role="search">
        <CampoTexto nombre="q" etiqueta="Buscar por nombre o club" valor={q} />
        <CampoSelect
          nombre="club"
          etiqueta="Club"
          valor={club}
          opciones={[{ value: '', label: 'Todos los clubes' }, ...clubes.map((c) => ({ value: c.id, label: c.nombre }))]}
        />
        {categoria && <input type="hidden" name="categoria" value={categoria} />}
        <Button type="submit" icon={Search} className={estilos.boton}>
          Buscar
        </Button>
      </form>

      <div className={comunes.filtros}>
        <FilaChips etiqueta="Filtrar por categoría">
          <CategoryTag href={urlCategoria()} seleccionado={!categoria}>
            Todas las categorías
          </CategoryTag>
          {CATEGORIAS.map((c) => (
            <CategoryTag key={c.id} href={urlCategoria(c.id)} seleccionado={categoria === c.id}>
              {c.nombre}
            </CategoryTag>
          ))}
        </FilaChips>
      </div>

      <p className={estilos.contador} aria-live="polite">
        {resultados.length} deportistas
      </p>

      {resultados.length === 0 ? (
        <div className={comunes.vacio}>
          <p>{q ? `No encontramos deportistas con «${q}».` : 'No encontramos deportistas para este filtro.'}</p>
          {hayFiltros && (
            <Link href={rutas.deportistas()} className={comunes.enlaceTexto}>
              Ver todos
            </Link>
          )}
        </div>
      ) : (
        <ul className={`${comunes.listaFilas} ${comunes.dosColumnas}`}>
          {visibles.map((d) => (
            <li key={d.id}>
              <Link href={rutas.deportista(d.id)} className={comunes.fila}>
                <span className={comunes.filaTexto}>
                  <span className={comunes.filaTitulo}>{d.nombreCompleto}</span>
                  <span className={comunes.filaDetalle}>
                    {d.clubNombre} · {d.categoriaTexto}
                  </span>
                </span>
                <Icon icono={ChevronRight} size={20} className={comunes.chevron} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {paginas > 1 && (
        <nav aria-label="Paginación" className={estilos.paginacion}>
          {pagina > 1 ? (
            <Button variant="secundario" href={urlPagina(pagina - 1)}>
              Anterior
            </Button>
          ) : (
            <span />
          )}
          <span className={estilos.pagina}>
            Página {pagina} de {paginas}
          </span>
          {pagina < paginas ? (
            <Button variant="secundario" href={urlPagina(pagina + 1)}>
              Siguiente
            </Button>
          ) : (
            <span />
          )}
        </nav>
      )}
    </Contenedor>
  );
}
