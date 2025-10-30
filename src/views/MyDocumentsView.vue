<template>
  <div class="my-documents-view">
    <v-container>
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <h1 class="text-h3 font-weight-bold gradient-text">My Documents</h1>
          <p class="text-subtitle-1 mt-2">Manage and organize all your documents in one place</p>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-end align-center">
          <v-btn
            prepend-icon="mdi-filter-variant"
            variant="outlined"
            class="mr-3"
            color="primary"
          >
            Filter
          </v-btn>
          <v-btn
            prepend-icon="mdi-sort"
            variant="outlined"
            class="mr-3"
            color="primary"
          >
            Sort
          </v-btn>
          <v-btn
            prepend-icon="mdi-plus"
            color="primary"
            class="animated-btn"
            @click="$router.push('/upload')"
          >
            New Document
          </v-btn>
        </v-col>
      </v-row>

      <!-- Search Bar -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="Search documents..."
            variant="outlined"
            hide-details
            class="search-field"
            density="comfortable"
            @input="searchDocuments"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Documents Grid -->
      <v-row v-if="documents.length > 0">
        <v-col
          v-for="doc in documents"
          :key="doc.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="document-card h-100" elevation="3" :class="isDark ? 'dark-card' : ''">
            <div class="document-icon-wrapper">
              <v-icon size="40" :color="getDocumentColor(doc.type)" class="document-icon">
                {{ getDocumentIcon(doc.type) }}
              </v-icon>
            </div>
            <v-card-title class="text-h6 font-weight-bold">{{ doc.name }}</v-card-title>
            <v-card-subtitle>{{ formatDate(doc.lastModified) }}</v-card-subtitle>
            <v-card-text>
              <div class="d-flex align-center mb-2">
                <v-icon size="small" color="grey">mdi-file-outline</v-icon>
                <span class="ml-2 text-caption">{{ doc.type }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon size="small" color="grey">mdi-account</v-icon>
                <span class="ml-2 text-caption">{{ doc.owner }}</span>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn variant="text" color="primary" @click="openDocument(doc)">
                <v-icon>mdi-pencil</v-icon> Edit
              </v-btn>
              <v-spacer></v-spacer>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn icon v-bind="props">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="shareDocument(doc)">
                    <v-list-item-title>
                      <v-icon size="small" class="mr-2">mdi-share-variant</v-icon>
                      Share
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="downloadDocument(doc)">
                    <v-list-item-title>
                      <v-icon size="small" class="mr-2">mdi-download</v-icon>
                      Download
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="deleteDocument(doc)">
                    <v-list-item-title class="text-error">
                      <v-icon size="small" class="mr-2" color="error">mdi-delete</v-icon>
                      Delete
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-row v-else>
        <v-col cols="12" class="text-center py-16">
          <div class="empty-state">
            <v-icon size="100" color="grey-lighten-1" class="mb-4">mdi-file-document-multiple-outline</v-icon>
            <h3 class="text-h5 font-weight-bold mb-2">No documents found</h3>
            <p class="text-body-1 mb-6">You don't have any documents yet. Upload your first document to get started.</p>
            <v-btn
              color="primary"
              prepend-icon="mdi-upload"
              size="large"
              class="animated-btn"
              @click="$router.push('/upload')"
            >
              Upload Document
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'MyDocumentsView',
  data() {
    return {
      searchQuery: '',
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
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-field {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.search-field:focus-within {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.4);
}

.document-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.document-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.document-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  margin-bottom: 10px;
}

.document-icon {
  transition: all 0.3s ease;
}

.document-card:hover .document-icon {
  transform: scale(1.2) rotate(5deg);
}

.empty-state {
  padding: 3rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.animated-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  padding: 0 24px;
  border-radius: 30px;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.animated-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
}

.dark-card {
  background: linear-gradient(145deg, #2d3748, #1a202c);
  color: #e2e8f0;
}
</style>