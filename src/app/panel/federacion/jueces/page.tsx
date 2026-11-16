import { Trash2, UserPlus } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';
import { Tarjeta } from '@/components/vistas/federacion-resto/Bloques';
import estilos from '@/components/vistas/federacion-resto/federacion-resto.module.css';
import { listarEquipoFederacion } from '@/datos';

const ROL_PRIMERO = 'Juez central';

export default function JuecesPage() {
  const equipo = listarEquipoFederacion();

  // Agrupado por rol, con el juez central primero y el resto en el orden de los datos.
  const roles = [...new Set(equipo.map((m) => m.rol))].sort(
    (a, b) => Number(b === ROL_PRIMERO) - Number(a === ROL_PRIMERO),
  );

  return (
    <>
      <EncabezadoPanel
        titulo="Jueces y equipo"
        subtitulo={`${equipo.length} personas`}
        acciones={<AccionNoDisponible icon={UserPlus}>Agregar persona</AccionNoDisponible>}
      />
      <div className={estilos.pagina}>
        <p className={estilos.notaInfo}>
          El juez central arma las series y carga los resultados desde su panel. Los jueces de largada y de llegada le
          dictan los tiempos.
        </p>
        <Tarjeta titulo="Equipo" meta={String(equipo.length)}>
          {roles.map((rol) => (
            <section key={rol} aria-label={rol}>
              <h3 className={`${estilos.grupoRol} ${estilos.etiqueta}`}>{rol}</h3>
              <ul className={estilos.lista}>
                {equipo
                  .filter((m) => m.rol === rol)
                  .map((m) => (
                    <li key={m.id} className={estilos.fila}>
                      <span className={estilos.filaTexto}>
                        <span className={estilos.filaNombre}>{m.nombre}</span>
                        <span className={estilos.itemMeta}>{m.rol}</span>
                      </span>
                      <AccionNoDisponible variant="icono" icon={Trash2} label={`Quitar a ${m.nombre}`} />
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </Tarjeta>
      </div>
    </>
  );
}
