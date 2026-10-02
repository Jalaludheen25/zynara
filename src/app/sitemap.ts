import type { MetadataRoute } from 'next'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zynaratech.co'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/about', '/vaqto', '/contact', '/privacy', '/terms'].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : path === '/privacy' || path === '/terms' ? 0.3 : 0.8,
  }))
}
