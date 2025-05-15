import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WalletContextProvider from './components/WalletProvider/page'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agentic Web3',
  description: 'AI-powered Web3 assistant',
  icons: {
    icon: '/lo-go.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  )
} 