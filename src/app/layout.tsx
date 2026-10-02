import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif, Sora } from 'next/font/google'
import { meta } from '@/content/site'
import { TransitionProvider } from '@/components/layout/TransitionProvider'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { PageAnimations } from '@/components/layout/PageAnimations'
import { Cursor } from '@/components/layout/Cursor'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' })
const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap', preload: false })
const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zynaratech.co'),
  title: { default: meta.title, template: '%s | Zynara Tech' },
  description: meta.description,
  applicationName: 'Zynara Tech',
  openGraph: {
    type: 'website',
    siteName: 'Zynara Tech',
    title: meta.title,
    description: meta.description,
    locale: 'en_AE',
  },
  twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
}

export const viewport: Viewport = {
  themeColor: '#080d1b',
  colorScheme: 'dark',
}

// Runs before first paint: enables the JS-only pre-animation states, honours
// reduced motion, and falls back to fully visible content if motion never boots.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('anim-off');setTimeout(function(){if(!d.classList.contains('anim-ready'))d.classList.add('anim-off')},6000)})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <TransitionProvider>
          <SmoothScroll />
          <Header />
          <div id="page">
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
          </div>
          <PageAnimations />
        </TransitionProvider>
        <Cursor />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  )
}
