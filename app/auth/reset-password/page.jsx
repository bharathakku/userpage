'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { API_BASE_URL } from '@/lib/api/apiClient'

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(()=>{
    setToken(params?.get('token') || '')
  },[params])

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setErr('')
    if (!token) { setErr('Invalid or missing token'); return }
    if (password.length < 6) { setErr('Password must be at least 6 characters'); return }
    if (password !== confirm) { setErr('Passwords do not match'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data.error || 'Failed to reset password')
      setMsg('Password reset successful. You can now log in.')
      setTimeout(()=> router.replace('/auth/login'), 800)
    } catch (e) {
      setErr(e.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Reset password</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your new password below.</p>
        <form onSubmit={submit} className="space-y-4">
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="New password" />
          <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Confirm new password" />
          <button disabled={loading} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50">{loading? 'Resetting...' : 'Reset password'}</button>
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
