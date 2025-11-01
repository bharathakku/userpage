'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, MapPin, Clock, Edit, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { api } from '@/lib/api'
import { computeFare, loadPricing } from '@/lib/pricing'

export default function VehicleSelectionPage() {
  const router = useRouter()
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pickupName, setPickupName] = useState('')
  const [dropName, setDropName] = useState('')
  const [routeInfo, setRouteInfo] = useState(null)

  const locIqKey = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY || ''

  async function reverseGeocode(lat, lng) {
    try {
      if (!lat || !lng) return ''
      if (locIqKey) {
        const url = `https://us1.locationiq.com/v1/reverse?key=${locIqKey}&lat=${lat}&lon=${lng}&format=json`
        const res = await fetch(url)
        const data = await res.json()
        return data?.display_name || ''
      } else {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
        const data = await res.json()
        return data?.display_name || ''
      }
    } catch { return '' }
  }

  // Load selected route and resolve human-readable names
  useEffect(() => {
    try {
      const route = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('bookingRoute') || 'null') : null
      setRouteInfo(route)
      if (route?.pickup) reverseGeocode(route.pickup.lat, route.pickup.lng).then(setPickupName)
      if (route?.drop) reverseGeocode(route.drop.lat, route.drop.lng).then(setDropName)
    } catch {}
  }, [])

  useEffect(() => {
    let mounted = true
    async function fetchVehicles() {
      try {
        setLoading(true)
        setError(null)
        // Ensure pricing is loaded from backend before computing fares (fallback inside lib if fails)
        try { await loadPricing() } catch {}
        const data = await api.get('/vehicles')
        if (!mounted) return
        // Backend returns: { id, type, title, capacityKg, basePrice, perKmPrice, imageUrl, isActive }
        // Transform to frontend format
        if (Array.isArray(data) && data.length > 0) {
          const route = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('bookingRoute') || 'null') : null
          const distanceKm = route?.distanceKm || 0
          // Fetch live availability of nearby online+active drivers grouped by vehicle type
          let counts = {}
          try {
            const plat = route?.pickup?.lat || route?.drop?.lat
            const plng = route?.pickup?.lng || route?.drop?.lng
            const qs = (plat && plng) ? `?lat=${encodeURIComponent(plat)}&lng=${encodeURIComponent(plng)}&maxDistanceMeters=15000` : ''
            const avail = await api.get(`/drivers/availability${qs}`)
            counts = avail?.counts || {}
          } catch {}
          const images = {
            'two-wheeler': 'https://img.icons8.com/color/96/scooter.png',
            'three-wheeler': 'https://cdn-icons-png.flaticon.com/512/6179/6179815.png',
            'heavy-truck': 'https://cdn-icons-png.flaticon.com/512/870/870130.png',
          }
          const defaultCaps = { 'two-wheeler': 50, 'three-wheeler': 500, 'heavy-truck': 1000 }
          const transformedVehicles = data.map(vehicle => {
            // Map backend vehicle to canonical pricing keys used by computeFare
            const typeLower = (vehicle.type || '').toLowerCase()
            const hint = (vehicle.slug || vehicle.key || vehicle.code || '').toLowerCase()
            const byHint = hint.includes('truck') ? 'heavy-truck' : hint.includes('three') ? 'three-wheeler' : hint.includes('two') ? 'two-wheeler' : ''
            const byType = typeLower.includes('truck') ? 'heavy-truck' : typeLower.includes('three') ? 'three-wheeler' : typeLower.includes('two') ? 'two-wheeler' : ''
            // IMPORTANT: do NOT use vehicle.id here; it might be a UUID and not a pricing key
            const pricingKey = byHint || byType || 'two-wheeler'
            const fare = computeFare(pricingKey, distanceKm)
            const capacityKg = vehicle.capacityKg || defaultCaps[pricingKey]
            const isAvailFromCounts = (counts && Object.prototype.hasOwnProperty.call(counts, pricingKey)) ? (counts[pricingKey] > 0) : true
            return ({
              id: pricingKey,
              type: vehicle.type,
              subtitle: vehicle.title,
              capacity: `${capacityKg} kg`,
              description: `Up to ${capacityKg} kg capacity`,
              price: fare.total,
              originalPrice: undefined,
              image: vehicle.imageUrl || images[pricingKey],
              available: isAvailFromCounts,
              estimatedTime: '10-15 mins'
            })
          })
          setVehicles(transformedVehicles)
        } else {
          throw new Error('Empty vehicles list')
        }
      } catch (e) {
        if (!mounted) return
        setError('Using default vehicle options')
        // Fallback to previous static list
        const route = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('bookingRoute') || 'null') : null
        const distanceKm = route?.distanceKm || 0
        setVehicles([
          (() => { const f = computeFare('two-wheeler', distanceKm); return {
            id: 'two-wheeler', type: 'Two Wheeler', subtitle: 'Fast & Light', distance: `${distanceKm.toFixed(1)} km`, time: '6-10 mins',
            capacity: 'Up to 50 kg', description: 'Ideal for documents and small parcels', price: f.total, image: 'https://img.icons8.com/color/96/scooter.png', available: true, estimatedTime: '6-10 mins'
          }})(),
          (() => { const f = computeFare('three-wheeler', distanceKm); return {
            id: 'three-wheeler', type: 'Three Wheeler', subtitle: 'Mid-size Deliveries', distance: `${distanceKm.toFixed(1)} km`, time: '10-15 mins',
            capacity: 'Up to 500 kg', description: 'Perfect for medium loads and local deliveries', price: f.total, image: 'https://cdn-icons-png.flaticon.com/512/6179/6179815.png', available: true, estimatedTime: '10-15 mins'
          }})(),
          (() => { const f = computeFare('heavy-truck', distanceKm); return {
            id: 'heavy-truck', type: 'Heavy Truck', subtitle: 'Heavy Duty Truck', distance: `${distanceKm.toFixed(1)} km`, time: '12-18 mins',
            capacity: 'Up to 1000 kg', description: 'Ideal for furniture, appliances & bulk items', price: f.total, image: 'https://cdn-icons-png.flaticon.com/512/870/870130.png', available: true, estimatedTime: '12-18 mins'
          }})(),
        ])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchVehicles()
    return () => { mounted = false }
  }, [])

  const handleProceed = () => {
    if (selectedVehicle) {
      const selected = vehicles.find(v => v.id === selectedVehicle)
      const query = selected ? `?vehicleId=${encodeURIComponent(selected.id)}` : ''
      router.push(`/booking/review${query}`)
    }
  }

  const handleEditLocation = () => {
    router.push('/booking/address')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/booking/address">
              <Button variant="ghost" size="icon" className="mr-3">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Select Vehicle</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              Add Stop
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEditLocation}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Locations
            </Button>
          </div>
        </div>

        {/* Address Summary */}
        <Card className="mb-6 shadow-lg border-gray-200">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{pickupName || 'Resolving pickup location...'}</p>
                  <p className="text-sm text-gray-600">Pick up location</p>
                </div>
              </div>
              <div className="ml-6 border-l-2 border-gray-200 h-6"></div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{dropName || 'Resolving drop location...'}</p>
                  <p className="text-sm text-gray-600">Drop location</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Options */}
        <div className="space-y-3 mb-20">
          {loading && (
            <Card className="border-gray-200">
              <CardContent className="p-4 text-sm text-gray-600">Loading vehicles...</CardContent>
            </Card>
          )}
          {!loading && error && (
            <Card className="border-amber-300 bg-amber-50">
              <CardContent className="p-4 text-sm text-amber-800">{error}</CardContent>
            </Card>
          )}
          {vehicles.map((vehicle) => {
            const isSelected = selectedVehicle === vehicle.id
            
            return (
              <Card 
                key={vehicle.id}
                className={`cursor-pointer transition-all duration-200 border ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedVehicle(vehicle.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Vehicle Image */}
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm flex-shrink-0">
                        <Image
                          src={vehicle.image}
                          alt={vehicle.type}
                          width={45}
                          height={45}
                          className="w-11 h-11 object-contain"
                          unoptimized
                        />
                      </div>
                      
                      {/* Vehicle Details */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{vehicle.type}</h3>
                          <p className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                            {vehicle.subtitle}
                          </p>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Capacity:</span>
                            <span>{vehicle.capacity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">ETA:</span>
                            <span>{vehicle.estimatedTime}</span>
                          </div>
                          <p className="text-gray-600 mt-1">{vehicle.description}</p>
                        </div>
                        
                        {!vehicle.available && (
                          <div className="mt-2">
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                              Currently Unavailable
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="mb-1">
                        {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                          <div className="text-sm text-gray-500 line-through">₹{vehicle.originalPrice}</div>
                        )}
                        <div className="text-xl font-bold text-gray-900">₹{vehicle.price}</div>
                      </div>
                      
                      {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                        <div className="text-xs text-green-600 font-medium">
                          Save ₹{vehicle.originalPrice - vehicle.price}
                        </div>
                      )}
                      
                      {isSelected && (
                        <div className="text-sm text-blue-600 font-medium mt-2 bg-blue-100 px-2 py-1 rounded-full">
                          Selected
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Proceed Button */}
        <div className="fixed bottom-6 left-4 right-4 max-w-2xl mx-auto">
          <Card className="shadow-2xl border-gray-200">
            <CardContent className="p-4">
              <Button 
                onClick={handleProceed}
                disabled={!selectedVehicle}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {selectedVehicle 
                  ? `Continue with ${vehicles.find(v => v.id === selectedVehicle)?.type || 'Vehicle'}` 
                  : 'Select a Vehicle to Continue'
                }
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
