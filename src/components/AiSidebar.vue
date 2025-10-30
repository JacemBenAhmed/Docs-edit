<template>
  <div class="ai-sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <h3 v-if="!isCollapsed">AI Assistant</h3>
      <button class="toggle-btn" @click="toggleSidebar">
        <span v-if="isCollapsed">›</span>
        <span v-else>‹</span>
      </button>
    </div>
    
    <div class="sidebar-content" v-if="!isCollapsed">
      <div class="ai-profile">
        <div class="ai-avatar">AI</div>
        <div class="ai-status">Ready to help</div>
      </div>
      
      <div class="message-container">
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
          @keyup.enter="sendMessage"
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const isCollapsed = ref(false);
const userInput = ref('');

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
}

function sendMessage() {
  if (!userInput.value.trim()) return;
  
  // Add user message
  messages.push({
    text: userInput.value,
    sender: 'user',
    time: formatTime(new Date())
  });
  
  // Simulate AI response
  setTimeout(() => {
    messages.push({
      text: "I'm analyzing your request. This is a simulated response for now. In a real implementation, this would connect to an AI service.",
      sender: 'ai',
      time: formatTime(new Date())
    });
  }, 1000);
  
  userInput.value = '';
}

function usesuggestion(suggestion) {
  userInput.value = suggestion;
  sendMessage();
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
.ai-sidebar {
  position: relative;
  width: 100%;
  height: calc(100vh - 3rem);
  min-height: 600px;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  border: 2px solid #e0e7ff;
  border-radius: 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(66, 133, 244, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.ai-sidebar.collapsed {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  min-height: unset;
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
}

.ai-sidebar.collapsed .sidebar-header {
  border-bottom: none;
  padding: 0;
  min-height: 56px;
  justify-content: center;
  border-radius: 50%;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0 5px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
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
  min-height: 400px;
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