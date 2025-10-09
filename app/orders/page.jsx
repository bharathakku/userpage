'use client'

import { useEffect, useState } from 'react'
import { Package, Clock, CheckCircle, XCircle, MapPin, Phone, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ordersService } from '@/lib/api/apiClient'
import CancelOrderModal from '@/components/modals/cancel-order-modal'

export default function OrdersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('active')
  const [activeOrders, setActiveOrders] = useState([])
  const [orderHistory, setOrderHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelOrderId, setCancelOrderId] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await ordersService.getMyOrders()
        // Expecting array of orders with fields: _id, status, from, to, price, createdAt, driver, vehicleType
        const list = Array.isArray(res?.data) ? res.data : []
        const active = list.filter(o => !['delivered','completed','cancelled'].includes((o.status||'').toLowerCase()))
        const history = list.filter(o => ['delivered','completed','cancelled'].includes((o.status||'').toLowerCase()))
        if (!mounted) return
        setActiveOrders(active)
        setOrderHistory(history)
      } catch (e) {
        if (!mounted) return
        setError(e?.message || 'Failed to load orders')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleTrackLive = (orderId) => {
    // Navigate to tracking page
    router.push(`/orders/track/${orderId}`)
  }

  const handleViewDetails = (orderId) => {
    // Navigate to order details page
    router.push(`/orders/details/${orderId}`)
  }

  const handleRateDriver = (orderId) => {
    // Navigate to rating page
    router.push(`/orders/rating/${orderId}`)
  }
  
  const handleViewReceipt = (orderId) => {
    // Navigate to receipt page
    router.push(`/orders/receipt/${orderId}`)
  }

  const openCancelModal = (orderId) => {
    setCancelOrderId(orderId)
    setCancelModalOpen(true)
  }

  const handleConfirmCancel = async (reason) => {
    if (!cancelOrderId) return
    try {
      await ordersService.cancelOrder(cancelOrderId, reason)
      // Refresh lists
      const res = await ordersService.getMyOrders()
      const list = Array.isArray(res?.data) ? res.data : []
      const active = list.filter(o => !['delivered','completed','cancelled'].includes((o.status||'').toLowerCase()))
      const history = list.filter(o => ['delivered','completed','cancelled'].includes((o.status||'').toLowerCase()))
      setActiveOrders(active)
      setOrderHistory(history)
    } catch (e) {
      alert(e?.message || 'Failed to cancel order')
    } finally {
      setCancelModalOpen(false)
      setCancelOrderId(null)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_transit':
        return <Truck className="h-4 w-4 text-blue-600" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'in_transit':
        return 'In Transit'
      case 'delivered':
        return 'Completed'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_transit':
        return 'text-blue-600 bg-blue-50'
      case 'delivered':
        return 'text-green-600 bg-green-50'
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'cancelled':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Orders</h1>
        <p className="text-sm sm:text-base text-gray-600">Track your deliveries and view order history</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'active'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Active Orders ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'history'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Order History ({orderHistory.length})
        </button>
      </div>

      {/* Active Orders */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {loading ? (
            <Card><CardContent className="py-10 text-center">Loading...</CardContent></Card>
          ) : error ? (
            <Card><CardContent className="py-10 text-center text-red-600">{error}</CardContent></Card>
          ) : activeOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Orders</h3>
                <p className="text-gray-500 mb-4">You don't have any active deliveries at the moment</p>
                <Link href="/">
                  <Button>Book a Delivery</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            activeOrders.map((order) => (
              <Card key={order._id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <span className="text-base sm:text-lg">Order #{order._id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium self-start ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </CardTitle>
                      <CardDescription className="text-sm">{order.vehicleType || 'Vehicle'}</CardDescription>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500">Estimated arrival</p>
                      <p className="font-semibold text-blue-600">{order.estimatedTime || '-'}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Driver Info */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {(order.driver?.name || 'D').split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{order.driver?.name || 'Driver'}</p>
                          <p className="text-sm text-gray-600">Your driver</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                      <div>
                        <p className="font-medium">Pickup</p>
                        <p className="text-sm text-gray-600">{order.from?.address || '-'}</p>
                      </div>
                    </div>
                    <div className="ml-6 border-l-2 border-gray-200 h-6"></div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                      <div>
                        <p className="font-medium">Drop-off</p>
                        <p className="text-sm text-gray-600">{order.to?.address || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t space-y-2 sm:space-y-0 sm:flex sm:gap-3">
                    <Button 
                      variant="outline" 
                      className="w-full sm:flex-1 text-sm"
                      onClick={() => handleTrackLive(order._id)}
                    >
                      Track Live
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full sm:flex-1 text-sm"
                      onClick={() => handleViewDetails(order._id)}
                    >
                      View Details
                    </Button>
                    <Button variant="destructive" className="w-full sm:flex-1 text-sm" onClick={() => openCancelModal(order._id)}>
                      Cancel Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Order History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {loading ? (
            <Card><CardContent className="py-10 text-center">Loading...</CardContent></Card>
          ) : error ? (
            <Card><CardContent className="py-10 text-center text-red-600">{error}</CardContent></Card>
          ) : orderHistory.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Order History</h3>
                <p className="text-gray-500">Your completed orders will appear here</p>
              </CardContent>
            </Card>
          ) : (
            orderHistory.map((order) => (
              <Card key={order._id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium">Order #{order._id}</p>
                          <p className="text-sm text-gray-500">{new Date(order.createdAt||Date.now()).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.price || '-'}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">From:</p>
                        <p className="font-medium">{order.from?.address || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">To:</p>
                        <p className="font-medium">{order.to?.address || '-'}</p>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-3 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:w-auto text-xs sm:text-sm"
                        onClick={() => handleViewReceipt(order._id)}
                      >
                        View Receipt
                      </Button>
                      {['completed','delivered'].includes((order.status||'').toLowerCase()) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full sm:w-auto text-xs sm:text-sm"
                          onClick={() => handleRateDriver(order._id)}
                        >
                          Rate & Review
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                        Rebook
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
      <CancelOrderModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        orderDetails={{ id: cancelOrderId }}
      />
    </div>
  )
}
