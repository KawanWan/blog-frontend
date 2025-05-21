import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Seu Blog',
  description: 'Frontend do blog com TailwindCSS e Next.js',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}