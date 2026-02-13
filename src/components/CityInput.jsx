import { useState, useEffect, useRef } from 'react'
import { searchCities } from '../lib/db'

export default function CityInput({ value, onChange, onCitySelect, placeholder = 'ex: Montpellier' }) {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleChange(e) {
    const val = e.target.value
    onChange(val)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (val.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setLoading(true)
    timeoutRef.current = setTimeout(async () => {
      const results = await searchCities(val)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
      setLoading(false)
    }, 250)
  }

  function handleSelect(city) {
    onChange(city.name)
    setShowSuggestions(false)
    setSuggestions([])
    if (onCitySelect) onCitySelect(city)
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        value={value}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 10,
          border: '1px solid #e0e0e0', fontSize: 15,
        }}
      />
      {loading && (
        <div style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          width: 14, height: 14, border: '2px solid #ddd', borderTopColor: '#888',
          borderRadius: '50%', animation: 'spin 0.6s linear infinite',
        }} />
      )}
      {showSuggestions && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: 'white', borderRadius: 10, border: '1px solid #e0e0e0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 50,
          maxHeight: 240, overflowY: 'auto',
          animation: 'fadeIn 0.15s ease',
        }}>
          {suggestions.map((city, i) => (
            <div
              key={`${city.name}-${city.postcode}-${i}`}
              onClick={() => handleSelect(city)}
              style={{
                padding: '10px 14px', cursor: 'pointer',
                borderBottom: i < suggestions.length - 1 ? '1px solid #f5f5f5' : 'none',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f7f4'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-dark)' }}>
                {city.name}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', fontFamily: 'var(--font-mono)' }}>
                {city.postcode} · {city.dept}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
