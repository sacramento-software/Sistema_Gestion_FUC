import { clubPorSigla } from './clubes';
import type { Delegado, MiembroEquipo } from './tipos';
import { slug } from './texto';

function delegado(nombre: string, sigla: string, principal = false): Delegado {
  return { id: slug(nombre), nombre, clubId: clubPorSigla(sigla), principal };
}

/** Uno o dos por club (14 en total). Sin teléfonos ni correos. */
export const delegados: Delegado[] = [
  delegado('Pablo Suárez', 'ACAL', true),
  delegado('Lucía Bentancor', 'ACAL'),
  delegado('Gustavo Carballo', 'CNM', true),
  delegado('Elena Rey', 'CNM'),
  delegado('Mario Quiroga', 'RCO', true),
  delegado('Silvia Altuna', 'CRS', true),
  delegado('Héctor Mello', 'CRS'),
  delegado('Raúl Giacometti', 'CDP', true),
  delegado('Patricia Lamas', 'CKM', true),
  delegado('Walter Dufour', 'CNP', true),
  delegado('Alicia Gadea', 'CNP'),
  delegado('Omar Vignolo', 'CNSL', true),
  delegado('Teresa Brun', 'CNME', true),
  delegado('Julio Cardona', 'KCR', true),
];

function miembro(nombre: string, rol: string): MiembroEquipo {
  return { id: slug(nombre), nombre, rol };
}

/** Jueces y equipo de la Federación. El usuario `admin` es la Federación y no figura acá. */
export const equipoFederacion: MiembroEquipo[] = [
  miembro('Carla Viera', 'Juez central'),
  miembro('Leonel Martirena', 'Juez de largada'),
  miembro('Sandra Olmedo', 'Juez de largada'),
  miembro('Gabriel Sanguinetti', 'Juez de llegada'),
  miembro('Mónica Arrillaga', 'Juez de llegada'),
  miembro('Héctor Pietra', 'Juez de recorrido'),
  miembro('Rosana Iglesias', 'Cronometrista'),
  miembro('Daniel Barbot', 'Cronometrista'),
  miembro('Inés Zunino', 'Administración'),
  miembro('Fabián Cedrés', 'Administración'),
];
