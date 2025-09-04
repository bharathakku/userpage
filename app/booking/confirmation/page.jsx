'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Phone, MessageCircle, Star, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BookingConfirmationPage() {
  const router = useRouter()
  const [bookingStage, setBookingStage] = useState('searching') // searching, found, confirmed
  const [searchDuration, setSearchDuration] = useState(0)

  const driverInfo = {
    name: 'Ramesh',
    phone: '9573248557',
    vehicleNumber: 'JASRA • 6456551326',
    location: 'Rama, Kamal, Patel',
    address: 'Shop • High Court Road, Ashika Drive, Noida',
    vehicle: 'Tata Ace'
  }

  useEffect(() => {
    // Simulate searching for driver
    const searchTimer = setInterval(() => {
      setSearchDuration(prev => prev + 1)
    }, 1000)

    // After 5 seconds, show driver found
    const foundTimer = setTimeout(() => {
      setBookingStage('found')
    }, 5000)

    return () => {
      clearInterval(searchTimer)
      clearTimeout(foundTimer)
    }
  }, [])

  const handleViewDetails = () => {
    router.push('/orders')
  }

  if (bookingStage === 'searching') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/booking/review">
              <Button variant="ghost" size="icon" className="mr-3">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Booking Confirmation</h1>
          </div>

          {/* Searching Animation */}
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-lg shadow-2xl border-gray-200">
              <CardContent className="p-8 text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Navigation className="w-12 h-12 text-white animate-spin" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-blue-300 rounded-full animate-ping"></div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Searching for a driver...</h2>
                <p className="text-gray-600 mb-6">Please wait while we find the best partner for you</p>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span>Search time:</span>
                    <span className="font-semibold text-blue-600">{searchDuration}s</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(searchDuration * 20, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  We're connecting you with nearby partners for the fastest pickup
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-3">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Booking Done</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Details */}
          <div className="space-y-6">
            {/* Success Message */}
            <Card className="shadow-xl border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Done</h2>
                <p className="text-green-700">Searching for a driver...</p>
                <p className="text-sm text-green-600 mt-2">Booking will get cancelled if no driver accepts in 10 mins</p>
              </CardContent>
            </Card>

            {/* Driver Information */}
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Driver Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h3 className="font-bold text-lg">{driverInfo.name} • {driverInfo.phone}</h3>
                    <p className="text-sm text-gray-600">{driverInfo.location}</p>
                    <p className="text-sm text-gray-500 mt-1">{driverInfo.vehicleNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium text-gray-900">Pickup Location</p>
                      <p className="text-sm text-gray-600">Rohit Niwas, Sola</p>
                    </div>
                  </div>
                  <div className="ml-6 border-l-2 border-gray-200 h-6"></div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium text-gray-900">Drop Location</p>
                      <p className="text-sm text-gray-600">{driverInfo.address}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={handleViewDetails} className="w-full bg-blue-600 hover:bg-blue-700">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-gray-200 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Live Tracking</CardTitle>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    Ship to 10,000+ locations with Partner Intercity! Send Now
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-96 flex items-center justify-center rounded-b-lg relative">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-blue-800 font-medium">Live Tracking Map</p>
                    <p className="text-sm text-blue-600">Driver location will appear here</p>
                  </div>
                  
                  {/* Mock location marker */}
                  <div className="absolute top-20 left-1/3 w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-red-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
