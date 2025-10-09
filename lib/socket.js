import { io } from 'socket.io-client'

let socket = null

export function connectSocket(token) {
  if (socket && socket.connected) return socket
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4001/api'
  const wsBase = apiBase.replace(/\/?api\/?$/, '')
  socket = io(wsBase, { withCredentials: true, transports: ['websocket'] })

  socket.on('connect', () => {
    // Optionally send token if you add server-side auth on sockets
    if (token) socket.emit('authenticate', token)
  })

  return socket
}

export function joinOrder(orderId) {
  if (!socket) return
  socket.emit('join-order', orderId)
}

export function leaveOrder(orderId) {
  if (!socket) return
  socket.emit('leave-order', orderId)
}

export function onOrderStatus(handler) {
  if (!socket) return () => {}
  socket.on('order-status', handler)
  return () => socket.off('order-status', handler)
}

export function onDriverLocation(handler) {
  if (!socket) return () => {}
  socket.on('driver-location', handler)
  return () => socket.off('driver-location', handler)
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Chat helpers (align with admin/partner)
export function joinChatThread(threadId) {
  if (!socket) return
  socket.emit('chat:join', threadId)
}

export function leaveChatThread(threadId) {
  if (!socket) return
  socket.emit('chat:leave', threadId)
}

export function onChatMessage(handler) {
  if (!socket) return () => {}
  socket.on('chat:message', (messageOrPayload) => {
    // Some servers may broadcast just the message, others may wrap payload
    const msg = messageOrPayload && messageOrPayload.text ? messageOrPayload : (messageOrPayload?.message || messageOrPayload)
    handler(msg)
  })
  return () => socket.off('chat:message', handler)
}

export function emitChatMessage(threadId, message) {
  if (!socket) return
  socket.emit('chat:message', { threadId, message })
}
