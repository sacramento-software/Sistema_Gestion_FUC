import Link from 'next/link';
import { CategoryTag, StatusBadge } from '@/components/ds';
import { listarCompetencias, type CompetenciaVista } from '@/datos';
import { rutas } from '@/lib/rutas';
import { armarUrl, Vacio } from './Bloques';
import estilos from './federacion.module.css';

const FILTROS: { valor: CompetenciaVista['estado'] | undefined; clave?: string; texto: string }[] = [
  { valor: undefined, texto: 'Todas' },
  { valor: 'abiertas', clave: 'abiertas', texto: 'Inscripciones abiertas' },
  { valor: 'curso', clave: 'curso', texto: 'En curso' },
  { valor: 'finalizada', clave: 'finalizada', texto: 'Finalizadas' },
];

export function ListaCompetencias({ estado, texto }: { estado?: string; texto?: string }) {
  const todas = listarCompetencias();
  const filtro = FILTROS.find((f) => f.clave === estado)?.valor;
  const buscado = (texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = todas.filter(
    (c) =>
      (!filtro || c.estado === filtro) &&
      (!buscado ||
        `${c.nombre} ${c.sede}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(buscado)),
  );

  return (
    <div className={estilos.pagina}>
      <nav aria-label="Filtrar por estado" className={estilos.filtros}>
        {FILTROS.map((f) => (
          <CategoryTag
            key={f.texto}
            href={armarUrl(rutas.panel.federacion.competencias(), { estado: f.clave, q: texto || undefined })}
            seleccionado={f.valor === filtro}
          >
            {f.texto}
          </CategoryTag>
        ))}
      </nav>

      <section aria-label="Competencias" className={`${estilos.tarjeta} ${estilos.tarjetaTabla}`}>
        {visibles.length === 0 ? (
          <Vacio>No hay competencias con este estado.</Vacio>
        ) : (
          <>
            <div className={`${estilos.encabezadoTabla} ${estilos.tablaCompetencias}`} aria-hidden="true">
              <span>Competencia</span>
              <span>Sede</span>
              <span>Fechas</span>
              <span>Eventos</span>
              <span>Inscriptos</span>
              <span>Estado</span>
            </div>
            {visibles.map((c) => (
              <Link
                key={c.id}
                href={rutas.panel.federacion.competencia(c.id)}
                className={`${estilos.filaTabla} ${estilos.tablaCompetencias}`}
              >
                <span className={estilos.celda}>
                  <span className={estilos.filaTitulo}>{c.nombre}</span>
                  <br />
                  <span className={estilos.subtexto}>{c.tipoTexto}</span>
                </span>
                <span className={estilos.celda}>
                  <span className={estilos.celdaRotulo}>Sede</span>
                  {c.sede}
                </span>
                <span className={estilos.celda}>
                  <span className={estilos.celdaRotulo}>Fechas</span>
                  {c.fechas.media}
                </span>
                <span className={`${estilos.celda} ${estilos.mono}`}>
                  <span className={estilos.celdaRotulo}>Eventos</span>
                  {c.cantidadEventos}
                </span>
                <span className={estilos.celda}>
                  <span className={estilos.celdaRotulo}>Inscriptos</span>
                  {c.botesInscriptos} botes · {c.clubesInscriptos} clubes
                </span>
                <span className={estilos.celda}>
                  <StatusBadge estado={c.estado} />
                </span>
              </Link>
            ))}
          </>
        )}
      </section>
    </div>
  );
}
