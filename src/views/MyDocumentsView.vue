<template>
  <div class="documents-page">
    <!-- Background Effects -->
    <div class="documents-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="mesh-pattern"></div>
    </div>

    <!-- Enhanced Toolbar -->
    <div class="toolbar-modern">
      <v-container class="toolbar-container">
        <div class="toolbar-content">
          <div class="toolbar-left">
            <div class="docs-brand">
              <v-icon size="28" color="primary">mdi-file-document-multiple</v-icon>
              <span class="brand-text">My Documents</span>
            </div>
            
            <div class="search-modern">
              <v-icon size="20" class="search-icon">mdi-magnify</v-icon>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search documents..."
                class="search-input-modern"
                @input="searchDocuments"
              >
              <button 
                v-if="searchQuery" 
                class="clear-search"
                @click="searchQuery = ''"
              >
                <v-icon size="18">mdi-close</v-icon>
              </button>
            </div>
          </div>
          
          <div class="toolbar-right">
            <v-btn
              variant="outlined"
              size="small"
              class="toolbar-btn"
              @click="toggleView"
            >
              <v-icon>{{ viewMode === 'grid' ? 'mdi-view-list' : 'mdi-view-grid' }}</v-icon>
            </v-btn>
            
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  variant="outlined"
                  size="small"
                  class="toolbar-btn"
                  v-bind="props"
                >
                  <v-icon>mdi-sort</v-icon>
                  <span class="ml-2">{{ sortLabel }}</span>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="sortBy = option.value"
                >
                  <v-list-item-title>{{ option.label }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            
            <v-btn
              color="primary"
              size="large"
              class="new-doc-btn-modern"
              prepend-icon="mdi-plus"
              @click="$router.push('/pdf-editor')"
            >
              New Document
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <!-- Main Content -->
    <v-container class="main-content">
      <!-- Page Header -->
      <div class="page-header-modern">
        <div class="header-left">
          <h1 class="page-title-modern">
            <span class="gradient-text">{{ filteredDocuments.length }}</span> Documents
          </h1>
          <p class="page-subtitle-modern">Manage and organize your documents</p>
        </div>
        
        <div class="header-stats">
          <div class="stat-badge">
            <v-icon size="18" color="primary" class="mr-1">mdi-file-document</v-icon>
            <span>{{ documents.length }} Total</span>
          </div>
          <div class="stat-badge">
            <v-icon size="18" color="success" class="mr-1">mdi-share-variant</v-icon>
            <span>{{ sharedCount }} Shared</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="loading-text">Loading documents...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
        <h3 class="error-title">Failed to load documents</h3>
        <p class="error-message">{{ error }}</p>
        <v-btn
          color="primary"
          @click="loadDocuments"
          prepend-icon="mdi-refresh"
        >
          Retry
        </v-btn>
      </div>

      <!-- Documents Grid/List -->
      <div v-else-if="filteredDocuments.length > 0" :class="viewMode === 'grid' ? 'documents-grid-modern' : 'documents-list-modern'">
        <div
          v-for="(doc, index) in filteredDocuments"
          :key="doc.id"
          class="document-card-modern"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @click="openDocument(doc)"
        >
          <!-- Card Header -->
          <div class="card-header-modern" :style="{ background: getCardGradient(doc.type) }">
            <div class="card-icon-wrapper">
              <v-icon :size="64" color="white" class="card-icon-modern">
                {{ getDocumentIcon(doc.type) }}
              </v-icon>
            </div>
            
            <!-- Menu Button -->
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="white"
                  class="card-menu-btn-modern"
                  v-bind="props"
                  @click.stop
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click.stop="openDocument(doc)">
                  <template v-slot:prepend>
                    <v-icon>mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="shareDocument(doc)">
                  <template v-slot:prepend>
                    <v-icon>mdi-share-variant</v-icon>
                  </template>
                  <v-list-item-title>Share</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="downloadDocument(doc)">
                  <template v-slot:prepend>
                    <v-icon>mdi-download</v-icon>
                  </template>
                  <v-list-item-title>Download</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click.stop="deleteDocument(doc)" class="text-error">
                  <template v-slot:prepend>
                    <v-icon color="error">mdi-delete</v-icon>
                  </template>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            
            <!-- Shared Badge -->
            <v-chip
              v-if="doc.shared"
              size="small"
              color="success"
              class="shared-badge"
            >
              <v-icon start size="14">mdi-share</v-icon>
              Shared
            </v-chip>
          </div>

          <!-- Card Body -->
          <div class="card-body-modern">
            <h3 class="card-title-modern">{{ doc.name || doc.title }}</h3>
            <p v-if="doc.description" class="card-description">{{ doc.description }}</p>
            <div class="card-meta-modern">
              <div class="meta-item">
                <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                <span>{{ formatDate(doc.lastModified || doc.updatedAt) }}</span>
              </div>
              <div class="meta-item">
                <v-icon size="14" class="mr-1">mdi-account</v-icon>
                <span>{{ doc.owner || doc.author || 'Unknown' }}</span>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer-modern">
            <v-chip
              :color="getDocumentColor(doc.type)"
              size="small"
              variant="tonal"
            >
              {{ doc.type }}
            </v-chip>
            <div class="card-actions">
              <v-btn
                icon
                size="small"
                variant="text"
                color="primary"
                @click.stop="openDocument(doc)"
              >
                <v-icon size="18">mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                size="small"
                variant="text"
                color="success"
                @click.stop="shareDocument(doc)"
              >
                <v-icon size="18">mdi-share-variant</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state-modern">
        <div class="empty-content">
          <div class="empty-icon-wrapper">
            <v-icon size="120" color="primary" class="empty-icon">mdi-file-document-multiple-outline</v-icon>
            <div class="empty-glow"></div>
          </div>
          <h2 class="empty-title">No documents found</h2>
          <p class="empty-description">
            {{ searchQuery ? 'Try adjusting your search terms' : 'Start creating or uploading documents to see them here' }}
          </p>
          <v-btn
            v-if="!searchQuery"
            color="primary"
            size="large"
            class="empty-action-btn"
            prepend-icon="mdi-plus"
            @click="$router.push('/pdf-editor')"
          >
            Create New Document
          </v-btn>
          <v-btn
            v-else
            variant="outlined"
            size="large"
            class="empty-action-btn"
            @click="searchQuery = ''"
          >
            Clear Search
          </v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import documentService from '../services/documentService.js'

export default {
  name: 'MyDocumentsView',
  data() {
    return {
      searchQuery: '',
      viewMode: 'grid', // 'grid' or 'list'
      sortBy: 'date',
      documents: [],
      isLoading: false,
      error: null,
      sortOptions: [
        { value: 'date', label: 'Date Modified' },
        { value: 'name', label: 'Name (A-Z)' },
        { value: 'name-desc', label: 'Name (Z-A)' },
        { value: 'type', label: 'Type' }
      ]
    }
  },
  async mounted() {
    await this.loadDocuments()
  },
  computed: {
    filteredDocuments() {
      let filtered = [...this.documents]
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(doc => 
          doc.name?.toLowerCase().includes(query) ||
          doc.title?.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.type?.toLowerCase().includes(query) ||
          doc.owner?.toLowerCase().includes(query) ||
          doc.author?.toLowerCase().includes(query)
        )
      }
      
      // Sort
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'name':
            return (a.name || a.title || '').localeCompare(b.name || b.title || '')
          case 'name-desc':
            return (b.name || b.title || '').localeCompare(a.name || a.title || '')
          case 'type':
            return (a.type || '').localeCompare(b.type || '')
          case 'date':
          default:
            const dateA = a.lastModified || a.updatedAt || new Date(0)
            const dateB = b.lastModified || b.updatedAt || new Date(0)
            return new Date(dateB) - new Date(dateA)
        }
      })
      
      return filtered
    },
    
    sortLabel() {
      const option = this.sortOptions.find(opt => opt.value === this.sortBy)
      return option ? option.label : 'Sort'
    },
    
    sharedCount() {
      return this.documents.filter(doc => doc.shared).length
    }
  },
  methods: {
    toggleView() {
      this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid'
    },
    
    formatDate(date) {
      if (!date) return 'Unknown'
      
      const dateObj = date instanceof Date ? date : new Date(date)
      if (isNaN(dateObj.getTime())) return 'Invalid date'
      
      const now = new Date()
      const diffTime = Math.abs(now - dateObj)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      }).format(dateObj)
    },
    
    getDocumentIcon(type) {
      const icons = {
        'PDF': 'mdi-file-pdf-box',
        'DOCX': 'mdi-file-word',
        'XLSX': 'mdi-file-excel',
        'PPTX': 'mdi-file-powerpoint',
        'TXT': 'mdi-file-document-outline',
        'JPG': 'mdi-file-image',
        'PNG': 'mdi-file-image'
      }
      return icons[type] || 'mdi-file-outline'
    },
    
    getDocumentColor(type) {
      const colors = {
        'PDF': 'error',
        'DOCX': 'primary',
        'XLSX': 'success',
        'PPTX': 'warning',
        'TXT': 'grey',
        'JPG': 'purple',
        'PNG': 'purple'
      }
      return colors[type] || 'grey'
    },
    
    getCardGradient(type) {
      const gradients = {
        'PDF': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'DOCX': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'XLSX': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'PPTX': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'TXT': 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        'JPG': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        'PNG': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
      }
      return gradients[type] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    
    /**
     * Load documents from API
     */
    async loadDocuments() {
      this.isLoading = true
      this.error = null
      
      try {
      

      
        
        const apiDocuments = await documentService.getAllDocuments()
        
        this.documents = apiDocuments.map(doc => ({
          id: doc.id,
          name: doc.title, 
          title: doc.title,
          content: doc.content,
          description: doc.description,
          type: this.detectDocumentType(doc.content, doc.title),
          lastModified: new Date(doc.updatedAt || doc.createdAt),
          updatedAt: doc.updatedAt,
          createdAt: doc.createdAt,
          owner: doc.author || 'Unknown',
          author: doc.author,
          shared: false 
        }))
        
        console.log('✅ Documents loaded:', this.documents)
      } catch (error) {
        console.error('❌ Error loading documents:', error)
        this.error = error.message || 'Failed to load documents'
      } finally {
        this.isLoading = false
      }
    },

    
    detectDocumentType(content, title) {
      const titleLower = (title || '').toLowerCase()
      const contentLower = (content || '').toLowerCase()
      
      if (titleLower.endsWith('.pdf') || contentLower.includes('pdf')) return 'PDF'
      if (titleLower.endsWith('.docx') || titleLower.endsWith('.doc')) return 'DOCX'
      if (titleLower.endsWith('.xlsx') || titleLower.endsWith('.xls')) return 'XLSX'
      if (titleLower.endsWith('.pptx') || titleLower.endsWith('.ppt')) return 'PPTX'
      if (titleLower.endsWith('.txt')) return 'TXT'
      if (titleLower.endsWith('.jpg') || titleLower.endsWith('.jpeg')) return 'JPG'
      if (titleLower.endsWith('.png')) return 'PNG'
      
      // Default to DOCX for text documents
      return 'DOCX'
    },
    
    searchDocuments() {
      // Search is handled by computed property
    },
    
    openDocument(doc) {
      this.$router.push(`/edit/${doc.id}`)
    },
    
    shareDocument(doc) {
      console.log('Sharing document:', doc.name || doc.title)
      // Implement share functionality
    },
    
    downloadDocument(doc) {
      console.log('Downloading document:', doc.name || doc.title)
      // Implement download functionality
    },
    
    async deleteDocument(doc) {
      const docName = doc.name || doc.title || 'this document'
      if (confirm(`Are you sure you want to delete "${docName}"?`)) {
        try {
          const clerk = this.$clerk
          if (!clerk) {
            throw new Error('Clerk is not initialized')
          }

          await clerk.load()
          await documentService.deleteDocument(doc.id, clerk)
          
          // Remove from local array
          const index = this.documents.findIndex(d => d.id === doc.id)
          if (index > -1) {
            this.documents.splice(index, 1)
          }
          
          console.log('✅ Document deleted successfully')
        } catch (error) {
          console.error('❌ Error deleting document:', error)
          alert(`Failed to delete document: ${error.message}`)
        }
      }
    }
  }
}
</script>

<style scoped>
.documents-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  position: relative;
  padding-top: 140px;
}

.documents-background {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float-orb 20s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -150px;
  left: -150px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  bottom: -100px;
  right: -100px;
  animation-delay: 5s;
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

/* Toolbar */
.toolbar-modern {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
}

.toolbar-container {
  padding: 16px 24px;
}

.toolbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
}

.docs-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.brand-text {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-modern {
  position: relative;
  flex: 1;
  max-width: 500px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
  pointer-events: none;
  z-index: 2;
}

.search-input-modern {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #0f172a;
  background: white;
  outline: none;
  transition: all 0.2s ease;
}

.search-input-modern:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.search-input-modern::placeholder {
  color: #94a3b8;
}

.clear-search {
  position: absolute;
  right: 12px;
  width: 28px;
  height: 28px;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
}

.clear-search:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-btn {
  border-radius: 10px;
  text-transform: none;
  font-weight: 600;
}

.new-doc-btn-modern {
  border-radius: 12px;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0.2px;
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
  padding: 0 24px;
}

.new-doc-btn-modern:hover {
  box-shadow: 0 12px 32px rgba(79, 70, 229, 0.4);
  transform: translateY(-2px);
}

/* Main Content */
.main-content {
  position: relative;
  z-index: 1;
  padding-top: 40px;
  padding-bottom: 60px;
}

.page-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 2px solid #e2e8f0;
}

.header-left {
  flex: 1;
}

.page-title-modern {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 900;
  letter-spacing: -1px;
  color: #0f172a;
  margin-bottom: 8px;
}

.page-subtitle-modern {
  font-size: 18px;
  color: #64748b;
}

.gradient-text {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-badge {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

/* Documents Grid */
.documents-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.documents-list-modern {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.document-card-modern {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.5s ease-out backwards;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.document-card-modern:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
  border-color: rgba(79, 70, 229, 0.3);
}

.card-header-modern {
  position: relative;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-header-modern::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.2), transparent);
  pointer-events: none;
}

.card-icon-wrapper {
  position: relative;
  z-index: 2;
}

.card-icon-modern {
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.document-card-modern:hover .card-icon-modern {
  transform: scale(1.1) rotate(-5deg);
}

.card-menu-btn-modern {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  opacity: 0.8;
}

.card-menu-btn-modern:hover {
  opacity: 1;
}

.shared-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
}

.card-body-modern {
  padding: 20px;
  flex: 1;
}

.card-title-modern {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-description {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta-modern {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #64748b;
}

.card-footer-modern {
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
}

.card-actions {
  display: flex;
  gap: 8px;
}

/* List View */
.documents-list-modern .document-card-modern {
  flex-direction: row;
  height: auto;
}

.documents-list-modern .card-header-modern {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.documents-list-modern .card-body-modern {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.documents-list-modern .card-footer-modern {
  width: auto;
  border-top: none;
  border-left: 1px solid #e2e8f0;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  padding: 60px 20px;
}

.loading-text {
  margin-top: 24px;
  font-size: 16px;
  color: #64748b;
  font-weight: 600;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  padding: 60px 20px;
  text-align: center;
}

.error-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.error-message {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 24px;
  max-width: 500px;
}

/* Empty State */
.empty-state-modern {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  padding: 60px 20px;
}

.empty-content {
  text-align: center;
  max-width: 500px;
}

.empty-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 32px;
}

.empty-icon {
  opacity: 0.6;
  filter: drop-shadow(0 8px 24px rgba(79, 70, 229, 0.2));
}

.empty-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.1), transparent);
  border-radius: 50%;
  animation: pulse-glow 2s ease-in-out infinite;
}

.empty-title {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
}

.empty-description {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 32px;
  line-height: 1.6;
}

.empty-action-btn {
  border-radius: 12px;
  font-weight: 700;
  text-transform: none;
  padding: 0 32px;
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
}

/* Animations */
@keyframes float-orb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

/* Responsive */
@media (max-width: 960px) {
  .toolbar-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .toolbar-left {
    width: 100%;
    flex-direction: column;
    gap: 16px;
  }
  
  .search-modern {
    max-width: 100%;
  }
  
  .page-header-modern {
    flex-direction: column;
    gap: 20px;
  }
  
  .header-stats {
    width: 100%;
    justify-content: flex-start;
  }
  
  .documents-grid-modern {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 600px) {
  .documents-grid-modern {
    grid-template-columns: 1fr;
  }
  
  .toolbar-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .new-doc-btn-modern {
    flex: 1;
  }
  
  .documents-list-modern .document-card-modern {
    flex-direction: column;
  }
  
  .documents-list-modern .card-footer-modern {
    border-left: none;
    border-top: 1px solid #e2e8f0;
    flex-direction: row;
  }
}
</style>
