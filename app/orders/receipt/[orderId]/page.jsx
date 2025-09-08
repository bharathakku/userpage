'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Check,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Package,
  User,
  Printer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ReceiptPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId

  // Mock receipt data - in real app, this would be fetched based on orderId
  const receiptData = {
    id: orderId,
    invoiceNumber: `INV-${orderId}`,
    orderDate: '2024-01-20',
    orderTime: '2:00 PM',
    completedDate: '2024-01-20',
    completedTime: '3:45 PM',
    driver: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      vehicle: 'Tata Ace',
      plateNumber: 'DL 3C AB 1234'
    },
    customer: {
      name: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      email: 'ramesh@example.com'
    },
    pickup: {
      address: 'Sector 48, Noida West',
      contactName: 'Ramesh Kumar',
      contactPhone: '+91 98765 43210'
    },
    dropoff: {
      address: 'Connaught Place, Delhi',
      contactName: 'Suresh Sharma',
      contactPhone: '+91 98765 43211'
    },
    package: {
      type: 'Documents',
      weight: '2 kg',
      description: 'Important office documents'
    },
    pricing: {
      baseFare: 350,
      distanceCharges: 120,
      timeCharges: 25,
      gst: 16.2,
      serviceCharge: 8,
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
    duration: '1 hour 15 minutes',
    gstDetails: {
      gstin: 'YD123456789',
      companyName: 'YourDelivery Private Limited',
      address: 'Sector 18, Noida, UP - 201301'
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleDownload = () => {
    // In real app, this would generate and download PDF
    alert('PDF download functionality would be implemented here')
  }

  const handleShare = () => {
    // In real app, this would share receipt
    if (navigator.share) {
      navigator.share({
        title: `Receipt for Order #${orderId}`,
        text: `Receipt for your YourDelivery order #${orderId}`,
        url: window.location.href
      })
    } else {
      alert('Share functionality would be implemented here')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hidden in print */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl print:hidden">
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
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Receipt</h1>
              <p className="text-sm text-gray-600">Order #{orderId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Receipt Content */}
      <div className="container mx-auto px-3 sm:px-4 pb-6 max-w-2xl print:px-0 print:max-w-full">
        <Card className="print:shadow-none print:border-0">
          <CardContent className="p-6 sm:p-8 print:p-6">
            {/* Header */}
            <div className="text-center mb-8 print:mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">YD</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">YourDelivery</h2>
                  <p className="text-sm text-gray-600">Partner first logistics</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-semibold">Order Completed Successfully</span>
              </div>
              
              <div className="text-center text-gray-600 text-sm">
                <p>GST Invoice</p>
                <p className="font-mono mt-1">#{receiptData.invoiceNumber}</p>
              </div>
            </div>

            {/* Company Details */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg print:bg-transparent">
              <h3 className="font-semibold text-gray-900 mb-2">Company Details</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium">{receiptData.gstDetails.companyName}</p>
                <p>{receiptData.gstDetails.address}</p>
                <p>GSTIN: {receiptData.gstDetails.gstin}</p>
              </div>
            </div>

            {/* Order Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Order Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">#{receiptData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">{receiptData.orderDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">{receiptData.completedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{receiptData.duration}</span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{receiptData.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{receiptData.customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-xs">{receiptData.customer.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Service Details
              </h3>
              
              <div className="space-y-4">
                {/* Pickup */}
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-green-800 mb-1">Pickup Location</p>
                    <p className="text-sm text-green-700">{receiptData.pickup.address}</p>
                    <p className="text-xs text-green-600 mt-1">Contact: {receiptData.pickup.contactName}</p>
                  </div>
                </div>

                {/* Dropoff */}
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-800 mb-1">Dropoff Location</p>
                    <p className="text-sm text-blue-700">{receiptData.dropoff.address}</p>
                    <p className="text-xs text-blue-600 mt-1">Contact: {receiptData.dropoff.contactName}</p>
                  </div>
                </div>

                {/* Package & Driver */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Package Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Type: {receiptData.package.type}</p>
                      <p>Weight: {receiptData.package.weight}</p>
                      <p>Distance: {receiptData.distance}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Driver Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Name: {receiptData.driver.name}</p>
                      <p>Vehicle: {receiptData.driver.vehicle}</p>
                      <p>Plate: {receiptData.driver.plateNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Details
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent">
                {/* Payment Method */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Payment Method</p>
                    <p className="text-sm text-gray-600">{receiptData.payment.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{receiptData.payment.status}</p>
                    <p className="text-xs text-gray-500">TXN: {receiptData.payment.transactionId}</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span>₹{receiptData.pricing.baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance Charges ({receiptData.distance})</span>
                    <span>₹{receiptData.pricing.distanceCharges}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Charges</span>
                    <span>₹{receiptData.pricing.timeCharges}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Charge</span>
                    <span>₹{receiptData.pricing.serviceCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%)</span>
                    <span>₹{receiptData.pricing.gst}</span>
                  </div>
                  {receiptData.pricing.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{receiptData.pricing.discount}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-green-600">₹{receiptData.pricing.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 border-t pt-6">
              <p className="mb-2">Thank you for choosing YourDelivery!</p>
              <p>For support, contact us at: support@yourdelivery.com | +91 1800-123-4567</p>
              <p className="mt-2">This is a computer-generated invoice and doesn't require a signature.</p>
              <p className="mt-4 text-xs">Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .print\\:max-w-full {
            max-width: 100% !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
          .print\\:p-6 {
            padding: 1.5rem !important;
          }
          .print\\:bg-transparent {
            background-color: transparent !important;
          }
        }
      `}</style>
    </div>
  )
}
