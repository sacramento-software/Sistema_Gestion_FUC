import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Contenedor } from '@/components/cascaras';
import { Icon } from '@/components/ds';
import { TarjetaNoticia } from '@/components/vistas/publico-resto/TarjetaNoticia';
import { listarNoticias, obtenerNoticia } from '@/datos';
import { rutas } from '@/lib/rutas';
import comunes from '@/components/vistas/publico-resto/Paginas.module.css';
import estilos from './noticia.module.css';

type Params = { noticiaId: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { noticiaId } = await params;
  const noticia = obtenerNoticia(noticiaId);
  return noticia ? { title: noticia.titulo } : {};
}

export default async function NoticiaPage({ params }: { params: Promise<Params> }) {
  const { noticiaId } = await params;
  const noticia = obtenerNoticia(noticiaId);
  if (!noticia) notFound();

  // «Más noticias»: las 3 siguientes en el orden de la lista, volviendo al principio si hace falta.
  const todas = listarNoticias();
  const indice = todas.findIndex((n) => n.id === noticia.id);
  const otras = todas.filter((n) => n.id !== noticia.id);
  const siguientes = [...otras.slice(indice), ...otras.slice(0, indice)].slice(0, 3);

  return (
    <Contenedor as="main" className={comunes.pagina}>
      <Link href={rutas.noticias()} className={comunes.volver}>
        <Icon icono={ChevronLeft} size={20} />
        Noticias
      </Link>

      <article className={estilos.articulo}>
        <header className={estilos.encabezado}>
          <p className={estilos.meta}>
            <span>{noticia.categoria}</span>
            <span>{noticia.fechaTexto}</span>
          </p>
          <h1 className={estilos.titulo}>{noticia.titulo}</h1>
        </header>

        <div className={estilos.foto}>
          <Image src={noticia.foto} alt={noticia.alt} fill priority sizes="(max-width: 1200px) 100vw, 1100px" className={estilos.imagen} />
        </div>

        <div className={estilos.cuerpo}>
          {noticia.cuerpo.map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        </div>
      </article>

      {siguientes.length > 0 && (
        <section className={comunes.seccion} aria-labelledby="mas-noticias">
          <h2 id="mas-noticias" className={comunes.seccionTitulo}>
            Más noticias
          </h2>
          <div className={estilos.mas}>
            {siguientes.map((n) => (
              <TarjetaNoticia key={n.id} noticia={n} />
            ))}
          </div>
        </section>
      )}
    </Contenedor>
  );
}
