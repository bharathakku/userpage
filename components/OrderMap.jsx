"use client"

import { useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

// Fix default icon paths for Leaflet in Next.js
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false })

export default function OrderMap({ driverLocation }) {
  useEffect(() => {
    // Ensure default icons load correctly (only on client)
    let mounted = true
    async function setupLeaflet() {
      const L = await import('leaflet')
      if (!mounted) return
      // Some bundlers wrap default under .default
      const Leaf = L.default || L
      try { delete Leaf.Icon.Default.prototype._getIconUrl } catch {}
      Leaf.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x.src,
        iconUrl: markerIcon.src,
        shadowUrl: markerShadow.src,
      })
    }
    setupLeaflet()
    return () => { mounted = false }
  }, [])

  const center = useMemo(() => {
    if (driverLocation?.lat && driverLocation?.lng) return [driverLocation.lat, driverLocation.lng]
    // Default to Bangalore
    return [12.9716, 77.5946]
  }, [driverLocation])

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {driverLocation?.lat && driverLocation?.lng && (
          <Marker position={[driverLocation.lat, driverLocation.lng]}>
            <Popup>Driver current location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
