'use client'

import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CancelOrderModal({ isOpen, onClose, onConfirm, orderDetails }) {
  const [selectedReason, setSelectedReason] = useState('')
  const [otherReason, setOtherReason] = useState('')

  const cancellationReasons = [
    'Driver was not allocated',
    'Changed my mind', 
    'My reason is not listed'
  ]

  const handleConfirm = () => {
    const reason = selectedReason === 'My reason is not listed' ? otherReason : selectedReason
    if (reason.trim()) {
      onConfirm(reason)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between">
            <div></div>
            <CardTitle className="text-lg">Please choose a reason for cancellation 😊</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cancellation Reasons */}
          <div className="space-y-3">
            {cancellationReasons.map((reason) => (
              <label 
                key={reason} 
                className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="cancellationReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{reason}</span>
              </label>
            ))}
          </div>

          {/* Other reason text area */}
          {selectedReason === 'My reason is not listed' && (
            <div className="mt-4">
              <textarea
                placeholder="You can add other reason here (optional)"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          )}

          {/* Warning message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              Selecting a reason helps us improve our service. You can also provide additional feedback if needed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onClose}
            >
              Go Back
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700" 
              onClick={handleConfirm}
              disabled={!selectedReason}
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
