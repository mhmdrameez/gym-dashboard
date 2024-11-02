import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gym Flow',
    short_name: 'GymFlow',
    description: 'A Progressive Web App for gym enthusiasts to connect and track their progress.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f0f0f0',
    theme_color: '#4CAF50', // Green, often associated with health and fitness
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
