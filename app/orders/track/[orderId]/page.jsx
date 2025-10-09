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
import { API_BASE_URL } from '@/lib/api/apiClient'
import { connectSocket, joinOrder, leaveOrder, onOrderStatus, onDriverLocation } from '@/lib/socket'
import OrderMap from '@/components/OrderMap'

export default function OrderTrackingPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId
  const [currentTime, setCurrentTime] = useState(new Date())
  const [status, setStatus] = useState('in_transit')
  const [driver, setDriver] = useState({ name: 'Driver', phone: '', vehicle: '', plateNumber: '', rating: 0 })
  const [pickup, setPickup] = useState({ address: '' })
  const [dropoff, setDropoff] = useState({ address: '', estimatedTime: '' })
  const [fare, setFare] = useState(0)
  const [distance, setDistance] = useState('')
  const [estimatedArrival, setEstimatedArrival] = useState('')
  const [progressPct, setProgressPct] = useState(0)
  const [timeline, setTimeline] = useState([])
  const [driverLocation, setDriverLocation] = useState(null)

  // Compute progress from status timeline
  function calcProgress(statusVal) {
    const order = ['assigned','accepted','picked_up','in_transit','delivered']
    const idx = Math.max(0, order.indexOf(statusVal))
    return Math.round((idx / (order.length - 1)) * 100)
  }

  const trackingSteps = (() => {
    const orderSeq = ['assigned','accepted','picked_up','in_transit','delivered']
    const titles = {
      assigned: { title: 'Driver Assigned', desc: 'Driver assigned to your order' },
      accepted: { title: 'Driver Accepted', desc: 'Driver accepted and is heading to pickup' },
      picked_up: { title: 'Picked Up', desc: 'Package collected from pickup location' },
      in_transit: { title: 'In Transit', desc: 'On the way to your location' },
      delivered: { title: 'Delivered', desc: 'Package handed over' },
    }
    const idx = Math.max(0, orderSeq.indexOf(status))
    return orderSeq.map((s, i) => ({
      id: i + 1,
      title: titles[s].title,
      description: titles[s].desc,
      time: i < idx ? '✓' : i === idx ? 'Now' : '',
      completed: i < idx || s === 'delivered' && status === 'delivered',
      active: i === idx && status !== 'delivered',
    }))
  })()

  // Fetch initial tracking and setup socket listeners
  useEffect(() => {
    let offStatus = null
    let offLoc = null
    const timer = setInterval(() => setCurrentTime(new Date()), 30000)

    async function bootstrap() {
      try {
        // Connect socket
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        connectSocket(token)
        joinOrder(orderId)

        // Fetch initial tracking
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}/tracking`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        })
        if (res.ok) {
          const data = await res.json()
          setStatus(data.status || 'in_transit')
          setTimeline(Array.isArray(data.timeline) ? data.timeline : [])
          setDriverLocation(data.driverLocation || null)
          setProgressPct(calcProgress(data.status || 'in_transit'))
          if (data.driverBasic) {
            setDriver({
              name: data.driverBasic.name || 'Driver',
              phone: data.driverBasic.phone || '',
              vehicle: data.driverBasic.vehicleType || '',
              plateNumber: data.driverBasic.vehicleNumber || '',
              rating: 5, // placeholder; hook to rating API if available
            })
          }
          // Fetch full order for addresses/fare/distance
          try {
            const res2 = await fetch(`${API_BASE_URL}/orders/${orderId}`, { headers: { 'Authorization': token ? `Bearer ${token}` : '' } })
            if (res2.ok) {
              const ord = await res2.json()
              setPickup({ address: ord?.from?.address || '' })
              setDropoff({ address: ord?.to?.address || '', estimatedTime: '' })
              setFare((ord?.adjustedPrice ?? ord?.price) || 0)
              setDistance(`${Number(ord?.distanceKm ?? 0).toFixed(2)} km`)
            }
          } catch {}
        }
      } catch (e) {
        console.error('Failed to init tracking', e)
      }

      // Ask for notification permission (best-effort)
      try {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission().catch(() => {})
        }
      } catch {}

      // Subscribe to live updates
      offStatus = onOrderStatus((evt) => {
        if (evt?.orderId === orderId) {
          setStatus(evt.status)
          setProgressPct(calcProgress(evt.status))
          setTimeline((tl) => [...tl, { status: evt.status, at: new Date().toISOString(), completed: true }])
          // Notify on delivered and update UI elements
          if (evt.status === 'delivered') {
            try {
              if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                const n = new Notification('Order Delivered', { body: `Your order #${orderId} has been delivered.` })
                setTimeout(() => n.close && n.close(), 4000)
              }
            } catch {}
            setEstimatedArrival('Delivered')
          }
        }
      })
      offLoc = onDriverLocation((evt) => {
        if (evt?.orderId === orderId) {
          setDriverLocation({ lat: evt.lat, lng: evt.lng, ts: evt.ts })
        }
      })
    }

    bootstrap()
    return () => {
      clearInterval(timer)
      leaveOrder(orderId)
      if (offStatus) offStatus()
      if (offLoc) offLoc()
    }
  }, [orderId])

  const handleBack = () => {
    router.back()
  }

  const handleCallDriver = () => {
    // In real app, this would initiate a call
    if (driver?.phone) window.open(`tel:${driver.phone}`)
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
          {/* Delivered Success Banner */}
          {status === 'delivered' && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-5 flex items-start gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Delivery Completed</h3>
                  <p className="text-sm text-green-700">Thank you! Your order has been delivered successfully.</p>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Live Status Card */}
          <Card className={status === 'delivered' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${status === 'delivered' ? 'bg-green-600' : 'bg-blue-600'} rounded-full flex items-center justify-center`}>
                  {status === 'delivered' ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : (
                    <Truck className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className={`font-semibold ${status === 'delivered' ? 'text-green-900' : 'text-blue-900'}`}>
                    {status === 'delivered' ? 'Your order is delivered' : `Your order is ${status.replace('_',' ')}`}
                  </h3>
                  <p className={`text-sm ${status === 'delivered' ? 'text-green-700' : 'text-blue-700'}`}>
                    {status === 'delivered' ? 'Completed' : `Estimated arrival: ${estimatedArrival || '—'}`}
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-blue-600">{progressPct}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Information */}
          {/* Live Map */}
          <OrderMap driverLocation={driverLocation} />

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
                    <h4 className="font-medium text-gray-900">{driver?.name || 'Driver Assigned'}</h4>
                    <p className="text-sm text-gray-600">{driver?.vehicle} {driver?.plateNumber ? `• ${driver.plateNumber}` : ''}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(driver?.rating || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({driver?.rating || 0})</span>
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
                    <p className="text-sm text-gray-600">{pickup.address}</p>
                    <p className="text-xs text-green-600 mt-1">&nbsp;</p>
                  </div>
                </div>

                {/* Route Line */}
                <div className="ml-2 border-l-2 border-dashed border-gray-300 h-8"></div>

                {/* Dropoff Location */}
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Dropoff Location</p>
                    <p className="text-sm text-gray-600">{dropoff.address}</p>
                    <p className="text-xs text-blue-600 mt-1">ETA: {dropoff.estimatedTime || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Distance</span>
                <span className="font-medium">{distance || '—'}</span>
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
                  <span className="font-medium">#{orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vehicle Type</span>
                  <span className="font-medium">{driver?.vehicle || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-bold text-lg text-green-600">₹{fare || 0}</span>
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
