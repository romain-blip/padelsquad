import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { updatePlayerStatus, getMessages, sendMessage, subscribeToMessages } from '../lib/db'
import { formatDate } from '../lib/constants'
import { Modal, Spinner } from './UI'

export default function SessionDetailModal({ session, onClose, onRefresh }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab] = useState('players') // 'players' | 'chat'
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

  // Load chat messages
  useEffect(() => {
    if (tab === 'chat' && canChat) {
      loadMessages()
      // Subscribe to realtime
      channelRef.current = subscribeToMessages(session.id, (newMessage) => {
        setMessages(prev => [...prev, newMessage])
      })
    }
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe()
      }
    }
  }, [tab])

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadMessages() {
    setLoadingChat(true)
    try {
      const data = await getMessages(session.id)
      setMessages(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingChat(false)
    }
  }

  async function handleSend() {
    if (!newMsg.trim()) return
    setSendingMsg(true)
    try {
      await sendMessage(session.id, user.id, newMsg.trim())
      setNewMsg('')
      await loadMessages()
    } catch (err) {
      showToast('Erreur envoi: ' + err.message, 'error')
    } finally {
      setSendingMsg(false)
    }
  }

  async function handleAccept(playerId) {
    try {
      await updatePlayerStatus(session.id, playerId, 'accepted')
      showToast('Joueur accepté ✓')
      onRefresh?.()
    } catch (err) {
      showToast('Erreur: ' + err.message, 'error')
    }
  }

  async function handleReject(playerId) {
    try {
      await updatePlayerStatus(session.id, playerId, 'rejected')
      showToast('Demande refusée')
      onRefresh?.()
    } catch (err) {
      showToast('Erreur: ' + err.message, 'error')
    }
  }

  return (
    <Modal onClose={onClose}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)',
        padding: '20px 24px 16px', borderRadius: '20px 20px 0 0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: 0, color: 'white', fontSize: 20, fontWeight: 700 }}>
              {session.city}
            </h2>
            <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              {session.club} · {formatDate(session.date)} · {session.time?.slice(0, 5)}
              {session.duration ? ` · ${session.duration}min` : ''}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', width: 28, height: 28,
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
              padding: '8px 14px', borderRadius: '8px 8px 0 0', border: 'none',
              background: tab === t.id ? 'white' : 'rgba(255,255,255,0.1)',
              color: tab === t.id ? 'var(--color-dark)' : 'rgba(255,255,255,0.6)',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ minHeight: 250, maxHeight: 400, overflowY: 'auto' }}>
        {/* Players tab */}
        {tab === 'players' && (
          <div style={{ padding: '16px 24px' }}>
            {accepted.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#bbb', padding: 20 }}>Aucun joueur confirmé</p>
            ) : (
              accepted.map((sp, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
                  borderBottom: i < accepted.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: sp.player?.avatar_url
                      ? `url(${sp.player.avatar_url}) center/cover`
                      : 'linear-gradient(135deg, #1a1a2e, #3d3d6e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, color: 'white', fontWeight: 700, flexShrink: 0,
                  }}>
                    {!sp.player?.avatar_url && (sp.player?.name?.[0] || '?')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-dark)' }}>
                      {sp.player?.name || 'Joueur'}
                      {sp.player?.id === (session.creator?.id || session.creator_id) && (
                        <span style={{ fontSize: 10, color: '#aaa', marginLeft: 6 }}>👑 orga</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#aaa' }}>
                      Niveau {sp.player?.level_num || '?'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pending requests tab (creator only) */}
        {tab === 'pending' && (
          <div style={{ padding: '16px 24px' }}>
            {pending.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#bbb', padding: 20 }}>Aucune demande en attente</p>
            ) : (
              pending.map((sp, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0',
                  borderBottom: i < pending.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: sp.player?.avatar_url
                      ? `url(${sp.player.avatar_url}) center/cover`
                      : 'linear-gradient(135deg, #1a1a2e, #3d3d6e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, color: 'white', fontWeight: 700, flexShrink: 0,
                  }}>
                    {!sp.player?.avatar_url && (sp.player?.name?.[0] || '?')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-dark)' }}>
                      {sp.player?.name || 'Joueur'}
                    </div>
                    <div style={{ fontSize: 12, color: '#aaa' }}>
                      Niveau {sp.player?.level_num || '?'}
                      {sp.player?.play_style && ` · ${sp.player.play_style}`}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleAccept(sp.player?.id)} style={{
                      padding: '7px 12px', borderRadius: 8, border: 'none',
                      background: '#e8f5e9', color: '#2e7d32',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>
                      ✓ Accepter
                    </button>
                    <button onClick={() => handleReject(sp.player?.id)} style={{
                      padding: '7px 12px', borderRadius: 8, border: 'none',
                      background: '#fce4ec', color: '#c62828',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Chat tab */}
        {tab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: 350 }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {loadingChat ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                  <Spinner size={24} />
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#bbb', padding: 40 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                  <p style={{ fontSize: 13 }}>Premier message ? Vas-y !</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.sender_id === user.id
                  const sender = msg.sender
                  return (
                    <div key={msg.id || i} style={{
                      display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start',
                      marginBottom: 8,
                    }}>
                      <div style={{ maxWidth: '75%' }}>
                        {!isMe && (
                          <span style={{
                            fontSize: 10, color: '#aaa', fontWeight: 600,
                            marginLeft: 4, marginBottom: 2, display: 'block',
                          }}>
                            {sender?.name || 'Joueur'}
                          </span>
                        )}
                        <div style={{
                          padding: '8px 12px', borderRadius: 12,
                          background: isMe ? 'var(--color-dark)' : '#f0f0f0',
                          color: isMe ? 'white' : '#333',
                          fontSize: 14, lineHeight: 1.4,
                          borderBottomRightRadius: isMe ? 4 : 12,
                          borderBottomLeftRadius: isMe ? 12 : 4,
                        }}>
                          {msg.content}
                        </div>
                        <span style={{
                          fontSize: 9, color: '#ccc', display: 'block',
                          textAlign: isMe ? 'right' : 'left', marginTop: 2,
                          marginLeft: 4, marginRight: 4,
                        }}>
                          {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 24px 16px', borderTop: '1px solid #f0f0f0',
              display: 'flex', gap: 8,
            }}>
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Écris un message..."
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 10,
                  border: '1px solid #e0e0e0', fontSize: 14, outline: 'none',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!newMsg.trim() || sendingMsg}
                style={{
                  padding: '10px 16px', borderRadius: 10, border: 'none',
                  background: newMsg.trim() ? 'var(--color-dark)' : '#e0e0e0',
                  color: 'white', fontSize: 14, fontWeight: 700,
                  cursor: newMsg.trim() ? 'pointer' : 'default',
                }}
              >
                {sendingMsg ? '...' : '→'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
