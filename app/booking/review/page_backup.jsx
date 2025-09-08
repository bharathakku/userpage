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
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Premium Header */}
        <div className="flex items-center mb-10 animate-fade-in-up">
          <Link href="/booking/new">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-4 hover:bg-slate-100 rounded-full transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Review Booking</h1>
            <p className="text-slate-600 text-sm">Confirm your delivery details and complete your booking</p>
          </div>
        </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Booking Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Premium Trip Details Card */}
          <Card variant="premium" className="overflow-hidden group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Truck className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-1">{bookingDetails.vehicle}</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                      <CardDescription className="text-success-600 font-medium">{bookingDetails.distance}</CardDescription>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">Trip ID</div>
                  <div className="text-sm font-mono text-slate-700 bg-slate-100 px-3 py-1 rounded-full">{bookingDetails.tripId}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <MapPin className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Address Details</div>
                    <span className="text-sm font-medium text-slate-800">{bookingDetails.driver}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-success-50 hover:bg-success-100 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Check className="h-4 w-4 text-success-600" />
                  </div>
                  <div>
                    <div className="text-xs text-success-600 mb-1">Loading Time</div>
                    <span className="text-sm font-medium text-success-800">{bookingDetails.pickupTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100">
                <Clock className="h-5 w-5 text-brand-600" />
                <div>
                  <div className="text-sm font-medium text-brand-900">Estimated Duration</div>
                  <div className="text-lg font-bold gradient-text">{bookingDetails.estimatedTime}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Trip Route Card */}
          <Card variant="premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-600" />
                Trip Route
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                {/* Pickup Location */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-success-50 border border-success-200 hover:bg-success-100 transition-colors">
                  <div className="relative">
                    <div className="w-4 h-4 bg-success-500 rounded-full shadow-lg animate-pulse"></div>
                    <div className="absolute top-4 left-1/2 w-0.5 h-16 bg-gradient-to-b from-success-300 to-error-300 transform -translate-x-1/2"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-success-900">Pickup Location</h4>
                      <span className="text-xs bg-success-200 text-success-800 px-2 py-1 rounded-full font-medium">Confirmed</span>
                    </div>
                    <div className="space-y-1 text-sm text-success-700">
                      <p className="font-medium">Ramesh • 9876548637</p>
                      <p>Akshaya • 9876548627</p>
                      <p className="text-xs text-success-600 bg-white/50 px-2 py-1 rounded">Ward 11, Jal vihar Road, Sector 48, Noida West</p>
                    </div>
                  </div>
                </div>
                
                {/* Drop Location */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-error-50 border border-error-200 hover:bg-error-100 transition-colors">
                  <div className="w-4 h-4 bg-error-500 rounded-full shadow-lg"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-error-900">Drop Location</h4>
                      <span className="text-xs bg-warning-200 text-warning-800 px-2 py-1 rounded-full font-medium animate-pulse">Pending</span>
                    </div>
                    <p className="text-sm text-error-700 mb-2">Searching for a driver...</p>
                    <Button variant="ghost" className="p-0 h-auto text-brand-600 hover:text-brand-700 font-medium">
                      View Details →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Offers Card */}
          <Card variant="premium" className="group hover:shadow-premium-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-warning-400 to-warning-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">%</span>
                </div>
                Offers and Discounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-warning-50 to-orange-50 border border-warning-200 group-hover:border-warning-300 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-warning-500 to-orange-500 p-3 rounded-xl shadow-lg">
                    <span className="text-white font-bold text-lg">%</span>
                  </div>
                  <div>
                    <p className="font-semibold text-warning-900">Apply Coupon</p>
                    <p className="text-sm text-warning-700">Save up to ₹50 on your booking</p>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-warning-500 to-orange-500 hover:from-warning-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">Apply</Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Goods Type Card */}
          <Card variant="premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">📦</span>
                </div>
                Goods Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-xl bg-gradient-to-br from-brand-50 to-purple-50 border border-brand-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <p className="font-medium text-brand-900 mb-1">Electronics & Appliances</p>
                    <p className="text-sm text-brand-700 leading-relaxed">{bookingDetails.goodsType}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Premium Fare Summary and Payment */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-8">
            {/* Premium Fare Summary */}
            <Card variant="premium" className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">₹</span>
                  </div>
                  Fare Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Trip Fare (incl. Toll)</span>
                  <span className="font-semibold text-slate-900">₹{bookingDetails.fareBreakdown.tripFare}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Net Fare</span>
                  <span className="font-semibold text-slate-900">₹{bookingDetails.fareBreakdown.tollCharge}</span>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-brand-50 to-brand-100">
                    <span className="font-semibold text-brand-900">Amount Payable</span>
                    <span className="text-2xl font-bold gradient-text">₹{bookingDetails.fareBreakdown.netFare}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Payment Method */}
            <Card variant="premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-brand-600" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon
                  const isSelected = selectedPaymentMethod === method.id
                  return (
                    <div
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-brand-50 to-brand-100 border-2 border-brand-300 shadow-lg transform scale-[1.02]' 
                          : 'bg-slate-50 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-brand-500' : 'bg-slate-200'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          isSelected ? 'text-white' : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          isSelected ? 'text-brand-900' : 'text-slate-800'
                        }`}>{method.name}</p>
                        {method.balance && (
                          <p className={`text-sm ${
                            isSelected ? 'text-brand-700' : 'text-slate-500'
                          }`}>Available: {method.balance}</p>
                        )}
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'border-brand-500 bg-brand-500' 
                          : 'border-slate-300'
                      }`}>
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Premium Action Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={() => router.push('/booking/confirmation')}
                className="w-full h-14 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Truck className="mr-2 h-5 w-5" />
                Book {bookingDetails.vehicle}
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 border-2 border-slate-300 hover:border-slate-400 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-all duration-300"
                onClick={() => router.push('/booking/confirmation')}
              >
                Schedule for Later
              </Button>
            </div>

            {/* Trust Badges */}
            <Card variant="ghost" className="bg-gradient-to-r from-slate-50/50 to-slate-100/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                    <span>Instant Booking</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
