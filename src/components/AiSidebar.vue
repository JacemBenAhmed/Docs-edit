<template>
  <div
    class="ai-sidebar"
    :class="{ collapsed: isCollapsed, ready: isReady, expanded: !isCollapsed }"
    @click="isCollapsed && toggleSidebar()"
  >
    <div class="sidebar-header">
      <div class="header-content">
        <h3>AI Assistant</h3>
      </div>
      <button class="toggle-btn" @click.stop="toggleSidebar" :title="isCollapsed ? 'Expand' : 'Collapse'">
        <svg v-if="isCollapsed" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
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
          <textarea 
            v-model="userInput" 
            placeholder="Ask me anything about your document..." 
            @keydown.enter.exact.prevent="sendMessage"
            ref="messageInput"
            class="message-input"
          ></textarea>
          <button class="send-btn" @click="sendMessage">
            <span class="send-icon">↑</span>
          </button>
        </div>
        
        <div class="suggestion-chips">
          <button 
            v-for="(suggestion, index) in suggestions" 
            :key="index"
            class="suggestion-chip"
            @click="usesuggestion(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, watch, onMounted } from 'vue';

const isCollapsed = ref(true);
const isReady = ref(false);
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

function sendMessage() {
  if (!userInput.value.trim()) return;
  
  // Add user message
  messages.push({
    text: userInput.value,
    sender: 'user',
    time: formatTime(new Date())
  });
  
  userInput.value = '';
  scrollToBottom();
  
  // Simulate AI response
  setTimeout(() => {
    messages.push({
      text: "I'm analyzing your request. This is a simulated response for now. In a real implementation, this would connect to an AI service.",
      sender: 'ai',
      time: formatTime(new Date())
    });
    scrollToBottom();
  }, 1000);
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
  right: 1.75rem;
  bottom: 1.75rem;
  width: 420px;
  max-height: min(75vh, 640px);
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  border: 2px solid #e0e7ff;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 18px 45px rgba(66, 133, 244, 0.22), 0 6px 16px rgba(15, 23, 42, 0.18);
  overflow: hidden;
  overscroll-behavior: contain;
  transform-origin: bottom right;
  transform: translateY(16px) scale(0.96);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, box-shadow 0.35s ease;
  z-index: 1050;
}

.ai-sidebar.ready {
  transform: translateY(0) scale(1);
  opacity: 1;
  pointer-events: auto;
}

.ai-sidebar.collapsed {
  width: 240px;
  max-height: 80px;
  border-radius: 36px;
  cursor: pointer;
  padding-bottom: 0;
  box-shadow: 0 16px 32px rgba(66, 133, 244, 0.3), 0 6px 18px rgba(15, 23, 42, 0.22);
}

.ai-sidebar.collapsed:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 22px 36px rgba(66, 133, 244, 0.36), 0 10px 22px rgba(15, 23, 42, 0.22);
}

.ai-sidebar.expanded {
  pointer-events: auto;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 2px solid #e0e7ff;
  background: linear-gradient(135deg, #4285f4 0%, #5a9ff5 100%);
  color: white;
  min-height: 64px;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.ai-sidebar.collapsed .sidebar-header {
  border-bottom: none;
  padding: 22px 64px 22px 32px;
  min-height: 80px;
  justify-content: center;
  gap: 12px;
  border-radius: 36px;
}

.ai-sidebar.collapsed .toggle-btn {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.35);
  border-color: rgba(255, 255, 255, 0.45);
  color: white;
}

.ai-sidebar.collapsed .toggle-btn:hover {
  background: rgba(255, 255, 255, 0.45);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 10px;
  transition: opacity 0.3s ease;
}

.ai-sidebar.collapsed .header-content {
  opacity: 1;
}

.ai-sidebar.collapsed .header-content h3 {
  font-size: 17px;
  font-weight: 600;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  opacity: 1;
  max-height: calc(70vh - 120px);
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease, max-height 0.35s ease;
  overscroll-behavior: contain;
}

.ai-sidebar.collapsed .sidebar-content {
  opacity: 0;
  pointer-events: none;
  max-height: 0;
  transform: translateY(12px);
}

.ai-panel-enter-active,
.ai-panel-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.ai-panel-enter-from,
.ai-panel-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.ai-profile {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 2px solid #f0f4ff;
  background: linear-gradient(to right, #fafbff, #f8fafc);
}

.ai-avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4285f4 0%, #5a9ff5 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  margin-right: 12px;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.ai-status {
  font-size: 14px;
  color: #5f6368;
  font-weight: 500;
}

.message-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: linear-gradient(to bottom, #fafbff, #ffffff);
  max-height: none;
  min-height: 280px;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
}

.message-container::-webkit-scrollbar {
  width: 6px;
}

.message-container::-webkit-scrollbar-track {
  background: #f0f4ff;
  border-radius: 10px;
}

.message-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #4285f4, #5a9ff5);
  border-radius: 10px;
}

.message-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #3367d6, #4a8be8);
}

.message {
  max-width: 85%;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.message:hover {
  transform: translateY(-1px);
}

.ai-message {
  align-self: flex-start;
  background: linear-gradient(135deg, #e8f0fe 0%, #f0f6ff 100%);
  color: #202124;
  border-bottom-left-radius: 4px;
  border: 1px solid #d2e3fc;
}

.user-message {
  align-self: flex-end;
  background: linear-gradient(135deg, #4285f4 0%, #5a9ff5 100%);
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 3px 8px rgba(66, 133, 244, 0.3);
}

.message-time {
  font-size: 10px;
  margin-top: 4px;
  opacity: 0.7;
  text-align: right;
}

.input-container {
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  border-top: 2px solid #f0f4ff;
  background: #fafbff;
}

.message-input {
  flex: 1;
  border: 2px solid #e0e7ff;
  border-radius: 22px;
  padding: 11px 16px;
  font-size: 14px;
  resize: none;
  height: 44px;
  outline: none;
  font-family: inherit;
  background: white;
  transition: all 0.2s ease;
}

.message-input:focus {
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.15), 0 2px 8px rgba(66, 133, 244, 0.2);
  background: #fafbff;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4285f4 0%, #5a9ff5 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 3px 10px rgba(66, 133, 244, 0.3);
}

.send-btn:hover {
  background: linear-gradient(135deg, #3367d6 0%, #4a8be8 100%);
  transform: scale(1.05);
  box-shadow: 0 4px 14px rgba(66, 133, 244, 0.4);
}

.send-icon {
  font-size: 18px;
  font-weight: bold;
}

.suggestion-chips {
  padding: 12px 16px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background: #fafbff;
}

.suggestion-chip {
  background: linear-gradient(135deg, #e8f0fe 0%, #f0f6ff 100%);
  color: #1a73e8;
  border: 2px solid #d2e3fc;
  border-radius: 18px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(66, 133, 244, 0.15);
}

.suggestion-chip:hover {
  background: linear-gradient(135deg, #4285f4 0%, #5a9ff5 100%);
  color: white;
  border-color: #4285f4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}
</style>