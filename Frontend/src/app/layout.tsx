import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NextUIProvider from '@/app/componentes/providers/NextUIProvider'
import ThemeProvider from './componentes/providers/ThemeProvider'
import NextAuthProvider from './componentes/providers/NextAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlipBoard',
  description: 'Plataforma de aprendizaje basada en aula invertida',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NextAuthProvider>
            <ThemeProvider>
              <NextUIProvider>
                {children}
              </NextUIProvider>
            </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
