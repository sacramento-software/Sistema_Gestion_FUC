import { Download, Mail } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';
import { Chip, GraficoBarras, Metrica, Tarjeta } from '@/components/vistas/federacion-resto/Bloques';
import { botesPorCompetencia, totalBotes } from '@/components/vistas/federacion-resto/calculos';
import estilos from '@/components/vistas/federacion-resto/federacion-resto.module.css';
import { cantidadDe, pesos } from '@/components/vistas/federacion-resto/formato';
import { listarClubes } from '@/datos';
import { ARANCEL_POR_BOTE, cuotasClubes } from '@/datos/extra/08-federacion-resto';
import { anioTemporada, fechaRelativa, formatearFecha, hoyDemoISO } from '@/dominio';

export default function ContabilidadPage() {
  const hoy = hoyDemoISO();
  const clubes = new Map(listarClubes().map((c) => [c.id, c]));

  const filas = cuotasClubes
    .map((cuota) => {
      const fecha = fechaRelativa(cuota.dias, hoy);
      const texto = formatearFecha(fecha, 'media');
      return {
        ...cuota,
        nombre: clubes.get(cuota.clubId)?.nombre ?? cuota.clubId,
        fechaTexto: cuota.alDia ? `Pagó el ${texto}` : cuota.dias < 0 ? `Venció el ${texto}` : `Vence el ${texto}`,
      };
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  const cobradas = filas.filter((f) => f.alDia);
  const pendientes = filas.filter((f) => !f.alDia);
  const suma = (lista: typeof filas) => lista.reduce((n, f) => n + f.monto, 0);
  const porCompetencia = botesPorCompetencia();

  return (
    <>
      <EncabezadoPanel
        titulo="Contabilidad"
        subtitulo={`Temporada ${anioTemporada(hoy)}`}
        acciones={
          <AccionNoDisponible icon={Download}>
            Exportar planilla
          </AccionNoDisponible>
        }
      />
      <div className={estilos.pagina}>
        <div className={`${estilos.metricas} ${estilos.metricas3}`}>
          <Metrica
            etiqueta="Cuotas cobradas"
            valor={pesos(suma(cobradas))}
            detalle={cantidadDe(cobradas.length, 'club', 'clubes')}
          />
          <Metrica
            etiqueta="Cuotas pendientes"
            valor={pesos(suma(pendientes))}
            detalle={cantidadDe(pendientes.length, 'club', 'clubes')}
          />
          <Metrica
            etiqueta="Ingresos por inscripciones"
            valor={pesos(totalBotes() * ARANCEL_POR_BOTE)}
            detalle={`${cantidadDe(totalBotes(), 'bote', 'botes')} a ${pesos(ARANCEL_POR_BOTE)}`}
          />
        </div>

        <Tarjeta titulo="Cuotas de los clubes" meta={`${filas.length} clubes`}>
          <table className={estilos.tabla}>
            <thead>
              <tr>
                <th scope="col">Club</th>
                <th scope="col">Monto</th>
                <th scope="col">Estado</th>
                <th scope="col">Fecha</th>
                <th scope="col">
                  <span className={estilos.ocultoVisual}>Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.clubId}>
                  <td data-etiqueta="Club">
                    <strong>{f.nombre}</strong>
                  </td>
                  <td data-etiqueta="Monto" className={estilos.mono}>
                    {pesos(f.monto)}
                  </td>
                  <td data-etiqueta="Estado">
                    <Chip tono={f.alDia ? 'exito' : 'peligro'}>{f.alDia ? 'Al día' : 'Pendiente'}</Chip>
                  </td>
                  <td data-etiqueta="Fecha">{f.fechaTexto}</td>
                  <td data-etiqueta="" className={estilos.derecha}>
                    {!f.alDia && (
                      <AccionNoDisponible variant="icono" icon={Mail} label={`Enviar recordatorio a ${f.nombre}`} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tarjeta>

        <GraficoBarras
          titulo="Ingresos por inscripciones por competencia"
          datos={porCompetencia.map((c) => ({
            etiqueta: c.nombre,
            valor: c.botes * ARANCEL_POR_BOTE,
            texto: pesos(c.botes * ARANCEL_POR_BOTE),
          }))}
          nota={`Arancel de ${pesos(ARANCEL_POR_BOTE)} por bote inscripto.`}
        />
      </div>
    </>
  );
}
