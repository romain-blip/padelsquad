// ============================================================
// 🏸 PADELSQUAD — Edge Function: notify
// ============================================================
// Cette Edge Function envoie des emails via Resend quand:
// - Quelqu'un demande à rejoindre une session
// - Premier message dans un chat
//
// DÉPLOIEMENT:
// 1. Installe le CLI Supabase: npm install -g supabase
// 2. Login: supabase login
// 3. Link: supabase link --project-ref TON_PROJECT_REF
// 4. Déploie: supabase functions deploy notify
// 5. Ajoute le secret: supabase secrets set RESEND_API_KEY=re_xxxx
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

Deno.serve(async (req) => {
  try {
    const { type, sessionId, requesterName, senderName, messagePreview } = await req.json()

    // Get session + creator info
    const { data: session } = await supabase
      .from('sessions')
      .select(`
        *,
        creator:profiles!sessions_creator_id_fkey(id, name, email:id)
      `)
      .eq('id', sessionId)
      .single()

    if (!session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), { status: 404 })
    }

    // Get creator email from auth
    const { data: { user: creatorUser } } = await supabase.auth.admin.getUserById(session.creator.id)
    const creatorEmail = creatorUser?.email

    if (!creatorEmail) {
      return new Response(JSON.stringify({ error: 'No email' }), { status: 400 })
    }

    let subject, html

    if (type === 'join_request') {
      // Check if we already sent this notification
      const { data: existing } = await supabase
        .from('notifications')
        .select('id')
        .eq('type', 'join_request')
        .eq('recipient_id', session.creator.id)
        .eq('session_id', sessionId)
        .maybeSingle()

      subject = `🏸 ${requesterName} veut rejoindre ta session`
      html = `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:480px;margin:0 auto;">
          <div style="background:#1a1a2e;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
            <span style="font-size:32px;">🏸</span>
            <h1 style="color:white;font-size:20px;margin:8px 0 0;">PadelSquad</h1>
          </div>
          <div style="padding:24px;background:white;border:1px solid #eee;border-radius:0 0 12px 12px;">
            <h2 style="margin:0 0 12px;font-size:18px;color:#1a1a2e;">Nouvelle demande !</h2>
            <p style="color:#666;font-size:15px;line-height:1.5;">
              <strong>${requesterName}</strong> veut rejoindre ta session à
              <strong>${session.city}</strong> le <strong>${session.date}</strong> à <strong>${session.time?.slice(0, 5)}</strong>.
            </p>
            <a href="https://padel-squad.com" style="display:inline-block;background:#1a1a2e;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;margin-top:12px;">
              Voir la demande →
            </a>
          </div>
        </div>
      `
    } else if (type === 'first_message') {
      subject = `💬 ${senderName} a envoyé un message`
      html = `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:480px;margin:0 auto;">
          <div style="background:#1a1a2e;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
            <span style="font-size:32px;">🏸</span>
            <h1 style="color:white;font-size:20px;margin:8px 0 0;">PadelSquad</h1>
          </div>
          <div style="padding:24px;background:white;border:1px solid #eee;border-radius:0 0 12px 12px;">
            <h2 style="margin:0 0 12px;font-size:18px;color:#1a1a2e;">Nouveau message 💬</h2>
            <p style="color:#666;font-size:15px;line-height:1.5;">
              <strong>${senderName}</strong> dans la session <strong>${session.city}</strong> :
            </p>
            <div style="background:#f8f7f4;padding:12px 16px;border-radius:8px;margin:8px 0;color:#333;font-size:14px;">
              "${messagePreview?.slice(0, 100)}${messagePreview?.length > 100 ? '...' : ''}"
            </div>
            <a href="https://padel-squad.com" style="display:inline-block;background:#1a1a2e;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;margin-top:12px;">
              Répondre →
            </a>
          </div>
        </div>
      `
    } else {
      return new Response(JSON.stringify({ error: 'Unknown type' }), { status: 400 })
    }

    // Send via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PadelSquad <noreply@padel-squad.com>',
        to: [creatorEmail],
        subject,
        html,
      }),
    })

    const result = await res.json()

    // Log notification
    await supabase.from('notifications').insert({
      type,
      recipient_id: session.creator.id,
      session_id: sessionId,
    }).select()

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
