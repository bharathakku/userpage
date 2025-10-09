'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function RaiseComplaintPage() {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('other')
  const [priority, setPriority] = useState('medium')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4001'
  const apiBase = rawBase.endsWith('/api') ? rawBase : `${rawBase.replace(/\/$/, '')}/api`

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!subject.trim() || !description.trim()) {
      setError('Please fill subject and description.')
      return
    }
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await fetch(`${apiBase}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        credentials: 'include',
        body: JSON.stringify({ subject, description, category, priority })
      })
      if (!res.ok) throw new Error('Failed to create ticket')
      // Ask Help & Support to open chat on next load
      try { localStorage.setItem('open_support_chat', '1') } catch {}
      router.replace('/settings/help-support')
    } catch (err) {
      setError(err?.message || 'Failed to submit complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Raise a Complaint</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded bg-red-50 text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Short summary" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded px-3 py-2">
                    <option value="delivery">Delivery</option>
                    <option value="payment">Payment</option>
                    <option value="technical">Technical</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border rounded px-3 py-2">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} className="w-full border rounded px-3 py-2" placeholder="Describe the issue in detail..." />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
