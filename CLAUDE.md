# Alcance y criterios — Demo FUC

Documento rector para quien redacta las specs y para los agentes que las ejecutan. Toda spec lo da por leído. En la spec 1 se copia como `CLAUDE.md` del repo `sacramento-software/Sistema_Gestion_FUC`. Fecha: 15/11/2026.

---

## 1. Qué es

- Una **demo** del sistema de gestión de competencias de la Federación Uruguaya de Canotaje (FUC). Nicolás le manda el link al presidente, Sebastián Gómez, y él **la explora solo**, sin guía.
- Objetivo: que vea el sistema como si ya estuviera terminado y en uso, y quiera comprarlo. Después de la demo se habla de alcance y precio, **fuera** del sistema.
- **Todo es estático.** Los datos vienen precargados en el repo. No hay base de datos y nada se guarda. Lo que no está implementado se ve, pero deshabilitado y con un aviso.
- Tiene que parecer profesional y terminado. Es preferible una vista menos que una vista a medias.

## 2. Qué funciona y qué no

**Funciona (son interacciones que no guardan nada):**
- Ingreso con los atajos `admin` (Federación), `juez` (Juez central) y `delegado` (Delegado de ACAL Náutico Club), y "Cerrar sesión". El rol se fija al ingresar y no se cambia adentro.
- Navegar: menús, enlaces, pestañas, elegir una serie, un evento o una competencia de una lista.
- Filtrar y buscar sobre los datos cargados.
- Abrir y cerrar la ficha del deportista.
- Modo noche.
- "Compartir", que copia el enlace.

**No funciona.** Todo lo que crea, modifica, borra, envía, importa o exporta se muestra **deshabilitado** con el componente compartido de acción no disponible (spec 1):
- Se ve como deshabilitado y lleva `aria-disabled`, sin `disabled` nativo, para que pueda recibir foco y mostrar el aviso.
- Al pasar el mouse, al enfocarlo o al tocarlo en el celular muestra exactamente: **«Esta funcionalidad no está implementada en la demo.»**
- No navega a ninguna parte y no abre formularios.
- Ejemplos: Crear competencia, Agregar club, Agregar delegado, Agregar deportista, Editar, Importar, Inscribir, Confirmar inscripción, Quitar, Crear serie, Asignar carril, Comenzar, Terminar carrera, Publicar resultados, Corregir tiempo, Guardar configuración.
- Los campos de carga (tiempos, selectores de bote) se muestran con su valor precargado y en solo lectura.

**Nunca aparece:**
- "Próximamente", "Disponible en la versión completa", precios, cotización ni planes.
- "Ver como", "Reiniciar demo", "Cambiar de rol" ni "Duplicar competencia".
- Marcas de "datos de ejemplo". Todo se presenta igual, como un sistema en uso.
- Cédula ni fecha de nacimiento en ninguna vista pública.

## 3. Datos de demo

- Viven en el repo, como módulos TypeScript tipados (spec 3). No hay base de datos, ni Supabase, ni Kysely, ni migraciones.
- **Las fechas son relativas al día en que se mira**, en la zona `America/Montevideo`. Las páginas se generan en cada visita, o se revalidan al menos una vez por día, para que no queden congeladas en la fecha del build.
- **Calendario (los nombres y las sedes son reales; las fechas, relativas):**
  - **Campeonato Nacional de Velocidad**, Lago Calcagno: **en curso hoy**, de dos días (hoy y mañana). Tiene la jornada de hoy con series Publicadas, **una serie En vivo**, una Terminada (en revisión) y el resto Armadas. Es la competencia de las vistas de carrera (P3, P5, J1, J2b).
  - **Campeonato Nacional Short Race**, San Gregorio de Polanco (Río Negro): unos días adelante, **inscripciones abiertas**, con fecha de cierre anterior al inicio. La usa el delegado (D3).
  - **Medio Fondo** y **Promocional (Ranking Menores)**: ya finalizadas, en el pasado, con resultados publicados que alimentan la ficha del deportista y los rankings.
  - La spec 3 fija los desfasajes exactos en días.
- **Personas y clubes:** el único dato real es **ACAL Náutico Club**. Los demás clubes, deportistas, jueces y delegados son ficticios y verosímiles (nombres uruguayos). Hay cantidad suficiente para que las listas se vean llenas.
- Las posiciones, diferencias y puntos **no se escriben a mano**: se calculan con las funciones de dominio de la spec 3 a partir de los tiempos cargados. Así no hay incoherencias.

## 4. Reglas de dominio que todas las vistas respetan

- Una **competencia** tiene **eventos** tomados de un catálogo, con la nomenclatura `K2-500-JUNIOR-F`, que se lee «K2 500 m · Junior · Femenino». Cada evento tiene **fases** (eliminatorias, repechaje, semifinal, final) y cada fase tiene **series** con carriles (de 1 a 9).
- **Bote:** K1 y C1 llevan 1 deportista, K2 y C2 llevan 2, K4 lleva 4. En inscripción, armado y resultado, un bote de K2 o K4 se muestra **como una unidad**.
- **Estados de la serie:** Armada → En vivo → Terminada (en revisión) → Publicada. El público **no ve tiempos** hasta que la serie está Publicada.
- **Estados de la competencia:** Abierta → Cerrada → En curso → Finalizada.
- **Posiciones:** se ordenan por tiempo. No hay empates de tiempo. DSQ, DNS y DNF van al final, con su significado al pie.
- **Tiempos** en formato `m:ss.cc` (1:41.27); por debajo del minuto, sin "0:" (38.92); diferencia con el primero como +0.78.
- **Puntos solo en finales** (Final A y Final B): 10-8-6-5-4-3-2-1. Eliminatorias, repechaje y semifinal no dan puntos. El **podio** (oro, plata y bronce) se marca solo en finales.
- **Avance entre fases:** se muestra como texto ("Avanzan a la final los mejores 3 tiempos") y se marcan los clasificados. En el armado de una fase posterior se listan todos los inscriptos, con la marca "Clasificado".
- El **juez arma las series a mano**. Al delegado, la inscripción le muestra avisos que no bloquean: ficha médica vencida, categoría o sexo distintos al del evento.
- **Categoría** = año de la competencia − año de nacimiento, según rangos configurables.
- **Campeonatos por tipo de evento:** Velocidad, Medio Fondo, Short Race y Promocional. Acumulan los puntos de las finales a lo largo de varias competencias.

## 5. Diseño

- Fuente visual: proyecto de Claude Design **"Proyecto FUC"** (id `bdebccb8-a32b-4f67-83e2-d32201361d2b`), que se lee con las herramientas MCP de Claude Design.
- **Vistas diseñadas:**
  - `Home Deportivo` es la home (P1) y la referencia de estilo.
  - `00 Cáscara pública`, `00 Cáscara panel`, `00 Ingreso`, `P3`, `P5`, `P6`, `J1`, `J2b` y `D3`.
- **Vistas sin diseño:** D1, D2, F1 a F8, P2, P4, P7 y P8. Se construyen con los tokens y componentes del FUC DS, siguiendo el patrón de la vista diseñada más parecida.
- Los archivos de Claude Design traen recursos de presentación que **no se portan**: controles "Vista previa del rol", tableros de ancho fijo puestos lado a lado, títulos "Vista piloto · 00" y textos explicativos para el diseñador. Lo que se porta es la pantalla, de forma responsive y fluida.
- **Modo claro por defecto**, con modo noche disponible. Voseo y formato oración, sin emojis.
- **Responsive real:** lo público es para el celular primero, con zonas táctiles de 48 px o más y sin desplazamiento horizontal. El panel es para la computadora, pero tiene que poder usarse en el celular.

## 6. Qué manda cuando dos fuentes se contradicen

1. Este documento.
2. La spec de la pieza.
3. La bitácora (sección 9) de `MAPA-VISTAS.md`.
4. El archivo de Claude Design de la vista.
5. El resto de `MAPA-VISTAS.md`.
6. El README del FUC DS.

`DECISIONES.md` y `EXTRACCION-NEGOCIO.md` son contexto histórico: donde contradicen lo anterior, no aplican.

## 7. Stack

- Next.js 16 (App Router, Server Components) y TypeScript estricto.
- CSS con los tokens del FUC DS como variables, sin Tailwind.
- Íconos de Lucide.
- Vercel Hobby (el repo es público).
- Sin base de datos ni servicios externos.
- La sesión es una cookie firmada que guarda el rol. El secreto va en una variable de entorno, nunca en el repo.

## 8. Cómo trabajan los agentes ejecutores

**Autonomía.** Este apartado reemplaza, **solo dentro de este repo**, las reglas globales de preguntar antes de implementar, confirmar que se entendió el plan e ir paso a paso.
- El agente ejecuta su spec de corrido hasta cumplir los criterios de aceptación, **sin hacer preguntas**.
- Ante algo ambiguo, elige la opción más simple que sea coherente con este documento y con el guion (sección 9), y la anota en la sección **"Decisiones tomadas"** de su PR.
- Solo se detiene si necesita credenciales, cuentas o servicios externos que no tiene. En ese caso deja todo lo demás hecho y lo explica en el PR.

**Contrato congelado.** Después de las specs 1 a 3, ninguna spec de vistas modifica lo siguiente:
- los componentes del DS ni el componente de acción no disponible;
- las cáscaras;
- la sesión;
- los datos existentes ni las funciones de dominio.

Si a una vista le faltan datos, los agrega en un archivo nuevo propio, sin tocar los existentes, y lo anota en el PR.

**Git:**
- Cada spec va en una rama `feature/NN-nombre` creada desde `develop`.
- Abre un PR a `develop`.
- El orquestador mergea cuando la CI está en verde y `/code-review` no deja hallazgos graves.
- El paso de `develop` a `staging` (lo que ve Sebastián) lo aprueba Nicolás.
- No se edita nada directo en `develop`, `staging` ni `main`.
- Sin atribución de IA en commits ni PRs: nada de `Co-Authored-By` ni "Generated with".
- Nada destructivo (`reset --hard`, `push --force`).

**Calidad:**
- Lint, typecheck y build en verde, en la CI.
- Tests solo de las funciones de dominio (formato de tiempos, posiciones, puntos, categoría, armado de botes).
- Antes del PR, revisar la vista en el navegador a 390 px y a 1280 px.

## 9. Guion de la demo (lo que ninguna pieza puede romper)

1. Sebastián abre el link y ve la **home** con una carrera **en vivo** destacada.
2. Toca la carrera y ve la **serie en vivo**, con carriles, deportistas y clubes.
3. Va a la **competencia**: ve el programa de hoy, filtra por categoría y abre un **resultado publicado** con posiciones, tiempos y, si es una final, puntos y podio.
4. Toca un nombre y se abre la **ficha del deportista**: club, categoría, mejores tiempos, últimas carreras y campeonatos.
5. Toca **"Ingresar" → Federación**: ve el tablero, las competencias, el centro de gestión de una competencia y el catálogo. Las acciones de alta y edición están deshabilitadas, con su aviso.
6. **Cierra sesión → Delegado**: ve la Short Race con las inscripciones abiertas, el plantel de su club con una ficha médica vencida y el armado de una inscripción de K2, en solo lectura.
7. **Cierra sesión → Juez central**: ve la jornada, la consola con la serie en vivo y los tiempos cargados, una serie terminada con las posiciones calculadas y el armado de series.
8. Recorre rankings, noticias, contabilidad y estadísticas, que muestran el alcance futuro.

## 10. Corte en specs (después del cambio a "todo estático")

| # | Spec | Contenido | Depende de |
|---|---|---|---|
| 1 | Esqueleto | Next 16, tokens y componentes del DS, componente de acción no disponible, cáscara pública y de panel, CI, Vercel con preview por PR, este documento como `CLAUDE.md` | — |
| 2 | Ingreso y sesión | 00 Ingreso con atajos, cookie firmada, control de rol en el servidor, "Cerrar sesión" | 1 |
| 3 | Datos de demo | Módulos tipados, fechas relativas, funciones de dominio con tests | 1 |
| 4 | Público: seguir una regata | Home Deportivo, P3, P5, P6 | 1, 3 |
| 5 | Panel del juez | J1 y J2b, en lectura | 1, 2, 3 |
| 6 | Panel del delegado | D1, D2 y D3, en lectura | 1, 2, 3 |
| 7 | Federación: gestión | F1 a F4 | 1, 2, 3 |
| 8 | Federación: resto | F5 a F8 | 1, 2, 3 |
| 9 | Público: resto | P2, P4, P7, P8 | 1, 3 |

- **Ola 1:** la spec 1, y después la 2 y la 3 en paralelo.
- **Ola 2:** dos orquestadores con Sonnet, de 3 specs cada uno, cada spec en su worktree:
  - A: 4, 5 y 9.
  - B: 6, 7 y 8.
