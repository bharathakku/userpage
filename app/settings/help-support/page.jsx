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
import { connectSocket, joinChatThread, onChatMessage, emitChatMessage } from '@/lib/socket'
import { useApp } from '@/contexts/AppContext'

// Chat Component
function ChatWidget() {
  const { state } = useApp()
  // Resolve userId robustly from context or localStorage
  const userId = (() => {
    if (state?.user?.id) return state.user.id
    if (state?.user?._id) return state.user._id
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('user_data') : null
      const parsed = raw ? JSON.parse(raw) : null
      return parsed?.id || parsed?._id || null
    } catch { return null }
  })()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [threadId, setThreadId] = useState(null)
  const [unread, setUnread] = useState(0)
  const messagesEndRef = useRef(null)

  const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4001/api'
  const apiBase = rawBase.endsWith('/api') ? rawBase : rawBase.replace(/\/$/, '') + '/api'

  // connect socket once and auto-open if coming from complaint form
  useEffect(() => {
    connectSocket()
    try {
      const flag = typeof window !== 'undefined' ? localStorage.getItem('open_support_chat') : null
      if (flag === '1') {
        setIsOpen(true)
        localStorage.removeItem('open_support_chat')
      }
    } catch {}
  }, [])

  // Allow external trigger from the page to open the chat instantly
  useEffect(() => {
    const handler = () => { setIsOpen(true); setIsMinimized(false); setUnread(0) }
    if (typeof window !== 'undefined') {
      window.addEventListener('open_support_chat', handler)
      // Optional global for convenience
      try { window.openSupportChat = handler } catch {}
    }
    return () => { if (typeof window !== 'undefined') window.removeEventListener('open_support_chat', handler) }
  }, [])

  // Set threadId and join room when userId is known
  useEffect(() => {
    if (!userId) return
    const tid = `admin:${userId}`
    setThreadId(tid)
    joinChatThread(tid)
  }, [userId])
  // Listen for incoming messages for this thread
  useEffect(() => {
    if (!threadId) return
    const off = onChatMessage((msg) => {
      if (msg.threadId && msg.threadId !== threadId) return
      setMessages(prev => {
        const id = msg._id || `${msg.text}-${msg.createdAt}`
        const exists = prev.some(m => (m._id || m.id) === id)
        if (exists) return prev
        return [...prev, {
          _id: msg._id,
          id,
          text: msg.text,
          sender: String(msg.fromUserId) === String(userId) ? 'user' : 'agent',
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]
      })
      if (!isOpen || isMinimized) setUnread(u => u + 1)
      if (isOpen && !isMinimized) setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 40)
    })
    return () => { off && off() }
  }, [threadId, userId, isOpen, isMinimized])

  // When opening the widget, load history once
  useEffect(() => {
    if (!isOpen || !threadId) return
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {}
    fetch(`${apiBase}/chat/threads/${threadId}/messages`, { credentials: 'include', headers: { ...authHeader } })
      .then(async r => {
        if (!r.ok) return []
        return r.json()
      })
      .then(items => {
        const mapped = (items || []).map(m => ({
          id: m._id,
          text: m.text,
          sender: String(m.fromUserId) === String(userId) ? 'user' : 'agent',
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
        setMessages(mapped)
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
      })
      .catch(() => {})
  }, [isOpen, threadId, userId, apiBase])

  

  const sendMessage = async () => {
    if (!message.trim() || !threadId) return
    const text = message
    setMessage('')
    const tempId = `local-${Date.now()}`
    setMessages(prev => [...prev, { id: tempId, _id: tempId, text, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 20)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await fetch(`${apiBase}/chat/threads/${threadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        credentials: 'include',
        body: JSON.stringify({ text })
      })
      let saved = null
      try { saved = await res.json() } catch {}
      const payload = saved && saved._id ? saved : { _id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text, fromUserId: userId, createdAt: new Date().toISOString(), threadId }
      // Update optimistic bubble to use saved id so socket echo won't duplicate
      setMessages(prev => prev.map(m => (m._id === tempId ? { ...m, _id: payload._id, id: payload._id, time: new Date(payload.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : m)))
      // Now emit once so the admin receives it
      emitChatMessage(threadId, payload)
    } catch {}
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
          onClick={() => { setIsOpen(true); setUnread(0) }}
          className="relative h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none px-1.5 py-1 rounded-full">
              {unread}
            </span>
          )}
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
              {messages.map((msg, idx) => (
                <div
                  key={`${msg._id || msg.id || 'm'}-${idx}`}
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
                  onKeyDown={handleKeyPress}
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
                      {option.title === 'Live Chat' ? (
                        <Button
                          size="sm"
                          onClick={() => { try { window.dispatchEvent(new Event('open_support_chat')) } catch {} }}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Start Chat
                        </Button>
                      ) : (
                        <Button size="sm" className={`${option.color.replace('text-', 'bg-').replace('-600', '-600')} hover:${option.color.replace('text-', 'bg-').replace('-600', '-700')} text-white`}>
                          {option.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Complaint Section (replaces phone call option) */}
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">Raise a Complaint</h3>
                  <p className="text-sm text-gray-600 mb-2">Report issues and track resolution with our support team</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Response within 1 hour</span>
                    <Button size="sm" variant="outline" onClick={() => router.push('/support/complaint')} className="border-red-200 text-red-700 hover:bg-red-50">
                      Open Complaint
                    </Button>
                  </div>
                </div>
              </div>
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
