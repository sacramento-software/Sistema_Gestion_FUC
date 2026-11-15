import type { Metadata } from 'next';
import Link from 'next/link';
import { Contenedor } from '@/components/cascaras';
import { CategoryTag } from '@/components/ds';
import { EncabezadoPagina } from '@/components/vistas/publico-resto/EncabezadoPagina';
import { FilaChips } from '@/components/vistas/publico-resto/FilaChips';
import { TarjetaNoticia } from '@/components/vistas/publico-resto/TarjetaNoticia';
import { armarUrl, primero } from '@/components/vistas/publico-resto/url';
import { listarNoticias } from '@/datos';
import { rutas } from '@/lib/rutas';
import comunes from '@/components/vistas/publico-resto/Paginas.module.css';
import estilos from './noticias.module.css';

export const metadata: Metadata = { title: 'Noticias' };

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const consulta = await searchParams;
  const todas = listarNoticias();
  const categorias = [...new Set(todas.map((n) => n.categoria))];
  const pedida = primero(consulta.categoria);
  const categoria = categorias.find((c) => c === pedida);
  const visibles = categoria ? todas.filter((n) => n.categoria === categoria) : todas;
  const [destacada, ...resto] = visibles;

  return (
    <Contenedor ancho="amplio" as="main" className={comunes.pagina}>
      <EncabezadoPagina titulo="Noticias" bajada="Lo último del canotaje uruguayo." />

      <div className={comunes.filtros}>
        <FilaChips etiqueta="Filtrar por categoría">
          <CategoryTag href={rutas.noticias()} seleccionado={!categoria}>
            Todas
          </CategoryTag>
          {categorias.map((c) => (
            <CategoryTag key={c} href={armarUrl(rutas.noticias(), { categoria: c })} seleccionado={categoria === c}>
              {c}
            </CategoryTag>
          ))}
        </FilaChips>
      </div>

      {!destacada ? (
        <div className={comunes.vacio}>
          <p>No hay noticias para este filtro.</p>
          <Link href={rutas.noticias()} className={comunes.enlaceTexto}>
            Ver todas
          </Link>
        </div>
      ) : (
        <>
          <div className={estilos.destacada}>
            <TarjetaNoticia noticia={destacada} destacada />
          </div>
          {resto.length > 0 && (
            <div className={estilos.grilla}>
              {resto.map((n) => (
                <TarjetaNoticia key={n.id} noticia={n} />
              ))}
            </div>
          )}
        </>
      )}
    </Contenedor>
  );
}
