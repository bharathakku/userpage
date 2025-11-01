// Pricing utilities (backend-driven with safe fallback)
import { apiClient } from '@/lib/api/apiClient'

// Fallback defaults used until backend pricing arrives
export const FALLBACK_RATES = {
  'heavy-truck': { base: 250, perKm: 50 },
  'three-wheeler': { base: 150, perKm: 30 },
  'two-wheeler': { base: 20, perKm: 8 },
}

// Waiting time rules (minutes included, per-minute charge, minimum waiting fee)
export const WAITING_RULES = {
  'two-wheeler': { included: 10, perMinute: 2, minCharge: 10 },
  'three-wheeler': { included: 20, perMinute: 2.5, minCharge: 15 },
  'heavy-truck': { included: 30, perMinute: 3, minCharge: 20 },
}

let dynamicRates = null // { [vehicleId]: { base, perKm } }
let loadingPromise = null

export async function loadPricing(force = false) {
  if (dynamicRates && !force) return dynamicRates
  if (!loadingPromise) {
    loadingPromise = apiClient.get('/pricing')
      .then((res) => {
        const arr = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [])
        const mapped = {}
        arr.forEach(r => { if (r?.vehicleId) mapped[r.vehicleId] = { base: Number(r.base)||0, perKm: Number(r.perKm)||0 } })
        dynamicRates = Object.keys(mapped).length ? mapped : null
        return dynamicRates
      })
      .catch(() => null)
      .finally(() => { loadingPromise = null })
  }
  try { return await loadingPromise } catch { return null }
}

function getRate(vehicleId) {
  const key = String(vehicleId || '').toLowerCase()
  const dyn = dynamicRates && dynamicRates[key]
  // If dynamic exists but is invalid/zero, prefer fallback per key
  const fallback = FALLBACK_RATES[key]
  if (dyn && (Number(dyn.base) > 0 || Number(dyn.perKm) > 0)) return dyn
  if (fallback) return fallback
  // If dynamic table exists but key missing, still use fallback if available above.
  // Final safe default
  return { base: 0, perKm: 0 }
}

export function computeFare(vehicleId, distanceKm = 0, waitingMinutes = 0) {
  const rate = getRate(vehicleId)
  const km = Math.max(0, Number(distanceKm) || 0)
  const distanceCharge = km * rate.perKm
  // waiting calculation
  const rules = WAITING_RULES[vehicleId] || { included: 0, perMinute: 0, minCharge: 0 }
  const w = Math.max(0, Math.floor(Number(waitingMinutes) || 0))
  const over = Math.max(0, w - (rules.included || 0))
  const rawWaiting = over * (rules.perMinute || 0)
  const extraWaitingCharge = over > 0 ? Math.max(rawWaiting, rules.minCharge || 0) : 0
  const total = Math.max(0, Math.round((rate.base + distanceCharge + extraWaitingCharge) * 100) / 100)
  return {
    vehicleId,
    base: rate.base,
    perKm: rate.perKm,
    distanceKm: km,
    distanceCharge,
    waiting: {
      included: rules.included || 0,
      perMinute: rules.perMinute || 0,
      minCharge: rules.minCharge || 0,
      providedMinutes: w,
      overMinutes: over,
      extraWaitingCharge,
    },
    total,
  }
}

export function formatCurrencyINR(amount) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount)
  } catch {
    return `₹${amount}`
  }
}
