import type { Metadata } from 'next'
import { privacy, terms } from '@/content/site'
import { LegalDocument } from '@/components/legal/LegalDocument'

export const metadata: Metadata = {
  title: terms.title,
  description: terms.intro,
}

export default function TermsPage() {
  return (
    <LegalDocument
      doc={terms}
      related={[
        { label: privacy.title, href: '/privacy' },
        { label: 'Contact', href: '/contact' },
      ]}
    />
  )
}
