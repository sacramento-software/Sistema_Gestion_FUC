import { Ban, Plus } from 'lucide-react';
import { CategoryTag } from '@/components/ds';
import { AccionNoDisponible } from '@/components/demo';
import { BarraGestion } from '@/components/vistas/comun/BarraGestion';
import { catalogoDeEventos } from '@/datos';
import { CATEGORIAS } from '@/dominio/categorias';
import { rutas } from '@/lib/rutas';
import { armarUrl, BandaInfo, Etiqueta, Vacio } from './Bloques';
import estilos from './federacion.module.css';

export interface FiltrosCatalogo {
  embarcacion?: string;
  categoria?: string;
  genero?: string;
  inactivos?: string;
  q?: string;
}

const EMBARCACIONES = ['K1', 'K2', 'K4', 'C1', 'C2'];
const GENEROS = [
  { valor: 'F', texto: 'Femenino' },
  { valor: 'M', texto: 'Masculino' },
];

export function resumenCatalogo(): string {
  const todos = catalogoDeEventos();
  return `${todos.length} eventos · ${todos.filter((e) => e.activo).length} activos`;
}

function GrupoFiltro({
  titulo,
  opciones,
  actual,
  clave,
  filtros,
}: {
  titulo: string;
  opciones: { valor: string; texto: string }[];
  actual?: string;
  clave: keyof FiltrosCatalogo;
  filtros: FiltrosCatalogo;
}) {
  const url = (valor?: string) => armarUrl(rutas.panel.federacion.catalogo(), { ...filtros, [clave]: valor });
  return (
    <div className={estilos.grupoFiltro}>
      <Etiqueta>{titulo}</Etiqueta>
      <div className={estilos.filtros}>
        <CategoryTag href={url()} seleccionado={!actual}>
          Todas
        </CategoryTag>
        {opciones.map((o) => (
          <CategoryTag key={o.valor} href={url(o.valor)} seleccionado={actual === o.valor}>
            {o.texto}
          </CategoryTag>
        ))}
      </div>
    </div>
  );
}

export function Catalogo({ filtros }: { filtros: FiltrosCatalogo }) {
  const mostrarInactivos = filtros.inactivos === '1';
  const visibles = catalogoDeEventos().filter(
    (e) =>
      (mostrarInactivos || e.activo) &&
      (!filtros.embarcacion || e.embarcacion === filtros.embarcacion) &&
      (!filtros.categoria || e.categoriaId === filtros.categoria) &&
      (!filtros.genero || e.genero === filtros.genero) &&
      (!filtros.q || e.codigo.toLowerCase().includes(filtros.q.toLowerCase())),
  );

  return (
    <div className={estilos.pagina}>
      <BandaInfo>
        La nomenclatura es embarcación-distancia-categoría-género: K2-500-JUNIOR-F se lee «K2 500 m · Junior · Femenino».
      </BandaInfo>

      <BarraGestion
        accion={rutas.panel.federacion.catalogo()}
        placeholder="Buscar por código, ej. K2-500"
        q={filtros.q}
        conservar={{
          embarcacion: filtros.embarcacion,
          categoria: filtros.categoria,
          genero: filtros.genero,
          inactivos: filtros.inactivos,
        }}
        alta={<AccionNoDisponible icon={Plus}>Crear evento</AccionNoDisponible>}
      />

      <section aria-label="Filtros del catálogo" className={estilos.pagina}>
        <GrupoFiltro
          titulo="Embarcación"
          opciones={EMBARCACIONES.map((v) => ({ valor: v, texto: v }))}
          actual={filtros.embarcacion}
          clave="embarcacion"
          filtros={filtros}
        />
        <GrupoFiltro
          titulo="Categoría"
          opciones={CATEGORIAS.map((c) => ({ valor: c.id, texto: c.nombre }))}
          actual={filtros.categoria}
          clave="categoria"
          filtros={filtros}
        />
        <GrupoFiltro titulo="Género" opciones={GENEROS} actual={filtros.genero} clave="genero" filtros={filtros} />
        <div className={estilos.filtros}>
          <CategoryTag
            href={armarUrl(rutas.panel.federacion.catalogo(), { ...filtros, inactivos: mostrarInactivos ? undefined : '1' })}
            seleccionado={mostrarInactivos}
          >
            Mostrar inactivos
          </CategoryTag>
        </div>
      </section>

      <section aria-label="Eventos del catálogo" className={`${estilos.tarjeta} ${estilos.tarjetaTabla}`}>
        {visibles.length === 0 ? (
          <Vacio>No hay eventos del catálogo con estos filtros.</Vacio>
        ) : (
          <>
            <div className={`${estilos.encabezadoTabla} ${estilos.tablaCatalogo}`} aria-hidden="true">
              <span>CÓDIGO</span>
              <span>EVENTO</span>
              <span>USOS</span>
              <span>ESTADO</span>
              <span />
            </div>
            {visibles.map((e) => (
              <div key={e.id} className={`${estilos.filaTabla} ${estilos.tablaCatalogo}`}>
                <span className={`${estilos.celda} ${estilos.mono}`}>{e.codigo}</span>
                <span className={`${estilos.celda} ${estilos.filaTitulo}`}>{e.lectura}</span>
                <span className={estilos.celda}>
                  <span className={estilos.celdaRotulo}>Usos</span>en {e.usos} {e.usos === 1 ? 'competencia' : 'competencias'}
                </span>
                <span className={estilos.celda}>
                  <span className={`${estilos.chipEstado} ${e.activo ? estilos.chipActivo : estilos.chipInactivo}`}>
                    {e.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </span>
                <span className={estilos.celda}>
                  {e.activo && <AccionNoDisponible variant="icono" icon={Ban} label={`Desactivar ${e.codigo}`} />}
                </span>
              </div>
            ))}
          </>
        )}
      </section>
    </div>
  );
}
