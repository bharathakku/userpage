'use client'

import { useEffect, useRef, useState } from 'react'
import { apiClient } from '@/lib/api/apiClient'

// Load Leaflet and Leaflet.draw from CDN
function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject('ssr')
    if (window.L && window.L.Draw) return resolve(window.L)

    const injectCss = (id, href) => {
      if (!document.getElementById(id)) {
        const link = document.createElement('link')
        link.id = id
        link.rel = 'stylesheet'
        link.href = href
        document.head.appendChild(link)
      }
    }
    injectCss('leaflet-css-cdn', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css')
    injectCss('leaflet-draw-css-cdn', 'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css')

    const onReady = () => { if (window.L && window.L.Draw) resolve(window.L) }
    if (!document.getElementById('leaflet-js-cdn')) {
      const s = document.createElement('script')
      s.id = 'leaflet-js-cdn'
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      s.async = true
      s.onload = () => {
        const s2 = document.createElement('script')
        s2.id = 'leaflet-draw-js-cdn'
        s2.src = 'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js'
        s2.async = true
        s2.onload = onReady
        s2.onerror = reject
        document.body.appendChild(s2)
      }
      s.onerror = reject
      document.body.appendChild(s)
    } else {
      onReady()
    }
  })
}

export default function AddressMap({
  // Default to Ernakulam
  defaultCenter = { lat: 9.9816, lng: 76.2999 },
  defaultZoom = 13,
  onChange = () => {}, // ({ pickup, drop, distanceKm })
  split = false, // when true: left inputs, right map
}) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const pickupMarker = useRef(null)
  const dropMarker = useRef(null)
  const routeLayer = useRef(null)
  const pickupInputRef = useRef(null)
  const dropInputRef = useRef(null)
  const pickupAddrRef = useRef('')
  const dropAddrRef = useRef('')
  const zoneLayersRef = useRef([])
  const searchTimer = useRef(null)
  const [activeField, setActiveField] = useState('pickup')
  const [distanceKm, setDistanceKm] = useState(null)
  const [error, setError] = useState('')
  const [pickupResults, setPickupResults] = useState([])
  const [dropResults, setDropResults] = useState([])
  const [recentPlaces, setRecentPlaces] = useState([])

  const tileUrl = process.env.NEXT_PUBLIC_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const tileAttr = process.env.NEXT_PUBLIC_TILE_ATTR || '&copy; OpenStreetMap contributors'
  const locIqKey = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY || ''
  const orsKey = process.env.NEXT_PUBLIC_ORS_KEY || ''

  useEffect(() => {
    let mounted = true
    loadLeaflet()
      .then(async (L) => {
        if (!mounted) return
        mapInstance.current = L.map(mapRef.current, {
          center: [defaultCenter.lat, defaultCenter.lng],
          zoom: defaultZoom,
          preferCanvas: true,
          zoomControl: true,
        })
        L.tileLayer(tileUrl, { attribution: tileAttr }).addTo(mapInstance.current)

        // Markers
        pickupMarker.current = L.marker([defaultCenter.lat, defaultCenter.lng], { draggable: true }).addTo(mapInstance.current)
        dropMarker.current = L.marker([defaultCenter.lat + 0.01, defaultCenter.lng + 0.01], { draggable: true }).addTo(mapInstance.current)
        pickupMarker.current.on('dragend', async () => { await fillFromReverse('pickup'); recalcRoute() })
        dropMarker.current.on('dragend', async () => { await fillFromReverse('drop'); recalcRoute() })

        // Map click sets the active marker (pickup or drop)
        mapInstance.current.on('click', async (e) => {
          const ll = [e.latlng.lat, e.latlng.lng]
          if (activeField === 'pickup') {
            pickupMarker.current.setLatLng(ll)
            await fillFromReverse('pickup')
          } else {
            dropMarker.current.setLatLng(ll)
            await fillFromReverse('drop')
          }
          recalcRoute()
        })

        // Zones overlay (read-only)
        try {
          const res = await apiClient.get('/zones').catch(() => [])
          const arr = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [])
          arr.forEach(z => {
            const latlngs = (z.coordinates || []).map(c => [c.lat, c.lng])
            if (latlngs.length >= 3) {
              const poly = L.polygon(latlngs, { color: z.color || '#3b82f6', weight: 2, fillOpacity: 0.15 })
              poly.addTo(mapInstance.current)
              zoneLayersRef.current.push(poly)
            }
          })
        } catch {}

        recalcRoute()

        // Try HTML5 geolocation for live location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude
            const lng = pos.coords.longitude
            const ll = [lat, lng]
            pickupMarker.current.setLatLng(ll)
            mapInstance.current.setView(ll, Math.max(defaultZoom, 14))
            fillFromReverse('pickup')
            recalcRoute()
          }, () => {}, { enableHighAccuracy: true, timeout: 5000 })
        }
      })
      .catch(() => setError('Failed to load map'))

    return () => { mounted = false }
  }, [])

  function pickResult(which, item) {
    const L = window.L
    if (!L || !mapInstance.current) return
    const lat = item.lat || item.latitude
    const lng = item.lon || item.longitude
    const ll = [Number(lat), Number(lng)]
    if (which === 'pickup') {
      pickupMarker.current.setLatLng(ll)
      setPickupResults([])
      if (pickupInputRef.current) pickupInputRef.current.value = item.display_name || item.address?.name || ''
      pickupAddrRef.current = item.display_name || item.address?.name || ''
    } else {
      dropMarker.current.setLatLng(ll)
      setDropResults([])
      if (dropInputRef.current) dropInputRef.current.value = item.display_name || item.address?.name || ''
      dropAddrRef.current = item.display_name || item.address?.name || ''
    }
    mapInstance.current.panTo(ll)
    recalcRoute()
  }

  async function searchLocation(query, setter) {
    if (!query) { setter([]); return }
    try {
      // Bias to current map center for better nearby results
      const center = mapInstance.current?.getCenter()
      if (locIqKey) {
        const proximity = center ? `&location=${center.lng},${center.lat}` : ''
        const url = `https://api.locationiq.com/v1/autocomplete?key=${locIqKey}&q=${encodeURIComponent(query)}&limit=5&dedupe=1${proximity}`
        const res = await fetch(url)
        const data = await res.json()
        setter(Array.isArray(data) ? data : [])
      } else {
        // Fallback to Nominatim
        const near = center ? `&viewbox=${center.lng-0.1},${center.lat+0.1},${center.lng+0.1},${center.lat-0.1}&bounded=1` : ''
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=5&addressdetails=1${near}`
        const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
        const data = await res.json()
        // map to LocationIQ-like objects
        const mapped = Array.isArray(data) ? data.map(d => ({
          display_name: d.display_name,
          lat: d.lat,
          lon: d.lon,
          address: d.address,
        })) : []
        setter(mapped)
      }
    } catch { setter([]) }
  }

  function debouncedSearch(e, which) {
    const q = e.target.value
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      searchLocation(q, which === 'pickup' ? setPickupResults : setDropResults)
    }, 300)
  }

  function getMarkerLatLngs() {
    const p = pickupMarker.current?.getLatLng()
    const d = dropMarker.current?.getLatLng()
    return {
      pickup: p ? { lat: p.lat, lng: p.lng } : null,
      drop: d ? { lat: d.lat, lng: d.lng } : null,
    }
  }

  async function recalcRoute() {
    try {
      const L = window.L
      if (!L) return
      const { pickup, drop } = getMarkerLatLngs()
      if (!pickup || !drop) return

      // Remove previous route
      if (routeLayer.current && mapInstance.current) {
        mapInstance.current.removeLayer(routeLayer.current)
        routeLayer.current = null
      }

      let latlngs = []
      let meters = 0

      if (orsKey) {
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsKey}&start=${pickup.lng},${pickup.lat}&end=${drop.lng},${drop.lat}&format=geojson`
        const res = await fetch(url)
        const gj = await res.json()
        const feat = gj?.features?.[0]
        const coords = feat?.geometry?.coordinates || [] // [lng,lat]
        if (coords.length) latlngs = coords.map(([lng, lat]) => [lat, lng])
        meters = feat?.properties?.summary?.distance || 0
      } else {
        // Fallback to OSRM demo server
        const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?overview=full&geometries=geojson`
        const res = await fetch(url)
        const data = await res.json()
        const route0 = data?.routes?.[0]
        const coords = route0?.geometry?.coordinates || []
        if (coords.length) latlngs = coords.map(([lng, lat]) => [lat, lng])
        meters = route0?.distance || 0
      }

      if (latlngs.length) {
        routeLayer.current = L.polyline(latlngs, { color: '#0ea5e9', weight: 4, opacity: 0.8 }).addTo(mapInstance.current)
      }
      const km = Math.max(0, meters / 1000)
      setDistanceKm(km)
      // Persist for next step (vehicle selection computes fare from this)
      try {
        const payload = { 
          pickup: pickup ? { ...pickup, address: pickupAddrRef.current || (pickupInputRef.current?.value || '') } : null,
          drop: drop ? { ...drop, address: dropAddrRef.current || (dropInputRef.current?.value || '') } : null,
          distanceKm: km, 
          updatedAt: Date.now() 
        }
        if (typeof window !== 'undefined') window.localStorage.setItem('bookingRoute', JSON.stringify(payload))
      } catch {}
      onChange({ 
        pickup: pickup ? { ...pickup, address: pickupAddrRef.current || (pickupInputRef.current?.value || '') } : null,
        drop: drop ? { ...drop, address: dropAddrRef.current || (dropInputRef.current?.value || '') } : null,
        distanceKm: km 
      })
    } catch {}
  }

  // Reverse geocode and update input + history
  async function fillFromReverse(which) {
    try {
      const p = which === 'pickup' ? pickupMarker.current?.getLatLng() : dropMarker.current?.getLatLng()
      if (!p) return
      let name = ''
      if (locIqKey) {
        const url = `https://us1.locationiq.com/v1/reverse?key=${locIqKey}&lat=${p.lat}&lon=${p.lng}&format=json`
        const res = await fetch(url)
        const data = await res.json()
        name = data?.display_name || ''
      } else {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${p.lat}&lon=${p.lng}`
        const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
        const data = await res.json()
        name = data?.display_name || ''
      }
      if (which === 'pickup' && pickupInputRef.current) { pickupInputRef.current.value = name; pickupAddrRef.current = name }
      if (which === 'drop' && dropInputRef.current) { dropInputRef.current.value = name; dropAddrRef.current = name }
      // Save to recent history
      const entry = { name, lat: p.lat, lon: p.lng, ts: Date.now() }
      try {
        const prev = JSON.parse(window.localStorage.getItem('recentPlaces') || '[]')
        const merged = [entry, ...prev.filter(r => Math.abs(r.lat - entry.lat) > 1e-6 || Math.abs(r.lon - entry.lon) > 1e-6)].slice(0, 10)
        window.localStorage.setItem('recentPlaces', JSON.stringify(merged))
        setRecentPlaces(merged)
      } catch {}
    } catch {}
  }

  // Load recent from localStorage on mount
  useEffect(() => {
    try {
      const prev = JSON.parse(typeof window !== 'undefined' ? (window.localStorage.getItem('recentPlaces') || '[]') : '[]')
      if (Array.isArray(prev)) setRecentPlaces(prev)
    } catch {}
  }, [])

  const InputsPanel = (
      <div className="p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <div className="relative">
            <label className="block text-xs font-medium text-slate-600 mb-1">Pickup</label>
            <input 
              ref={pickupInputRef} 
              onFocus={()=>setActiveField('pickup')} 
              onChange={(e)=>debouncedSearch(e,'pickup')} 
              placeholder="Search pickup place" 
              className="w-full px-3 py-2.5 rounded-lg bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {pickupResults.length > 0 && (
              <div className="absolute mt-1 z-50 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl max-h-64 overflow-auto">
                {pickupResults.map((r,i)=> (
                  <button key={i} className="w-full text-left px-3 py-2 hover:bg-slate-50" onClick={()=>pickResult('pickup', r)}>
                    {r.display_name || r.address?.name || r?.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-xs font-medium text-slate-600 mb-1">Drop</label>
            <input 
              ref={dropInputRef} 
              onFocus={()=>setActiveField('drop')} 
              onChange={(e)=>debouncedSearch(e,'drop')} 
              placeholder="Search drop place" 
              className="w-full px-3 py-2.5 rounded-lg bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {dropResults.length > 0 && (
              <div className="absolute mt-1 z-50 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl max-h-64 overflow-auto">
                {dropResults.map((r,i)=> (
                  <button key={i} className="w-full text-left px-3 py-2 hover:bg-slate-50" onClick={()=>pickResult('drop', r)}>
                    {r.display_name || r.address?.name || r?.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {recentPlaces.length > 0 && (
            <div className="border rounded-lg p-3 text-sm text-gray-700 bg-gray-50">
              <div className="font-medium mb-2">Recent places</div>
              <div className="flex flex-col gap-1 max-h-36 overflow-auto">
                {recentPlaces.map((r, idx) => (
                  <button key={idx} className="text-left px-2 py-1 hover:bg-white rounded" onClick={()=>pickResult(activeField, { display_name: r.name, lat: r.lat, lon: r.lon })}>
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {distanceKm != null && (
          <div className="text-sm text-slate-700">Estimated distance: <strong>{distanceKm.toFixed(2)} km</strong></div>
        )}
        {error && <div className="text-xs text-red-600">{error}</div>}
      </div>
  )

  const MapPanel = (
      <div className="h-full">
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        <div className="px-3 py-1 text-[11px] text-gray-500">Map data © OpenStreetMap contributors</div>
      </div>
  )

  if (split) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm">{InputsPanel}</div>
        <div className="rounded-xl border border-slate-200 overflow-hidden" style={{ minHeight: '60vh' }}>{MapPanel}</div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      {InputsPanel}
      {MapPanel}
    </div>
  )
}
