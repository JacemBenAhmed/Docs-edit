

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || ''
const SESSION_KEY = 'chatSessionId'

async function safeReadText(res) {
  try {
    return await res.text()
  } catch {
    return ''
  }
}

function buildUrl(path) {
  const base = API_BASE.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

function getSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
      id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
      localStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
}

export function resetSession() {
  try { localStorage.removeItem(SESSION_KEY) } catch {}
}

export async function ask(prompt, sessionId = getSessionId()) {
  

  console.log('Sending prompt to /assistant/ask:', prompt , API_BASE);

  const res = await fetch(buildUrl('/assistant/ask'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, sessionId })
  })

  if (!res.ok) {
    const errText = await safeReadText(res)
    throw new Error(errText || `HTTP ${res.status}`)
  }

  return await res.text()
}

export async function askChat(prompt, sessionId = getSessionId()) {
    console.log('Sending prompt to /assistant/ask:', prompt , API_BASE);

  const res = await fetch(buildUrl('/Assistant/ask'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, sessionId })
  })

  if (!res.ok) {
    const errText = await safeReadText(res)
    throw new Error(errText || `HTTP ${res.status}`)
  }
  console.log('Response status:', res.data);
  return await res.text()
}

export async function askStream({ prompt, sessionId = getSessionId(), onMessage, onDone, onError, signal }) {
  try {
    const res = await fetch(buildUrl('/assistant/ask-stream'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, sessionId }),
      signal
    })

    if (!res.ok) {
      const errText = await safeReadText(res)
      throw new Error(errText || `HTTP ${res.status}`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const frames = buffer.split('\n\n')
      buffer = frames.pop() || ''

      for (const frame of frames) {
        const line = frame.trim()
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (data === '[DONE]') {
          onDone?.()
          return
        }
        try {
          onMessage?.(data)
        } catch (e) {}
      }
    }

    onDone?.()
  } catch (err) {
    onError?.(err)
    throw err
  }
}

// Streaming via the new chat endpoint (chunked response)
export async function askChatStream({ prompt, sessionId = getSessionId(), onChunk, onDone, onError, signal }) {
  try {
    const res = await fetch(buildUrl('/chat/ask'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, sessionId }),
      signal
    })

    if (!res.ok) {
      const errText = await safeReadText(res)
      throw new Error(errText || `HTTP ${res.status}`)
    }

    if (!res.body) {
      const text = await res.text()
      onChunk?.(text)
      onDone?.()
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      onChunk?.(chunk)
    }
    onDone?.()
  } catch (err) {
    onError?.(err)
    throw err
  }
}
