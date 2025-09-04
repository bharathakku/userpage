'use client'

import { useState } from 'react'
import { ArrowLeft, Truck, MapPin, Clock, CreditCard, Wallet, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BookingReviewPage() {
  const router = useRouter()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet')
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const bookingDetails = {
    tripId: 'CBN7G53B6001',
    vehicle: 'Tata Ace',
    driver: 'View Address Details',
    distance: '23 kms away',
    pickupTime: '70 mins loading/unloading time included',
    fareBreakdown: {
      tripFare: 495.09,
      tollCharge: 0.00,
      netFare: 495
    },
    goodsType: 'Appliances / Electronics / Home Appliances / Electronic ITEMS',
    estimatedTime: '2 hours 45 mins'
  }

  const paymentMethods = [
    { id: 'wallet', name: 'Wallet Balance', balance: '₹5,000', icon: Wallet },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI Payment', icon: CreditCard }
  ]

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/booking/new">
          <Button variant="ghost" size="icon" className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Review Booking</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Details Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{bookingDetails.vehicle}</CardTitle>
                  <CardDescription className="text-green-600">{bookingDetails.distance}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{bookingDetails.driver}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-green-600">
                <Check className="h-4 w-4" />
                <span>{bookingDetails.pickupTime}</span>
              </div>
            </CardContent>
          </Card>

          {/* Trip Route */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Pickup Location</p>
                    <p className="text-sm text-gray-600">Ramesh • 9876548637</p>
                    <p className="text-sm text-gray-500">Akshaya • 9876548627</p>
                    <p className="text-xs text-gray-400">Ward 11, Jal vihar Road, Sector 48, Noida West</p>
                  </div>
                </div>
                <div className="ml-6 border-l-2 border-gray-200 h-8"></div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Drop Location</p>
                    <p className="text-sm text-gray-500">Searching for a driver...</p>
                    <Button variant="link" className="p-0 h-auto text-blue-600">View Details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offers and Discounts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Offers and Discounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <span className="text-orange-600 font-semibold">%</span>
                  </div>
                  <span>Apply Coupon</span>
                </div>
                <Button variant="outline" size="sm">Apply</Button>
              </div>
            </CardContent>
          </Card>

          {/* Goods Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Goods Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">{bookingDetails.goodsType}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Fare Summary and Payment */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Fare Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fare Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Trip Fare (incl. Toll)</span>
                  <span>₹{bookingDetails.fareBreakdown.tripFare}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Net Fare</span>
                  <span>₹{bookingDetails.fareBreakdown.tollCharge}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Amount Payable (rounded)</span>
                    <span>₹{bookingDetails.fareBreakdown.netFare}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choose Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon
                  return (
                    <div
                      key={method.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 ${
                        selectedPaymentMethod === method.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <IconComponent className="h-5 w-5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{method.name}</p>
                        {method.balance && (
                          <p className="text-xs text-gray-500">{method.balance}</p>
                        )}
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPaymentMethod === method.id 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === method.id && (
                          <div className="w-full h-full bg-white rounded-full p-0.5">
                            <div className="w-full h-full bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Book Button */}
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/booking/confirmation')}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              >
                Book Tata Ace
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12"
                onClick={() => router.push('/booking/confirmation')}
              >
                Book Tata Ace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
