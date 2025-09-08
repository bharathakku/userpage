'use client'

import { useState } from 'react'
import { Package, Clock, CheckCircle, XCircle, MapPin, Phone, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function OrdersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('active')

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

  const activeOrders = [
    {
      id: 'CBN7G53B6001',
      status: 'in_transit',
      vehicle: 'Tata Ace',
      driver: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      pickup: 'Sector 48, Noida West',
      dropoff: 'Connaught Place, Delhi',
      estimatedTime: '45 mins',
      fare: 495
    }
  ]

  const orderHistory = [
    {
      id: 'CBN7G53B6002',
      status: 'completed',
      date: '2024-01-20',
      vehicle: 'Tata Ace',
      pickup: 'Sector 62, Noida',
      dropoff: 'Karol Bagh, Delhi',
      fare: 380
    },
    {
      id: 'CBN7G53B6003',
      status: 'cancelled',
      date: '2024-01-18',
      vehicle: '2 Wheeler',
      pickup: 'Lajpat Nagar',
      dropoff: 'India Gate',
      fare: 120
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_transit':
        return <Truck className="h-4 w-4 text-blue-600" />
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
          {activeOrders.length === 0 ? (
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
              <Card key={order.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <span className="text-base sm:text-lg">Order #{order.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium self-start ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </CardTitle>
                      <CardDescription className="text-sm">{order.vehicle}</CardDescription>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500">Estimated arrival</p>
                      <p className="font-semibold text-blue-600">{order.estimatedTime}</p>
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
                            {order.driver.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{order.driver}</p>
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
                        <p className="text-sm text-gray-600">{order.pickup}</p>
                      </div>
                    </div>
                    <div className="ml-6 border-l-2 border-gray-200 h-6"></div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                      <div>
                        <p className="font-medium">Drop-off</p>
                        <p className="text-sm text-gray-600">{order.dropoff}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t space-y-2 sm:space-y-0 sm:flex sm:gap-3">
                    <Button 
                      variant="outline" 
                      className="w-full sm:flex-1 text-sm"
                      onClick={() => handleTrackLive(order.id)}
                    >
                      Track Live
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full sm:flex-1 text-sm"
                      onClick={() => handleViewDetails(order.id)}
                    >
                      View Details
                    </Button>
                    <Button variant="destructive" className="w-full sm:flex-1 text-sm">
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
          {orderHistory.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Order History</h3>
                <p className="text-gray-500">Your completed orders will appear here</p>
              </CardContent>
            </Card>
          ) : (
            orderHistory.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">{order.date} • {order.vehicle}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.fare}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">From:</p>
                        <p className="font-medium">{order.pickup}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">To:</p>
                        <p className="font-medium">{order.dropoff}</p>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-3 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:w-auto text-xs sm:text-sm"
                        onClick={() => handleViewReceipt(order.id)}
                      >
                        View Receipt
                      </Button>
                      {order.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full sm:w-auto text-xs sm:text-sm"
                          onClick={() => handleRateDriver(order.id)}
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
    </div>
  )
}
