'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock,
  ChevronRight,
  HelpCircle,
  FileText,
  Headphones,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HelpSupportPage() {
  const router = useRouter()
  const [expandedFaq, setExpandedFaq] = useState(null)

  const handleBack = () => {
    router.back()
  }

  const contactOptions = [
    {
      icon: Phone,
      title: 'Call Us',
      subtitle: 'Get immediate assistance',
      info: '+91 1800-123-4567',
      available: '24/7 Available',
      action: 'Call Now',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      subtitle: 'Chat with our support team',
      info: 'Average response time: 2 mins',
      available: 'Online now',
      action: 'Start Chat',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Mail,
      title: 'Email Support',
      subtitle: 'Send us a detailed message',
      info: 'support@yourdelivery.com',
      available: 'Response within 24 hours',
      action: 'Send Email',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  const quickActions = [
    {
      icon: FileText,
      title: 'Order Issues',
      subtitle: 'Report problems with your delivery',
      href: '/help/order-issues'
    },
    {
      icon: AlertTriangle,
      title: 'Report a Problem',
      subtitle: 'Technical issues or concerns',
      href: '/help/report-problem'
    },
    {
      icon: HelpCircle,
      title: 'FAQs',
      subtitle: 'Frequently asked questions',
      href: '/help/faqs'
    }
  ]

  const faqs = [
    {
      question: 'How do I track my delivery?',
      answer: 'You can track your delivery in real-time through the Orders section. You\'ll receive notifications at each step of the delivery process.'
    },
    {
      question: 'What are the delivery charges?',
      answer: 'Delivery charges vary based on distance, vehicle type, and delivery urgency. You can see the exact charges before confirming your booking.'
    },
    {
      question: 'How do I cancel my order?',
      answer: 'You can cancel your order from the Orders section before the driver picks up your item. Cancellation fees may apply based on timing.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI, credit/debit cards, net banking, and cash on delivery. Digital payments are preferred for contactless delivery.'
    },
    {
      question: 'How do I change my delivery address?',
      answer: 'You can update your delivery address before the pickup is completed. Additional charges may apply if the new location is significantly different.'
    }
  ]

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
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
          <h1 className="text-xl font-semibold text-gray-900">Help & Support</h1>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          Get assistance
        </p>

        {/* Contact Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-blue-600" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactOptions.map((option, index) => (
              <div key={index} className={`p-4 ${option.bgColor} rounded-lg`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${option.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <option.icon className={`h-5 w-5 ${option.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{option.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{option.subtitle}</p>
                    <p className="text-sm font-medium text-gray-800 mb-1">{option.info}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {option.available}
                      </span>
                      <Button size="sm" className={`${option.color.replace('text-', 'bg-').replace('-600', '-600')} hover:${option.color.replace('text-', 'bg-').replace('-600', '-700')} text-white`}>
                        {option.action}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <action.icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-500">{action.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronRight 
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      expandedFaq === index ? 'rotate-90' : ''
                    }`} 
                  />
                </button>
                
                {expandedFaq === index && (
                  <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Still need help? We're here for you!
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>Mon-Sun: 24/7</span>
            <span>•</span>
            <span>Average response: 2 mins</span>
          </div>
        </div>
      </div>
    </div>
  )
}
