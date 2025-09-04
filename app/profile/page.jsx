'use client'

import { useState } from 'react'
import { User, MapPin, Gift, FileText, Settings, ChevronRight, Copy, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfilePage() {
  const [referralCode] = useState('RBI-S43')
  const [copied, setCopied] = useState(false)

  const userProfile = {
    name: 'Ramesh',
    phone: '+91 9876543210',
    email: 'ramesh@example.com',
    profileType: 'Partner Enterprise',
    joinDate: 'Nov 2023'
  }

  const savedAddresses = [
    { id: 1, type: 'Home', address: '12 Bagh Street, Chanakyapuri, GA - 403501', isDefault: true },
    { id: 2, type: 'Office', address: '115 India Buildings Fort, TN - 600001', isDefault: false }
  ]

  const referralStats = {
    totalReferred: 3,
    totalEarned: 200,
    pendingEarnings: 50
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const menuItems = [
    { icon: User, title: 'Personal Information', subtitle: 'Update your details' },
    { icon: MapPin, title: 'Saved Addresses', subtitle: `${savedAddresses.length} addresses`, count: savedAddresses.length },
    { icon: Settings, title: 'App Settings', subtitle: 'Notifications, privacy' },
    { icon: FileText, title: 'Terms and Conditions', subtitle: 'Read our terms' },
    { icon: FileText, title: 'Privacy Policy', subtitle: 'How we protect your data' }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{userProfile.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm font-medium">
                      {userProfile.profileType}
                    </span>
                    <span className="text-sm text-gray-500">Since {userProfile.joinDate}</span>
                  </CardDescription>
                </div>
                <Button variant="outline">Edit</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{userProfile.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userProfile.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {menuItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500">{item.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Saved Addresses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Saved Addresses</CardTitle>
                <Button variant="outline" size="sm">Add Address</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {savedAddresses.map((address) => (
                <div key={address.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{address.type}</p>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{address.address}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Referral */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Referral Card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Gift className="h-5 w-5" />
                  Refer and Earn ₹200
                </CardTitle>
                <CardDescription className="text-green-700">
                  Your referral code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-green-800">{referralCode}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyReferralCode}
                      className="text-green-700 border-green-300 hover:bg-green-50"
                    >
                      {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Friends referred:</span>
                    <span className="font-semibold">{referralStats.totalReferred}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total earned:</span>
                    <span className="font-semibold text-green-600">₹{referralStats.totalEarned}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending:</span>
                    <span className="font-semibold text-orange-600">₹{referralStats.pendingEarnings}</span>
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Share className="h-4 w-4 mr-2" />
                  Share Code
                </Button>
              </CardContent>
            </Card>

            {/* How it works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How it works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-xs font-bold">1</span>
                    </div>
                    <p>Share your referral code with friends</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-xs font-bold">2</span>
                    </div>
                    <p>They sign up and complete their first booking</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-xs font-bold">3</span>
                    </div>
                    <p>Both you and your friend get ₹200 credit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Referral History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Gift className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No referral history yet</p>
                  <p className="text-xs text-gray-400">Start referring friends to see your earnings</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
