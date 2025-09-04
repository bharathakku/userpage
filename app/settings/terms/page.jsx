'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const lastUpdated = 'December 15, 2023'

  const termsContent = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using YourDelivery services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      title: '2. Service Description',
      content: `YourDelivery provides on-demand delivery services connecting customers with delivery partners. We facilitate the pickup and delivery of goods within specified service areas through our mobile application and website platform.`
    },
    {
      title: '3. User Registration and Account',
      content: `To use our services, you must register and create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration.`
    },
    {
      title: '4. Service Availability and Limitations',
      content: `Our services are available in select cities and areas. Service availability may vary based on location, time, weather conditions, and partner availability. We reserve the right to limit or discontinue services in any area at our discretion.`
    },
    {
      title: '5. Pricing and Payment',
      content: `Delivery charges are calculated based on distance, vehicle type, and current demand. All prices displayed include applicable taxes. Payment can be made through various methods including UPI, cards, net banking, or cash on delivery where available.`
    },
    {
      title: '6. Booking and Cancellation Policy',
      content: `Bookings can be cancelled before pickup with applicable cancellation charges. Late cancellations or no-shows may incur additional fees. Refunds for cancelled orders will be processed as per our refund policy.`
    },
    {
      title: '7. Prohibited Items',
      content: `Certain items are prohibited from transport including but not limited to: illegal substances, dangerous goods, perishable items without proper packaging, valuable items above specified limits, and items prohibited by law.`
    },
    {
      title: '8. Liability and Insurance',
      content: `YourDelivery acts as an intermediary platform. While we strive to ensure safe delivery, our liability is limited to the declared value of goods. Users are advised to purchase additional insurance for valuable items.`
    },
    {
      title: '9. Privacy and Data Protection',
      content: `We collect and process personal information as described in our Privacy Policy. By using our services, you consent to the collection and use of your information in accordance with our Privacy Policy.`
    },
    {
      title: '10. Dispute Resolution',
      content: `Any disputes arising from the use of our services will be resolved through arbitration in accordance with the laws of India. The courts of [City] shall have exclusive jurisdiction over any legal proceedings.`
    },
    {
      title: '11. Modifications to Terms',
      content: `YourDelivery reserves the right to modify these terms at any time. Users will be notified of significant changes through the app or email. Continued use of services after modifications constitutes acceptance of updated terms.`
    },
    {
      title: '12. Contact Information',
      content: `For questions regarding these terms, please contact us at legal@yourdelivery.com or through our customer support channels available in the app.`
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Terms and Conditions</h1>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          Read the rules
        </p>

        {/* Document Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">YourDelivery Terms of Service</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Last updated: {lastUpdated}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      10 min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Content */}
        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
            <p className="text-sm text-gray-600">
              Please read these terms carefully before using our services. By using YourDelivery, 
              you agree to be bound by these terms and conditions.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {termsContent.map((section, index) => (
              <div key={index} className="pb-6 border-b border-gray-100 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {section.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}

            {/* Important Notice */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-600 text-sm font-bold">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Important Notice</h4>
                  <p className="text-sm text-yellow-700">
                    These terms are legally binding. If you do not agree with any part of these terms, 
                    please discontinue using our services immediately. For clarifications, contact our 
                    legal team at legal@yourdelivery.com.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Questions about our terms? Contact our support team.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              Download PDF
            </Button>
            <Button variant="outline">
              Contact Legal Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
