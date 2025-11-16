<template>
  <div class="document-sidebar" :class="{ 'dark-mode': isDarkMode }">
    <!-- Metadata Section -->
    <div class="sidebar-section metadata-section">
      <div class="section-header">
        <i class="mdi mdi-information-outline"></i>
        <h3>Document Info</h3>
      </div>
      
      <div class="metadata-grid">
        <div class="metadata-item">
          <span class="label">
            <i class="mdi mdi-account"></i>
            Author
          </span>
          <span class="value">{{ metadata.author }}</span>
        </div>
        
        <div class="metadata-item">
          <span class="label">
            <i class="mdi mdi-calendar-clock"></i>
            Created
          </span>
          <span class="value">{{ formatDate(metadata.createdDate) }}</span>
        </div>
        
        <div class="metadata-item">
          <span class="label">
            <i class="mdi mdi-pencil-clock"></i>
            Last Edited
          </span>
          <span class="value">{{ formatDate(metadata.lastEdited) }}</span>
        </div>
        
        <div class="metadata-item">
          <span class="label">
            <i class="mdi mdi-tag"></i>
            Version
          </span>
          <span class="value">{{ metadata.version }}</span>
        </div>
        
        <div class="metadata-item">
          <span class="label">
            <i class="mdi mdi-text-box"></i>
            Words
          </span>
          <span class="value">{{ metadata.wordCount.toLocaleString() }}</span>
        </div>
        
        <div class="metadata-item">
          <span class="label">
            <i class="mdi mdi-file-document"></i>
            Pages
          </span>
          <span class="value">{{ metadata.pageCount }}</span>
        </div>
      </div>
    </div>

    <!-- Comments Section -->
    <div class="sidebar-section comments-section">
      <div class="section-header sticky-header">
        <i class="mdi mdi-comment-multiple"></i>
        <h3>Comments ({{ comments.length }})</h3>
      </div>
      
      <div class="comments-container">
        <div v-if="comments.length === 0" class="no-comments">
          <i class="mdi mdi-comment-off"></i>
          <p>No comments yet</p>
        </div>
        
        <div v-else v-for="(comment, index) in comments" :key="index" class="comment-card">
          <div class="comment-header">
            <span class="username">{{ comment.username }}</span>
            <span class="timestamp" :title="comment.timestamp.toLocaleString()">
              {{ getRelativeTime(comment.timestamp) }}
            </span>
          </div>
          <p class="comment-text">{{ comment.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Props for metadata and comments (can be passed from parent)
defineProps({
  metadata: {
    type: Object,
    default: () => ({
      author: 'You',
      createdDate: new Date('2024-11-01'),
      lastEdited: new Date(),
      version: 'v1.0',
      wordCount: 2847,
      pageCount: 5
    })
  },
  comments: {
    type: Array,
    default: () => [
      {
        username: 'Sarah Johnson',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        text: 'Great opening! The introduction really sets the tone well.'
      },
      {
        username: 'Mike Chen',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        text: 'Can you clarify the methodology section? Need more detail on the approach.'
      },
      {
        username: 'Alex Rivera',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        text: 'Love the examples in the case study. Consider adding citations for the data.'
      }
    ]
  }
})

// Dark mode toggle (can be integrated with app-wide theme)
const isDarkMode = ref(false)

// Utility functions
function formatDate(date) {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

function getRelativeTime(date) {
  const now = new Date()
  const diffMs = now - new Date(date)
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return formatDate(date)
}
</script>

<style scoped>
.document-sidebar {
  position: fixed;
  left: 0;
  top: 140px;
  width: 450px;
  height: calc(100vh - 140px);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 40;
  padding: 24px 0;
  transition: all 300ms ease;
}

.document-sidebar.dark-mode {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-right-color: #334155;
}

/* Scrollbar styling */
.document-sidebar::-webkit-scrollbar {
  width: 6px;
}

.document-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.document-sidebar::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.3);
  border-radius: 3px;
  transition: background 200ms ease;
}

.document-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(71, 85, 105, 0.5);
}

.document-sidebar.dark-mode::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
}

.document-sidebar.dark-mode::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* Sidebar Section */
.sidebar-section {
  padding: 0 16px;
  margin-bottom: 28px;
  animation: slideIn 400ms ease-out;
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

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
  transition: all 200ms ease;
}

.document-sidebar.dark-mode .section-header {
  border-bottom-color: #334155;
}

.section-header.sticky-header {
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 12px 16px;
  margin: -12px -16px 16px -16px;
  z-index: 10;
}

.document-sidebar.dark-mode .section-header.sticky-header {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.section-header i {
  font-size: 18px;
  color: #3b82f6;
  flex-shrink: 0;
}

.document-sidebar.dark-mode .section-header i {
  color: #60a5fa;
}

.section-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.document-sidebar.dark-mode .section-header h3 {
  color: #f1f5f9;
}

/* Metadata Section */
.metadata-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 200ms ease;
  cursor: default;
}

.document-sidebar.dark-mode .metadata-item {
  background: rgba(30, 41, 59, 0.4);
  border-color: #334155;
}

.metadata-item:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.document-sidebar.dark-mode .metadata-item:hover {
  background: rgba(30, 41, 59, 0.6);
  border-color: #60a5fa;
}

.metadata-item .label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.document-sidebar.dark-mode .metadata-item .label {
  color: #94a3b8;
}

.metadata-item .label i {
  font-size: 14px;
  color: #3b82f6;
}

.document-sidebar.dark-mode .metadata-item .label i {
  color: #60a5fa;
}

.metadata-item .value {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.4;
  word-break: break-word;
}

.document-sidebar.dark-mode .metadata-item .value {
  color: #e2e8f0;
}

/* Comments Section */
.comments-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 400px);
  overflow-y: auto;
  padding-right: 4px;
}

.comments-container::-webkit-scrollbar {
  width: 6px;
}

.comments-container::-webkit-scrollbar-track {
  background: transparent;
}

.comments-container::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.2);
  border-radius: 3px;
}

.comments-container::-webkit-scrollbar-thumb:hover {
  background: rgba(71, 85, 105, 0.4);
}

.document-sidebar.dark-mode .comments-container::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.2);
}

.document-sidebar.dark-mode .comments-container::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.4);
}

.no-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  color: #94a3b8;
  text-align: center;
}

.document-sidebar.dark-mode .no-comments {
  color: #64748b;
}

.no-comments i {
  font-size: 32px;
  opacity: 0.4;
}

.no-comments p {
  font-size: 13px;
  font-weight: 500;
  margin: 0;
}

/* Comment Card */
.comment-card {
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #e2e8f0;
  border-left: 3px solid #3b82f6;
  border-radius: 6px;
  transition: all 200ms ease;
  animation: commentFadeIn 300ms ease-out;
}

.document-sidebar.dark-mode .comment-card {
  background: rgba(30, 41, 59, 0.4);
  border-color: #334155;
  border-left-color: #60a5fa;
}

@keyframes commentFadeIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.comment-card:hover {
  background: rgba(255, 255, 255, 0.95);
  border-left-color: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateX(2px);
}

.document-sidebar.dark-mode .comment-card:hover {
  background: rgba(30, 41, 59, 0.6);
  border-left-color: #93c5fd;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.comment-header .username {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  flex: 1;
}

.document-sidebar.dark-mode .comment-header .username {
  color: #f1f5f9;
}

.comment-header .timestamp {
  font-size: 11px;
  color: #94a3b8;
  flex-shrink: 0;
  white-space: nowrap;
}

.document-sidebar.dark-mode .comment-header .timestamp {
  color: #64748b;
}

.comment-text {
  font-size: 13px;
  line-height: 1.5;
  color: #475569;
  margin: 0;
  word-wrap: break-word;
}

.document-sidebar.dark-mode .comment-text {
  color: #cbd5e1;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .document-sidebar {
    width: 280px;
  }
}

@media (max-width: 1200px) {
  .document-sidebar {
    width: 240px;
  }
  
  .metadata-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .document-sidebar {
    position: static;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding: 16px 0;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  }
  
  .document-sidebar.dark-mode {
    border-bottom-color: #334155;
  }
  
  .sidebar-section {
    padding: 0 16px;
  }
  
  .comments-container {
    max-height: none;
  }
}
</style>
