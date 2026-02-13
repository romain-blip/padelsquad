import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        // User denied or error — not blocking, just no sorting by distance
        setError(err.message)
        setLoading(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300000, // Cache 5 min
      }
    )
  }, [])

  return { position, error, loading }
}

// Haversine formula — distance in km between two points
export function getDistanceKm(lat1, lng1, lat2, lng2) {
  if (!lat1 || !lng1 || !lat2 || !lng2) return null
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

function toRad(deg) {
  return deg * (Math.PI / 180)
}

export function formatDistance(km) {
  if (km === null || km === undefined) return null
  if (km < 1) return '< 1 km'
  if (km >= 100) return `${km} km`
  return `${km} km`
}
