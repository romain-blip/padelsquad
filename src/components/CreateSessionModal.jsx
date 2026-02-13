import { useState } from 'react'
import { useAuth } from '../lib/auth'
import { DEPARTMENTS, DURATIONS, TIME_SLOTS, getLevelNumColor, getLevelLabel } from '../lib/constants'
import { Modal, Spinner } from './UI'
import CityInput from './CityInput'

function getToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function CreateSessionModal({ onClose, onCreate }) {
  const { profile } = useAuth()
  const [form, setForm] = useState({
    city: profile?.city || '',
    club: '',
    date: '',
    time: '',
    duration: 90,
    levelMin: Math.max(1, (profile?.level_num || 5) - 2),
    levelMax: Math.min(10, (profile?.level_num || 5) + 2),
    dept: profile?.dept || '',
    latitude: null,
    longitude: null,
  })
  const [loading, setLoading] = useState(false)

  const valid = form.city && form.date && form.time && form.dept

  function handleCitySelect(city) {
    const matchingDept = DEPARTMENTS.find(d => d.startsWith(city.deptCode))
    setForm(prev => ({
      ...prev,
      city: city.name,
      dept: matchingDept || prev.dept,
      latitude: city.lat,
      longitude: city.lng,
    }))
  }

  async function handleCreate() {
    if (!valid) return
    setLoading(true)
    try {
      await onCreate(form)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const minColor = getLevelNumColor(form.levelMin)
  const maxColor = getLevelNumColor(form.levelMax)

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: '28px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--color-dark)' }}>
            Créer une session
          </h2>
          <button onClick={onClose} style={{
            background: '#f5f5f5', border: 'none', width: 30, height: 30, borderRadius: '50%',
            cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        {/* City */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
            marginBottom: 5, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Ville</label>
          <CityInput
            value={form.city}
            onChange={(val) => setForm({ ...form, city: val })}
            onCitySelect={handleCitySelect}
            placeholder="ex: Castelnau-le-Lez"
          />
        </div>

        {/* Club */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
            marginBottom: 5, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Club / Terrain</label>
          <input
            placeholder="ex: Padel Club 34"
            value={form.club}
            onChange={(e) => setForm({ ...form, club: e.target.value })}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              border: '1px solid #e0e0e0', fontSize: 15,
            }}
          />
        </div>

        {/* Date + Time slot */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
              marginBottom: 5, fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>Date</label>
            <input type="date" value={form.date}
              min={getToday()}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '1px solid #e0e0e0', fontSize: 14,
              }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
              marginBottom: 5, fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>Heure</label>
            <select value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '1px solid #e0e0e0', fontSize: 14, background: 'white',
              }}>
              <option value="">Créneau</option>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
            marginBottom: 8, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Durée</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {DURATIONS.map(d => {
              const active = form.duration === d.value
              return (
                <button key={d.value} onClick={() => setForm({ ...form, duration: d.value })} style={{
                  flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                  background: active ? 'var(--color-dark)' : '#f0f0f0',
                  color: active ? 'white' : '#888',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {d.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Department */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
            marginBottom: 5, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Département</label>
          <select value={form.dept}
            onChange={(e) => setForm({ ...form, dept: e.target.value })}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              border: '1px solid #e0e0e0', fontSize: 14, background: 'white',
            }}>
            <option value="">Sélectionne le département</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Level range */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
            marginBottom: 8, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Niveau recherché</label>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', background: '#fafaf8', borderRadius: 10,
          }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>MIN</div>
              <select value={form.levelMin}
                onChange={(e) => {
                  const v = parseInt(e.target.value)
                  setForm({ ...form, levelMin: v, levelMax: Math.max(v, form.levelMax) })
                }}
                style={{
                  width: '100%', padding: '8px', borderRadius: 8, border: `2px solid ${minColor.dot}`,
                  fontSize: 16, fontWeight: 700, background: minColor.bg, color: minColor.text,
                  textAlign: 'center',
                }}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n =>
                  <option key={n} value={n}>{n}</option>
                )}
              </select>
              <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>{getLevelLabel(form.levelMin)}</div>
            </div>
            <div style={{ fontSize: 18, color: '#ccc', fontWeight: 300 }}>→</div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>MAX</div>
              <select value={form.levelMax}
                onChange={(e) => {
                  const v = parseInt(e.target.value)
                  setForm({ ...form, levelMax: v, levelMin: Math.min(v, form.levelMin) })
                }}
                style={{
                  width: '100%', padding: '8px', borderRadius: 8, border: `2px solid ${maxColor.dot}`,
                  fontSize: 16, fontWeight: 700, background: maxColor.bg, color: maxColor.text,
                  textAlign: 'center',
                }}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n =>
                  <option key={n} value={n}>{n}</option>
                )}
              </select>
              <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>{getLevelLabel(form.levelMax)}</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={!valid || loading}
          style={{
            width: '100%', padding: '14px',
            background: valid ? 'var(--color-dark)' : '#e0e0e0',
            color: 'white', border: 'none', borderRadius: 12,
            fontSize: 16, fontWeight: 700,
            cursor: valid && !loading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {loading && <Spinner size={16} />}
          Publier la session 🚀
        </button>
      </div>
    </Modal>
  )
}
