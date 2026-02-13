import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { updatePlayerStatus, getMessages, sendMessage, subscribeToMessages } from '../lib/db'
import { notifyFirstMessage } from '../lib/notifications'
import { formatDate } from '../lib/constants'
import { Modal, Spinner } from './UI'

export default function SessionDetailModal({ session, onClose, onRefresh, defaultTab }) {
  const { user, profile } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab] = useState(defaultTab || 'players')
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [loadingChat, setLoadingChat] = useState(false)
  const [sendingMsg, setSendingMsg] = useState(false)
  const chatEndRef = useRef(null)
  const channelRef = useRef(null)

  const isCreator = session.creator_id === user.id || session.creator?.id === user.id
  const players = session.session_players || []
  const accepted = players.filter(p => p.status === 'accepted' || !p.status)
  const pending = players.filter(p => p.status === 'pending')
  const myStatus = players.find(p => p.player?.id === user.id)?.status
  const canChat = isCreator || myStatus === 'accepted'

  useEffect(() => {
    if (tab === 'chat' && canChat) {
      loadMessages()
      if (Notification.permission === 'default') Notification.requestPermission()
      channelRef.current = subscribeToMessages(session.id, (newMessage) => {
        setMessages(prev => [...prev, newMessage])
        if (document.hidden && newMessage.sender_id !== user.id) {
          if (Notification.permission === 'granted') {
            new Notification('PadelSquad 🎾', { body: `Nouveau message dans ${session.city}` })
          }
        }
      })
    }
    return () => { channelRef.current?.unsubscribe() }
  }, [tab])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function loadMessages() {
    setLoadingChat(true)
    try { setMessages(await getMessages(session.id)) } catch (err) { console.error(err) }
    finally { setLoadingChat(false) }
  }

  async function handleSend() {
    if (!newMsg.trim()) return
    const content = newMsg.trim()
    setSendingMsg(true)
    try {
      await sendMessage(session.id, user.id, content)
      if (messages.length === 0) notifyFirstMessage(session.id, profile?.name || 'Un joueur', content)
      setNewMsg('')
      await loadMessages()
    } catch (err) { showToast('Erreur envoi: ' + err.message, 'error') }
    finally { setSendingMsg(false) }
  }

  async function handleAccept(playerId) {
    try { await updatePlayerStatus(session.id, playerId, 'accepted'); showToast('Joueur accepté ✓'); onRefresh?.() }
    catch (err) { showToast('Erreur: ' + err.message, 'error') }
  }

  async function handleReject(playerId) {
    try { await updatePlayerStatus(session.id, playerId, 'rejected'); showToast('Demande refusée'); onRefresh?.() }
    catch (err) { showToast('Erreur: ' + err.message, 'error') }
  }

  return (
    <Modal onClose={onClose}>
      {/* Header */}
      <div style={{
        background: 'var(--color-dark)', padding: '20px 24px 16px',
        borderRadius: '20px 20px 0 0', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--court-pattern)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: -30, right: -30, width: 120, height: 120, background: 'radial-gradient(circle, rgba(232,106,58,0.2), transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: 0, color: 'white', fontSize: 20, fontWeight: 800 }}>{session.city}</h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 500 }}>
                {session.club} · {formatDate(session.date)} · {session.time?.slice(0, 5)}
                {session.duration ? ` · ${session.duration}min` : ''}
              </p>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', width: 28, height: 28,
              borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
            {[
              { id: 'players', label: `Joueurs (${accepted.length}/${session.spots_total})`, show: true },
              { id: 'pending', label: `Demandes (${pending.length})`, show: isCreator && pending.length > 0 },
              { id: 'chat', label: '💬 Chat', show: canChat },
            ].filter(t => t.show).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '8px 14px', borderRadius: '10px 10px 0 0', border: 'none',
                background: tab === t.id ? 'var(--color-bg)' : 'rgba(255,255,255,0.08)',
                color: tab === t.id ? 'var(--color-dark)' : 'rgba(255,255,255,0.5)',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ minHeight: 250, maxHeight: 400, overflowY: 'auto' }}>
        {/* Players */}
        {tab === 'players' && (
          <div style={{ padding: '16px 24px' }}>
            {accepted.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-muted)', padding: 20 }}>Aucun joueur confirmé</p>
            ) : accepted.map((sp, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                borderBottom: i < accepted.length - 1 ? '1px solid var(--color-sand)' : 'none',
                animation: `slideIn 0.3s ease ${i * 60}ms both`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: sp.player?.avatar_url ? `url(${sp.player.avatar_url}) center/cover` : `hsl(${(sp.player?.name?.charCodeAt(0) || 0) * 7 % 360}, 42%, 52%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, color: 'white', fontWeight: 700, flexShrink: 0,
                }}>{!sp.player?.avatar_url && (sp.player?.name?.[0] || '?')}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-dark)' }}>
                    {sp.player?.name || 'Joueur'}
                    {sp.player?.id === (session.creator?.id || session.creator_id) && (
                      <span style={{ fontSize: 10, color: 'var(--color-muted)', marginLeft: 6 }}>👑 orga</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Niveau {sp.player?.level_num || '?'}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pending */}
        {tab === 'pending' && (
          <div style={{ padding: '16px 24px' }}>
            {pending.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-muted)', padding: 20 }}>Aucune demande</p>
            ) : pending.map((sp, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                borderBottom: i < pending.length - 1 ? '1px solid var(--color-sand)' : 'none',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: sp.player?.avatar_url ? `url(${sp.player.avatar_url}) center/cover` : `hsl(${(sp.player?.name?.charCodeAt(0) || 0) * 7 % 360}, 42%, 52%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, color: 'white', fontWeight: 700, flexShrink: 0,
                }}>{!sp.player?.avatar_url && (sp.player?.name?.[0] || '?')}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-dark)' }}>{sp.player?.name || 'Joueur'}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Niveau {sp.player?.level_num || '?'}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleAccept(sp.player?.id)} style={{
                    padding: '8px 14px', borderRadius: 10, border: 'none',
                    background: 'var(--color-success-bg)', color: 'var(--color-success)',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}>✓ Accepter</button>
                  <button onClick={() => handleReject(sp.player?.id)} style={{
                    padding: '8px 14px', borderRadius: 10, border: 'none',
                    background: '#FEE', color: '#c62828',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat */}
        {tab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: 350 }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', background: 'var(--color-bg)' }}>
              {loadingChat ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner size={24} /></div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-muted)', padding: 40 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                  <p style={{ fontSize: 13 }}>Premier message ? Vas-y !</p>
                </div>
              ) : messages.map((msg, i) => {
                const isMe = msg.sender_id === user.id
                return (
                  <div key={msg.id || i} style={{
                    display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start',
                    marginBottom: 10, animation: `fadeUp 0.3s ease ${i * 30}ms both`,
                  }}>
                    <div style={{ maxWidth: '78%' }}>
                      {!isMe && (
                        <span style={{ fontSize: 10, color: 'var(--color-muted)', fontWeight: 600, marginLeft: 6, display: 'block', marginBottom: 2 }}>
                          {msg.sender?.name || 'Joueur'}
                        </span>
                      )}
                      <div style={{
                        padding: '11px 15px', borderRadius: 18,
                        background: isMe ? 'linear-gradient(135deg, var(--color-dark), var(--color-dark-light))' : 'white',
                        color: isMe ? 'white' : 'var(--color-dark)',
                        fontSize: 14, lineHeight: 1.45, fontWeight: 500,
                        borderBottomRightRadius: isMe ? 6 : 18,
                        borderBottomLeftRadius: isMe ? 18 : 6,
                        boxShadow: isMe ? '0 4px 12px rgba(22,48,32,0.2)' : '0 1px 4px rgba(0,0,0,0.04)',
                      }}>{msg.content}</div>
                      <span style={{ fontSize: 9, color: 'var(--color-muted)', display: 'block', textAlign: isMe ? 'right' : 'left', margin: '3px 6px' }}>
                        {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                )
              })}
              <div ref={chatEndRef} />
            </div>
            <div style={{
              padding: '12px 24px 16px', borderTop: '1px solid var(--color-sand)',
              display: 'flex', gap: 8, background: 'white',
            }}>
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Écris un message..."
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: 14,
                  border: '1.5px solid var(--color-sand)', fontSize: 14,
                  background: 'var(--color-bg)', fontFamily: 'inherit', fontWeight: 500,
                }}
              />
              <button onClick={handleSend} disabled={!newMsg.trim() || sendingMsg} style={{
                padding: '12px 18px', borderRadius: 14, border: 'none',
                background: newMsg.trim() ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))' : 'var(--color-sand)',
                color: 'white', fontWeight: 700, cursor: newMsg.trim() ? 'pointer' : 'default',
                boxShadow: newMsg.trim() ? '0 4px 14px rgba(232,106,58,0.3)' : 'none',
                fontSize: 16,
              }}>{sendingMsg ? '...' : '→'}</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
