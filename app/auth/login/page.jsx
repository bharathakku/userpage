'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Phone, Loader2, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import OTPInput from '@/components/ui/OTPInput'
import { API_BASE_URL } from '@/lib/api/apiClient'
import { validatePhoneNumber } from '@/lib/phoneUtils'

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone') // 'phone' or 'otp'
  const [isLoading, setIsLoading] = useState(false)
  const [phoneToken, setPhoneToken] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // OTP-only authentication (demo login removed)

  // Avoid hydration mismatches from extension-injected DOM (e.g., password managers)
  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validation = validatePhoneNumber(phoneNumber)
    
    if (!validation.isValid) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/phone/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${validation.cleaned}` })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP')
      setPhoneToken(data.token)
      setSuccess('OTP sent successfully!')
      setStep('otp')
      setPhoneNumber(validation.formatted)
      // Dev-only aid: auto-complete OTP using devCode if provided by backend
      if (data.devCode) {
        try { setTimeout(() => handleOTPComplete(String(data.devCode)), 200) } catch {}
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.')
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPComplete = async (enteredOTP) => {
    setOtp(enteredOTP)
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/phone/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: phoneToken, code: enteredOTP, role: 'customer' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid OTP')

      setSuccess('Login successful!')
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
      // Write a persistent cookie and ensure it is visible before navigating
      try {
        const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
        // 7 days lifetime
        document.cookie = `auth_token=${data.token}; Path=/; Max-Age=604800; SameSite=Lax${secure}`
      } catch {}
      // Wait until the cookie is readable to avoid middleware race
      const start = Date.now()
      const waitForCookie = () => {
        try {
          if (document.cookie.includes('auth_token=')) {
            router.push('/')
            return
          }
        } catch {}
        if (Date.now() - start > 1000) {
          // Fallback to hard navigation if cookie not detected quickly
          window.location.href = '/'
          return
        }
        setTimeout(waitForCookie, 50)
      }
      waitForCookie()
    } catch (err) {
      setError(err.message || 'Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError('')
    setIsLoading(true)

    try {
      const validation = validatePhoneNumber(phoneNumber)
      const res = await fetch(`${API_BASE_URL}/auth/phone/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${validation.cleaned}` })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to resend OTP')
      setPhoneToken(data.token)
      setSuccess('OTP resent successfully!')
      if (data.devCode) {
        try { setTimeout(() => handleOTPComplete(String(data.devCode)), 200) } catch {}
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToPhone = () => {
    setStep('phone')
    setOtp('')
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="absolute left-4 top-4">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">
                {step === 'phone' ? 'Welcome Back' : 'Verify OTP'}
              </h1>
            </div>
            <CardDescription>
              {step === 'phone' 
                ? 'Enter your mobile number to continue' 
                : `We've sent a 6-digit code to ${phoneNumber}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  {mounted ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-bwignore="true"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        placeholder="Enter your 10-digit mobile number"
                        maxLength={10}
                        required
                      />
                    </div>
                  ) : (
                    // Render a stable placeholder on server and initial client render
                    <div className="h-12 w-full border border-gray-200 rounded-lg bg-gray-50" />
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send you a verification code
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Enter Verification Code
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    We've sent a 6-digit code to <br />
                    <span className="font-medium text-gray-900">{phoneNumber}</span>
                  </p>
                  
                  <OTPInput
                    onComplete={handleOTPComplete}
                    isLoading={isLoading}
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleResendOTP}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      'Resend OTP'
                    )}
                  </Button>

                  <Button
                    onClick={handleBackToPhone}
                    variant="ghost"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Change Number
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
