'use client'

import { useState } from 'react'
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

export default function OrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId

  // Mock order data - in real app, this would be fetched based on orderId
  const orderDetails = {
    id: orderId,
    status: 'in_transit',
    bookingDate: '2024-01-20',
    bookingTime: '2:00 PM',
    driver: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      vehicle: 'Tata Ace',
      plateNumber: 'DL 3C AB 1234',
      rating: 4.8,
      totalTrips: 1250
    },
    pickup: {
      address: 'Sector 48, Noida West',
      contactName: 'Ramesh Kumar',
      contactPhone: '+91 98765 43210',
      instructions: 'Gate No. 2, Blue Building',
      scheduledTime: '2:30 PM',
      actualTime: '2:30 PM'
    },
    dropoff: {
      address: 'Connaught Place, Delhi',
      contactName: 'Suresh Sharma',
      contactPhone: '+91 98765 43211',
      instructions: 'Main entrance, ask for security',
      scheduledTime: '3:15 PM',
      actualTime: null
    },
    package: {
      type: 'Documents',
      weight: '2 kg',
      dimensions: '30cm x 20cm x 5cm',
      value: '₹500',
      description: 'Important office documents'
    },
    pricing: {
      baseFare: 350,
      distanceCharges: 120,
      timeCharges: 25,
      tax: 18,
      discount: 13,
      total: 495
    },
    payment: {
      method: 'UPI',
      transactionId: 'TXN123456789',
      status: 'Completed',
      paidAt: '2:00 PM, 20 Jan 2024'
    },
    distance: '32 km',
    estimatedDuration: '45 mins',
    actualDuration: null
  }

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
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(orderDetails.status)}`}>
            {getStatusText(orderDetails.status)}
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
                  <p className="font-medium">{orderDetails.bookingDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Booking Time</p>
                  <p className="font-medium">{orderDetails.bookingTime}</p>
                </div>
                <div>
                  <p className="text-gray-500">Distance</p>
                  <p className="font-medium">{orderDetails.distance}</p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">
                    {orderDetails.actualDuration || orderDetails.estimatedDuration}
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
                  <h4 className="font-semibold text-gray-900">{orderDetails.driver.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {orderDetails.driver.vehicle} • {orderDetails.driver.plateNumber}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span>⭐ {orderDetails.driver.rating} rating</span>
                    <span>• {orderDetails.driver.totalTrips} trips</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => window.open(`tel:${orderDetails.driver.phone}`)}
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
                    <p className="font-medium">{orderDetails.pickup.address}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                      <p>Contact: {orderDetails.pickup.contactName}</p>
                      <p>Phone: {orderDetails.pickup.contactPhone}</p>
                      <p className="col-span-1 sm:col-span-2">
                        Instructions: {orderDetails.pickup.instructions}
                      </p>
                      <p>Scheduled: {orderDetails.pickup.scheduledTime}</p>
                      <p className="text-green-600">Completed: {orderDetails.pickup.actualTime}</p>
                    </div>
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
                    <p className="font-medium">{orderDetails.dropoff.address}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                      <p>Contact: {orderDetails.dropoff.contactName}</p>
                      <p>Phone: {orderDetails.dropoff.contactPhone}</p>
                      <p className="col-span-1 sm:col-span-2">
                        Instructions: {orderDetails.dropoff.instructions}
                      </p>
                      <p>Scheduled: {orderDetails.dropoff.scheduledTime}</p>
                      <p className="text-blue-600">
                        {orderDetails.dropoff.actualTime ? 
                          `Completed: ${orderDetails.dropoff.actualTime}` : 
                          'In Progress'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Information */}
          <Card>
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Package Type</p>
                  <p className="font-medium">{orderDetails.package.type}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Weight</p>
                  <p className="font-medium">{orderDetails.package.weight}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Dimensions</p>
                  <p className="font-medium">{orderDetails.package.dimensions}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Declared Value</p>
                  <p className="font-medium">{orderDetails.package.value}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-500 mb-1">Description</p>
                  <p className="font-medium">{orderDetails.package.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Payment Method */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="text-sm font-medium">{orderDetails.payment.method}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Transaction ID</span>
                  <span className="text-sm font-mono">{orderDetails.payment.transactionId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Status</span>
                  <span className="text-sm font-medium text-green-600">{orderDetails.payment.status}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Price Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span>₹{orderDetails.pricing.baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance Charges</span>
                    <span>₹{orderDetails.pricing.distanceCharges}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Charges</span>
                    <span>₹{orderDetails.pricing.timeCharges}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax & Fees</span>
                    <span>₹{orderDetails.pricing.tax}</span>
                  </div>
                  {orderDetails.pricing.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{orderDetails.pricing.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t font-semibold text-lg">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{orderDetails.pricing.total}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                <p>Order placed on {orderDetails.payment.paidAt}</p>
                <p className="mt-1">Need help? Contact our support team</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
