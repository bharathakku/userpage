'use client'

import { useState, useRef, useEffect } from 'react'
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
  AlertTriangle,
  Send,
  X,
  MinusCircle,
  Maximize
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Chat Component
function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'agent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setMessage('')
      
      // Simulate agent response
      setTimeout(() => {
        const response = {
          id: messages.length + 2,
          text: 'Thank you for your message. Our team will assist you shortly.',
          sender: 'agent',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, response])
      }, 1000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 sm:w-80 lg:w-96 max-w-[calc(100vw-2rem)]">
      <Card className={`shadow-xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-80 sm:h-96'}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium text-sm">Live Chat Support</span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-1 text-white hover:bg-blue-500 rounded"
            >
              {isMinimized ? <Maximize className="h-4 w-4" /> : <MinusCircle className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-1 text-white hover:bg-blue-500 rounded"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <>
            <CardContent className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 opacity-70`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows={1}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  size="sm"
                  className="h-8 w-8 p-1"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

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
    <>
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
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
    <ChatWidget />
    </>
  )
}
