<template>
  <div class="upload-view">
    <v-container>
      <!-- Header Section -->
      <v-row class="mb-8">
        <v-col cols="12">
          <h1 class="text-h3 font-weight-bold gradient-text">Upload Documents</h1>
          <p class="text-subtitle-1 mt-2">Drag and drop your files or browse to upload</p>
        </v-col>
      </v-row>

      <!-- Upload Box -->
      <v-row class="mb-8">
        <v-col cols="12">
          <div 
            class="upload-box"
            :class="{ 'drag-active': isDragging, 'dark-upload-box': isDark }"
            @dragenter="onDragEnter"
            @dragleave="onDragLeave"
            @dragover.prevent
            @drop="onDrop"
          >
            <div class="upload-content">
              <v-icon size="64" color="primary" class="upload-icon mb-4">mdi-cloud-upload</v-icon>
              <h3 class="text-h5 font-weight-bold mb-2">Drop files here or</h3>
              <v-btn
                color="primary"
                prepend-icon="mdi-folder-open"
                class="browse-btn"
                @click="triggerFileInput"
              >
                Browse Files
              </v-btn>
              <input
                ref="fileInput"
                type="file"
                multiple
                class="hidden-input"
                @change="onFileSelected"
              />
              <p class="text-body-2 mt-4 text-grey">
                Supported file types: PDF, DOCX, XLSX, PPTX, TXT, JPG, PNG
              </p>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Selected Files -->
      <v-row v-if="selectedFiles.length > 0">
        <v-col cols="12">
          <h3 class="text-h5 font-weight-bold mb-4">Selected Files</h3>
          
          <v-card
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="mb-3 selected-file-card"
            :class="isDark ? 'dark-card' : ''"
          >
            <div class="d-flex align-center pa-4">
              <v-icon size="32" :color="getFileColor(file.type)" class="mr-4">
                {{ getFileIcon(file.type) }}
              </v-icon>
              
              <div class="flex-grow-1">
                <div class="d-flex align-center">
                  <span class="text-subtitle-1 font-weight-medium">{{ file.name }}</span>
                  <v-chip size="small" color="grey-lighten-3" class="ml-2">
                    {{ formatFileSize(file.size) }}
                  </v-chip>
                </div>
                <v-progress-linear
                  v-if="file.uploading"
                  color="primary"
                  height="4"
                  :model-value="file.progress"
                  class="mt-2"
                ></v-progress-linear>
              </div>
              
              <v-btn
                icon
                variant="text"
                color="error"
                @click="removeFile(index)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card>
          
          <div class="d-flex justify-end mt-4">
            <v-btn
              variant="outlined"
              color="grey"
              class="mr-3"
              @click="clearFiles"
            >
              Clear All
            </v-btn>
            <v-btn
              color="primary"
              prepend-icon="mdi-cloud-upload"
              class="animated-btn"
              @click="uploadFiles"
              :loading="uploading"
            >
              Upload Files
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Recent Uploads -->
      <v-row class="mt-8">
        <v-col cols="12">
          <h3 class="text-h5 font-weight-bold mb-4">Recent Uploads</h3>
          
          <v-table v-if="recentUploads.length > 0">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="upload in recentUploads" :key="upload.id">
                <td>
                  <div class="d-flex align-center">
                    <v-icon size="20" :color="getFileColor(upload.type)" class="mr-2">
                      {{ getFileIcon(upload.type) }}
                    </v-icon>
                    {{ upload.name }}
                  </div>
                </td>
                <td>{{ upload.type }}</td>
                <td>{{ formatFileSize(upload.size) }}</td>
                <td>{{ formatDate(upload.date) }}</td>
                <td>
                  <v-btn icon variant="text" color="primary" class="mr-1">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon variant="text" color="error">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
          
          <div v-else class="text-center py-8 empty-uploads">
            <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-tray-arrow-up</v-icon>
            <p class="text-body-1">No recent uploads</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'UploadView',
  data() {
    return {
      isDragging: false,
      selectedFiles: [],
      uploading: false,
      recentUploads: [
        {
          id: 1,
          name: 'Annual Report.pdf',
          type: 'PDF',
          size: 2500000,
          date: new Date('2023-05-15')
        },
        {
          id: 2,
          name: 'Product Roadmap.docx',
          type: 'DOCX',
          size: 1200000,
          date: new Date('2023-05-10')
        },
        {
          id: 3,
          name: 'Team Photo.jpg',
          type: 'JPG',
          size: 3800000,
          date: new Date('2023-05-05')
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
    onDragEnter(e) {
      e.preventDefault()
      this.isDragging = true
    },
    onDragLeave(e) {
      e.preventDefault()
      this.isDragging = false
    },
    onDrop(e) {
      e.preventDefault()
      this.isDragging = false
      
      const files = e.dataTransfer.files
      this.processFiles(files)
    },
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    onFileSelected(e) {
      const files = e.target.files
      this.processFiles(files)
    },
    processFiles(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileType = this.getFileType(file.name)
        
        this.selectedFiles.push({
          name: file.name,
          size: file.size,
          type: fileType,
          file: file,
          uploading: false,
          progress: 0
        })
      }
    },
    getFileType(fileName) {
      const extension = fileName.split('.').pop().toUpperCase()
      return extension
    },
    getFileIcon(type) {
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
    getFileColor(type) {
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
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date)
    },
    removeFile(index) {
      this.selectedFiles.splice(index, 1)
    },
    clearFiles() {
      this.selectedFiles = []
    },
    uploadFiles() {
      if (this.selectedFiles.length === 0) return
      
      this.uploading = true
      
      // Simulate upload progress for each file
      this.selectedFiles.forEach(file => {
        file.uploading = true
        
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 10
          file.progress = Math.min(progress, 100)
          
          if (file.progress === 100) {
            clearInterval(interval)
            
            // Add to recent uploads after successful upload
            setTimeout(() => {
              this.recentUploads.unshift({
                id: Date.now(),
                name: file.name,
                type: file.type,
                size: file.size,
                date: new Date()
              })
              
              // Clear selected files after all uploads complete
              const allComplete = this.selectedFiles.every(f => f.progress === 100)
              if (allComplete) {
                setTimeout(() => {
                  this.selectedFiles = []
                  this.uploading = false
                }, 500)
              }
            }, 500)
          }
        }, 300)
      })
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

.upload-box {
  border: 2px dashed #e0e0e0;
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  transition: all 0.3s ease;
  background-color: rgba(245, 245, 245, 0.5);
}

.dark-upload-box {
  border-color: #4a5568;
  background-color: rgba(45, 55, 72, 0.3);
}

.upload-box:hover {
  border-color: #667eea;
  background-color: rgba(102, 126, 234, 0.05);
}

.drag-active {
  border-color: #667eea;
  background-color: rgba(102, 126, 234, 0.1);
  transform: scale(1.01);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.upload-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.hidden-input {
  display: none;
}

.browse-btn {
  margin-top: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  padding: 0 24px;
  border-radius: 30px;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.browse-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
}

.selected-file-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.selected-file-card:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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

.empty-uploads {
  border-radius: 12px;
  background-color: rgba(245, 245, 245, 0.5);
}

.dark-card {
  background: linear-gradient(145deg, #2d3748, #1a202c);
  color: #e2e8f0;
}
</style>