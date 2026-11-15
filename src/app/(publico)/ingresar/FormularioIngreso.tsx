'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, ClipboardCheck, Eye, EyeOff, Landmark, Timer, X, type LucideIcon } from 'lucide-react';
import { Button, Card, Icon, IconButton, Input, Logo, Toast } from '@/components/ds';
import { CONTRASENA_DEMO } from '@/lib/credenciales';
import { USUARIOS_DEMO, type Rol } from '@/lib/roles';
import { rutas } from '@/lib/rutas';
import { ingresar, type EstadoIngreso } from './acciones';
import estilos from './ingresar.module.css';

const ATAJOS: { rol: Rol; icono: LucideIcon; titulo: string }[] = [
  { rol: 'federacion', icono: Landmark, titulo: 'Federación' },
  { rol: 'delegado', icono: ClipboardCheck, titulo: 'Delegado de ACAL Náutico Club' },
  { rol: 'juez', icono: Timer, titulo: 'Juez central' },
];

const ESTADO_INICIAL: EstadoIngreso = { error: null };

export function FormularioIngreso() {
  const [estado, accion, pendiente] = useActionState(ingresar, ESTADO_INICIAL);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [atajo, setAtajo] = useState<Rol | null>(null);
  const [errorVisible, setErrorVisible] = useState(true);
  const formulario = useRef<HTMLFormElement>(null);
  const enviarPendiente = useRef(false);

  // El `Input` del DS no expone `name`, `autoComplete` ni `autoCapitalize`: se completan acá sobre los
  // elementos reales, y los valores viajan en campos ocultos con `name`.
  useEffect(() => {
    const ajustes: [string, Record<string, string>][] = [
      ['campo-usuario', { autocomplete: 'username', autocapitalize: 'none', spellcheck: 'false' }],
      ['campo-contrasena', { autocomplete: 'current-password' }],
    ];
    for (const [id, atributos] of ajustes) {
      const el = document.getElementById(id);
      for (const [clave, valor] of Object.entries(atributos)) el?.setAttribute(clave, valor);
    }
  }, []);

  // Se envía después de que React aplicó los valores del atajo (los campos ocultos ya están al día).
  useEffect(() => {
    if (enviarPendiente.current) {
      enviarPendiente.current = false;
      formulario.current?.requestSubmit();
    }
  }, [usuario, contrasena, atajo]);

  const alEscribir = (campo: 'usuario' | 'contrasena', valor: string) => {
    if (campo === 'usuario') setUsuario(valor);
    else setContrasena(valor);
    setAtajo(null);
    setErrorVisible(false);
  };

  const elegirAtajo = (rol: Rol) => {
    enviarPendiente.current = true;
    setUsuario(USUARIOS_DEMO[rol].usuario);
    setContrasena(CONTRASENA_DEMO);
    setAtajo(rol);
    setErrorVisible(true);
  };

  const error = errorVisible ? estado.error : null;
  const atajoElegido = ATAJOS.find((a) => a.rol === atajo);

  return (
    <div className={estilos.pagina}>
      <div className={estilos.columna}>
        <Card filete padding={28}>
          <form ref={formulario} action={accion} onSubmit={() => setErrorVisible(true)} className={estilos.formulario}>
            <div className={estilos.cabecera}>
              <Logo variante="sello" tamano={72} />
              <h1 className={estilos.titulo}>Ingresá a la plataforma</h1>
            </div>

            {error && (
              <div role="alert" className={estilos.error}>
                <span className={estilos.errorIcono}>
                  <Icon icono={X} size={14} color="var(--color-peligro-bg)" />
                </span>
                <span>
                  {error === 'servidor' ? (
                    <>
                      <strong>No pudimos iniciar la sesión.</strong> Volvé a intentar en unos minutos.
                    </>
                  ) : (
                    <>
                      <strong>Usuario o contraseña incorrectos.</strong> Revisá los datos o usá una cuenta de demostración.
                    </>
                  )}
                </span>
              </div>
            )}

            <Input
              id="campo-usuario"
              label="Usuario"
              value={usuario}
              onChange={(e) => alEscribir('usuario', e.target.value)}
            />
            <input type="hidden" name="usuario" value={usuario} />

            <div className={estilos.filaContrasena}>
              <Input
                id="campo-contrasena"
                label="Contraseña"
                type={verContrasena ? 'text' : 'password'}
                value={contrasena}
                onChange={(e) => alEscribir('contrasena', e.target.value)}
                className={estilos.campoContrasena}
              />
              <IconButton
                icon={verContrasena ? EyeOff : Eye}
                label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                variant="borde"
                onClick={() => setVerContrasena((v) => !v)}
              />
            </div>
            <input type="hidden" name="contrasena" value={contrasena} />

            <Button type="submit" fullWidth disabled={pendiente}>
              {pendiente ? 'Ingresando…' : 'Ingresar'}
            </Button>

            <Link href={rutas.inicio()} className={estilos.volver}>
              <Icon icono={ArrowLeft} size={18} />
              Volver al sitio
            </Link>
          </form>
        </Card>

        <section aria-labelledby="titulo-demo" className={estilos.demo}>
          <h2 id="titulo-demo" className={estilos.tituloDemo}>
            Cuentas de demostración
          </h2>
          <p className={estilos.subtituloDemo}>Tocá un rol para completar los datos y entrar.</p>
          <div className={estilos.atajos}>
            {ATAJOS.map(({ rol, icono, titulo }) => {
              const elegido = atajo === rol;
              return (
                <button
                  key={rol}
                  type="button"
                  className={estilos.atajo}
                  aria-pressed={elegido}
                  disabled={pendiente}
                  onClick={() => elegirAtajo(rol)}
                >
                  <Icon icono={icono} size={24} />
                  <span className={estilos.atajoTextos}>
                    <strong>{titulo}</strong>
                    <span>
                      Usuario <code className={estilos.codigo}>{USUARIOS_DEMO[rol].usuario}</code>
                    </span>
                  </span>
                  <Icon
                    icono={elegido ? Check : ChevronRight}
                    size={20}
                    color={elegido ? 'var(--color-accion)' : undefined}
                  />
                </button>
              );
            })}
          </div>
        </section>

        {atajoElegido && (
          <Toast tipo="info" titulo={`Ingresando como ${atajoElegido.titulo}.`}>
            Completamos usuario y contraseña por vos.
          </Toast>
        )}
      </div>
    </div>
  );
}
