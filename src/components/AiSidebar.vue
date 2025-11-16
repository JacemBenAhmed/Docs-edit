<template>
  <div
    class="ai-sidebar"
    :class="{ collapsed: isCollapsed, ready: isReady, expanded: !isCollapsed, fullscreen: isFullscreen }"
    @click="isCollapsed && toggleSidebar()"
  >
    <div class="sidebar-header">
      <div class="header-content">
        <div class="title">
          <h3>AI Assistant</h3>
          <span class="subtitle">Document helper</span>
        </div>
        <div class="header-icons" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.9 4.9l2.8 2.8" />
            <path d="M16.3 16.3l2.8 2.8" />
          </svg>
        </div>
      </div>
      <button class="toggle-btn" @click.stop="toggleSidebar" :title="isCollapsed ? 'Expand' : 'Collapse'">
        <i v-if="isCollapsed" class="mdi mdi-chevron-left"></i>
        <i v-else class="mdi mdi-chevron-right"></i>
      </button>
      <button v-if="!isCollapsed" class="fullscreen-toggle" @click.stop="isFullscreen = !isFullscreen" :title="isFullscreen ? 'Exit Full Screen' : 'Full Screen'" :class="{ active: isFullscreen }">
        <i v-if="!isFullscreen" class="mdi mdi-fullscreen"></i>
        <i v-else class="mdi mdi-fullscreen-exit"></i>
      </button>
    </div>
    
    <transition name="ai-panel">
      <div class="sidebar-content" v-show="!isCollapsed">
        <div class="ai-profile">
          <div class="ai-avatar">AI</div>
          <div class="ai-status">Ready to help</div>
        </div>
        
        <div class="message-container" ref="messageContainer">
          <div v-for="(message, index) in messages" :key="index" 
               :class="['message', message.sender === 'ai' ? 'ai-message' : 'user-message']">
            <div class="message-content">{{ message.text }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
        
        <div class="input-container">
          <div class="input-wrap">
            <textarea 
              v-model="userInput" 
              placeholder="Ask me anything about your document..." 
              @keydown.enter.exact.prevent="sendMessage"
              ref="messageInput"
              class="message-input"
              rows="3"
            ></textarea>
            <button class="send-btn" @click="sendMessage" aria-label="Send message">
              <span class="send-icon">↗</span>
            </button>
          </div>
        </div>
        
        <!-- suggestion chips removed as requested -->
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, watch, onMounted } from 'vue';
import { askChat } from '@/services/chatService.js'

const isCollapsed = ref(true);
const isReady = ref(false);
const isFullscreen = ref(false);
const userInput = ref('');
const messageContainer = ref(null);
const messageInput = ref(null);

const messages = reactive([
  { 
    text: "Hello! I'm your AI assistant. How can I help with your document today?", 
    sender: 'ai',
    time: formatTime(new Date())
  }
]);

const suggestions = [
  "Summarize this page",
  "Fix grammar errors",
  "Suggest improvements",
  "Format document"
];

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
  if (!isCollapsed.value) {
    nextTick(() => {
      scrollToBottom();
      messageInput.value?.focus();
    });
  }
}

async function sendMessage() {
  if (!userInput.value.trim()) return;

  const prompt = userInput.value

  // Add user message
  messages.push({
    text: prompt,
    sender: 'user',
    time: formatTime(new Date())
  });

  // Clear input and scroll
  userInput.value = '';
  scrollToBottom();

  // Add assistant thinking placeholder we can update
  const assistantMsg = {
    text: 'Thinking…',
    sender: 'ai',
    time: formatTime(new Date())
  }
  messages.push(assistantMsg)
  const assistantIndex = messages.length - 1
  scrollToBottom()

  // Call backend
  try {
    const full = await askChat(prompt)
    let content = full || '(No response)'
    try {
      const parsed = JSON.parse(full)
      if (parsed && typeof parsed === 'object') {
        content = parsed.message || parsed.response || parsed.answer || parsed.data || parsed.content || content
      }
    } catch {}
    messages[assistantIndex].text = content
  } catch (err) {
    console.error('AI chat error:', err)
    messages[assistantIndex].text = `Error: ${err?.message || 'Failed to get response'}`
  } finally {
    scrollToBottom()
  }
}

function usesuggestion(suggestion) {
  userInput.value = suggestion;
  sendMessage();
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
  nextTick(() => {
    const container = messageContainer.value;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
}

// Auto-scroll when messages change
watch(() => messages.length, () => {
  scrollToBottom();
});

onMounted(() => {
  requestAnimationFrame(() => {
    isReady.value = true;
  });
});
</script>

<style scoped>
.ai-sidebar {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  width: 450px;
  max-width: calc(100% - 3rem);
  max-height: min(200vh, 1020px);
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  transform-origin: bottom right;
  z-index: 1050;
  background: linear-gradient(180deg, rgba(255,255,255,0.68), rgba(250,251,255,0.6));
  border: 1px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(8px) saturate(120%);
  box-shadow: 0 12px 40px rgba(12, 18, 30, 0.28), inset 0 1px 0 rgba(255,255,255,0.6);
  opacity: 0;
  pointer-events: none;
  transform: translateY(22px) scale(0.98);
  transition: transform 420ms cubic-bezier(.2,.9,.2,1), opacity 360ms ease, box-shadow 260ms ease;
}

.ai-sidebar.ready {
  transform: translateY(0) scale(1);
  opacity: 1;
  pointer-events: auto;
}

.ai-sidebar.collapsed {
  width: 280px;
  max-height: 84px;
  border-radius: 40px;
  cursor: pointer;
  box-shadow: 0 18px 44px rgba(12,18,30,0.26);
  transition: width 360ms ease, transform 260ms ease, box-shadow 260ms ease;
}

.ai-sidebar.collapsed:hover { transform: translateY(-6px) scale(1.01); }

.ai-sidebar.expanded { pointer-events: auto; }

/* Full-screen toggle button styling */
.fullscreen-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: rgba(255,255,255,0.25);
  border: 1.5px solid rgba(255,255,255,0.4);
  color: white;
  cursor: pointer;
  transition: all 180ms ease;
  flex-shrink: 0;
  margin-left: 8px;
}

.fullscreen-toggle:hover {
  background: rgba(255,255,255,0.35);
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(255,255,255,0.15);
}

.fullscreen-toggle svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.fullscreen-toggle i {
  font-size: 18px;
  color: currentColor;
}

.ai-sidebar.fullscreen {
  position: fixed;
  width: 100%;
  height: calc(100vh - 140px); /* fill from below navbar/toolbar to bottom, minus footer space */
  right: 0;
  bottom: 0;
  border-radius: 0;
  max-width: 100%;
  max-height: calc(100vh - 140px);
  z-index: 10000;
  top: 140px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border-bottom: 1px solid rgba(16,24,40,0.04);
  position: relative;
}

.header-content { display:flex; align-items:center; gap:12px; width:100%; }
.title h3 { margin:0; font-size:16px; font-weight:700; color: #0f172a; letter-spacing:0.2px; }
.title .subtitle { display:block; font-size:12px; color: #475569; opacity:0.9; margin-top:2px; }
.header-icons svg { color: rgba(15,23,42,0.18); opacity:0.9 }

.ai-sidebar.collapsed .title h3 { color:#0b1220 }

.toggle-btn {
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.85));
  border: 1px solid rgba(12,18,30,0.06);
  width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center;
  box-shadow: 0 6px 16px rgba(12,18,30,0.06);
  cursor:pointer; transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.toggle-btn i {
  font-size: 20px;
  color: #0b1220;
}

.toggle-btn:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 10px 26px rgba(12,18,30,0.12); }

.sidebar-content { display:flex; flex-direction:column; height:100%; overflow:hidden; max-height: calc(72vh - 120px); transition: max-height 320ms ease, opacity 240ms ease; }
.ai-sidebar.collapsed .sidebar-content { opacity:0; pointer-events:none; max-height:0; }

.ai-profile { display:flex; align-items:center; gap:12px; padding:14px 18px; }
.ai-avatar { width:56px; height:56px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-weight:700; color:white;
  background: linear-gradient(135deg,#5b8df6 0%,#3b6ed9 100%); box-shadow: 0 8px 22px rgba(59,110,217,0.22);
}
.ai-status { font-size:13px; color:#475569 }

.message-container { flex:1; overflow-y:auto; padding:18px; display:flex; flex-direction:column; gap:12px; scroll-behavior:smooth; overscroll-behavior:contain; }
.message-container::-webkit-scrollbar{ width:8px }
.message-container::-webkit-scrollbar-track{ background:transparent }
.message-container::-webkit-scrollbar-thumb{ background:linear-gradient(180deg,#cfe0ff,#9fbfff); border-radius:10px; }

.message { max-width:84%; padding:12px 14px; border-radius:16px; font-size:14px; line-height:1.45; box-shadow: 0 6px 18px rgba(12,18,30,0.06); transition: transform 160ms ease, box-shadow 160ms ease, opacity 200ms ease; }
.message:hover { transform: translateY(-2px); }

.ai-message { align-self:flex-start; background: linear-gradient(180deg, rgba(248,250,255,0.9), rgba(241,246,255,0.85)); color:#0f172a; border:1px solid rgba(59,110,217,0.08); border-bottom-left-radius:6px; }
.user-message { align-self:flex-end; background: linear-gradient(135deg,#3b6ed9 0%,#6ea4ff 100%); color:#fff; border-bottom-right-radius:6px; box-shadow: 0 10px 30px rgba(59,110,217,0.18); }

.message-content { white-space:pre-wrap; word-break:break-word }
.message-time { font-size:11px; margin-top:6px; opacity:0.75; text-align:right }

.input-container { padding:12px 14px; border-top:1px solid rgba(16,24,40,0.04); background:linear-gradient(180deg, rgba(255,255,255,0.6), rgba(250,251,255,0.55)); }
.input-wrap { position:relative; display:flex; align-items:center }
.message-input { width:100%; resize:vertical; border-radius:14px; padding:14px 78px 14px 18px; font-size:15px; border:1px solid rgba(12,18,30,0.06); background:rgba(255,255,255,0.78); outline:none; transition: box-shadow 160ms ease, transform 120ms ease; height:64px; min-height:56px; }
.message-input:focus { box-shadow: 0 8px 26px rgba(59,110,217,0.14); }

.send-btn { position:absolute; right:12px; top:50%; transform:translateY(-50%); width:56px; height:56px; border-radius:50%; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#3f7ef0 0%,#2b62c8 100%); color:#fff; box-shadow: 0 14px 36px rgba(46,86,192,0.22); transition: transform 160ms ease, box-shadow 160ms ease; }
.send-btn:hover { transform:translateY(-50%) scale(1.035); box-shadow: 0 20px 44px rgba(46,86,192,0.28); }
.send-icon { font-size:18px; transform:translateY(-1px); }

.suggestion-chips { padding:12px 16px 18px; display:flex; gap:10px; flex-wrap:wrap }
.suggestion-chip { background: rgba(255,255,255,0.82); color:#184eac; border-radius:18px; padding:8px 12px; font-size:13px; border:1px solid rgba(59,110,217,0.08); cursor:pointer; transition: transform 140ms ease, box-shadow 140ms ease; }
.suggestion-chip:hover { transform:translateY(-4px); box-shadow: 0 10px 30px rgba(59,110,217,0.12); background:linear-gradient(90deg,#eaf2ff,#d9e9ff); }

@media (max-width: 920px) {
  .ai-sidebar{ width: 380px; }
  .ai-sidebar.collapsed{ width: 240px; }
}

@media (max-width: 720px){
  .ai-sidebar{ right:1rem; bottom:1rem; width: calc(100% - 2rem); max-height:78vh; border-radius:14px }
  .ai-sidebar.collapsed{ width:220px }
  .ai-sidebar.fullscreen { width:100vw; height:100vh; right:0; bottom:0 }
  .message-input{ height:40px }
}

@keyframes floatIn { from{ transform: translateY(6px) scale(.98); opacity:0 } to{ transform:none; opacity:1 } }
</style>