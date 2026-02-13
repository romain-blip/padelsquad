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
      creator:profiles!sessions_creator_id_fkey(id, name, level, level_num, dept, avatar_url),
      session_players(
        status,
        player:profiles(id, name, level, level_num, play_style, avatar_url)
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
        creator:profiles!sessions_creator_id_fkey(id, name, level, level_num, dept),
        session_players(
          status,
          player:profiles(id, name, level, level_num, avatar_url)
        )
      )
    `)
    .eq('player_id', userId)

  if (error) throw error
  return data?.map(d => d.session).filter(Boolean) || []
}

export async function createSession({ city, club, date, time, level, dept, creatorId, latitude, longitude, duration, levelMin, levelMax }) {
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
      latitude: latitude || null,
      longitude: longitude || null,
      duration: duration || 90,
      level_min: levelMin || 1,
      level_max: levelMax || 10,
    })
    .select()
    .single()

  if (error) throw error

  // Auto-join creator as accepted
  await joinSession(data.id, creatorId, true)
  return data
}

export async function updateSession(sessionId, updates) {
  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSession(sessionId) {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId)

  if (error) throw error
}

export async function joinSession(sessionId, playerId, isCreator = false) {
  const { error } = await supabase
    .from('session_players')
    .insert({
      session_id: sessionId,
      player_id: playerId,
      status: isCreator ? 'accepted' : 'pending',
    })

  if (error) {
    if (error.code === '23505') throw new Error('Tu as déjà demandé à rejoindre cette session')
    throw error
  }
}

export async function updatePlayerStatus(sessionId, playerId, status) {
  const { error } = await supabase
    .from('session_players')
    .update({ status })
    .eq('session_id', sessionId)
    .eq('player_id', playerId)

  if (error) throw error
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
// CHAT
// ============================================================

export async function getMessages(sessionId) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(id, name, avatar_url)
    `)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function sendMessage(sessionId, senderId, content) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ session_id: sessionId, sender_id: senderId, content })
    .select()
    .single()

  if (error) throw error
  return data
}

export function subscribeToMessages(sessionId, callback) {
  return supabase
    .channel(`messages:${sessionId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `session_id=eq.${sessionId}`,
    }, (payload) => {
      callback(payload.new)
    })
    .subscribe()
}

// ============================================================
// REVIEWS
// ============================================================

// Check if two players have been in the same past session (both accepted)
export async function havePlayedTogether(userId, otherUserId) {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // Get sessions where user was accepted
  const { data: mySessions } = await supabase
    .from('session_players')
    .select('session_id, session:sessions(date)')
    .eq('player_id', userId)
    .eq('status', 'accepted')

  if (!mySessions || mySessions.length === 0) return false

  // Filter past sessions
  const pastSessionIds = mySessions
    .filter(sp => sp.session?.date && sp.session.date < todayStr)
    .map(sp => sp.session_id)

  if (pastSessionIds.length === 0) return false

  // Check if other user was accepted in any of those past sessions
  const { data: shared } = await supabase
    .from('session_players')
    .select('session_id')
    .eq('player_id', otherUserId)
    .eq('status', 'accepted')
    .in('session_id', pastSessionIds)

  return shared && shared.length > 0
}

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
      `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=nom,codesPostaux,departement,centre&boost=population&limit=8`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.map(c => ({
      name: c.nom,
      postcode: c.codesPostaux?.[0] || '',
      dept: c.departement?.nom || '',
      deptCode: c.departement?.code || '',
      lat: c.centre?.coordinates?.[1] || null,
      lng: c.centre?.coordinates?.[0] || null,
    }))
  } catch {
    return []
  }
}
