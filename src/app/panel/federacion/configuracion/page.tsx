import { Save } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';
import { Input } from '@/components/ds';
import { Tarjeta } from '@/components/vistas/federacion-resto/Bloques';
import estilos from '@/components/vistas/federacion-resto/federacion-resto.module.css';
import { configuracionFederacion } from '@/datos';

function rango(desde: number, hasta: number | null): string {
  return hasta === null ? `${desde} años o más` : `${desde} a ${hasta} años`;
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
      <div className={estilos.pagina}>
        <Tarjeta titulo="Categorías por edad" meta={`${config.categorias.length} categorías`}>
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

        <Tarjeta titulo="Tabla de puntos de las finales">
          <div className={estilos.tarjetaCuerpo}>
            <div className={estilos.camposPuntos}>
              {config.tablaPuntos.map((puntos, i) => (
                <Input
                  key={i}
                  label={`Posición ${i + 1}`}
                  value={String(puntos)}
                  soloLectura
                  mono
                />
              ))}
            </div>
          </div>
          <p className={estilos.nota}>Solo las finales dan puntos.</p>
        </Tarjeta>

        <Tarjeta titulo="Avance entre fases, por defecto">
          <div className={estilos.tarjetaCuerpo}>
            <div className={estilos.camposFila}>
              <Input label="Mejores tiempos de cada serie" value={String(config.avancePorDefecto.cantidad)} soloLectura mono />
            </div>
            <p className={estilos.regla}>
              Avanzan los mejores {config.avancePorDefecto.cantidad} tiempos de cada serie. Cada competencia puede tener
              la suya.
            </p>
          </div>
        </Tarjeta>

        <Tarjeta titulo="Cierre de inscripciones">
          <div className={estilos.tarjetaCuerpo}>
            <div className={estilos.camposFila}>
              <Input label="Hora de cierre" value={horaCierre} soloLectura mono />
            </div>
            <p className={estilos.regla}>Las inscripciones se cierran solas a las {config.cierreAutomatico}.</p>
          </div>
        </Tarjeta>
      </div>
    </>
  );
}
