'use client';

import { useState } from 'react';
import { ArrowLeft, Truck, MapPin, Clock, CreditCard, Wallet, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BookingReviewPage() {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet');

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
  };

  const paymentMethods = [
    { id: 'wallet', name: 'Wallet Balance', balance: '₹5,000', icon: Wallet },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI Payment', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-10">
          <Link href="/booking/new">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-4 hover:bg-white/80 rounded-full transition-all duration-300 hover:scale-105 shadow-md"
            >
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Review Booking</h1>
            <p className="text-slate-600">Confirm your delivery details and complete your booking</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trip Details Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                      <Truck className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">{bookingDetails.vehicle}</h2>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-600 font-medium">{bookingDetails.distance}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 mb-1">Trip ID</div>
                    <div className="text-sm font-mono text-slate-700 bg-slate-100 px-3 py-2 rounded-lg">
                      {bookingDetails.tripId}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <MapPin className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Address Details</div>
                      <span className="text-sm font-medium text-slate-800">{bookingDetails.driver}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-green-600 mb-1">Loading Time</div>
                      <span className="text-sm font-medium text-green-800">{bookingDetails.pickupTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-blue-900">Estimated Duration</div>
                    <div className="text-lg font-bold text-blue-700">{bookingDetails.estimatedTime}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Route Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Trip Route
                </h3>
                
                <div className="space-y-4">
                  {/* Pickup Location */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors">
                    <div className="relative">
                      <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
                      <div className="absolute top-4 left-1/2 w-0.5 h-16 bg-gradient-to-b from-green-300 to-red-300 transform -translate-x-1/2"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-green-900">Pickup Location</h4>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">Confirmed</span>
                      </div>
                      <div className="space-y-1 text-sm text-green-700">
                        <p className="font-medium">Ramesh • 9876548637</p>
                        <p>Akshaya • 9876548627</p>
                        <p className="text-xs text-green-600 bg-white/70 px-2 py-1 rounded">Ward 11, Jal vihar Road, Sector 48, Noida West</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Drop Location */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-red-900">Drop Location</h4>
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-medium animate-pulse">Pending</span>
                      </div>
                      <p className="text-sm text-red-700 mb-2">Searching for a driver...</p>
                      <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium">
                        View Details →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Offers Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">%</span>
                  </div>
                  Offers and Discounts
                </h3>
                
                <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
                      <span className="text-white font-bold text-lg">%</span>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-900">Apply Coupon</p>
                      <p className="text-sm text-orange-700">Save up to ₹50 on your booking</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Apply
                  </Button>
                </div>
              </div>
            </div>

            {/* Goods Type Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">📦</span>
                  </div>
                  Goods Type
                </h3>
                
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900 mb-2">Electronics & Appliances</p>
                      <p className="text-sm text-blue-700 leading-relaxed">{bookingDetails.goodsType}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Fare Summary and Payment */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-8">
              {/* Fare Summary */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 p-6">
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">₹</span>
                    </div>
                    Fare Summary
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Trip Fare (incl. Toll)</span>
                    <span className="font-semibold text-slate-900">₹{bookingDetails.fareBreakdown.tripFare}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Net Fare</span>
                    <span className="font-semibold text-slate-900">₹{bookingDetails.fareBreakdown.tollCharge}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
                      <span className="font-semibold text-blue-900">Amount Payable</span>
                      <span className="text-2xl font-bold text-blue-700">₹{bookingDetails.fareBreakdown.netFare}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Payment Method
                  </h3>
                  
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      const isSelected = selectedPaymentMethod === method.id;
                      return (
                        <div
                          key={method.id}
                          className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                            isSelected 
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 shadow-lg transform scale-[1.02]' 
                              : 'bg-slate-50 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                          }`}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                        >
                          <div className={`p-3 rounded-lg ${
                            isSelected ? 'bg-blue-500' : 'bg-slate-200'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${
                              isSelected ? 'text-white' : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold ${
                              isSelected ? 'text-blue-900' : 'text-slate-800'
                            }`}>{method.name}</p>
                            {method.balance && (
                              <p className={`text-sm ${
                                isSelected ? 'text-blue-700' : 'text-slate-500'
                              }`}>Available: {method.balance}</p>
                            )}
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-slate-300'
                          }`}>
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  onClick={() => router.push('/booking/confirmation')}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
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
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Instant Booking</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
