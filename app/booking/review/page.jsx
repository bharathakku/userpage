'use client';
export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, Truck, MapPin, Clock, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import OrderService from '@/lib/orderService';
import { computeFare, formatCurrencyINR, WAITING_RULES } from '@/lib/pricing'

// Wrap URL hooks in Suspense to satisfy Next.js prerender rules
export default function BookingReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-600">Loading...</div>}>
      <BookingReviewInner />
    </Suspense>
  )
}

function BookingReviewInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [error, setError] = useState('');
  const [routeData, setRouteData] = useState(null) // { pickup: {lat,lng,address}, drop: {lat,lng,address} | [{...}] , distanceKm }
  const [waitingMinutes, setWaitingMinutes] = useState(0)

  // Get vehicle ID from URL params
  const vehicleId = searchParams.get('vehicleId') || 'two-wheeler';

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Use route and waiting minutes from localStorage (set in address page)
    try {
      const route = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('bookingRoute') || 'null') : null
      const wm = typeof window !== 'undefined' ? Number(window.localStorage.getItem('waiting_minutes') || '0') : 0
      if (route) {
        setRouteData(route)
        setWaitingMinutes(Number.isFinite(wm) ? wm : 0)
        const fare = computeFare(vehicleId || 'two-wheeler', route.distanceKm || 0, Number.isFinite(wm) ? wm : 0)
        setQuoteData({ ...fare })
        return
      }
    } catch {}

    // Fallback: fetch quote from API with default 5km
    fetchQuote();
  }, [isAuthenticated, vehicleId]);

  const fetchQuote = async () => {
    try {
      const result = await OrderService.getQuote(vehicleId, 5); // Default 5km
      if (result.success) {
        // fallback only: map API result to quoteData shape
        setQuoteData({
          vehicleId,
          base: result.data?.base || 0,
          perKm: result.data?.perKm || 0,
          distanceKm: result.data?.distanceKm || 5,
          distanceCharge: result.data?.distanceCharge || 0,
          waiting: { included: WAITING_RULES[vehicleId]?.included || 0, perMinute: WAITING_RULES[vehicleId]?.perMinute || 0, minCharge: WAITING_RULES[vehicleId]?.minCharge || 0, providedMinutes: 0, overMinutes: 0, extraWaitingCharge: 0 },
          total: result.data?.total || (result.data?.base || 0) + (result.data?.distanceCharge || 0),
        });
      } else {
        setError('Failed to get quote');
      }
    } catch (err) {
      setError('Failed to get quote');
    }
  };

  const handleCreateOrder = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setIsCreatingOrder(true);
    setError('');

    try {
      const route = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('bookingRoute') || 'null') : null
      const wm = typeof window !== 'undefined' ? Number(window.localStorage.getItem('waiting_minutes') || '0') : 0
      const origin = route?.pickup
      const rawDrop = route?.drop
      const drops = Array.isArray(rawDrop) ? rawDrop : (rawDrop ? [rawDrop] : [])
      const firstDrop = drops[0]
      const orderData = {
        vehicleType: vehicleId,
        from: origin ? { address: origin.address || 'Pickup', location: { coordinates: [origin.lng, origin.lat] } } : undefined,
        to: firstDrop ? { address: firstDrop.address || 'Drop', location: { coordinates: [firstDrop.lng, firstDrop.lat] } } : undefined,
        distanceKm: route?.distanceKm || quoteData?.distanceKm || 0,
        waitingMinutes: Number.isFinite(wm) ? wm : 0,
        price: quoteData?.total || 0,
        pricingBreakdown: quoteData || undefined,
      };

      const result = await OrderService.createOrder(orderData);
      
      if (result.success) {
        // Redirect to confirmation page with order ID
        router.push(`/booking/confirmation?orderId=${result.data._id}`);
      } else {
        setError(result.error || 'Failed to create order');
      }
    } catch (err) {
      setError('Failed to create order');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Use quote data if available, otherwise fallback to static data
  const bookingDetails = {
    tripId: `QUOTE-${Date.now()}`,
    vehicle: vehicleId === 'two-wheeler' ? 'Two Wheeler' : 
             vehicleId === 'three-wheeler' ? 'Three Wheeler' : 'Heavy Truck',
    distance: quoteData ? `${quoteData.distanceKm} kms` : '—',
    pickupTime: `${WAITING_RULES[vehicleId]?.included || 0} mins loading/unloading time included`,
    fareBreakdown: {
      tripFare: quoteData?.total || 0,
      distanceCharge: quoteData?.distanceCharge || 0,
      waitingCharge: quoteData?.waiting?.extraWaitingCharge || 0,
      netFare: quoteData?.total || 0,
    },
    estimatedTime: quoteData?.distanceKm ? `${Math.ceil((quoteData.distanceKm/25)*60)} mins (est.)` : '—',
  };

  // No pre-payment in app: payment handled directly with the driver.

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
                      <span className="text-sm font-medium text-slate-800">{routeData?.pickup?.address || 'Pickup & drop set on previous step'}</span>
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
                        <p className="text-xs text-green-600 bg-white/70 px-2 py-1 rounded">{routeData?.pickup?.address || '—'}</p>
                        {routeData?.pickup?.lat && routeData?.pickup?.lng && (
                          <p className="text-xs text-green-700">Lat: {routeData.pickup.lat.toFixed(5)} • Lng: {routeData.pickup.lng.toFixed(5)}</p>
                        )}
                        <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium" onClick={() => router.push('/booking/address')}>Edit on Map →</Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Drop Locations (supports multiple) */}
                  {(Array.isArray(routeData?.drop) ? routeData.drop : (routeData?.drop ? [routeData.drop] : [])).map((d, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors">
                      <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-red-900">Drop Location {routeData?.drop && Array.isArray(routeData.drop) ? `#${idx+1}` : ''}</h4>
                          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">Set</span>
                        </div>
                        <div className="space-y-1 text-sm text-red-700">
                          <p className="text-xs text-red-700 bg-white/70 px-2 py-1 rounded">{d?.address || '—'}</p>
                          {d?.lat && d?.lng && (
                            <p className="text-xs">Lat: {d.lat.toFixed(5)} • Lng: {d.lng.toFixed(5)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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

          {/* Right Column - Fare Summary */}
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
                    <span className="text-slate-600">Base Fare</span>
                    <span className="font-semibold text-slate-900">{formatCurrencyINR(quoteData?.base || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Distance Charge ({quoteData?.distanceKm || 0} km)</span>
                    <span className="font-semibold text-slate-900">{formatCurrencyINR(quoteData?.distanceCharge || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Waiting ({quoteData?.waiting?.providedMinutes || 0}m, includes {quoteData?.waiting?.included || 0}m)</span>
                    <span className="font-semibold text-slate-900">{formatCurrencyINR(quoteData?.waiting?.extraWaitingCharge || 0)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
                      <span className="font-semibold text-blue-900">Amount Payable</span>
                      <span className="text-2xl font-bold text-blue-700">{formatCurrencyINR(bookingDetails.fareBreakdown.netFare)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info Notice */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Payment Information</h3>
                  <p className="text-sm text-slate-700">
                    Payment is handled directly with the driver partner. This app does not accept pre-payments.
                    You will see the fare estimate here and can pay the driver upon delivery completion.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Button 
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder || !quoteData}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <Truck className="mr-2 h-5 w-5" />
                      Book {bookingDetails.vehicle}
                    </>
                  )}
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
                    <span>Pay Driver Directly</span>
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
