'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AddressMap from '@/components/map/AddressMap'

export default function AddressSelectionPage() {
  const router = useRouter()
  const [route, setRoute] = useState({ pickup: null, drop: null, distanceKm: null })

  const handleProceed = () => {
    if (route?.pickup && route?.drop && route?.distanceKm != null) {
      try {
        const payload = { ...route }
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('bookingRoute', JSON.stringify(payload))
        }
      } catch {}
      router.push('/booking/vehicle-selection')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-5xl pb-32">
        {/* Header */}
        <div className="flex items-center mb-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-3">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-semibold">Select Addresses</h1>
        </div>
        <p className="text-sm text-slate-600 mb-4">Set pickup and drop by searching or tapping the map. You can add an extra stop anytime.</p>
        {/* Split: left inputs/details, right map */}
        <Card className="shadow-lg border-gray-200 rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <AddressMap split onChange={(data) => setRoute(data)} />
          </CardContent>
        </Card>
        <div className="h-6" />

        {/* Proceed Buttons */}
        <div className="fixed inset-x-0 bottom-0 bg-white/90 backdrop-blur border-t border-gray-200 p-4 shadow-2xl z-40" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button 
                variant="outline"
                className="h-12 text-sm font-medium border-blue-300 text-blue-600 hover:bg-blue-50 sm:col-span-1"
              >
                + Add Stop
              </Button>
              <Button 
                onClick={handleProceed}
                disabled={!route?.pickup || !route?.drop || route?.distanceKm == null}
                className="bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold text-white sm:col-span-2"
              >
                Proceed
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
