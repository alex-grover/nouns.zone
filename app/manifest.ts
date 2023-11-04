import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'nouns.zone',
    short_name: 'nouns.zone',
    description: 'All things Nouns on Farcaster',
    display: 'standalone',
    theme_color: 'white',
    start_url: '/',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
