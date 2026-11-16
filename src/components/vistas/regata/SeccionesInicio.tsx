import { ArrowRight, ChevronRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CategoryTag } from '@/components/ds/CategoryTag';
import { Filete } from '@/components/ds/Filete';
import { Icon } from '@/components/ds/Icon';
import { StatusBadge } from '@/components/ds/StatusBadge';
import { Time } from '@/components/ds/Time';
import {
  listarClubes,
  listarCompetencias,
  listarNoticias,
  ultimasFinalesPublicadas,
  type CompetenciaVista,
} from '@/datos';
import { formatearFecha } from '@/dominio';
import { rutas } from '@/lib/rutas';
import { cx } from '@/components/ds/cx';
import { Medalla } from './Medalla';
import estilos from './SeccionesInicio.module.css';

function TituloSeccion({ children }: { children: ReactNode }) {
  return (
    <h2 className={estilos.titulo}>
      <span aria-hidden="true" className={estilos.barraTitulo} />
      {children}
    </h2>
  );
}

function EnlaceFlecha({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={estilos.enlaceFlecha}>
      {children}
      <Icon icono={ArrowRight} size={18} />
    </Link>
  );
}

/** Cinta de clubes afiliados: desplazamiento lento, decorativa. */
export function CintaClubes() {
  const clubes = listarClubes();
  const corrida = (
    <div className={estilos.corrida}>
      {clubes.map((c) => (
        <span key={c.id} className={estilos.club}>
          {c.nombre}
          <span className={estilos.barra}>/</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={estilos.cinta}>
      <div aria-hidden="true" className={estilos.ventanaCinta}>
        <div className={estilos.pista}>
          {corrida}
          {corrida}
        </div>
      </div>
    </div>
  );
}

function DiaMes({ fecha }: { fecha: string }) {
  const dia = Number(fecha.slice(8, 10));
  const mes = formatearFecha(fecha, 'media').split(' ')[1].toUpperCase();
  return (
    <span className={estilos.diaMes}>
      <span className={estilos.dia}>{dia}</span>
      <span className={estilos.mes}>{mes}</span>
    </span>
  );
}

function Destacada({ competencia }: { competencia: CompetenciaVista }) {
  return (
    <Link href={rutas.competencia(competencia.id)} className={estilos.destacada}>
      <div className={estilos.fotoDestacada}>
        <Image
          src="/imagenes/k4-dorsales.jpg"
          alt="K4 con dorsales en la línea de largada"
          fill
          sizes="(min-width: 1100px) 50vw, 100vw"
          className={estilos.imagen}
        />
        <span className={estilos.sello}>Destacada</span>
        <span className={estilos.estadoFoto}>
          <StatusBadge estado={competencia.estado} />
        </span>
      </div>
      <Filete />
      <div className={estilos.cuerpoDestacada}>
        <span className={estilos.fechaSede}>
          {competencia.fechas.media} · {competencia.sede}
        </span>
        <h3 className={estilos.nombreDestacada}>{competencia.nombre}</h3>
        <span className={estilos.resumen}>{competencia.resumen}</span>
        <div className={estilos.pieDestacada}>
          <div className={estilos.botes}>
            {competencia.embarcaciones.map((e) => (
              <CategoryTag key={e}>{e}</CategoryTag>
            ))}
          </div>
          <span className={estilos.verCompetencia}>
            Ver competencia
            <Icon icono={ArrowRight} size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function SeccionCompetencias() {
  const todas = listarCompetencias();
  const destacada = todas.find((c) => c.estado === 'abiertas') ?? todas.find((c) => c.estado === 'curso');
  const proximas = todas.filter((c) => c.estado !== 'finalizada');
  return (
    <section aria-labelledby="titulo-competencias" className={cx(estilos.seccion, estilos.fondoBase)}>
      <div className={estilos.interior}>
        <div className={estilos.cabecera}>
          <div id="titulo-competencias">
            <TituloSeccion>Competencias</TituloSeccion>
          </div>
          <EnlaceFlecha href={rutas.competencias()}>Calendario completo</EnlaceFlecha>
        </div>
        <div className={estilos.gridCompetencias}>
          {destacada && <Destacada competencia={destacada} />}
          <div className={estilos.proximas}>
            <Filete />
            <span className={estilos.rotuloProximas}>Próximas fechas</span>
            {proximas.map((c) => (
              <Link key={c.id} href={rutas.competencia(c.id)} className={estilos.filaProxima}>
                <DiaMes fecha={c.fechaInicio} />
                <span className={estilos.textosProxima}>
                  <StatusBadge estado={c.estado} />
                  <span className={estilos.nombreProxima}>{c.nombre}</span>
                  <span className={estilos.lugar}>
                    <Icon icono={MapPin} size={16} />
                    {c.sede} · {c.tipoTexto}
                  </span>
                </span>
                <Icon icono={ChevronRight} size={22} />
              </Link>
            ))}
            <Link href={rutas.competencias()} className={estilos.verCalendario}>
              Ver calendario completo
              <Icon icono={ArrowRight} size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SeccionResultados({ hrefTodos }: { hrefTodos: string }) {
  const finales = ultimasFinalesPublicadas(3);
  if (finales.length === 0) return null;
  const competencia = listarCompetencias().find((c) => c.id === finales[0].competenciaId);
  const rotulo = competencia
    ? `${competencia.nombre} ${competencia.fechaInicio.slice(0, 4)} · Finales`
    : 'Finales';
  return (
    <section aria-labelledby="titulo-resultados" className={cx(estilos.seccion, estilos.fondoAlterno)}>
      <div className={estilos.interior}>
        <div className={estilos.cabecera}>
          <div className={estilos.bloqueTitulo}>
            <span className={estilos.rotuloResultados}>{rotulo}</span>
            <div id="titulo-resultados">
              <TituloSeccion>Resultados</TituloSeccion>
            </div>
          </div>
          <EnlaceFlecha href={hrefTodos}>Todos los resultados</EnlaceFlecha>
        </div>
        <div className={estilos.gridFinales}>
          {finales.map((serie) => (
            <div key={serie.id} className={estilos.tarjetaFinal}>
              <Filete />
              <Link href={rutas.serie(serie.competenciaId, serie.id)} className={estilos.cabeceraFinal}>
                <span className={estilos.tituloFinal}>{serie.titulo}</span>
                <span className={estilos.subtituloFinal}>
                  {serie.categoriaGenero} · {serie.horaTexto}
                </span>
              </Link>
              <div className={estilos.encabezadoFinal} aria-hidden="true">
                <span>POS</span>
                <span>DEPORTISTA · CLUB</span>
                <span>TIEMPO</span>
              </div>
              {(serie.resultados ?? []).slice(0, 3).map((fila) => (
                <Link
                  key={fila.carril}
                  href={rutas.serie(serie.competenciaId, serie.id)}
                  className={estilos.filaFinal}
                >
                  <span className={estilos.posicion}>
                    <Medalla medalla={fila.medalla} />
                    {fila.posicion ?? '—'}
                  </span>
                  <span className={estilos.textosFinal}>
                    <span className={estilos.nombreFinal}>{fila.bote.nombreCorto}</span>
                    <span className={estilos.clubFinal}>{fila.bote.clubNombre}</span>
                  </span>
                  <Time valor={fila.tiempo ?? fila.codigo ?? '—'} diferencia={fila.diferencia ?? undefined} />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SeccionNoticias() {
  const noticias = listarNoticias().slice(0, 6);
  return (
    <section aria-labelledby="titulo-noticias" className={cx(estilos.seccion, estilos.fondoBase)}>
      <div className={estilos.interior}>
        <div className={estilos.cabecera}>
          <div id="titulo-noticias">
            <TituloSeccion>Últimas noticias</TituloSeccion>
          </div>
          <EnlaceFlecha href={rutas.noticias()}>Todas las noticias</EnlaceFlecha>
        </div>
        <div className={estilos.gridNoticias}>
          {noticias.map((n) => (
            <Link key={n.id} href={rutas.noticia(n.id)} className={estilos.noticia}>
              <div className={estilos.fotoNoticia}>
                <Image src={n.foto} alt={n.alt} fill sizes="(min-width: 1100px) 33vw, 100vw" className={estilos.imagen} />
              </div>
              <Filete />
              <div className={estilos.cuerpoNoticia}>
                <span className={estilos.metaNoticia}>
                  <span className={estilos.categoriaNoticia}>{n.categoria}</span>
                  <span className={estilos.fechaNoticia}>{n.fechaTexto}</span>
                </span>
                <span className={estilos.tituloNoticia}>{n.titulo}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const DISCIPLINAS = [
  {
    foto: '/imagenes/canotaje6.jpg',
    alt: 'K4 de palistas en plena palada durante una regata',
    nombre: 'Velocidad',
    desc: 'Carreras en aguas planas sobre pista balizada, con salida en carriles y llegada por décimas. Es la base del calendario nacional y de la selección.',
    datos: ['200 m', '500 m', '1000 m', 'K1 · K2 · K4 · C1 · C2'],
  },
  {
    foto: '/imagenes/canotaje5.jpg',
    alt: 'Palistas remando en una prueba de larga distancia',
    nombre: 'Maratón',
    desc: 'Pruebas de resistencia en circuitos largos de ida y vuelta, con porteos entre tramos. Se corre en equipo y exige estrategia tanto como fondo.',
    datos: ['Larga distancia', 'Porteos', 'Individual y por equipos'],
  },
  {
    foto: '/imagenes/lago-calcagno.jpg',
    alt: 'Lago Calcagno con kayaks amarillos junto al muelle',
    nombre: 'Canoa turismo',
    desc: 'Travesías recreativas por ríos, lagos y costa, sin competencia. Una forma de conocer el territorio remando, con salidas guiadas desde los clubes.',
    datos: ['Salidas guiadas', 'Ríos y costa', 'Sin competencia'],
  },
  {
    foto: '/imagenes/canotaje4.jpg',
    alt: 'Niña en kayak naranja durante una clase de escuela',
    nombre: 'Escuelas',
    desc: 'Programas de iniciación para niñas, niños y adultos: seguridad en el agua, técnica de palada y primeras regatas amistosas en cada club.',
    datos: ['Todas las edades', 'Equipo provisto', 'Primeras remadas'],
  },
] as const;

/** Las cuatro disciplinas: informativas, sin enlace (no hay páginas de disciplinas). */
export function SeccionDisciplinas() {
  return (
    <section aria-labelledby="titulo-disciplinas" className={cx(estilos.seccion, estilos.fondoAlterno)}>
      <div className={estilos.interior}>
        <div className={estilos.cabecera}>
          <div id="titulo-disciplinas">
            <TituloSeccion>Disciplinas</TituloSeccion>
          </div>
          <span className={estilos.intro}>Encontrá tu modalidad y el club más cercano para empezar a palear.</span>
        </div>
        <div className={estilos.gridDisciplinas}>
          {DISCIPLINAS.map((d) => (
            <div key={d.nombre} className={estilos.disciplina}>
              <div className={estilos.fotoDisciplina}>
                <Image
                  src={d.foto}
                  alt={d.alt}
                  fill
                  quality={90}
                  sizes="(min-width: 1100px) 600px, (min-width: 640px) 50vw, 100vw"
                  className={estilos.imagen}
                />
              </div>
              <Filete />
              <div className={estilos.textosDisciplina}>
                <span className={estilos.nombreDisciplina}>{d.nombre}</span>
                <p className={estilos.descDisciplina}>{d.desc}</p>
                <ul className={estilos.datosDisciplina}>
                  {d.datos.map((t) => (
                    <li key={t} className={estilos.datoDisciplina}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
