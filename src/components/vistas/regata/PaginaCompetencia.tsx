import { ChevronLeft, ChevronRight, Info, MapPin, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Contenedor } from '@/components/cascaras';
import { CategoryTag } from '@/components/ds/CategoryTag';
import { cx } from '@/components/ds/cx';
import { EstadoSerieBadge } from '@/components/ds/EstadoSerieBadge';
import { Filete } from '@/components/ds/Filete';
import { Icon } from '@/components/ds/Icon';
import { StatusBadge } from '@/components/ds/StatusBadge';
import { Tabs } from '@/components/ds/Tabs';
import { Time } from '@/components/ds/Time';
import {
  programaDeCompetencia,
  serieEnVivo,
  seriesPublicadas,
  type CompetenciaVista,
  type DiaPrograma,
  type ItemPrograma,
  type SerieDetalle,
} from '@/datos';
import { formatearFecha } from '@/dominio';
import { rutas } from '@/lib/rutas';
import base from './base.module.css';
import { Medalla } from './Medalla';
import estilos from './PaginaCompetencia.module.css';
import { TarjetaEnVivo } from './TarjetaEnVivo';

export type Pestana = 'programa' | 'resultados';

export interface PaginaCompetenciaProps {
  competencia: CompetenciaVista;
  pestana: Pestana;
  /** `filtroCategoria` pedido por la URL (se valida acá contra el programa). */
  categoria?: string;
}

const PUNTOS_TEXTO = 'Los puntos se otorgan solo en las finales (10-8-6-5-4-3-2-1).';

function agruparPorHora(items: ItemPrograma[]): { hora: string; items: ItemPrograma[] }[] {
  const grupos: { hora: string; items: ItemPrograma[] }[] = [];
  for (const item of items) {
    const hora = `${item.hora.slice(0, 2)} h`;
    const grupo = grupos.find((g) => g.hora === hora);
    if (grupo) grupo.items.push(item);
    else grupos.push({ hora, items: [item] });
  }
  return grupos;
}

function FilaPrograma({ item, competenciaId }: { item: ItemPrograma; competenciaId: string }) {
  const contenido = (
    <>
      <span className={estilos.textosFila}>
        <span className={estilos.tituloFila}>{item.titulo}</span>
        <span className={estilos.secundario}>
          {item.categoriaGenero} · <span className={base.mono}>{item.horaTexto}</span>
        </span>
      </span>
      {item.estado === 'prevista' ? (
        <StatusBadge estado="cerradas">Prevista</StatusBadge>
      ) : (
        <EstadoSerieBadge estado={item.estado} />
      )}
      <span className={estilos.chevron}>{item.serieId && <Icon icono={ChevronRight} size={20} />}</span>
    </>
  );
  const clase = cx(estilos.filaPrograma, item.estado === 'en-vivo' && estilos.enVivo);
  return item.serieId ? (
    <Link href={rutas.serie(competenciaId, item.serieId)} className={cx(clase, estilos.enlaceFila)}>
      {contenido}
    </Link>
  ) : (
    <div className={clase}>{contenido}</div>
  );
}

function Programa({ dias, competenciaId }: { dias: DiaPrograma[]; competenciaId: string }) {
  return (
    <div className={estilos.columnas}>
      {dias.map((dia) => (
        <section key={dia.fecha} aria-label={dia.titulo} className={base.tarjeta}>
          <Filete />
          <h2 className={estilos.tituloDia}>{dia.titulo}</h2>
          {dia.items.length === 0 && <p className={estilos.vacioDia}>No hay eventos de esta categoría este día.</p>}
          {agruparPorHora(dia.items).map((grupo) => (
            <div key={grupo.hora}>
              <div className={estilos.hora}>{grupo.hora}</div>
              {grupo.items.map((item) => (
                <FilaPrograma key={`${item.eventoId}-${item.serieId ?? item.fase}`} item={item} competenciaId={competenciaId} />
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function ResultadosEvento({ series }: { series: SerieDetalle[] }) {
  const evento = series[0].evento;
  return (
    <section aria-label={evento.lectura} className={base.tarjeta}>
      <Filete />
      <div className={estilos.cabeceraEvento}>
        <h2 className={estilos.tituloEvento}>
          <Link href={rutas.evento(series[0].competenciaId, evento.id)} className={estilos.enlaceEvento}>
            {evento.lectura}
          </Link>
        </h2>
        <span className={base.rotulo}>{series.length === 1 ? '1 serie publicada' : `${series.length} series publicadas`}</span>
      </div>
      {series.map((serie) => (
        <div key={serie.id} className={estilos.bloqueSerie}>
          <Link href={rutas.serie(serie.competenciaId, serie.id)} className={cx(estilos.filaPrograma, estilos.enlaceFila)}>
            <span className={estilos.textosFila}>
              <span className={estilos.faseSerie}>{serie.fase.nombre}</span>
              <span className={estilos.secundario}>
                {formatearFecha(serie.fecha, 'dia-corto')} · <span className={base.mono}>{serie.horaTexto}</span>
              </span>
            </span>
            <EstadoSerieBadge estado="publicada" />
            <span className={estilos.chevron}>
              <Icon icono={ChevronRight} size={20} />
            </span>
          </Link>
          <ol aria-label={`Primeros tres · ${serie.titulo}`} className={estilos.podio}>
            {(serie.resultados ?? []).slice(0, 3).map((fila, i) => (
              <li key={fila.carril} className={cx(estilos.filaPodio, serie.esFinal && estilos.conPuntos)}>
                <span className={estilos.posicionPodio}>
                  {fila.posicion ?? '—'}
                  {serie.esFinal && <Medalla medalla={fila.medalla} />}
                </span>
                <span className={estilos.textosFila}>
                  <span className={estilos.nombrePodio}>{fila.bote.nombre}</span>
                  <span className={estilos.secundario}>{fila.bote.clubNombre}</span>
                </span>
                <Time
                  valor={fila.tiempo ?? fila.codigo ?? '—'}
                  diferencia={i > 0 ? (fila.diferencia ?? undefined) : undefined}
                  apagado={Boolean(fila.codigo)}
                />
                {serie.esFinal && (
                  <span className={estilos.puntos}>
                    <span className={estilos.valorPuntos}>{fila.puntos ?? ''}</span>
                    <span className={estilos.unidadPuntos}>pts</span>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}

function Resultados({
  competencia,
  series,
  filtrada,
}: {
  competencia: CompetenciaVista;
  series: SerieDetalle[];
  filtrada: boolean;
}) {
  if (series.length === 0) {
    const abierta = competencia.estado === 'abiertas';
    const titulo = filtrada
      ? 'Todavía no hay resultados publicados para esta categoría.'
      : 'Todavía no hay resultados publicados.';
    const texto = filtrada
      ? 'Aparecen acá apenas se publique la primera serie.'
      : abierta
        ? `La competencia empieza el ${formatearFecha(competencia.fechaInicio, 'dia').toLowerCase()}. Los resultados aparecen acá a medida que se publica cada serie.`
        : 'Aparecen acá apenas se publique la primera serie.';
    return (
      <div className={estilos.vacio}>
        <span className={estilos.iconoVacio}>
          <Icon icono={Trophy} size={24} />
        </span>
        <div className={estilos.textosVacio}>
          <span className={estilos.tituloVacio}>{titulo}</span>
          <span className={estilos.textoVacio}>{texto}</span>
        </div>
      </div>
    );
  }

  const eventos: SerieDetalle[][] = [];
  for (const serie of series) {
    const grupo = eventos.find((g) => g[0].eventoId === serie.eventoId);
    if (grupo) grupo.push(serie);
    else eventos.push([serie]);
  }
  return (
    <>
      <div className={estilos.columnas}>
        {eventos.map((grupo) => (
          <ResultadosEvento key={grupo[0].eventoId} series={grupo} />
        ))}
      </div>
      <p className={estilos.notaPie}>
        Se muestran los tres primeros de cada serie; abrí la serie para ver todos los carriles. {PUNTOS_TEXTO}
      </p>
    </>
  );
}

/** P3: la competencia con su programa y sus resultados, filtrables por URL. */
export function PaginaCompetencia({ competencia, pestana, categoria }: PaginaCompetenciaProps) {
  const dias = programaDeCompetencia(competencia.id);
  const enVivo = serieEnVivo();

  // Categorías en orden de programa.
  const categorias: { filtro: string; texto: string }[] = [];
  for (const dia of dias) {
    for (const item of dia.items) {
      if (!categorias.some((c) => c.filtro === item.filtroCategoria)) {
        categorias.push({ filtro: item.filtroCategoria, texto: item.categoriaGenero });
      }
    }
  }
  const filtro = categoria && categorias.some((c) => c.filtro === categoria) ? categoria : undefined;

  const diasFiltrados = dias.map((d) => ({
    ...d,
    items: filtro ? d.items.filter((i) => i.filtroCategoria === filtro) : d.items,
  }));
  const cantidadPrograma = diasFiltrados.reduce((n, d) => n + d.items.length, 0);
  const publicadas = seriesPublicadas(competencia.id).filter((s) => !filtro || s.evento.filtroCategoria === filtro);

  const href = (nuevaPestana: Pestana, nuevaCategoria?: string) => {
    const params = new URLSearchParams();
    if (nuevaPestana !== 'programa') params.set('pestana', nuevaPestana);
    if (nuevaCategoria) params.set('categoria', nuevaCategoria);
    const consulta = params.toString();
    return `${rutas.competencia(competencia.id)}${consulta ? `?${consulta}` : ''}`;
  };

  const pestanas = [
    { id: 'programa', label: 'Programa', count: cantidadPrograma, href: href('programa', filtro) },
    { id: 'resultados', label: 'Resultados', count: publicadas.length, href: href('resultados', filtro) },
  ];

  return (
    <Contenedor className={estilos.pagina}>
      <Link href={rutas.competencias()} className={base.atras}>
        <Icon icono={ChevronLeft} size={18} />
        Competencias
      </Link>

      <div className={estilos.titulo}>
        <div className={estilos.titulos}>
          <h1 className={estilos.h1}>{competencia.nombre}</h1>
          <span className={estilos.lugar}>
            <Icon icono={MapPin} size={18} />
            {competencia.sede} · {competencia.fechas.larga}
          </span>
        </div>
        <div className={estilos.estado}>
          <StatusBadge estado={competencia.estado} />
        </div>
      </div>

      {competencia.estado === 'abiertas' && (
        <p className={estilos.parrafo}>
          Inscripciones abiertas. Inscribe el delegado de cada club, desde su panel.
          {competencia.cierre && <strong className={estilos.cierre}> {competencia.cierre.texto}</strong>}
        </p>
      )}

      {competencia.estado === 'curso' && enVivo && enVivo.competenciaId === competencia.id && (
        <TarjetaEnVivo serie={enVivo} />
      )}

      <div className={estilos.pestanasArriba}>
        <Tabs items={pestanas} value={pestana} />
      </div>

      <div role="group" aria-label="Filtrar por categoría" className={estilos.filtro}>
        <span className={cx(base.rotulo, estilos.rotuloFiltro)}>Categoría</span>
        <div className={estilos.chips}>
          <CategoryTag href={href(pestana)} seleccionado={!filtro} className={estilos.chip}>
            Todas
          </CategoryTag>
          {categorias.map((c) => (
            <CategoryTag key={c.filtro} href={href(pestana, c.filtro)} seleccionado={filtro === c.filtro} className={estilos.chip}>
              {c.texto}
            </CategoryTag>
          ))}
        </div>
      </div>

      {pestana === 'programa' ? (
        <>
          {competencia.estado === 'abiertas' && (
            <div className={estilos.aviso}>
              <span className={estilos.iconoAviso}>
                <Icon icono={Info} size={18} />
              </span>
              <span>
                <strong>Programa previsto.</strong> Las series y los horarios se confirman al cierre de inscripciones.
              </span>
            </div>
          )}
          <Programa dias={diasFiltrados} competenciaId={competencia.id} />
        </>
      ) : (
        <Resultados competencia={competencia} series={publicadas} filtrada={Boolean(filtro)} />
      )}

      {/* En celular las pestañas van fijas abajo, encima de la navegación inferior. */}
      <div className={estilos.pestanasFijas}>
        <Tabs items={pestanas} value={pestana} />
      </div>
    </Contenedor>
  );
}
