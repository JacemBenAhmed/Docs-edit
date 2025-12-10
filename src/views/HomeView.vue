<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="mesh-pattern"></div>
      </div>
      
      <v-container class="hero-container">
        <v-row align="center" class="hero-content">
          <v-col cols="12" lg="6" class="hero-text">
            <div class="hero-badge">
              <v-icon size="20" class="mr-2">mdi-robot</v-icon>
              <span>AI-Powered Document Creation</span>
            </div>
            <h1 class="hero-headline">
              THEEE easiest way with Edity ,
              powered by <span class="gradient-text">AI</span>
            </h1>
            <p class="hero-description">
              Write smarter, collaborate seamlessly, and let AI add content directly to your documents. 
              Real-time editing, intelligent suggestions, and team collaboration—all in one powerful workspace.
            </p>
            <div class="hero-cta">
              <v-btn
                size="x-large"
                color="primary"
                class="cta-primary"
                elevation="8"
                @click="$router.push('/pdf-editor')"
              >
                <v-icon class="mr-2">mdi-file-document-edit</v-icon>
                Start Creating
              </v-btn>
              <v-btn
                size="x-large"
                variant="outlined"
                class="cta-secondary"
                @click="$router.push('/documents')"
              >
                <v-icon class="mr-2">mdi-chat-processing</v-icon>
                Try AI Chat
              </v-btn>
            </div>
            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-number">10K+</div>
                <div class="stat-label">Active Users</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">50K+</div>
                <div class="stat-label">Documents Created</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">99.9%</div>
                <div class="stat-label">Uptime</div>
              </div>
            </div>
          </v-col>
          
          <v-col cols="12" lg="6" class="hero-visual">
            <div class="doc-preview">
              <div class="doc-header">
                <div class="doc-dots">
                  <span></span><span></span><span></span>
                </div>
                <div class="doc-title">My Document</div>
              </div>
              <div class="doc-content">
                <div class="doc-line typing-animation">AI is writing...</div>
                <div class="doc-line">Collaborative editing in real-time</div>
                <div class="doc-line highlight">AI Agent added this content</div>
              </div>
              <div class="ai-chat-bubble">
                <v-icon size="18" class="mr-2">mdi-robot</v-icon>
                <span>I can add content directly to your doc!</span>
              </div>
              <div class="collaborators">
                <div class="avatar" v-for="i in 3" :key="i" :style="{ left: `${(i-1) * 28}px` }">
                  <v-icon>mdi-account</v-icon>
                </div>
                <div class="avatar-count">+5 more</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <v-container>
        <div class="section-header">
          <h2 class="section-title">Everything you need to <span class="gradient-text">create</span> together</h2>
          <p class="section-subtitle">Powerful features designed for modern teams</p>
        </div>
        
        <v-row class="features-grid">
          <v-col cols="12" md="6" lg="4" v-for="(feature, index) in features" :key="index">
            <div class="feature-card" :style="{ animationDelay: `${index * 0.1}s` }">
              <div class="feature-icon-wrapper">
                <v-icon :size="48" :color="feature.color" class="feature-icon">{{ feature.icon }}</v-icon>
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
              <div class="feature-highlight"></div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- AI Agent Section -->
    <section class="ai-section">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6" class="ai-content">
            <div class="section-badge">
              <v-icon size="18" class="mr-2">mdi-sparkles</v-icon>
              AI Agent Integration
            </div>
            <h2 class="section-title-large">AI that writes <span class="gradient-text">directly</span> in your documents</h2>
            <p class="section-description">
              Chat with our AI agent and watch it add content, suggestions, and improvements 
              directly into your document in real-time. No copy-paste needed.
            </p>
            <ul class="feature-list">
              <li>
                <v-icon size="20" color="success" class="mr-3">mdi-check-circle</v-icon>
                <span>AI chat interface for instant assistance</span>
              </li>
              <li>
                <v-icon size="20" color="success" class="mr-3">mdi-check-circle</v-icon>
                <span>Direct content insertion into documents</span>
              </li>
              <li>
                <v-icon size="20" color="success" class="mr-3">mdi-check-circle</v-icon>
                <span>Smart suggestions and auto-completion</span>
              </li>
              <li>
                <v-icon size="20" color="success" class="mr-3">mdi-check-circle</v-icon>
                <span>Context-aware writing assistance</span>
              </li>
            </ul>
            <v-btn
              size="large"
              color="primary"
              class="mt-6"
              @click="$router.push('/pdf-editor')"
            >
              <v-icon class="mr-2">mdi-robot</v-icon>
              Try AI Agent
            </v-btn>
          </v-col>
          <v-col cols="12" md="6" class="ai-visual">
            <div class="ai-demo">
              <div class="chat-window">
                <div class="chat-header">
                  <v-icon size="20" class="mr-2">mdi-robot</v-icon>
                  <span>AI Assistant</span>
                </div>
                <div class="chat-messages">
                  <div class="message user">Add a conclusion paragraph</div>
                  <div class="message ai">
                    <v-icon size="16" class="mr-2">mdi-robot</v-icon>
                    Adding content to your document...
                  </div>
                </div>
                <div class="chat-input">
                  <input type="text" placeholder="Ask AI to add content..." />
                  <v-icon>mdi-send</v-icon>
                </div>
              </div>
              <div class="doc-preview-small">
                <div class="doc-line">Your document content...</div>
                <div class="doc-line highlight-new">✨ AI added this paragraph</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Collaboration Section -->
    <section class="collaboration-section">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6" class="collab-visual order-md-2">
            <div class="collab-demo">
              <div class="editor-view">
                <div class="editor-toolbar">
                  <div class="toolbar-item"></div>
                  <div class="toolbar-item"></div>
                  <div class="toolbar-item"></div>
                </div>
                <div class="editor-content">
                  <div class="cursor-indicator" style="top: 20px; left: 40px;">
                    <div class="cursor-name">Sarah</div>
                    <div class="cursor"></div>
                  </div>
                  <div class="cursor-indicator" style="top: 60px; left: 120px;">
                    <div class="cursor-name">Mike</div>
                    <div class="cursor"></div>
                  </div>
                  <div class="doc-line">Real-time collaborative editing</div>
                  <div class="doc-line">Multiple users editing simultaneously</div>
                </div>
              </div>
              <div class="online-users">
                <div class="user-avatar" v-for="i in 4" :key="i">
                  <v-icon>mdi-account</v-icon>
                </div>
                <div class="user-status">4 people editing</div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="collab-content order-md-1">
            <div class="section-badge">
              <v-icon size="18" class="mr-2">mdi-account-multiple</v-icon>
              Real-Time Collaboration
            </div>
            <h2 class="section-title-large">Work together, <span class="gradient-text">instantly</span></h2>
            <p class="section-description">
              See changes as they happen. Multiple team members can edit the same document 
              simultaneously with live cursors, comments, and suggestions.
            </p>
            <ul class="feature-list">
              <li>
                <v-icon size="20" color="success" class="mr-3">mdi-check-circle</v-icon>
                <span>Live cursors showing who's editing</span>
              </li>
              <li>
                <v-icon size="20" color="success" class="mr-3">mdi-check-circle</v-icon>
                <span>Real-time document synchronization</span>
              </li>
              <li>
                <v-icon size="20" color="success" class="mr-3">mdi-check-circle</v-icon>
                <span>Comments and suggestions</span>
              </li>
              <li>
                <v-icon size="20" color="success" class="mr-3">mdi-check-circle</v-icon>
                <span>Version history and changes tracking</span>
              </li>
            </ul>
            <v-btn
              size="large"
              color="primary"
              variant="outlined"
              class="mt-6"
              @click="$router.push('/documents')"
            >
              <v-icon class="mr-2">mdi-share-variant</v-icon>
              Start Collaborating
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section class="final-cta">
      <v-container>
        <div class="cta-content">
          <h2 class="cta-title">Ready to transform how you <span class="gradient-text">create</span>?</h2>
          <p class="cta-description">
            Join thousands of teams using AI-powered document creation and real-time collaboration
          </p>
          <div class="cta-buttons">
            <v-btn
              size="x-large"
              color="primary"
              class="cta-btn-primary"
              elevation="8"
              @click="$router.push('/pdf-editor')"
            >
              <v-icon class="mr-2">mdi-rocket-launch</v-icon>
              Get Started Free
            </v-btn>
            <v-btn
              size="x-large"
              variant="outlined"
              class="cta-btn-secondary"
              @click="$router.push('/profile')"
            >
              <v-icon class="mr-2">mdi-account-plus</v-icon>
              Sign Up Now
            </v-btn>
          </div>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = computed(() => !!theme.global.current.value.dark)

const features = [
  {
    title: 'Google Docs-like Editor',
    description: 'Familiar interface with powerful formatting, tables, images, and more. Everything you expect from a modern document editor.',
    icon: 'mdi-file-document-edit',
    color: '#4f46e5'
  },
  {
    title: 'AI Agent & Chat',
    description: 'Chat with AI and watch it add content directly to your documents. Get suggestions, improvements, and auto-completion.',
    icon: 'mdi-robot',
    color: '#7c3aed'
  },
  {
    title: 'Real-Time Collaboration',
    description: 'Multiple users editing simultaneously with live cursors, comments, and instant synchronization across all devices.',
    icon: 'mdi-account-multiple',
    color: '#06b6d4'
  },
  {
    title: 'Direct Content Insertion',
    description: 'AI adds text, paragraphs, and suggestions directly into your document—no copy-paste needed. Seamless integration.',
    icon: 'mdi-auto-fix',
    color: '#10b981'
  },
  {
    title: 'Cloud Sync & Storage',
    description: 'Access your documents from anywhere. Automatic cloud sync ensures your work is always saved and up-to-date.',
    icon: 'mdi-cloud',
    color: '#f59e0b'
  },
  {
    title: 'Smart Suggestions',
    description: 'AI-powered writing assistance with grammar checks, style improvements, and intelligent content recommendations.',
    icon: 'mdi-lightbulb-on',
    color: '#ef4444'
  }
]
</script>

<style scoped>
.home-page {
  width: 100%;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  padding: 80px 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float-orb 20s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -200px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  bottom: -150px;
  right: -100px;
  animation-delay: 5s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  top: 50%;
  right: 20%;
  animation-delay: 10s;
}

.mesh-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
}

.hero-container {
  position: relative;
  z-index: 2;
}

.hero-text {
  padding: 40px 0;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(124, 58, 237, 0.1));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 50px;
  color: #4f46e5;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.hero-headline {
  font-size: clamp(42px, 6vw, 72px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -1.5px;
  color: #0f172a;
  margin-bottom: 24px;
}

.hero-description {
  font-size: 20px;
  line-height: 1.7;
  color: #64748b;
  max-width: 600px;
  margin-bottom: 40px;
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 48px;
}

.cta-primary {
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 14px;
  text-transform: none;
  letter-spacing: 0.2px;
  box-shadow: 0 20px 50px rgba(79, 70, 229, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 25px 60px rgba(79, 70, 229, 0.4);
}

.cta-secondary {
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 14px;
  text-transform: none;
  border: 2px solid #e2e8f0;
  color: #1e293b;
  transition: all 0.3s ease;
}

.cta-secondary:hover {
  border-color: #4f46e5;
  background: rgba(79, 70, 229, 0.05);
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: left;
}

.stat-number {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.hero-visual {
  position: relative;
  padding: 40px 0;
}

.doc-preview {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.2);
  overflow: hidden;
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: transform 0.3s ease;
}

.doc-preview:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.doc-header {
  background: #f8fafc;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.doc-dots {
  display: flex;
  gap: 6px;
}

.doc-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e1;
}

.doc-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.doc-content {
  padding: 24px;
  min-height: 200px;
  background: white;
}

.doc-line {
  padding: 8px 0;
  color: #334155;
  font-size: 15px;
  line-height: 1.6;
}

.doc-line.highlight {
  background: linear-gradient(120deg, rgba(99, 102, 241, 0.1), rgba(124, 58, 237, 0.1));
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #4f46e5;
  margin: 8px 0;
}

.typing-animation {
  position: relative;
}

.typing-animation::after {
  content: '▊';
  animation: blink 1s infinite;
  color: #4f46e5;
}

.ai-chat-bubble {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  padding: 12px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.4);
  display: flex;
  align-items: center;
  animation: float-bubble 3s ease-in-out infinite;
}

.collaborators {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  position: absolute;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-count {
  margin-left: 90px;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

/* Features Section */
.features-section {
  padding: 120px 0;
  background: #ffffff;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-title {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 900;
  letter-spacing: -1px;
  color: #0f172a;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 20px;
  color: #64748b;
}

.features-grid {
  margin-top: 48px;
}

.feature-card {
  position: relative;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 40px;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out backwards;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: #4f46e5;
  box-shadow: 0 25px 60px rgba(79, 70, 229, 0.15);
}

.feature-icon-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.feature-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.feature-description {
  font-size: 16px;
  line-height: 1.7;
  color: #64748b;
}

.feature-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-highlight {
  transform: scaleX(1);
}

/* AI Section */
.ai-section {
  padding: 120px 0;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.ai-content {
  padding-right: 48px;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50px;
  color: #4f46e5;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 24px;
}

.section-title-large {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 900;
  letter-spacing: -1px;
  color: #0f172a;
  margin-bottom: 24px;
  line-height: 1.2;
}

.section-description {
  font-size: 18px;
  line-height: 1.8;
  color: #64748b;
  margin-bottom: 32px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  padding: 12px 0;
  font-size: 16px;
  color: #334155;
}

.ai-visual {
  position: relative;
}

.ai-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chat-window {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.chat-messages {
  padding: 20px;
  min-height: 150px;
  background: #f8fafc;
}

.message {
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  font-size: 14px;
}

.message.user {
  background: white;
  color: #1e293b;
  margin-left: auto;
  max-width: 70%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.message.ai {
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1));
  color: #4f46e5;
  display: flex;
  align-items: center;
  max-width: 80%;
}

.chat-input {
  padding: 16px 20px;
  background: white;
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid #e2e8f0;
}

.chat-input input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #1e293b;
}

.chat-input input::placeholder {
  color: #94a3b8;
}

.doc-preview-small {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
}

.doc-line.highlight-new {
  background: linear-gradient(120deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #10b981;
  margin: 8px 0;
  animation: slideIn 0.5s ease-out;
}

/* Collaboration Section */
.collaboration-section {
  padding: 120px 0;
  background: #ffffff;
}

.collab-demo {
  position: relative;
}

.editor-view {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.15);
  overflow: hidden;
}

.editor-toolbar {
  background: #f8fafc;
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.toolbar-item {
  width: 32px;
  height: 32px;
  background: #e2e8f0;
  border-radius: 6px;
}

.editor-content {
  padding: 24px;
  min-height: 200px;
  position: relative;
}

.cursor-indicator {
  position: absolute;
  z-index: 10;
}

.cursor-name {
  background: #4f46e5;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
}

.cursor {
  width: 2px;
  height: 20px;
  background: #4f46e5;
  animation: blink-cursor 1s infinite;
}

.online-users {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-status {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
}

/* Final CTA */
.final-cta {
  padding: 120px 0;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(124, 58, 237, 0.05));
  position: relative;
  overflow: hidden;
}

.final-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.1), transparent 70%);
}

.cta-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.cta-title {
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 900;
  letter-spacing: -1.5px;
  color: #0f172a;
  margin-bottom: 24px;
}

.cta-description {
  font-size: 20px;
  color: #64748b;
  margin-bottom: 48px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cta-btn-primary {
  padding: 18px 36px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 14px;
  text-transform: none;
  box-shadow: 0 20px 50px rgba(79, 70, 229, 0.3);
}

.cta-btn-secondary {
  padding: 18px 36px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 14px;
  text-transform: none;
  border: 2px solid #e2e8f0;
}

.gradient-text {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Animations */
@keyframes float-orb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes float-bubble {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes blink-cursor {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 960px) {
  .hero-section {
    min-height: auto;
    padding: 60px 0;
  }
  
  .hero-headline {
    font-size: 36px;
  }
  
  .hero-description {
    font-size: 18px;
  }
  
  .features-section,
  .ai-section,
  .collaboration-section,
  .final-cta {
    padding: 80px 0;
  }
  
  .ai-content {
    padding-right: 0;
    margin-bottom: 48px;
  }
  
  .order-md-1 {
    order: 1;
  }
  
  .order-md-2 {
    order: 2;
  }
}
</style>
