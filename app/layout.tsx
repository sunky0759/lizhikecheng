'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import Navigation from './components/Navigation'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.isCollapsed)
    }

    document.body.addEventListener('sidebarToggle', handleSidebarToggle as EventListener)

    return () => {
      document.body.removeEventListener('sidebarToggle', handleSidebarToggle as EventListener)
    }
  }, [])

  return (
    <html lang="zh">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Navigation />
          <main className={`flex-1 p-4 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}

