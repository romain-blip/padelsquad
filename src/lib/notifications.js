import { supabase } from './supabase'

// Send email notification by calling the Supabase Edge Function
// The Edge Function handles the actual Resend API call
export async function notifyJoinRequest(sessionId, requesterName) {
  try {
    const { data, error } = await supabase.functions.invoke('notify', {
      body: {
        type: 'join_request',
        sessionId,
        requesterName,
      },
    })
    if (error) console.error('Notify error:', error)
    return data
  } catch (err) {
    // Non-blocking — don't crash if notification fails
    console.error('Notify failed:', err)
  }
}

export async function notifyFirstMessage(sessionId, senderName, messagePreview) {
  try {
    const { data, error } = await supabase.functions.invoke('notify', {
      body: {
        type: 'first_message',
        sessionId,
        senderName,
        messagePreview,
      },
    })
    if (error) console.error('Notify error:', error)
    return data
  } catch (err) {
    console.error('Notify failed:', err)
  }
}
