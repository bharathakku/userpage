'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  Clock, 
  CheckCircle,
  Navigation,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OrderTrackingPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mock order data - in real app, this would be fetched based on orderId
  const orderDetails = {
    id: orderId,
    status: 'in_transit',
    driver: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      vehicle: 'Tata Ace',
      plateNumber: 'DL 3C AB 1234',
      rating: 4.8
    },
    pickup: {
      address: 'Sector 48, Noida West',
      time: '2:30 PM',
      completed: true
    },
    dropoff: {
      address: 'Connaught Place, Delhi',
      estimatedTime: '45 mins',
      completed: false
    },
    fare: 495,
    distance: '32 km',
    estimatedArrival: '3:15 PM'
  }

  const trackingSteps = [
    {
      id: 1,
      title: 'Order Confirmed',
      description: 'Your order has been placed successfully',
      time: '2:00 PM',
      completed: true,
      active: false
    },
    {
      id: 2,
      title: 'Driver Assigned',
      description: 'Driver is on the way to pickup location',
      time: '2:15 PM',
      completed: true,
      active: false
    },
    {
      id: 3,
      title: 'Picked Up',
      description: 'Item has been collected from pickup location',
      time: '2:30 PM',
      completed: true,
      active: false
    },
    {
      id: 4,
      title: 'In Transit',
      description: 'Your item is on the way to destination',
      time: 'Now',
      completed: false,
      active: true
    },
    {
      id: 5,
      title: 'Delivered',
      description: 'Item will be delivered to destination',
      time: 'Est. 3:15 PM',
      completed: false,
      active: false
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(timer)
  }, [])

  const handleBack = () => {
    router.back()
  }

  const handleCallDriver = () => {
    // In real app, this would initiate a call
    window.open(`tel:${orderDetails.driver.phone}`)
  }

  const handleRefreshTracking = () => {
    // In real app, this would refresh tracking data
    setCurrentTime(new Date())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Track Order</h1>
              <p className="text-sm text-gray-600">#{orderId}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshTracking}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Live Status Card */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Your order is on the way!</h3>
                  <p className="text-sm text-blue-700">Estimated arrival: {orderDetails.estimatedArrival}</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-blue-600">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Driver Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{orderDetails.driver.name}</h4>
                    <p className="text-sm text-gray-600">{orderDetails.driver.vehicle} • {orderDetails.driver.plateNumber}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(orderDetails.driver.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({orderDetails.driver.rating})</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCallDriver}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">Call</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Route Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pickup Location */}
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">Pickup Location</p>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600">{orderDetails.pickup.address}</p>
                    <p className="text-xs text-green-600 mt-1">Completed at {orderDetails.pickup.time}</p>
                  </div>
                </div>

                {/* Route Line */}
                <div className="ml-2 border-l-2 border-dashed border-gray-300 h-8"></div>

                {/* Dropoff Location */}
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Dropoff Location</p>
                    <p className="text-sm text-gray-600">{orderDetails.dropoff.address}</p>
                    <p className="text-xs text-blue-600 mt-1">ETA: {orderDetails.dropoff.estimatedTime}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Distance</span>
                <span className="font-medium">{orderDetails.distance}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed
                        ? 'bg-green-100 text-green-600'
                        : step.active
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : step.active ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${
                          step.active ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </h4>
                        <span className={`text-xs ${
                          step.active ? 'text-blue-600 font-medium' : 'text-gray-500'
                        }`}>
                          {step.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>

                    {/* Connecting Line */}
                    {index < trackingSteps.length - 1 && (
                      <div className="absolute ml-4 mt-8 w-0.5 h-4 bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-medium">#{orderDetails.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vehicle Type</span>
                  <span className="font-medium">{orderDetails.driver.vehicle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-bold text-lg text-green-600">₹{orderDetails.fare}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call Support
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Share Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
