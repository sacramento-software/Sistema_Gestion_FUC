import { Trash2, UserPlus } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';
import { Tarjeta } from '@/components/vistas/federacion-resto/Bloques';
import estilos from '@/components/vistas/federacion-resto/federacion-resto.module.css';
import { BarraGestion } from '@/components/vistas/comun/BarraGestion';
import { listarEquipoFederacion } from '@/datos';
import { sinTildes } from '@/datos/texto';
import { rutas } from '@/lib/rutas';

const ROL_PRIMERO = 'Juez central';

const primero = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

export default async function JuecesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; rol?: string | string[] }>;
}) {
  const parametros = await searchParams;
  const q = primero(parametros.q).trim();
  const rolPedido = primero(parametros.rol);
  const todo = listarEquipoFederacion();
  const equipo = todo.filter(
    (m) => (!rolPedido || m.rol === rolPedido) && (!q || sinTildes(m.nombre).includes(sinTildes(q))),
  );

  // Agrupado por rol, con el juez central primero y el resto en el orden de los datos.
  const rolesTodos = [...new Set(todo.map((m) => m.rol))];
  const roles = [...new Set(equipo.map((m) => m.rol))].sort(
    (a, b) => Number(b === ROL_PRIMERO) - Number(a === ROL_PRIMERO),
  );

  return (
    <>
      <EncabezadoPanel
        titulo="Jueces y equipo"
        subtitulo={`${todo.length} personas`}
      />
      <div className={estilos.pagina}>
        <BarraGestion
          accion={rutas.panel.federacion.jueces()}
          placeholder="Buscar por nombre"
          q={q}
          filtro={{
            nombre: 'rol',
            etiqueta: 'Todos los roles',
            opciones: rolesTodos.map((r) => ({ value: r, label: r })),
            actual: rolPedido,
          }}
          alta={<AccionNoDisponible icon={UserPlus}>Agregar persona</AccionNoDisponible>}
        />
        <p className={estilos.notaInfo}>
          El juez central arma las series y carga los resultados desde su panel. Los jueces de largada y de llegada le
          dictan los tiempos.
        </p>
        <Tarjeta titulo="Equipo" meta={String(equipo.length)}>
          {equipo.length === 0 && <p className={estilos.notaInfo}>No hay personas con este filtro.</p>}
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
