'use client'

import { useState } from 'react'
import Link from 'next/link'
import { API_BASE_URL } from '@/lib/api/apiClient'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setErr('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/password/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data.error || 'Failed to request reset')
      setMsg('If the email exists, a reset link has been sent.')
    } catch (e) {
      setErr(e.message || 'Failed to request reset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Forgot password</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your email to receive a reset link.</p>
        <form onSubmit={submit} className="space-y-4">
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
          <button disabled={loading} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50">{loading? 'Sending...' : 'Send reset link'}</button>
          {msg && <div className="text-green-600 text-sm">{msg}</div>}
          {err && <div className="text-red-600 text-sm">{err}</div>}
        </form>
        <div className="text-sm text-gray-600 mt-4">
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">Back to login</Link>
        </div>
      </div>
    </div>
  )
}
