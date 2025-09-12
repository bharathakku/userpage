'use client'

import { useState } from 'react'
import { MapPin, Clock, Star, Wallet, Plus, ArrowRight, Target, Package, Truck } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const vehicleTypes = [
  {
    id: 'trucks',
    name: 'Trucks',
    subtitle: 'For bulky shipments',
    image: 'https://cdn-icons-png.flaticon.com/512/870/870130.png',
    description: 'For bulk deliveries and heavy items',
    capacity: 'Up to 10 tons',
    gradient: 'from-blue-500 to-blue-600',
    hoverGradient: 'group-hover:from-blue-600 group-hover:to-blue-700'
  },
  {
    id: 'pickup',
    name: 'Pickup Truck',
    subtitle: 'Reliable & Versatile',
    image: '/images/pickup-truck-flaticon.png',
    description: 'Perfect for medium to large deliveries',
    capacity: 'Up to 1000 kg',
    gradient: 'from-green-500 to-green-600',
    hoverGradient: 'group-hover:from-green-600 group-hover:to-green-700'
  },
  {
    id: 'threewheeler',
    name: 'Three Wheeler',
    subtitle: 'Mid-size Deliveries',
    image: 'https://cdn-icons-png.flaticon.com/512/6179/6179815.png',
    description: 'Perfect for medium loads and local deliveries',
    capacity: 'Up to 500 kg',
    gradient: 'from-orange-500 to-orange-600',
    hoverGradient: 'group-hover:from-orange-600 group-hover:to-orange-700'
  }
]

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState('Pick Up From')
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-blue-600/10 pattern-dots"></div>
            
            <div className="relative flex flex-col lg:flex-row items-center justify-between">
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                    Welcome to YourDelivery! 🚚
                  </h1>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-300 mb-4">
                    India&apos;s Trusted Logistics Partner
                  </h2>
                  <p className="text-blue-100 text-sm sm:text-base lg:text-lg mb-6 max-w-lg mx-auto lg:mx-0">
                    From documents to heavy cargo - we deliver everything in your city with real-time tracking and verified partners.
                  </p>
                </div>
                <Link href="/booking/address">
                  <Button 
                    className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Book Delivery
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="hidden lg:block relative">
                <div className="w-48 h-48 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center transform rotate-12 shadow-2xl">
                  <Truck className="w-24 h-24 text-blue-700 transform -rotate-12" />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>


        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - Vehicle Selection */}
          <div className="lg:col-span-3 space-y-8">
            {/* Vehicle Selection */}
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Vehicle Type</h3>
                <p className="text-gray-600">Choose the perfect vehicle for your delivery needs</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {vehicleTypes.map((vehicle) => {
                  const isSelected = selectedVehicle === vehicle.id
                  
                  return (
                    <Card 
                      key={vehicle.id} 
                      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedVehicle(vehicle.id)
                        // Navigate to address selection after a brief delay to show selection
                        setTimeout(() => {
                          window.location.href = '/booking/address'
                        }, 500)
                      }}
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4 shadow-lg border border-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                          <Image
                            src={vehicle.image}
                            alt={vehicle.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                            unoptimized
                          />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">{vehicle.name}</CardTitle>
                        <CardDescription className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                          {vehicle.subtitle}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center pt-0">
                        <p className="text-sm text-gray-600 mb-3">{vehicle.description}</p>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs font-semibold text-gray-700">{vehicle.capacity}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Wallet & Activity Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Wallet Balance */}
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-full flex-shrink-0">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-100 text-sm">Wallet Balance</h4>
                        <p className="text-2xl sm:text-3xl font-bold text-white">₹5,000</p>
                      </div>
                    </div>
                    <Link href="/payments">
                      <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-full text-sm px-4 py-2">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Money
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-lg border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium mb-1">No recent deliveries</p>
                    <p className="text-sm text-gray-400">Your delivery history will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Location and Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Card */}
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Current Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50" 
                  onClick={() => setSelectedLocation('Pick Up From')}
                >
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-gray-700">{selectedLocation}</span>
                </Button>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 h-48 flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Map view will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/booking/address">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    <Package className="w-4 h-4 mr-3" />
                    New Booking
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button className="w-full justify-start" variant="outline">
                    <Clock className="w-4 h-4 mr-3 text-orange-600" />
                    <span className="text-gray-700">Track Orders</span>
                  </Button>
                </Link>
                <Link href="/support">
                  <Button className="w-full justify-start" variant="outline">
                    <Star className="w-4 h-4 mr-3 text-yellow-600" />
                    <span className="text-gray-700">Rate Service</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
