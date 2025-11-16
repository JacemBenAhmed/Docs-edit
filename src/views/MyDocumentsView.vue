<template>
  <div class="my-documents-view">
    <!-- Sticky Top Toolbar -->
    <div class="toolbar-container">
      <div class="toolbar-content">
        <div class="toolbar-left">
          <div class="docs-logo">
            <i class="mdi mdi-file-document-multiple"></i>
            <span>Docs</span>
          </div>
          <div class="search-wrapper">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search documents"
              class="search-input"
              @input="searchDocuments"
            >
            <i class="mdi mdi-magnify search-icon"></i>
          </div>
        </div>
        <button class="new-doc-btn" @click="$router.push('/upload')">
          <i class="mdi mdi-plus"></i>
          <span>New</span>
        </button>
      </div>
    </div>

    <!-- Main Container -->
    <div class="main-container">
      <!-- Header Section -->
      <div class="page-header">
        <h1 class="page-title">My Documents</h1>
        <div class="header-actions">
          <button class="icon-btn" title="Sort documents">
            <i class="mdi mdi-sort-variant"></i>
          </button>
          <button class="icon-btn" title="Change view">
            <i class="mdi mdi-view-grid"></i>
          </button>
        </div>
      </div>

      <!-- Documents Grid -->
      <div v-if="documents.length > 0" class="documents-grid-container">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="document-card-wrapper"
        >
          <div class="document-card" @click="openDocument(doc)">
            <!-- Card Header with Thumbnail -->
            <div class="card-header">
              <div class="card-icon-bg">
                <i :class="['mdi', getDocumentIcon(doc.type), 'card-icon']"></i>
              </div>
              <!-- Menu Button -->
              <button 
                class="card-menu-btn" 
                @click.stop="toggleMenu(doc.id)"
                title="More options"
              >
                <i class="mdi mdi-dots-vertical"></i>
              </button>
              <!-- Dropdown Menu -->
              <div v-if="activeMenu === doc.id" class="card-dropdown-menu">
                <button class="dropdown-item" @click.stop="openDocument(doc)">
                  <i class="mdi mdi-pencil"></i>
                  <span>Edit</span>
                </button>
                <button class="dropdown-item" @click.stop="shareDocument(doc)">
                  <i class="mdi mdi-share-variant"></i>
                  <span>Share</span>
                </button>
                <button class="dropdown-item" @click.stop="downloadDocument(doc)">
                  <i class="mdi mdi-download"></i>
                  <span>Download</span>
                </button>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item delete-item" @click.stop="deleteDocument(doc)">
                  <i class="mdi mdi-delete"></i>
                  <span>Delete</span>
                </button>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <h3 class="card-title">{{ doc.name }}</h3>
              <p class="card-meta">{{ formatDate(doc.lastModified) }}</p>
              <p class="card-owner">{{ doc.owner }}</p>
            </div>

            <!-- Card Footer Actions (appear on hover) -->
            <div class="card-footer-actions">
              <button 
                class="action-btn edit-btn" 
                @click.stop="openDocument(doc)"
                title="Edit document"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button 
                class="action-btn share-btn" 
                @click.stop="shareDocument(doc)"
                title="Share document"
              >
                <i class="mdi mdi-share-variant"></i>
              </button>
              <button 
                class="action-btn delete-btn" 
                @click.stop="deleteDocument(doc)"
                title="Delete document"
              >
                <i class="mdi mdi-delete"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state-container">
        <div class="empty-state">
          <div class="empty-icon">
            <i class="mdi mdi-file-document-multiple-outline"></i>
          </div>
          <h2>No documents yet</h2>
          <p>Start creating or uploading documents to see them here</p>
          <button class="new-doc-btn primary" @click="$router.push('/upload')">
            <i class="mdi mdi-plus"></i>
            <span>Create New Document</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyDocumentsView',
  data() {
    return {
      searchQuery: '',
      activeMenu: null,
      documents: [
        {
          id: 1,
          name: 'Project Proposal',
          type: 'PDF',
          lastModified: new Date('2023-05-15'),
          owner: 'John Doe',
          shared: true
        },
        {
          id: 2,
          name: 'Meeting Notes',
          type: 'DOCX',
          lastModified: new Date('2023-05-10'),
          owner: 'John Doe',
          shared: false
        },
        {
          id: 3,
          name: 'Budget Report',
          type: 'XLSX',
          lastModified: new Date('2023-05-05'),
          owner: 'John Doe',
          shared: true
        },
        {
          id: 4,
          name: 'Presentation Slides',
          type: 'PPTX',
          lastModified: new Date('2023-04-28'),
          owner: 'John Doe',
          shared: false
        },
        {
          id: 5,
          name: 'Research Paper',
          type: 'PDF',
          lastModified: new Date('2023-04-20'),
          owner: 'John Doe',
          shared: true
        },
        {
          id: 6,
          name: 'Client Contract',
          type: 'DOCX',
          lastModified: new Date('2023-04-15'),
          owner: 'John Doe',
          shared: false
        }
      ]
    }
  },
  computed: {
    isDark() {
      try { return !!this.$vuetify.theme?.global?.current?.value?.dark } catch { return false }
    }
  },
  methods: {
    toggleMenu(docId) {
      this.activeMenu = this.activeMenu === docId ? null : docId
    },
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date)
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
        'PDF': 'red',
        'DOCX': 'blue',
        'XLSX': 'green',
        'PPTX': 'orange',
        'TXT': 'grey',
        'JPG': 'purple',
        'PNG': 'purple'
      }
      return colors[type] || 'grey'
    },
    searchDocuments() {
      // Implement search functionality
      console.log('Searching for:', this.searchQuery)
    },
    openDocument(doc) {
      console.log('Opening document:', doc.name)
      // Navigate to edit view with document ID
      this.$router.push(`/edit/${doc.id}`)
    },
    shareDocument(doc) {
      console.log('Sharing document:', doc.name)
      // Implement share functionality
    },
    downloadDocument(doc) {
      console.log('Downloading document:', doc.name)
      // Implement download functionality
    },
    deleteDocument(doc) {
      console.log('Deleting document:', doc.name)
      // Implement delete functionality
    }
  }
}
</script>

<style scoped>
/* Import Google Font */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

* {
  box-sizing: border-box;
}

.my-documents-view {
  min-height: 100vh;
  background: #f1f3f4;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ==================== TOOLBAR ==================== */
.toolbar-container {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  border-bottom: 1px solid #dadce0;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.08);
  padding: 0 16px;
}

.toolbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  gap: 20px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.docs-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 500;
  color: #3c4043;
  min-width: 100px;
  text-decoration: none;
}

.docs-logo i {
  font-size: 28px;
  color: #4285f4;
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
  height: 40px;
}

.search-input {
  width: 100%;
  height: 100%;
  padding: 8px 16px 8px 40px;
  border: 1px solid #dadce0;
  border-radius: 24px;
  font-size: 14px;
  color: #202124;
  background: #f8f9fa;
  outline: none;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input::placeholder {
  color: #80868b;
}

.search-input:focus {
  background: white;
  border-color: #dadce0;
  box-shadow: 0 1px 6px rgba(32, 33, 36, 0.08), inset 0 1px 3px rgba(206, 206, 206, 0.3);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #80868b;
  pointer-events: none;
}

.new-doc-btn {
  padding: 8px 20px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 200ms ease;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.08);
  text-transform: capitalize;
}

.new-doc-btn:hover {
  background: #3b78e7;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.25);
  transform: translateY(-1px);
}

.new-doc-btn:active {
  transform: translateY(0);
}

.new-doc-btn i {
  font-size: 18px;
}

/* ==================== MAIN CONTAINER ==================== */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
}

/* ==================== PAGE HEADER ==================== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.page-title {
  font-size: 32px;
  font-weight: 400;
  color: #202124;
  margin: 0;
  letter-spacing: -0.3px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #dadce0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  color: #5f6368;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
}

.icon-btn:hover {
  background: #f8f9fa;
  border-color: #dadce0;
  color: #202124;
}

.icon-btn:active {
  background: #e8e8e8;
}

/* ==================== DOCUMENTS GRID ==================== */
.documents-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: 24px;
  animation: fadeIn 300ms ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== DOCUMENT CARD ==================== */
.document-card-wrapper {
  perspective: 1000px;
}

.document-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 280ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 280px;
  position: relative;
  box-shadow: 0 2px 4px rgba(60, 64, 67, 0.1);
}

.document-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 24px rgba(60, 64, 67, 0.15);
  border-color: #dadce0;
}

/* Card Header - Thumbnail Area */
.card-header {
  position: relative;
  height: 140px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1), transparent);
  pointer-events: none;
}

.card-icon-bg {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.card-icon {
  transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.document-card:hover .card-icon {
  transform: scale(1.2) rotate(-8deg);
}

/* Card Menu Button */
.card-menu-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
  opacity: 0;
  z-index: 10;
}

.document-card:hover .card-menu-btn {
  opacity: 1;
}

.card-menu-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.card-menu-btn:active {
  transform: scale(0.95);
}

/* Dropdown Menu */
.card-dropdown-menu {
  position: absolute;
  top: 44px;
  right: 0;
  background: white;
  border: 1px solid #dadce0;
  border-radius: 2px;
  box-shadow: 0 4px 12px rgba(60, 64, 67, 0.15);
  z-index: 1001;
  min-width: 160px;
  animation: slideDown 200ms ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 13px;
  color: #202124;
  cursor: pointer;
  transition: background 150ms ease;
  font-family: inherit;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item i {
  font-size: 18px;
  color: #5f6368;
  width: 24px;
  text-align: center;
}

.dropdown-item.delete-item {
  color: #d33427;
}

.dropdown-item.delete-item i {
  color: #d33427;
}

.dropdown-divider {
  height: 1px;
  background: #e8e8e8;
  margin: 4px 0;
}

/* Card Body */
.card-body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: #202124;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.card-meta {
  font-size: 12px;
  color: #80868b;
  margin: 0;
}

.card-owner {
  font-size: 12px;
  color: #5f6368;
  margin: 0;
  font-weight: 400;
}

/* Card Footer Actions */
.card-footer-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e8e8e8;
  background: #fafafa;
  justify-content: flex-start;
  opacity: 0;
  transform: translateY(8px);
  transition: all 200ms ease;
  pointer-events: none;
}

.document-card:hover .card-footer-actions {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
  color: #5f6368;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.08);
}

.action-btn:hover {
  background: white;
  color: #202124;
  box-shadow: 0 2px 6px rgba(60, 64, 67, 0.15);
  transform: scale(1.08);
}

.action-btn:active {
  transform: scale(0.95);
}

.edit-btn:hover {
  color: #4285f4;
}

.share-btn:hover {
  color: #1f73e6;
}

.delete-btn:hover {
  color: #d33427;
}

/* ==================== EMPTY STATE ==================== */
.empty-state-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  padding: 40px 20px;
}

.empty-state {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  font-size: 120px;
  color: #dadce0;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-state h2 {
  font-size: 28px;
  color: #202124;
  margin: 0 0 8px 0;
  font-weight: 400;
}

.empty-state p {
  font-size: 14px;
  color: #80868b;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.empty-state .new-doc-btn.primary {
  background: #4285f4;
  padding: 10px 28px;
  font-size: 14px;
  margin: 0 auto;
  display: inline-flex;
}

/* ==================== SCROLLBAR STYLING ==================== */
.documents-grid-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.documents-grid-container::-webkit-scrollbar-track {
  background: transparent;
}

.documents-grid-container::-webkit-scrollbar-thumb {
  background: #dadce0;
  border-radius: 4px;
}

.documents-grid-container::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

/* ==================== RESPONSIVE DESIGN ==================== */
@media (max-width: 1024px) {
  .documents-grid-container {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }

  .main-container {
    padding: 24px 12px;
  }
}

@media (max-width: 768px) {
  .toolbar-content {
    padding: 6px 0;
    gap: 12px;
  }

  .toolbar-left {
    gap: 12px;
  }

  .docs-logo {
    font-size: 18px;
    min-width: auto;
  }

  .docs-logo span {
    display: none;
  }

  .search-wrapper {
    max-width: none;
  }

  .new-doc-btn span {
    display: none;
  }

  .new-doc-btn {
    padding: 8px 12px;
    width: 40px;
    height: 40px;
    justify-content: center;
  }

  .page-title {
    font-size: 24px;
  }

  .documents-grid-container {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }

  .document-card {
    height: 240px;
  }

  .card-header {
    height: 110px;
  }

  .card-icon-bg {
    font-size: 40px;
  }

  .card-footer-actions {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }

  .action-btn {
    flex: 1;
    width: auto;
    padding: 8px 4px;
  }
}

@media (max-width: 480px) {
  .documents-grid-container {
    grid-template-columns: 1fr;
  }

  .toolbar-left {
    flex-direction: column;
    gap: 8px;
  }

  .search-wrapper {
    max-width: none;
    order: 3;
  }

  .main-container {
    padding: 16px 8px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
  }

  .document-card {
    height: auto;
  }

  .card-header {
    height: 120px;
  }

  .card-body {
    padding: 12px;
  }

  .card-footer-actions {
    padding: 8px 12px;
  }
}
</style>