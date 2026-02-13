import { supabase } from './supabase'

// ============================================================
// SESSIONS
// ============================================================

export async function getSessions({ dept, level } = {}) {
  // Use local date to avoid timezone issues
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  let query = supabase
    .from('sessions')
    .select(`
      *,
      creator:profiles!sessions_creator_id_fkey(id, name, level, dept, avatar_url),
      session_players(
        player:profiles(id, name, level)
      )
    `)
    .gte('date', todayStr)
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  if (dept) query = query.eq('dept', dept)
  if (level) query = query.eq('level', level)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getMySession(userId) {
  const { data, error } = await supabase
    .from('session_players')
    .select(`
      session:sessions(
        *,
        creator:profiles!sessions_creator_id_fkey(id, name, level, dept),
        session_players(
          player:profiles(id, name, level)
        )
      )
    `)
    .eq('player_id', userId)

  if (error) throw error
  return data?.map(d => d.session).filter(Boolean) || []
}

export async function createSession({ city, club, date, time, level, dept, creatorId }) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      city,
      club: club || 'À confirmer',
      date,
      time,
      level,
      dept,
      creator_id: creatorId,
      spots_total: 4,
    })
    .select()
    .single()

  if (error) throw error

  // Auto-join creator
  await joinSession(data.id, creatorId)
  return data
}

export async function joinSession(sessionId, playerId) {
  const { error } = await supabase
    .from('session_players')
    .insert({ session_id: sessionId, player_id: playerId })

  if (error) {
    if (error.code === '23505') throw new Error('Tu es déjà inscrit à cette session')
    throw error
  }
}

export async function leaveSession(sessionId, playerId) {
  const { error } = await supabase
    .from('session_players')
    .delete()
    .eq('session_id', sessionId)
    .eq('player_id', playerId)

  if (error) throw error
}

// ============================================================
// REVIEWS
// ============================================================

export async function getPlayerReviews(playerId) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles!reviews_reviewer_id_fkey(id, name)
    `)
    .eq('reviewed_id', playerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getPlayerRating(playerId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('stars')
    .eq('reviewed_id', playerId)

  if (error) throw error
  if (!data || data.length === 0) return { rating: 0, count: 0 }

  const avg = data.reduce((sum, r) => sum + r.stars, 0) / data.length
  return { rating: Math.round(avg * 10) / 10, count: data.length }
}

export async function submitReview({ reviewerId, reviewedId, stars, text }) {
  const { data, error } = await supabase
    .from('reviews')
    .upsert(
      {
        reviewer_id: reviewerId,
        reviewed_id: reviewedId,
        stars,
        text: text || null,
      },
      { onConflict: 'reviewer_id,reviewed_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================
// PROFILES
// ============================================================

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// ============================================================
// CITIES AUTOCOMPLETE (API Geo Gouv)
// ============================================================

export async function searchCities(query) {
  if (!query || query.length < 2) return []
  try {
    const res = await fetch(
      `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=nom,codesPostaux,departement&boost=population&limit=8`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.map(c => ({
      name: c.nom,
      postcode: c.codesPostaux?.[0] || '',
      dept: c.departement?.nom || '',
      deptCode: c.departement?.code || '',
    }))
  } catch {
    return []
  }
}
