import {
  Barlow_Condensed,
  Bodoni_Moda,
  Cormorant_Garamond,
  EB_Garamond,
  IBM_Plex_Mono,
  Public_Sans,
  Source_Serif_4,
} from 'next/font/google';

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--fuente-public-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--fuente-plex-mono',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--fuente-cormorant',
  display: 'swap',
});

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--fuente-barlow',
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--fuente-eb-garamond',
  display: 'swap',
});

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--fuente-bodoni',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--fuente-source-serif',
  display: 'swap',
});

export const clasesFuentes = [
  publicSans.variable,
  plexMono.variable,
  cormorant.variable,
  barlow.variable,
  ebGaramond.variable,
  bodoni.variable,
  sourceSerif.variable,
].join(' ');
