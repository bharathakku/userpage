'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/header'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import NotificationContainer from '@/components/ui/notification'
// Route protection is handled by Next middleware; this shell just renders layout

export default function AppShell({ children }) {
  const pathname = usePathname()
  const isAuthRoute = pathname?.startsWith('/auth/')

  if (isAuthRoute) {
    return (
      <main className="min-h-screen">
        {children}
        <NotificationContainer />
      </main>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pb-16 sm:pb-0">
        {children}
      </main>
      <MobileBottomNav />
      <NotificationContainer />
    </>
  )
}


