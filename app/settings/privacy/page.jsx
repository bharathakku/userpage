'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Shield, Calendar, Clock, Eye, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const lastUpdated = 'December 15, 2023'

  const privacyContent = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us. This includes your name, email address, phone number, delivery addresses, and payment information. We also automatically collect certain information about your device and how you interact with our services.`
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, communicate with you about products and services, and monitor and analyze trends and usage patterns.`
    },
    {
      title: '3. Information Sharing and Disclosure',
      content: `We may share your information with delivery partners to facilitate your bookings, with service providers who perform services on our behalf, when required by law or to protect our rights, and with your consent or at your direction.`
    },
    {
      title: '4. Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.`
    },
    {
      title: '5. Location Information',
      content: `We collect location information to provide delivery services, match you with nearby delivery partners, and improve our services. You can control location permissions through your device settings, though this may limit service functionality.`
    },
    {
      title: '6. Cookies and Tracking Technologies',
      content: `We use cookies and similar technologies to collect information about your browsing activities, remember your preferences, and provide personalized experiences. You can control cookies through your browser settings.`
    },
    {
      title: '7. Data Retention',
      content: `We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements. You can request deletion of your account and personal data.`
    },
    {
      title: '8. Your Rights and Choices',
      content: `You have the right to access, update, or delete your personal information, opt out of promotional communications, and control how your information is used. Contact us to exercise these rights or if you have questions about our privacy practices.`
    },
    {
      title: '9. Third-Party Services',
      content: `Our services may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties and encourage you to review their privacy policies.`
    },
    {
      title: '10. Changes to This Policy',
      content: `We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the effective date. Your continued use of our services after changes constitutes acceptance.`
    }
  ]

  const dataCategories = [
    {
      icon: Eye,
      title: 'Personal Information',
      description: 'Name, email, phone number, and profile details',
      retention: '5 years after account closure'
    },
    {
      icon: Lock,
      title: 'Location Data',
      description: 'Pickup and delivery addresses, GPS location',
      retention: '2 years for service improvement'
    },
    {
      icon: Shield,
      title: 'Payment Information',
      description: 'Card details, payment history (encrypted)',
      retention: '7 years as per regulations'
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
          <h1 className="text-xl font-semibold text-gray-900">Privacy Policy</h1>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          How we protect your data
        </p>

        {/* Document Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">YourDelivery Privacy Policy</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Last updated: {lastUpdated}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      8 min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data We Collect */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data We Collect & Protect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataCategories.map((category, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                  <category.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  <p className="text-xs text-gray-500">Retention: {category.retention}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Privacy Policy Content */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <p className="text-sm text-gray-600">
              At YourDelivery, we are committed to protecting your privacy and ensuring the security of your personal information. This policy explains how we collect, use, and protect your data.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {privacyContent.map((section, index) => (
              <div key={index} className="pb-6 border-b border-gray-100 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {section.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}

            {/* Privacy Rights */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="text-blue-600 h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Your Privacy Rights</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    You have the right to access, correct, or delete your personal data at any time. 
                    You can also control how your information is used for marketing purposes.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-blue-700 border-blue-300 hover:bg-blue-100">
                      Manage Data
                    </Button>
                    <Button size="sm" variant="outline" className="text-blue-700 border-blue-300 hover:bg-blue-100">
                      Download Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Questions about our privacy practices? We're here to help.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              Contact Privacy Team
            </Button>
            <Button variant="outline">
              Data Protection Officer
            </Button>
          </div>
        </div>

        {/* Compliance Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            This privacy policy complies with applicable data protection laws including GDPR and applicable Indian privacy regulations.
          </p>
        </div>
      </div>
    </div>
  )
}
