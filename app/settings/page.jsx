'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  MapPin, 
  HelpCircle, 
  FileText, 
  Gift, 
  ChevronRight,
  Edit3,
  Plus,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useApp } from '@/contexts/AppContext'

export default function SettingsPage() {
  const router = useRouter()
  const { state, api, dispatch, actionTypes } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  // ensure user is loaded so we show latest values
  useEffect(() => {
    if (!state.user?.isAuthenticated) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        if (token) api.getUserProfile()
      } catch {}
    }
  }, [])

  // derive display values from context or localStorage fallback
  useEffect(() => {
    const local = (() => { try { return JSON.parse(localStorage.getItem('user_data') || '{}') } catch { return {} } })()
    setName(state.user?.name || local.name || '—')
    setEmail(state.user?.email || local.email || '—')
  }, [state.user?.name, state.user?.email])

  const settingsMenuItems = [
    {
      icon: MapPin,
      title: 'Saved Addresses',
      subtitle: 'Manage your shipping addresses',
      href: '/settings/saved-addresses',
      hasChevron: true
    },
    {
      icon: Gift,
      title: 'Refer and earn ₹200',
      subtitle: 'Invite friends and earn',
      href: '/settings/referral',
      hasChevron: true,
      highlight: true
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get assistance',
      href: '/settings/help-support',
      hasChevron: true
    },
    {
      icon: FileText,
      title: 'Terms and Conditions',
      subtitle: 'Read the rules',
      href: '/settings/terms',
      hasChevron: true
    }
  ]

  const handleNavigation = (href) => {
    if (href) {
      router.push(href)
    }
  }

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    } catch {}
    dispatch && dispatch({ type: actionTypes.LOGOUT_USER })
    router.replace('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* User Profile Section */}
        <Card className="mb-6 border-2 border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Profile Avatar */}
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              
              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  {name}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  {email}
                </p>
                <p className="text-sm text-gray-600">
                  Verify Email ID
                </p>
              </div>
              
              {/* Edit Profile Button */}
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-50 self-start sm:self-center"
                onClick={() => router.push('/profile')}
              >
                Edit Profile
              </Button>
            </div>

            {/* GST Details Section */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-800 font-medium mb-1">Add GST Details</p>
                  <p className="text-blue-600 text-sm">
                    Save on taxes and get GST invoice
                  </p>
                </div>
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Add GST Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Menu */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {settingsMenuItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    flex items-center justify-between p-4 cursor-pointer transition-colors
                    ${item.highlight ? 'hover:bg-orange-50' : 'hover:bg-gray-50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon 
                      className={`h-5 w-5 ${
                        item.highlight ? 'text-orange-600' : 'text-gray-600'
                      }`} 
                    />
                    <div>
                      <p className={`font-medium ${
                        item.highlight ? 'text-orange-800' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {item.hasChevron && (
                    <ChevronRight 
                      className={`h-4 w-4 ${
                        item.highlight ? 'text-orange-600' : 'text-gray-400'
                      }`} 
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">You will be redirected to login</p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          © 2023 YourDelivery — Terms • Privacy • Help
        </div>
      </div>
    </div>
  )
}
