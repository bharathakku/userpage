'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  MapPin, 
  HelpCircle, 
  FileText, 
  Gift, 
  ChevronRight,
  Edit3,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  const router = useRouter()

  const userProfile = {
    name: 'Ramesh',
    email: 'ramesh@gmail.com',
    phone: '+91 9876543210',
    verified: true,
    gstNumber: null
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* User Profile Section */}
        <Card className="mb-6 border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {/* Profile Avatar */}
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              
              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {userProfile.name}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  {userProfile.email}
                </p>
                <p className="text-sm text-gray-600">
                  {userProfile.verified ? 'Verify Email ID' : 'Email not verified'}
                </p>
              </div>
              
              {/* Edit Profile Button */}
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
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

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          © 2023 YourDelivery — Terms • Privacy • Help
        </div>
      </div>
    </div>
  )
}
