'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  Calendar,
  Clock,
  Truck,
  Package,
  CreditCard,
  FileText,
  Download,
  Share2,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ordersService } from '@/lib/api/apiClient'

export default function OrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const notifiedRef = useRef(false)

  const load = useCallback(async () => {
    try {
      setError('')
      const res = await ordersService.getById(orderId)
      const data = res?.data || res // depending on api wrapper
      setOrder(data)
    } catch (e) {
      setError(e?.message || 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => { load() }, [load])

  // Poll every 10s until completed
  useEffect(() => {
    if (!order || ['delivered','completed','cancelled'].includes((order.status||'').toLowerCase())) return
    const t = setInterval(load, 10000)
    return () => clearInterval(t)
  }, [order, load])

  // Notify customer once when order completes
  useEffect(() => {
    const isDone = ['delivered','completed'].includes((order?.status||'').toLowerCase())
    if (!isDone || notifiedRef.current) return
    notifiedRef.current = true
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            new Notification('Delivery completed', { body: `Order #${orderId} has been delivered.` })
          }
        })
      }
    } catch {}
  }, [order, orderId])

  const handleBack = () => {
    router.back()
  }

  const handleDownloadInvoice = () => {
    // In real app, this would download the invoice
    alert('Download invoice functionality would be implemented here')
  }

  const handleShareOrder = () => {
    // In real app, this would share order details
    alert('Share order functionality would be implemented here')
  }

  const handleContactSupport = () => {
    // In real app, this would open support chat or call
    router.push('/settings/help-support')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_transit':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'in_transit':
        return 'In Transit'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
        {loading && (<div className="py-10 text-center">Loading...</div>)}
        {error && (<div className="py-3 text-center text-red-600">{error}</div>)}
        {!loading && order && (
        <>
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
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Order Details</h1>
              <p className="text-sm text-gray-600">#{orderId}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Booking Date</p>
                  <p className="font-medium">{new Date(order.createdAt||Date.now()).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Booking Time</p>
                  <p className="font-medium">{new Date(order.createdAt||Date.now()).toLocaleTimeString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Distance</p>
                  <p className="font-medium">{order?.distanceKm != null ? `${order.distanceKm} km` : '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">
                    {order?.estimatedTime || '-'}
                  </p>
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
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-8 w-8 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{order?.driver?.name || 'Driver'}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {(order?.vehicleType || 'Vehicle')} • {(order?.driver?.vehicleNumber || '—')}
                  </p>
                  {order?.driver?.rating != null && (
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span>⭐ {order.driver.rating} rating</span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => order?.driver?.phone && window.open(`tel:${order.driver.phone}`)}
                  >
                    <Phone className="h-4 w-4" />
                    Call Driver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Route Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pickup Details */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h4 className="font-medium text-gray-900">Pickup Location</h4>
                  </div>
                  <div className="ml-5 space-y-2 text-sm">
                    <p className="font-medium">{order?.from?.address || '—'}</p>
                  </div>
                </div>

                {/* Route Line */}
                <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-8"></div>

                {/* Dropoff Details */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <h4 className="font-medium text-gray-900">Dropoff Location</h4>
                  </div>
                  <div className="ml-5 space-y-2 text-sm">
                    <p className="font-medium">{order?.to?.address || '—'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information (shown only if present) */}
          {order?.payment && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="text-sm font-medium">{order.payment.method || '—'}</span>
                </div>
                {order.payment.transactionId && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Transaction ID</span>
                    <span className="text-sm font-mono">{order.payment.transactionId}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Status</span>
                  <span className="text-sm font-medium text-green-600">{order.payment.status || '—'}</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Price</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span>₹{order.price ?? order.amount ?? '-'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={handleDownloadInvoice}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>
            <Button
              variant="outline"
              onClick={handleShareOrder}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share Order
            </Button>
            <Button
              variant="outline"
              onClick={handleContactSupport}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </Button>
          </div>

          {/* Additional Information */}
          <Card>
            <CardContent className="p-4">
              <div className="text-center text-sm text-gray-500">
                <p>Order placed on {new Date(order?.createdAt || Date.now()).toLocaleString()}</p>
                <p className="mt-1">Need help? Contact our support team</p>
              </div>
            </CardContent>
          </Card>
        </div>
        </>
        )}
      </div>
    </div>
  )
}
