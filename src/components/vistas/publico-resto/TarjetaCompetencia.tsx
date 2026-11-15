import Link from 'next/link';
import { CategoryTag, Filete, PuntoEnVivo, StatusBadge } from '@/components/ds';
import type { CompetenciaVista } from '@/datos';
import { rutas } from '@/lib/rutas';
import estilos from './TarjetaCompetencia.module.css';

export interface TarjetaCompetenciaProps {
  competencia: CompetenciaVista;
  /** Título de la serie en vivo de esta competencia, si la hay. */
  enVivo?: string;
}

/** Tarjeta de competencia del calendario: toda ella es un enlace a la página de la competencia. */
export function TarjetaCompetencia({ competencia, enVivo }: TarjetaCompetenciaProps) {
  const abierta = competencia.estado === 'abiertas';
  return (
    <Link href={rutas.competencia(competencia.id)} className={estilos.tarjeta}>
      <Filete />
      <div className={estilos.cuerpo}>
        <div className={estilos.fila}>
          <StatusBadge estado={competencia.estado} />
          <span className={estilos.rotulo}>{competencia.tipoTexto}</span>
        </div>
        <h3 className={estilos.nombre}>{competencia.nombre}</h3>
        <div className={estilos.datos}>
          <span>{competencia.fechas.media}</span>
          <span>{competencia.sede}</span>
        </div>
        {enVivo && (
          <p className={estilos.enVivo}>
            <PuntoEnVivo />
            <span>En vivo ahora: {enVivo}</span>
          </p>
        )}
        <div className={estilos.categorias}>
          {competencia.embarcaciones.map((e) => (
            <CategoryTag key={e}>{e}</CategoryTag>
          ))}
        </div>
        {abierta && competencia.cierre && (
          <div className={estilos.cierre}>
            <span>Cierre de inscripción</span>
            <span className={estilos.cierreValor}>{competencia.cierre.texto}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
