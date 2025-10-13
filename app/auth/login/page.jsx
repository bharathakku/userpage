'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Lock, Loader2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { API_BASE_URL } from '@/lib/api/apiClient'
 

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mounted, setMounted] = useState(false)
  const [captchaA, setCaptchaA] = useState(0)
  const [captchaB, setCaptchaB] = useState(0)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const router = useRouter()

  // Avoid hydration mismatches from extension-injected DOM (e.g., password managers)
  useEffect(() => {
    setMounted(true)
    regenCaptcha()
  }, [])

  const regenCaptcha = () => {
    setCaptchaA(() => Math.floor(1 + Math.random() * 9))
    setCaptchaB(() => Math.floor(1 + Math.random() * 9))
    setCaptchaAnswer('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (parseInt(captchaAnswer, 10) !== (captchaA + captchaB)) {
      setError('Captcha is incorrect')
      return
    }
    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid credentials')
      setSuccess('Login successful!')
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
      try {
        const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
        document.cookie = `auth_token=${data.token}; Path=/; Max-Age=604800; SameSite=Lax${secure}`
      } catch {}
      const start = Date.now()
      const waitForCookie = () => {
        try {
          if (document.cookie.includes('auth_token=')) { router.push('/'); return }
        } catch {}
        if (Date.now() - start > 1000) { window.location.href = '/'; return }
        setTimeout(waitForCookie, 50)
      }
      waitForCookie()
    } catch (err) {
      setError(err.message || 'Network error. Please try again.')
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
                Welcome Back
              </h1>
            </div>
            <CardDescription>
              Sign in with your email and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {mounted ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        autoComplete="email"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-bwignore="true"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-full border border-gray-200 rounded-lg bg-gray-50" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Captcha</label>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 text-lg font-bold">
                      {captchaA} + {captchaB} = ?
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value.replace(/\D/g, ''))}
                      className="w-24 text-center py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ans"
                      required
                    />
                    <Button type="button" variant="outline" onClick={regenCaptcha} title="Refresh captcha">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

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
