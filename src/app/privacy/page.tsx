import type { Metadata } from 'next'
import { privacy, terms } from '@/content/site'
import { LegalDocument } from '@/components/legal/LegalDocument'

export const metadata: Metadata = {
  title: privacy.title,
  description: privacy.intro,
}

export default function PrivacyPage() {
  return (
    <LegalDocument
      doc={privacy}
      related={[
        { label: terms.title, href: '/terms' },
        { label: 'Contact', href: '/contact' },
      ]}
    />
  )
}
