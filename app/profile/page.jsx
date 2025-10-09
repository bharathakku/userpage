'use client'

import { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useApp } from '@/contexts/AppContext'

function apiBase() {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4001'
  const base = raw.endsWith('/api') ? raw : raw.replace(/\/$/, '') + '/api'
  return base
}

export default function ProfilePage() {
  const { state, api, dispatch, actionTypes } = useApp()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // ensure profile is loaded if token exists
  useEffect(() => {
    if (!state.user?.isAuthenticated) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        if (token) api.getUserProfile()
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // This page is simplified to only show core user details.

  useEffect(() => {
    setName(state.user?.name || '')
  }, [state.user?.name])

  const onSave = async () => {
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true)
    setError('')
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      const res = await fetch(`${apiBase()}/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error(`Failed to update (HTTP ${res.status})`)
      const user = await res.json()
      // Update context and localStorage so Admin and other apps see it
      dispatch({ type: actionTypes.UPDATE_USER, payload: { name: user.name } })
      try { localStorage.setItem('user_data', JSON.stringify(user)) } catch {}
      setEditing(false)
    } catch (e) {
      setError(e.message || 'Failed to update name')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Profile</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Only the profile card is displayed */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <input
                  className="w-full max-w-md px-3 py-2 border rounded-md"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                />
              ) : (
                <CardTitle className="text-lg sm:text-xl">{state.user?.name || '—'}</CardTitle>
              )}
              <CardDescription className="mt-1 text-sm text-gray-500">Manage your account details</CardDescription>
            </div>
            {editing ? (
              <div className="flex gap-2 self-start sm:self-center">
                <Button variant="outline" disabled={saving} onClick={() => setEditing(false)}>Cancel</Button>
                <Button onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              </div>
            ) : (
              <Button variant="outline" className="self-start sm:self-center" onClick={() => setEditing(true)}>Edit</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{state.user?.phone || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{state.user?.email || '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
