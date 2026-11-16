import { describe, expect, it } from 'vitest';
import { firmarRol, leerRolFirmado } from './sesion-cookie';
import { buscarCuenta } from './credenciales';

describe('cookie de sesión firmada', () => {
  it('acepta un valor firmado por el servidor', () => {
    expect(leerRolFirmado(firmarRol('juez'))).toBe('juez');
  });

  it('rechaza el rol cambiado a mano con la firma de otro', () => {
    const firma = firmarRol('delegado').split('.')[1];
    expect(leerRolFirmado(`federacion.${firma}`)).toBeNull();
  });

  it('rechaza formatos inválidos sin lanzar', () => {
    for (const valor of [undefined, '', 'juez', 'juez.', 'otro.abc', 'a.b.c', `juez.${'x'.repeat(200)}`]) {
      expect(leerRolFirmado(valor)).toBeNull();
    }
  });
});

describe('buscarCuenta', () => {
  it('ignora mayúsculas y espacios del usuario', () => {
    expect(buscarCuenta('ADMIN ', 'demo')?.rol).toBe('federacion');
  });

  it('rechaza contraseña incorrecta o campos vacíos', () => {
    expect(buscarCuenta('delegado', 'delegado26')).toBeNull();
    expect(buscarCuenta('', '')).toBeNull();
    expect(buscarCuenta('juez', 'Demo')).toBeNull();
  });
});
