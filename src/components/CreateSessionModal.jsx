import { useState } from 'react'
import { useAuth } from '../lib/auth'
import { LEVELS, DEPARTMENTS, getLevelColor } from '../lib/constants'
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
    level: profile?.level || 'Intermédiaire',
    dept: profile?.dept || '',
  })
  const [loading, setLoading] = useState(false)

  const valid = form.city && form.date && form.time && form.dept

  function handleCitySelect(city) {
    const matchingDept = DEPARTMENTS.find(d => d.startsWith(city.deptCode))
    if (matchingDept) {
      setForm(prev => ({ ...prev, city: city.name, dept: matchingDept }))
    } else {
      setForm(prev => ({ ...prev, city: city.name }))
    }
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
            <input type="time" value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '1px solid #e0e0e0', fontSize: 14,
              }} />
          </div>
        </div>

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

        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
            marginBottom: 8, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Niveau recherché</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {LEVELS.map(lvl => {
              const c = getLevelColor(lvl)
              const active = form.level === lvl
              return (
                <button key={lvl} onClick={() => setForm({ ...form, level: lvl })} style={{
                  padding: '6px 14px', borderRadius: 20,
                  border: active ? `2px solid ${c.dot}` : '1px solid #ddd',
                  background: active ? c.bg : 'white', color: active ? c.text : '#aaa',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {lvl}
                </button>
              )
            })}
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
            transition: 'background 0.2s',
          }}
        >
          {loading && <Spinner size={16} />}
          Publier la session 🚀
        </button>
      </div>
    </Modal>
  )
}
