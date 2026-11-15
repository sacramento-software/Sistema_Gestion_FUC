'use client';

import { Download, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { SelectorTema } from '@/components/cascaras/SelectorTema';
import { AccionNoDisponible } from '@/components/demo';
import {
  Button,
  Card,
  Carriles,
  CategoryTag,
  Checkbox,
  CompetitionCard,
  Dialog,
  EstadoSerieBadge,
  Filete,
  Icon,
  IconButton,
  Input,
  Logo,
  PhaseTrack,
  PuntoEnVivo,
  Radio,
  ResultsTable,
  Select,
  StatusBadge,
  Switch,
  Tabs,
  Time,
  Toast,
  Tooltip,
} from '@/components/ds';
import type { Tema } from '@/lib/tema-cookie';
import estilos from './catalogo.module.css';

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className={estilos.seccion}>
      <h2 className={estilos.subtitulo}>{titulo}</h2>
      <div className={estilos.fila}>{children}</div>
    </section>
  );
}

const FILAS = [
  { pos: 1, carril: 4, nombre: 'Martina Rodríguez', club: 'ACAL Náutico Club', tiempo: '1:41.27' },
  { pos: 2, carril: 5, nombre: 'Lucía Pereyra', club: 'Club Remeros', tiempo: '1:42.05', diferencia: '+0.78' },
  { pos: 3, carril: 3, nombre: 'Camila Techera', club: 'Club Canotaje Sur', tiempo: '1:43.90', diferencia: '+2.63' },
  { pos: '—', carril: 6, nombre: 'Julieta Barrios', club: 'Club del Lago', tiempo: 'DNF' },
];

export function Catalogo({ temaInicial }: { temaInicial: Tema }) {
  const [dialogo, setDialogo] = useState(false);
  const [pestana, setPestana] = useState('series');
  const [chip, setChip] = useState('K1 500 m');
  const [opcion, setOpcion] = useState('a');

  return (
    <div className={estilos.pagina}>
      <header className={estilos.cabecera}>
        <h1 className={estilos.titulo}>Catálogo del DS</h1>
        <SelectorTema temaInicial={temaInicial} />
      </header>

      <Seccion titulo="Button">
        <Button>Primario</Button>
        <Button variant="secundario">Secundario</Button>
        <Button variant="terciario">Terciario</Button>
        <Button variant="peligro">Peligro</Button>
        <Button disabled>Deshabilitado</Button>
        <Button size="sm" icon={Plus}>
          Chico con ícono
        </Button>
        <Button iconRight={Download}>Ícono a la derecha</Button>
        <Button href="/catalogo-ds" variant="secundario">
          Como enlace
        </Button>
      </Seccion>

      <Seccion titulo="IconButton e Icon">
        <IconButton icon={Search} label="Buscar" />
        <IconButton icon={Pencil} label="Editar" variant="borde" />
        <IconButton icon={Trash2} label="Quitar" disabled />
        <Icon icono={Plus} size={16} label="Más" />
        <Icon icono={Plus} size={24} />
      </Seccion>

      <Seccion titulo="AccionNoDisponible (5 variantes)">
        <AccionNoDisponible icon={Plus}>Crear competencia</AccionNoDisponible>
        <AccionNoDisponible variant="secundario">Editar</AccionNoDisponible>
        <AccionNoDisponible variant="terciario">Quitar</AccionNoDisponible>
        <AccionNoDisponible variant="peligro" size="sm">
          Borrar
        </AccionNoDisponible>
        <AccionNoDisponible variant="icono" icon={Pencil} label="Corregir tiempo" />
      </Seccion>

      <Seccion titulo="StatusBadge, EstadoSerieBadge y PuntoEnVivo">
        <StatusBadge estado="abiertas" />
        <StatusBadge estado="cerradas" />
        <StatusBadge estado="curso" />
        <StatusBadge estado="finalizada" />
        <EstadoSerieBadge estado="armada" />
        <EstadoSerieBadge estado="en-vivo" />
        <EstadoSerieBadge estado="terminada" />
        <EstadoSerieBadge estado="publicada" />
        <EstadoSerieBadge estado="terminada">Resultados en revisión</EstadoSerieBadge>
        <PuntoEnVivo />
        <PuntoEnVivo tamano={14} />
      </Seccion>

      <Seccion titulo="CategoryTag">
        <CategoryTag>K1</CategoryTag>
        {['K1 500 m', 'K2 500 m', 'C1 200 m'].map((c) => (
          <CategoryTag key={c} seleccionado={chip === c} onClick={() => setChip(c)}>
            {c}
          </CategoryTag>
        ))}
        <CategoryTag href="/catalogo-ds">Como enlace</CategoryTag>
      </Seccion>

      <Seccion titulo="PhaseTrack">
        <PhaseTrack actual={2} className={estilos.ancho} />
      </Seccion>

      <Seccion titulo="Tabs">
        <Tabs
          className={estilos.ancho}
          value={pestana}
          onChange={setPestana}
          items={[
            { id: 'series', label: 'Series', count: 3 },
            { id: 'semis', label: 'Semifinales', count: 2 },
            { id: 'final', label: 'Final' },
          ]}
        />
        <Tabs
          className={estilos.ancho}
          value="b"
          items={[
            { id: 'a', label: 'Con enlaces', href: '/catalogo-ds?a' },
            { id: 'b', label: 'Activa', href: '/catalogo-ds?b' },
          ]}
        />
      </Seccion>

      <Seccion titulo="Formularios">
        <Input label="Nombre" placeholder="Escribí un nombre" hint="Texto de ayuda" />
        <Input label="Tiempo" mono defaultValue="1:41.27" />
        <Input label="Con error" error="Revisá este dato." defaultValue="abc" />
        <Input label="Solo lectura" soloLectura defaultValue="Valor precargado" />
        <Input label="Deshabilitado" disabled defaultValue="No editable" />
        <Select label="Bote" options={['K1', 'K2', 'K4']} defaultValue="K2" />
        <Select label="Bote en solo lectura" soloLectura options={['K1', 'K2', 'K4']} defaultValue="K2" />
        <Checkbox label="Opción marcada" defaultChecked hint="Con ayuda" />
        <Checkbox label="Opción sin marcar" />
        <Radio label="Opción A" name="r" value="a" checked={opcion === 'a'} onChange={(v) => setOpcion(v ?? 'a')} />
        <Radio label="Opción B" name="r" value="b" checked={opcion === 'b'} onChange={(v) => setOpcion(v ?? 'a')} />
        <Switch label="Interruptor" defaultChecked />
      </Seccion>

      <Seccion titulo="Toast">
        <Toast titulo="Inscripción confirmada." className={estilos.ancho}>
          El club quedó registrado.
        </Toast>
        <Toast tipo="error" titulo="No pudimos guardar los resultados." className={estilos.ancho}>
          Revisá tu conexión y volvé a intentar.
        </Toast>
        <Toast tipo="info" onClose={() => {}} className={estilos.ancho}>
          Mensaje informativo con botón de cierre.
        </Toast>
      </Seccion>

      <Seccion titulo="Tooltip y Dialog">
        <Tooltip texto="Texto de ayuda">
          <Button variant="secundario">Pasá el mouse o enfocá</Button>
        </Tooltip>
        <Button onClick={() => setDialogo(true)}>Abrir diálogo</Button>
        <Dialog
          open={dialogo}
          titulo="Título del diálogo"
          onClose={() => setDialogo(false)}
          acciones={
            <>
              <Button variant="secundario" onClick={() => setDialogo(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setDialogo(false)}>Aceptar</Button>
            </>
          }
        >
          Se cierra con Escape, con la cruz y al tocar el velo. El foco queda atrapado adentro.
          <Input label="Campo de prueba" />
        </Dialog>
      </Seccion>

      <Seccion titulo="Card, Filete y Logo">
        <Card filete className={estilos.tarjeta}>
          Tarjeta con filete.
        </Card>
        <Card href="/catalogo-ds" className={estilos.tarjeta}>
          Tarjeta como enlace.
        </Card>
        <div className={estilos.ancho}>
          <Filete />
        </div>
        <Logo />
        <Logo variante="firma" />
        <Logo variante="horizontal" tamano={96} />
      </Seccion>

      <Seccion titulo="CompetitionCard">
        <CompetitionCard
          className={estilos.tarjeta}
          nombre="Campeonato Nacional de Velocidad"
          fecha="Sáb 25 y dom 26 de julio"
          estado="curso"
          imagen="/imagenes/canotaje5.jpg"
          href="/catalogo-ds"
        />
        <CompetitionCard
          className={estilos.tarjeta}
          nombre="Campeonato Nacional Short Race"
          fecha="Sáb 8 de agosto"
          sede="San Gregorio de Polanco, Río Negro"
          disciplina="Short Race"
          estado="abiertas"
          cierre="3 de agosto"
          categorias={['K1', 'K2']}
        />
      </Seccion>

      <Seccion titulo="Time y ResultsTable">
        <Time valor="1:41.27" tamano="xl" />
        <Time valor="38.92" diferencia="+0.78" tamano="l" />
        <Time valor="DNF" apagado />
        <ResultsTable
          className={estilos.ancho}
          titulo="Final A · K1 500 m · Junior · Femenino"
          estado="finalizada"
          final
          filas={FILAS}
          nota="DNF: no terminó"
        />
        <ResultsTable
          className={estilos.ancho}
          titulo="Serie 1 · compacta"
          estado="curso"
          compacto
          destacado={5}
          filas={FILAS}
        />
      </Seccion>

      <Seccion titulo="Carriles">
        <Carriles cantidad={5} destacado={3} className={estilos.ancho} />
        <Carriles tono="claro" cantidad={4} destacado={2} className={estilos.ancho} />
      </Seccion>
    </div>
  );
}
