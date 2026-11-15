import Image from 'next/image';
import Link from 'next/link';
import { Filete } from '@/components/ds';
import type { NoticiaVista } from '@/datos';
import { rutas } from '@/lib/rutas';
import estilos from './TarjetaNoticia.module.css';

export interface TarjetaNoticiaProps {
  noticia: NoticiaVista;
  /** A lo ancho, con foto 16:9 y resumen. */
  destacada?: boolean;
}

export function TarjetaNoticia({ noticia, destacada = false }: TarjetaNoticiaProps) {
  return (
    <Link
      href={rutas.noticia(noticia.id)}
      className={`${estilos.tarjeta} ${destacada ? estilos.destacada : ''}`}
    >
      <div className={estilos.foto}>
        <Image
          src={noticia.foto}
          alt={noticia.alt}
          fill
          sizes={destacada ? '(max-width: 900px) 100vw, 640px' : '(max-width: 720px) 100vw, 400px'}
          className={estilos.imagen}
          priority={destacada}
        />
      </div>
      <div className={estilos.cuerpo}>
        <Filete />
        <div className={estilos.texto}>
          <p className={estilos.meta}>
            <span>{noticia.categoria}</span>
            <span>{noticia.fechaTexto}</span>
          </p>
          <h2 className={estilos.titulo}>{noticia.titulo}</h2>
          {destacada && <p className={estilos.resumen}>{noticia.resumen}</p>}
        </div>
      </div>
    </Link>
  );
}
