'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, User, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Orders', href: '/orders' },
  { name: 'Payments', href: '/payments' },
  { name: 'Settings', href: '/settings' },
  { name: 'Support', href: '/support' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-lg">YD</span>
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 opacity-20 blur-sm group-hover:opacity-30 transition-opacity"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">YourDelivery</h1>
              <p className="text-xs text-gray-500 font-medium">Partner first logistics</p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center space-x-1 bg-gray-50 rounded-full p-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  pathname === item.href
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right side - Search, Notifications, and User */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full hover:bg-gray-100 transition-colors hidden sm:flex"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </Button>
          
          {/* Notifications */}
          <div className="relative hidden sm:block">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></div>
          </div>
          
          {/* User Profile */}
          <Link href="/profile" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 opacity-0 blur-sm group-hover:opacity-20 transition-opacity"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Ramesh</span>
              <p className="text-xs text-gray-500">Partner Enterprise</p>
            </div>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 rounded-full hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300',
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between px-4 py-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full"
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full relative"
                >
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
