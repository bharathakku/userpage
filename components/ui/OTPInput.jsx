'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function OTPInput({ 
  length = 6, 
  onComplete, 
  isLoading = false,
  disabled = false 
}) {
  const [otp, setOtp] = useState(new Array(length).fill(''))
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRefs = useRef([])

  const handleChange = (index, value) => {
    if (disabled || isLoading) return

    // Only allow single digit
    if (value.length > 1) return

    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input if current is filled
    if (value && index < length - 1) {
      setActiveIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }

    // Check if all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.length === length) {
      onComplete(newOtp.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (disabled || isLoading) return

    // Handle backspace
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Clear current field
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        // Move to previous field
        setActiveIndex(index - 1)
        inputRefs.current[index - 1]?.focus()
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1)
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    if (disabled || isLoading) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    
    if (pastedData.length === length) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      setActiveIndex(length - 1)
      inputRefs.current[length - 1]?.focus()
      onComplete(pastedData)
    }
  }

  const clearOTP = () => {
    setOtp(new Array(length).fill(''))
    setActiveIndex(0)
    inputRefs.current[0]?.focus()
  }

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setActiveIndex(index)}
            disabled={disabled || isLoading}
            className={`
              w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-200
              ${activeIndex === index 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${disabled || isLoading 
                ? 'bg-gray-100 cursor-not-allowed' 
                : 'bg-white'
              }
            `}
          />
        ))}
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Verifying OTP...</span>
        </div>
      )}
      
      <div className="text-center">
        <button
          type="button"
          onClick={clearOTP}
          disabled={disabled || isLoading}
          className="text-sm text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
        >
          Clear OTP
        </button>
      </div>
    </div>
  )
}


