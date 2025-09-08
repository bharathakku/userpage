'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Star, User, CheckCircle, MessageCircle, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RatingPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [submitted, setSubmitted] = useState(false)

  // Mock order data - in real app, this would be fetched based on orderId
  const orderDetails = {
    id: orderId,
    driver: 'Rajesh Kumar',
    vehicle: 'Tata Ace',
    date: '2024-01-20',
    pickup: 'Sector 62, Noida',
    dropoff: 'Karol Bagh, Delhi',
    fare: 380
  }

  const feedbackTags = [
    'On time delivery',
    'Professional behavior',
    'Safe driving',
    'Clean vehicle',
    'Helpful attitude',
    'Good communication',
    'Careful handling',
    'Followed instructions'
  ]

  const handleBack = () => {
    router.back()
  }

  const handleRating = (value) => {
    setRating(value)
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleSubmit = () => {
    if (rating === 0) return
    
    // Here you would submit the rating to your API
    console.log({
      orderId,
      rating,
      feedback,
      tags: selectedTags
    })
    
    setSubmitted(true)
    
    // Redirect back to orders after 2 seconds
    setTimeout(() => {
      router.push('/orders')
    }, 2000)
  }

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Poor'
      case 2: return 'Below Average'
      case 3: return 'Average'
      case 4: return 'Good'
      case 5: return 'Excellent'
      default: return 'Tap to rate'
    }
  }

  const getRatingColor = (rating) => {
    if (rating <= 2) return 'text-red-600'
    if (rating === 3) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="container mx-auto px-3 sm:px-4 py-4 max-w-md">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-4">
                Your rating has been submitted successfully.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to orders...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
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
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Rate Your Experience</h1>
        </div>

        <div className="space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{orderDetails.driver}</p>
                  <p className="text-sm text-gray-600">{orderDetails.vehicle}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Order ID</p>
                  <p className="font-medium">#{orderDetails.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium">₹{orderDetails.fare}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How was your experience?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-2 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className={`text-lg font-medium ${getRatingColor(rating)}`}>
                  {getRatingText(rating)}
                </p>
              </div>

              {/* Feedback Tags */}
              {rating > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">What went well?</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {feedbackTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                          selectedTags.includes(tag)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Written Feedback */}
              {rating > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Additional feedback (Optional)
                  </h4>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your experience or suggestions..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white"
                >
                  Submit Rating
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full"
                >
                  Skip for Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">Report Issue</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span className="text-sm">Add Photos</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
