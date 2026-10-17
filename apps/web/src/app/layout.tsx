import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark antialiased`}>
      <body className="font-sans bg-[#090d16] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 min-h-screen">
        {children}
      </body>
    </html>
  )
}
