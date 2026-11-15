'use client';

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { cx } from '@/components/ds/cx';
import { Icon } from '@/components/ds/Icon';
import { IconButton } from '@/components/ds/IconButton';
import estilos from './Portada.module.css';

const FOTOS = [
  { src: '/imagenes/canotaje7.jpg', alt: 'Palista en K1 durante una regata', pie: 'Velocidad · K1', posicion: '50% 40%' },
  { src: '/imagenes/lago-calcagno.jpg', alt: 'Lago Calcagno', pie: 'Lago Calcagno · Ciudad de la Costa', posicion: '50% 60%' },
  { src: '/imagenes/canotaje4.jpg', alt: 'Palistas jóvenes en kayak', pie: 'Escuelas de kayak', posicion: '50% 55%' },
] as const;

const INTERVALO_MS = 7000;

export interface AccesoPortada {
  rotulo: string;
  titulo: string;
  href: string;
}

export interface PortadaProps {
  proxima?: AccesoPortada;
  resultados?: AccesoPortada;
}

/** Portada de la home: carrusel de tres fotos con avance automático (sin movimiento si el usuario lo evita). */
export function Portada({ proxima, resultados }: PortadaProps) {
  const [actual, setActual] = useState(0);
  const [pausa, setPausa] = useState(false);
  const [sinMovimiento, setSinMovimiento] = useState(true);

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sincronizar = () => setSinMovimiento(consulta.matches);
    sincronizar();
    consulta.addEventListener('change', sincronizar);
    return () => consulta.removeEventListener('change', sincronizar);
  }, []);

  const ir = useCallback((i: number) => setActual((i + FOTOS.length) % FOTOS.length), []);

  useEffect(() => {
    if (pausa || sinMovimiento) return;
    const t = setTimeout(() => ir(actual + 1), INTERVALO_MS);
    return () => clearTimeout(t);
  }, [actual, pausa, sinMovimiento, ir]);

  const accesos = [proxima, resultados].filter((a): a is AccesoPortada => Boolean(a));

  return (
    <section
      data-theme="noche"
      aria-label="Portada"
      className={estilos.portada}
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
    >
      {FOTOS.map((foto, i) => (
        <Image
          key={foto.src}
          src={foto.src}
          alt={i === actual ? foto.alt : ''}
          aria-hidden={i === actual ? undefined : true}
          fill
          priority={i === 0}
          sizes="100vw"
          className={cx(estilos.foto, i === actual && estilos.fotoActual)}
          style={{ objectPosition: foto.posicion }}
        />
      ))}
      <div className={estilos.degradadoLateral} />
      <div className={estilos.degradadoInferior} />

      <div className={estilos.contenido}>
        <div className={estilos.marca}>
          <Image
            src="/imagenes/fuc-sello.jpg"
            alt="Sello de la Federación Uruguaya de Canotaje"
            width={112}
            height={112}
            className={estilos.sello}
          />
          <span className={estilos.linea} />
          <span className={estilos.federacion}>Federación Uruguaya de Canotaje</span>
        </div>
        <h1 className={estilos.titulo}>Bienvenido al sitio oficial</h1>
        <p className={estilos.bajada}>
          Conocé más sobre el canotaje en Uruguay y seguí las noticias y los resultados de cada competencia. Con tu usuario,
          ingresá a la plataforma para inscribir a tu club o cargar tiempos como juez.
        </p>
        {accesos.length > 0 && (
          <div className={estilos.accesos}>
            {accesos.map((a) => (
              <Link key={a.href} href={a.href} className={estilos.acceso}>
                <span className={estilos.textosAcceso}>
                  <span className={estilos.rotuloAcceso}>{a.rotulo}</span>
                  <span className={estilos.tituloAcceso}>{a.titulo}</span>
                </span>
                <Icon icono={ArrowRight} size={22} />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className={estilos.controles}>
        <div className={estilos.puntos} role="group" aria-label="Fotos de portada">
          {FOTOS.map((foto, i) => (
            <button
              key={foto.src}
              type="button"
              aria-label={`Foto ${i + 1}: ${foto.pie}`}
              aria-current={i === actual ? 'true' : undefined}
              className={estilos.punto}
              onClick={() => ir(i)}
            >
              <span className={cx(estilos.barra, i === actual && estilos.barraActual)} />
            </button>
          ))}
        </div>
        <span className={estilos.pie}>{FOTOS[actual].pie}</span>
        <span className={estilos.espacio} />
        <span className={estilos.contador} aria-live="off">
          {String(actual + 1).padStart(2, '0')} / {String(FOTOS.length).padStart(2, '0')}
        </span>
        <div className={estilos.flechas}>
          <IconButton icon={ChevronLeft} label="Foto anterior" onClick={() => ir(actual - 1)} />
          <IconButton icon={ChevronRight} label="Foto siguiente" onClick={() => ir(actual + 1)} />
        </div>
      </div>
    </section>
  );
}
