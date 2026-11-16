import { Pencil, Save } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';
import { Tarjeta } from '@/components/vistas/federacion-resto/Bloques';
import estilos from '@/components/vistas/federacion-resto/federacion-resto.module.css';
import { configuracionFederacion } from '@/datos';

function rango(desde: number, hasta: number | null): string {
  return hasta === null ? `${desde} años o más` : `${desde} a ${hasta} años`;
}

function Editar({ de }: { de: string }) {
  return (
    <AccionNoDisponible variant="secundario" size="sm" icon={Pencil} label={`Editar ${de}`}>
      Editar
    </AccionNoDisponible>
  );
}

export default function ConfiguracionPage() {
  const config = configuracionFederacion();
  // «23:59 del día de cierre»: la hora va al frente del texto.
  const [horaCierre] = config.cierreAutomatico.split(' ');

  return (
    <>
      <EncabezadoPanel
        titulo="Configuración"
        acciones={<AccionNoDisponible icon={Save}>Guardar configuración</AccionNoDisponible>}
      />
      <div className={estilos.configGrilla}>
        <div className={estilos.configCategorias}>
          <Tarjeta
            titulo="Categorías por edad"
            meta={`${config.categorias.length} categorías`}
            acciones={<Editar de="las categorías por edad" />}
          >
            <table className={estilos.tabla}>
              <thead>
                <tr>
                  <th scope="col">Categoría</th>
                  <th scope="col">Rango</th>
                </tr>
              </thead>
              <tbody>
                {config.categorias.map((c) => (
                  <tr key={c.id}>
                    <td data-etiqueta="Categoría">
                      <strong>{c.nombre}</strong>
                    </td>
                    <td data-etiqueta="Rango" className={estilos.mono}>
                      {rango(c.desde, c.hasta)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={estilos.nota}>La categoría se calcula con el año de la competencia menos el año de nacimiento.</p>
          </Tarjeta>
        </div>

        <div className={estilos.configColumna}>
          <Tarjeta titulo="Tabla de puntos de las finales" acciones={<Editar de="la tabla de puntos" />}>
            <dl className={estilos.valores}>
              {config.tablaPuntos.map((puntos, i) => (
                <div key={i} className={estilos.valor}>
                  <dt>Posición {i + 1}</dt>
                  <dd>{puntos}</dd>
                </div>
              ))}
            </dl>
            <p className={estilos.nota}>Solo las finales dan puntos.</p>
          </Tarjeta>

          <Tarjeta titulo="Avance entre fases" acciones={<Editar de="el avance entre fases" />}>
            <dl className={`${estilos.valores} ${estilos.valoresFila}`}>
              <div className={estilos.valor}>
                <dt>Mejores tiempos de cada serie</dt>
                <dd>{config.avancePorDefecto.cantidad}</dd>
              </div>
            </dl>
            <p className={estilos.nota}>
              Avanzan los mejores {config.avancePorDefecto.cantidad} tiempos de cada serie. Cada competencia puede tener la
              suya.
            </p>
          </Tarjeta>

          <Tarjeta titulo="Cierre de inscripciones" acciones={<Editar de="el cierre de inscripciones" />}>
            <dl className={`${estilos.valores} ${estilos.valoresFila}`}>
              <div className={estilos.valor}>
                <dt>Hora de cierre</dt>
                <dd>{horaCierre}</dd>
              </div>
            </dl>
            <p className={estilos.nota}>Las inscripciones se cierran solas a las {config.cierreAutomatico}.</p>
          </Tarjeta>
        </div>
      </div>
    </>
  );
}
