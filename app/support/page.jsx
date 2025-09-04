'use client'

import { useState } from 'react'
import { MessageCircle, Phone, Mail, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const faqData = [
  { id: 1, question: "How do I get a refund?", answer: "Refunds are processed within 5-7 business days after cancellation approval. The amount will be credited to your original payment method." },
  { id: 2, question: "How can I change my delivery address?", answer: "You can change your delivery address before the driver picks up your order. Go to Orders section and click on the order to modify the address." },
  { id: 3, question: "Where is my order?", answer: "Track your order in real-time from the Orders section. You'll receive live updates and can contact the driver directly." }
]

const supportCategories = [
  { title: "Popular topics", items: ["Refunds & Cancellations", "Payments & Delivery", "Delivery"] },
  { title: "Account", items: ["Login Issues", "Profile Settings", "Verification"] },
  { title: "Orders", items: ["Track Order", "Cancel Order", "Modify Order"] },
  { title: "Payments", items: ["Payment Methods", "Billing Issues", "Refunds"] }
]

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const filteredFaq = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
        <p className="text-gray-600">Describe your issue (e.g. refund, cancellation, order status)</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Contact Options */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start gap-3 h-12" variant="default">
                <MessageCircle className="h-5 w-5" />
                Chat with us
              </Button>
              
              <div className="border-t pt-4">
                <div className="text-sm text-gray-600 mb-2">Call us</div>
                <div className="text-sm text-gray-800">+91 98765 43210</div>
              </div>
              
              <div className="border-t pt-4">
                <div className="text-sm text-gray-600 mb-2">Email support</div>
                <div className="text-sm text-gray-800">support@yourdelivery.com</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - FAQ and Categories */}
        <div className="lg:col-span-2 space-y-8">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Frequently Asked Questions */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Frequently asked questions</h2>
            <div className="space-y-2">
              {filteredFaq.map((faq) => (
                <Card key={faq.id} className="border">
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 py-4"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium">{faq.question}</CardTitle>
                      {expandedFaq === faq.id ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </div>
                  </CardHeader>
                  {expandedFaq === faq.id && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* Support Categories */}
          <section className="grid md:grid-cols-2 gap-6">
            {supportCategories.map((category, index) => (
              <div key={index}>
                <h3 className="font-medium text-gray-900 mb-3">{category.title}</h3>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                        {item}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* Terms and Conditions Links */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <div className="grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="font-medium mb-2">1. Introduction</h4>
            <p className="text-gray-600">Welcome to YourDelivery. These Terms & Conditions govern your access to and use of our services.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">2. Definitions</h4>
            <p className="text-gray-600">Key terms and definitions used throughout our platform and services.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">3. Acceptance of Terms</h4>
            <p className="text-gray-600">By using our services you agree to be bound by these Terms.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">4. Eligibility & Account Registration</h4>
            <p className="text-gray-600">Requirements for creating and maintaining an account with us.</p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          © 2025 YourDelivery — Terms • Privacy • Help
        </div>
      </div>
    </div>
  )
}
