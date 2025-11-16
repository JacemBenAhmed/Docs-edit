<template>
  <div class="assistant-chat">
    <div class="toolbar">
      <v-btn color="primary" variant="flat" size="small">Chat</v-btn>
      <v-btn color="primary" variant="outlined" size="small" disabled>Agent</v-btn>
    </div>

    <div ref="messagesContainer" class="messages">
      <div v-for="(msg, idx) in messages" :key="idx" class="message-row" :class="msg.role">
        <div class="avatar">
          <v-avatar size="28">
            <v-icon v-if="msg.role==='assistant'">mdi-robot</v-icon>
            <v-icon v-else>mdi-account</v-icon>
          </v-avatar>
        </div>
        <div class="bubble" :class="msg.role">
          <div class="content">{{ msg.content }}</div>
        </div>
      </div>
      <div ref="endAnchor"></div>
    </div>

    <div class="composer">
      <v-textarea
        v-model="input"
        placeholder="Type a message..."
        auto-grow
        rows="1"
        max-rows="5"
        @keydown.enter.exact.prevent="send()"
      />
      <v-btn :disabled="!input.trim() || sending" color="primary" @click="send">
        <v-icon start>mdi-send</v-icon>
        Send
      </v-btn>
      <v-btn v-if="sending" variant="text" color="error" @click="cancel">
        <v-icon start>mdi-close</v-icon>
        Cancel
      </v-btn>
    </div>
  </div>
</template>

<script>
import { onMounted, nextTick } from 'vue'
import { askChat, askChatStream } from '@/services/chatService.js'

const HISTORY_KEY = 'assistantChatHistory'

export default {
  name: 'AssistantChat',
  data() {
    return {
      messages: [],
      input: '',
      sending: false,
      controller: null,
    }
  },
  mounted() {
    this.loadHistory()
    this.scrollToEnd()
  },
  methods: {
    loadHistory() {
      try {
        const raw = sessionStorage.getItem(HISTORY_KEY)
        this.messages = raw ? JSON.parse(raw) : []
      } catch {
        this.messages = []
      }
    },
    persistHistory() {
      try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(this.messages)) } catch {}
    },
    async send() {
      const text = this.input.trim()
      if (!text) return
      this.input = ''

      // Add user message
      this.messages.push({ role: 'user', content: text })
      // Show assistant thinking placeholder
      const assistantMsg = { role: 'assistant', content: 'Thinking…' }
      this.messages.push(assistantMsg)
      const assistantIndex = this.messages.length - 1
      this.persistHistory()
      this.sending = true

      try {
        const full = await askChat(text)
        let content = full || '(No response)'
        try {
          const parsed = JSON.parse(full)
          if (parsed && typeof parsed === 'object') {
            content = parsed.message || parsed.response || parsed.answer || parsed.data || parsed.content || content
          }
        } catch {}
        this.messages[assistantIndex].content = content
      } catch (err) {
        console.error('Chat error:', err)
        this.messages[assistantIndex].content = `Error: ${err.message || 'Failed to get response'}`
      } finally {
        this.sending = false
        this.persistHistory()
        await nextTick()
        this.scrollToEnd()
      }
    },
    cancel() {
      try { this.controller?.abort() } catch {}
      this.sending = false
      this.controller = null
    },
    async scrollToEnd() {
      await nextTick()
      try {
        this.$refs.endAnchor?.scrollIntoView({ behavior: 'smooth', block: 'end' })
      } catch {}
    }
  }
}
</script>

<style scoped>

</style>