'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, ShoppingBag, CreditCard, Settings } from 'lucide-react'

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    activeColor: 'text-blue-600',
    activeBg: 'bg-blue-100'
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingBag,
    activeColor: 'text-green-600',
    activeBg: 'bg-green-100'
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: CreditCard,
    activeColor: 'text-purple-600',
    activeBg: 'bg-purple-100'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    activeColor: 'text-gray-600',
    activeBg: 'bg-gray-100'
  }
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  // Don't show bottom nav on booking flow pages
  const hiddenPaths = ['/booking', '/login', '/register', '/onboarding']
  const shouldHide = hiddenPaths.some(path => pathname?.startsWith(path))
  
  // Special case: profile route should highlight Settings tab
  const getIsActive = (item) => {
    if (item.href === '/') {
      return pathname === '/'
    }
    if (item.href === '/settings') {
      return pathname?.startsWith('/settings') || pathname?.startsWith('/profile')
    }
    return pathname?.startsWith(item.href)
  }

  if (shouldHide) return null

  return (
    // Bottom Navigation - Only visible on mobile
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 sm:hidden">
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = getIsActive(item)
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${
                isActive 
                  ? `${item.activeColor}` 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                isActive ? item.activeBg : 'hover:bg-gray-50'
              }`}>
                <Icon 
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`} 
                />
              </div>
              <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                isActive ? 'scale-105' : 'scale-100'
              }`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
