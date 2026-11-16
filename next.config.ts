import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  images: {
    // 75 es el valor por defecto; 95 se usa en las fotos de la portada para que no se vean pastosas.
    qualities: [75, 95],
  },
};

export default nextConfig;
