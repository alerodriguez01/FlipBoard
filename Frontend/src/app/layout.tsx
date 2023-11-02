import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import UserProvider from '@/app/componentes/providers/UserProvider'
import NextUIProvider from '@/app/componentes/providers/NextUIProvider'
import ThemeProvider from './componentes/providers/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlipBoard',
  description: 'Plataforma de aprendizaje basada en aula invertida',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <UserProvider>
          <ThemeProvider>
            <NextUIProvider>
              {children}
            </NextUIProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
