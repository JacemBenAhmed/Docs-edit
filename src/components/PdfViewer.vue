<template>
  <div class="pdf-editor-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- PDF Viewer Container -->
    <div class="pdf-container" ref="pdfContainer">
      <div v-for="(page, index) in renderedPages" :key="index" class="pdf-page-container" :id="`page-container-${index + 1}`">
        <canvas :id="`pdf-page-${index + 1}`" class="pdf-page"></canvas>
        <canvas :id="`fabric-canvas-${index + 1}`" class="fabric-canvas"></canvas>
      </div>
      <div v-if="loading" class="loading-overlay">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <span class="loading-text">Loading PDF...</span>
      </div>
    </div>

    <!-- Floating Toolbar -->
    <div class="floating-toolbar" :class="{ 'dark-mode': isDarkMode }">
      <div class="toolbar-section">
        <v-select
          v-model="selectedFont"
          :items="fontOptions"
          label="Font"
          density="compact"
          variant="outlined"
          class="toolbar-select"
          @update:model-value="applyTextStyle"
        ></v-select>
        
        <v-select
          v-model="fontSize"
          :items="fontSizeOptions"
          label="Size"
          density="compact"
          variant="outlined"
          class="toolbar-select"
          @update:model-value="applyTextStyle"
        ></v-select>
        
        <v-color-picker
          v-model="textColor"
          mode="hexa"
          hide-inputs
          hide-canvas
          show-swatches
          swatches-max-height="120px"
          class="toolbar-color-picker"
          @update:model-value="applyTextStyle"
        ></v-color-picker>
      </div>
      
      <div class="toolbar-section">
        <v-btn-toggle v-model="textFormatting" multiple class="toolbar-btn-group">
          <v-btn icon @click="toggleBold">
            <v-icon>mdi-format-bold</v-icon>
          </v-btn>
          <v-btn icon @click="toggleItalic">
            <v-icon>mdi-format-italic</v-icon>
          </v-btn>
          <v-btn icon @click="toggleUnderline">
            <v-icon>mdi-format-underline</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
      
      <div class="toolbar-section">
        <v-btn-toggle v-model="selectedTool" mandatory class="toolbar-btn-group">
          <v-btn icon value="text" title="Add Text">
            <v-icon>mdi-format-text</v-icon>
          </v-btn>
          <v-btn icon value="rectangle" title="Add Rectangle">
            <v-icon>mdi-rectangle-outline</v-icon>
          </v-btn>
          <v-btn icon value="highlight" title="Highlight">
            <v-icon>mdi-marker</v-icon>
          </v-btn>
          <v-btn icon value="arrow" title="Add Arrow">
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
      
      <div class="toolbar-section">
        <v-btn-toggle class="toolbar-btn-group">
          <v-btn icon @click="undo" title="Undo" :disabled="!canUndo">
            <v-icon>mdi-undo</v-icon>
          </v-btn>
          <v-btn icon @click="redo" title="Redo" :disabled="!canRedo">
            <v-icon>mdi-redo</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
      
      <div class="toolbar-section">
        <v-btn color="primary" @click="savePdf" class="save-btn">
          <v-icon start>mdi-content-save</v-icon>
          Save as PDF
        </v-btn>
      </div>
      
      <div class="toolbar-section">
        <v-btn icon @click="toggleDarkMode" class="theme-toggle-btn">
          <v-icon>{{ isDarkMode ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
        </v-btn>
      </div>
    </div>
    
    <!-- Page Navigation -->
    <div class="page-navigation">
      <v-btn icon @click="prevPage" :disabled="currentPage <= 1">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <v-btn icon @click="nextPage" :disabled="currentPage >= totalPages">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </div>
      
      <div 
        class="annotation"
        v-for="(annotation, index) in annotations.filter(a => a.page === currentPage)" 
        :key="index"
        :style="getAnnotationStyle(annotation)"
        @click.stop="selectAnnotation(index)"
        :class="{ selected: selectedAnnotationIndex === index && selectedPage === currentPage }"
        contenteditable="false"
      >
        <span class="annotation-text">{{ annotation.text }}</span>
        <button v-if="selectedAnnotationIndex === index && selectedPage === currentPage" @click="deleteAnnotation(index)" class="delete-btn">×</button>
        <button v-if="selectedAnnotationIndex === index && selectedPage === currentPage" @click="editAnnotation(index)" class="edit-btn">✎</button>
      </div>
      <!-- Inline editing input -->
      <div v-if="editingAnnotationIndex !== null" class="annotation-edit-overlay" :style="editingStyle">
        <input 
          ref="editInputRef"
          v-model="editingText" 
          @keyup.enter="confirmEdit"
          @keyup.esc="cancelEdit"
          @blur="confirmEdit"
          class="annotation-edit-input"
        />
      </div>
      <!-- Text input overlay for new text -->
      <div v-if="showTextInput" class="text-input-overlay" :style="textInputStyle">
        <input 
          ref="textInputRef"
          v-model="newTextInput" 
          @keyup.enter="addTextFromInput"
          @keyup.esc="cancelTextInput"
          @blur="addTextFromInput"
          class="inline-text-input"
          placeholder="Type here..."
        />
      </div>
    
    <div class="zoom-controls">
      <button @click="zoomOut" class="btn-zoom">-</button>
      <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
      <button @click="zoomIn" class="btn-zoom">+</button>
    </div>
  
</template>

<script>
// Import fabric.js - it will be available as a global variable 'fabric'
import 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Set the worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default {
  name: 'PdfViewer',
  props: {
    pdfUrl: {
      type: String,
      default: '/sample.pdf'
    }
  },
  data() {
    return {
      // PDF state
      pdfDoc: null,
      totalPages: 0,
      currentPage: 1,
      renderedPages: [],
      loading: true,
      scale: 1.5,
      
      // Canvas and editing state
      fabricCanvases: {},
      activeCanvas: null,
      selectedObject: null,
      annotations: [],
      selectedAnnotationIndex: null,
      selectedPage: null,
      editingAnnotationIndex: null,
      editingText: '',
      showTextInput: false,
      textInputStyle: {},
      newTextInput: '',
      editingStyle: {},
      
      // Toolbar state
      selectedTool: 'text',
      selectedFont: 'Arial',
      fontSize: 16,
      textColor: '#000000',
      textFormatting: [],
      isDarkMode: false,
      
      // Undo/Redo state
      history: [],
      historyIndex: -1,
      
      // Options for UI
      fontOptions: [
        'Arial', 
        'Times New Roman', 
        'Courier New', 
        'Georgia', 
        'Verdana', 
        'Helvetica'
      ],
      fontSizeOptions: [
        8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64
      ]
    };
  },
  computed: {
    canUndo() {
      return this.historyIndex > 0;
    },
    canRedo() {
      return this.historyIndex < this.history.length - 1;
    }
  },
  mounted() {
    this.loadPdf();
    
    // Check for system dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkMode = true;
    }
    
    // Listen for window resize to adjust canvas sizes
    window.addEventListener('resize', this.resizeCanvases);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeCanvases);
    
    // Clean up fabric canvases
    Object.values(this.fabricCanvases).forEach(canvas => {
      canvas.dispose();
    });
  },
  methods: {
    async loadPdf() {
      try {
        this.loading = true;
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
        this.pdfDoc = await loadingTask.promise;
        this.totalPages = this.pdfDoc.numPages;
        
        // Render the first page
        await this.renderPage(this.currentPage);
        
        this.loading = false;
      } catch (error) {
        console.error('Error loading PDF:', error);
        this.loading = false;
      }
    },
    
    async renderPage(pageNumber) {
      try {
        // Get the page
        const page = await this.pdfDoc.getPage(pageNumber);
        
        // Calculate viewport dimensions
        const viewport = page.getViewport({ scale: this.scale });
        
        // Set up the PDF canvas
        const pdfCanvas = document.getElementById(`pdf-page-${pageNumber}`);
        const pdfContext = pdfCanvas.getContext('2d');
        
        // Set canvas dimensions
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        
        // Render the PDF page
        await page.render({
          canvasContext: pdfContext,
          viewport: viewport
        }).promise;
        
        // Set up the Fabric.js canvas for this page
        this.setupFabricCanvas(pageNumber, viewport.width, viewport.height);
        
        // Add this page to rendered pages if not already there
        if (!this.renderedPages.includes(pageNumber)) {
          this.renderedPages.push(pageNumber);
        }
        
        // Set this as the active canvas
        this.activeCanvas = this.fabricCanvases[pageNumber];
        
        // Save initial state for undo/redo
        this.saveCanvasState();
      } catch (error) {
        console.error(`Error rendering page ${pageNumber}:`, error);
      }
    },
    
    setupFabricCanvas(pageNumber, width, height) {
      // Create a new Fabric.js canvas if it doesn't exist
      if (!this.fabricCanvases[pageNumber]) {
        const fabricCanvas = new window.fabric.Canvas(`fabric-canvas-${pageNumber}`, {
          width: width,
          height: height,
          selection: true,
          preserveObjectStacking: true
        });
        
        // Set up event listeners for this canvas
        fabricCanvas.on('mouse:down', (options) => this.handleCanvasMouseDown(options, pageNumber));
        fabricCanvas.on('object:modified', () => this.saveCanvasState());
        fabricCanvas.on('selection:created', (e) => this.handleObjectSelected(e));
        fabricCanvas.on('selection:updated', (e) => this.handleObjectSelected(e));
        fabricCanvas.on('selection:cleared', () => this.selectedObject = null);
        
        this.fabricCanvases[pageNumber] = fabricCanvas;
      } else {
        // Update dimensions if canvas already exists
        this.fabricCanvases[pageNumber].setWidth(width);
        this.fabricCanvases[pageNumber].setHeight(height);
      }
    },
    
    handleCanvasMouseDown(options, pageNumber) {
      // Only handle clicks on the canvas background (not on objects)
      if (options.target) return;
      
      // Set the active canvas
      this.activeCanvas = this.fabricCanvases[pageNumber];
      
      // Handle different tools
      switch (this.selectedTool) {
        case 'text':
          this.addTextBox(options.pointer.x, options.pointer.y);
          break;
        case 'rectangle':
          this.addRectangle(options.pointer.x, options.pointer.y);
          break;
        case 'highlight':
          this.addHighlight(options.pointer.x, options.pointer.y);
          break;
        case 'arrow':
          this.addArrow(options.pointer.x, options.pointer.y);
          break;
      }
    },
    
    handleObjectSelected(e) {
      this.selectedObject = e.selected[0];
      
      // Update toolbar based on selected object
      if (this.selectedObject && this.selectedObject.type === 'textbox') {
        this.selectedFont = this.selectedObject.fontFamily;
        this.fontSize = this.selectedObject.fontSize;
        this.textColor = this.selectedObject.fill;
        
        // Update text formatting
        this.textFormatting = [];
        if (this.selectedObject.fontWeight === 'bold') this.textFormatting.push('bold');
        if (this.selectedObject.fontStyle === 'italic') this.textFormatting.push('italic');
        if (this.selectedObject.underline) this.textFormatting.push('underline');
      }
    },
    
    addTextBox(x, y) {
      const textbox = new window.fabric.Textbox('Click to edit text', {
        left: x,
        top: y,
        width: 200,
        fontFamily: this.selectedFont,
        fontSize: this.fontSize,
        fill: this.textColor,
        fontWeight: this.textFormatting.includes('bold') ? 'bold' : 'normal',
        fontStyle: this.textFormatting.includes('italic') ? 'italic' : 'normal',
        underline: this.textFormatting.includes('underline'),
        editable: true
      });
      
      this.activeCanvas.add(textbox);
      this.activeCanvas.setActiveObject(textbox);
      textbox.enterEditing();
      this.saveCanvasState();
    },
    
    addRectangle(x, y) {
      const rect = new window.fabric.Rect({
        left: x,
        top: y,
        width: 100,
        height: 50,
        fill: 'rgba(0,0,0,0.1)',
        stroke: this.textColor,
        strokeWidth: 1
      });
      
      this.activeCanvas.add(rect);
      this.activeCanvas.setActiveObject(rect);
      this.saveCanvasState();
    },
    
    addHighlight(x, y) {
      const highlight = new window.fabric.Rect({
        left: x,
        top: y,
        width: 150,
        height: 20,
        fill: 'rgba(255, 255, 0, 0.3)',
        selectable: true,
        hasControls: true
      });
      
      this.activeCanvas.add(highlight);
      this.activeCanvas.setActiveObject(highlight);
      this.saveCanvasState();
    },
    
    addArrow(x, y) {
      // Create an arrow using a line and a triangle
      const line = new window.fabric.Line([x, y, x + 100, y], {
        stroke: this.textColor,
        strokeWidth: 2,
        selectable: true
      });
      
      const triangle = new window.fabric.Triangle({
        left: x + 100,
        top: y,
        width: 10,
        height: 10,
        fill: this.textColor,
        angle: 90,
        originX: 'center',
        originY: 'center'
      });
      
      // Group the line and triangle to form an arrow
      const arrow = new window.fabric.Group([line, triangle], {
        left: x,
        top: y,
        selectable: true,
        hasControls: true
      });
      
      this.activeCanvas.add(arrow);
      this.activeCanvas.setActiveObject(arrow);
      this.saveCanvasState();
    },
    
    applyTextStyle() {
      if (!this.selectedObject || this.selectedObject.type !== 'textbox') return;
      
      this.selectedObject.set({
        fontFamily: this.selectedFont,
        fontSize: this.fontSize,
        fill: this.textColor
      });
      
      this.activeCanvas.renderAll();
      this.saveCanvasState();
    },
    
    toggleBold() {
      if (!this.selectedObject || this.selectedObject.type !== 'textbox') return;
      
      const isBold = this.textFormatting.includes('bold');
      this.selectedObject.set('fontWeight', isBold ? 'normal' : 'bold');
      
      this.activeCanvas.renderAll();
      this.saveCanvasState();
    },
    
    toggleItalic() {
      if (!this.selectedObject || this.selectedObject.type !== 'textbox') return;
      
      const isItalic = this.textFormatting.includes('italic');
      this.selectedObject.set('fontStyle', isItalic ? 'normal' : 'italic');
      
      this.activeCanvas.renderAll();
      this.saveCanvasState();
    },
    
    toggleUnderline() {
      if (!this.selectedObject || this.selectedObject.type !== 'textbox') return;
      
      const isUnderline = this.textFormatting.includes('underline');
      this.selectedObject.set('underline', !isUnderline);
      
      this.activeCanvas.renderAll();
      this.saveCanvasState();
    },
    
    saveCanvasState() {
      // Save current state for undo/redo
      if (this.activeCanvas) {
        // If we're in the middle of the history, remove everything after current index
        if (this.historyIndex < this.history.length - 1) {
          this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        // Add current state to history
        this.history.push(JSON.stringify(this.activeCanvas.toJSON()));
        this.historyIndex = this.history.length - 1;
      }
    },
    
    undo() {
      if (!this.canUndo || !this.activeCanvas) return;
      
      this.historyIndex--;
      this.loadCanvasState();
    },
    
    redo() {
      if (!this.canRedo || !this.activeCanvas) return;
      
      this.historyIndex++;
      this.loadCanvasState();
    },
    
    loadCanvasState() {
      if (this.activeCanvas && this.history[this.historyIndex]) {
        this.activeCanvas.loadFromJSON(JSON.parse(this.history[this.historyIndex]), () => {
          this.activeCanvas.renderAll();
        });
      }
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderPage(this.currentPage);
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.renderPage(this.currentPage);
      }
    },
    
    resizeCanvases() {
      // Resize all fabric canvases when window size changes
      Object.keys(this.fabricCanvases).forEach(pageNumber => {
        const pdfCanvas = document.getElementById(`pdf-page-${pageNumber}`);
        if (pdfCanvas) {
          this.fabricCanvases[pageNumber].setWidth(pdfCanvas.width);
          this.fabricCanvases[pageNumber].setHeight(pdfCanvas.height);
          this.fabricCanvases[pageNumber].renderAll();
        }
      });
    },
    
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    },
    
    async savePdf() {
      try {
        // Show loading state
        this.loading = true;
        
        // Load the original PDF
        const arrayBuffer = await fetch(this.pdfUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        // Process each page with annotations
        for (let pageNumber = 1; pageNumber <= this.totalPages; pageNumber++) {
          if (this.fabricCanvases[pageNumber]) {
            const canvas = this.fabricCanvases[pageNumber];
            
            // Get the PDF page
            const page = pdfDoc.getPage(pageNumber - 1);
            
            // Convert canvas objects to PDF annotations
            const objects = canvas.getObjects();
            
            for (const obj of objects) {
              if (obj.type === 'textbox') {
                // Add text
                page.drawText(obj.text, {
                  x: obj.left,
                  y: page.getHeight() - obj.top - obj.height,
                  size: obj.fontSize,
                  font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                  color: this.hexToRgb(obj.fill)
                });
              } else if (obj.type === 'rect') {
                // Add rectangle
                page.drawRectangle({
                  x: obj.left,
                  y: page.getHeight() - obj.top - obj.height,
                  width: obj.width,
                  height: obj.height,
                  color: this.hexToRgb(obj.fill || '#000000'),
                  opacity: obj.opacity || 1,
                  borderColor: obj.stroke ? this.hexToRgb(obj.stroke) : undefined,
                  borderWidth: obj.strokeWidth || 0
                });
              }
              // Note: Complex objects like arrows would need special handling
            }
          }
        }
        
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        
        // Create a download link
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'edited-document.pdf';
        link.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        this.loading = false;
      } catch (error) {
        console.error('Error saving PDF:', error);
        this.loading = false;
      }
    },
    
    getAnnotationStyle(annotation) {
        // Return the style object for positioning and styling the annotation
        return {
          position: 'absolute',
          left: `${annotation.x}px`,
          top: `${annotation.y}px`,
          color: annotation.color || '#000000',
          fontFamily: annotation.fontFamily || this.selectedFont,
          fontSize: `${annotation.fontSize || this.fontSize}px`,
          fontWeight: annotation.bold ? 'bold' : 'normal',
          fontStyle: annotation.italic ? 'italic' : 'normal',
          textDecoration: annotation.underline ? 'underline' : 'none',
          zIndex: 20
        };
      },
      
      selectAnnotation(index) {
        this.selectedAnnotationIndex = index;
        this.selectedPage = this.currentPage;
      },
      
      deleteAnnotation(index) {
        this.annotations = this.annotations.filter((a, i) => 
          !(i === index && a.page === this.currentPage)
        );
        this.selectedAnnotationIndex = null;
      },
      
      editAnnotation(index) {
        const annotation = this.annotations.find((a, i) => 
          i === index && a.page === this.currentPage
        );
        if (annotation) {
          this.editingAnnotationIndex = index;
          this.editingText = annotation.text;
          this.$nextTick(() => {
            if (this.$refs.editInputRef) {
              this.$refs.editInputRef.focus();
            }
          });
        }
      },
      
      confirmEdit() {
        if (this.editingAnnotationIndex !== null) {
          const index = this.editingAnnotationIndex;
          this.annotations = this.annotations.map((a, i) => {
            if (i === index && a.page === this.currentPage) {
              return { ...a, text: this.editingText };
            }
            return a;
          });
          this.cancelEdit();
        }
      },
      
      cancelEdit() {
        this.editingAnnotationIndex = null;
        this.editingText = '';
      },
    
    hexToRgb(hex) {
      // Convert hex color to rgb for pdf-lib
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? rgb(
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
          )
        : rgb(0, 0, 0);
    }
  }
};
</script>

<style scoped>
.pdf-editor-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  position: relative;
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.pdf-editor-container.dark-mode {
  background-color: #1e1e1e;
  color: #f5f5f5;
}

.pdf-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.pdf-page-container {
  position: relative;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.pdf-page {
  position: absolute;
  top: 0;
  left: 0;
}

.fabric-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.floating-toolbar {
  position: fixed;
  top: 70px;
  left: 20px;
  z-index: 100;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 300px;
  transition: all 0.3s ease;
}

.floating-toolbar.dark-mode {
  background-color: #2d2d2d;
  color: #f5f5f5;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.toolbar-section {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dark-mode .toolbar-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.toolbar-section:last-child {
  border-bottom: none;
}

.toolbar-select {
  min-width: 120px;
}

.toolbar-color-picker {
  max-width: 200px;
}

.toolbar-btn-group {
  display: flex;
  gap: 4px;
}

.save-btn {
  width: 100%;
}

.page-navigation {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;
  transition: all 0.3s ease;
}

.dark-mode .page-navigation {
  background-color: #2d2d2d;
  color: #f5f5f5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dark-mode .loading-overlay {
  background-color: rgba(30, 30, 30, 0.8);
}

.loading-text {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-toolbar {
    top: auto;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: none;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .toolbar-section {
    border-bottom: none;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0 8px;
  }
  
  .dark-mode .toolbar-section {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .toolbar-section:last-child {
    border-right: none;
  }
  
  .toolbar-select {
    min-width: 80px;
  }
}
</style>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const canvas = ref(null)
const pdfBytes = ref(null)
const originalPdfBytes = ref(null)
const pdfDoc = ref(null)
const scale = ref(1.5)
const selectedTool = ref('text')
const textSize = ref(14)
const textColor = ref('#000000')
const fontFamily = ref('Helvetica')

// Multi-page support
const currentPage = ref(0)
const totalPages = ref(1)
const allAnnotations = ref([]) // Array of arrays: [page][annotations]
const selectedAnnotationIndex = ref(-1)
const selectedPage = ref(0)

// Interactive editing state
const showTextInput = ref(false)
const textInputStyle = ref({ left: '0px', top: '0px' })
const newTextInput = ref('')
const textInputRef = ref(null)

// Edit existing annotation
const editingAnnotationIndex = ref(null)
const editingText = ref('')
const editingStyle = ref({ left: '0px', top: '0px' })
const editInputRef = ref(null)

const canvasOffset = ref({ x: 0, y: 0 })

// Computed property for current page annotations
const currentPageAnnotations = computed(() => {
  return allAnnotations.value[currentPage.value] || []
})

onMounted(async () => {
  const pdfUrl = '/sample.pdf'
  const response = await fetch(pdfUrl)
  const originalBuffer = await response.arrayBuffer()

  // Store the original for reset - create a proper copy
  const originalCopy = new ArrayBuffer(originalBuffer.byteLength)
  new Uint8Array(originalCopy).set(new Uint8Array(originalBuffer))
  originalPdfBytes.value = originalCopy

  // Create a copy for working with the PDF
  const bufferCopy = new ArrayBuffer(originalBuffer.byteLength)
  new Uint8Array(bufferCopy).set(new Uint8Array(originalBuffer))
  pdfBytes.value = bufferCopy

  // Load PDF for editing
  pdfDoc.value = await PDFDocument.load(bufferCopy)
  
  // Get total pages - use original buffer directly
  const pdf = await pdfjsLib.getDocument({ data: originalBuffer }).promise
  totalPages.value = pdf.numPages

  // Initialize annotations array for all pages
  allAnnotations.value = Array(totalPages.value).fill(null).map(() => [])

  // Display the PDF
  await renderPdf()
  
  // Calculate canvas offset after rendering
  await nextTick()
  updateCanvasOffset()
})

function updateCanvasOffset() {
  if (canvas.value) {
    const rect = canvas.value.getBoundingClientRect()
    canvasOffset.value = { x: rect.left, y: rect.top }
  }
}

async function renderPdf() {
  if (!pdfBytes.value || pdfBytes.value.byteLength === 0) {
    console.log('No PDF bytes available')
    return
  }

  if (!canvas.value) {
    console.log('Canvas not available yet')
    return
  }

  try {
    // Create a fresh Uint8Array copy to avoid detached buffer issues
    const arrayCopy = new Uint8Array(pdfBytes.value.byteLength)
    arrayCopy.set(new Uint8Array(pdfBytes.value))
    
    const pdf = await pdfjsLib.getDocument({ data: arrayCopy }).promise
    const page = await pdf.getPage(currentPage.value + 1) // pages are 1-indexed in pdf.js

    const viewport = page.getViewport({ scale: scale.value })
    const context = canvas.value.getContext('2d')
    canvas.value.height = viewport.height
    canvas.value.width = viewport.width

    await page.render({ canvasContext: context, viewport }).promise
    
    updateCanvasOffset()
  } catch (error) {
    console.error('Error rendering PDF:', error)
    console.error('PDF bytes available:', pdfBytes.value ? pdfBytes.value.byteLength : 'null')
  }
}

async function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    await renderPdf()
  }
}

async function previousPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    await renderPdf()
  }
}

function handleCanvasClick(event) {
  if (editingAnnotationIndex.value !== null) {
    return // Don't allow new clicks while editing
  }

  if (selectedTool.value === 'delete') {
    selectedAnnotationIndex.value = -1
    selectedPage.value = currentPage.value
    return
  }

  if (selectedTool.value === 'text') {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    textInputStyle.value = {
      left: x + 'px',
      top: y + 'px'
    }

    newTextInput.value = ''
    showTextInput.value = true

    nextTick(() => {
      if (textInputRef.value) {
        textInputRef.value.focus()
      }
    })
  }
}

function handleCanvasMove(event) {
  if (selectedTool.value === 'delete') {
    event.currentTarget.style.cursor = 'crosshair'
  } else if (selectedTool.value === 'text') {
    event.currentTarget.style.cursor = 'text'
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 }
}

function addTextFromInput() {
  if (!newTextInput.value.trim()) {
    showTextInput.value = false
    return
  }

  const color = hexToRgb(textColor.value)
  
  const annotation = {
    text: newTextInput.value,
    x: parseInt(textInputStyle.value.left),
    y: parseInt(textInputStyle.value.top),
    size: textSize.value,
    color: textColor.value,
    fontFamily: fontFamily.value,
    rgb: color,
    style: {
      left: textInputStyle.value.left,
      top: textInputStyle.value.top,
      fontSize: textSize.value + 'px',
      color: textColor.value,
      fontFamily: fontFamily.value
    }
  }
  
  // Initialize array for page if needed
  if (!allAnnotations.value[currentPage.value]) {
    allAnnotations.value[currentPage.value] = []
  }
  
  allAnnotations.value[currentPage.value].push(annotation)

  showTextInput.value = false
  newTextInput.value = ''
}

function cancelTextInput() {
  showTextInput.value = false
  newTextInput.value = ''
}

function selectAnnotation(index) {
  selectedAnnotationIndex.value = index
  selectedPage.value = currentPage.value
}

function editAnnotation(index) {
  const annotation = currentPageAnnotations.value[index]
  if (!annotation) return

  editingAnnotationIndex.value = index
  editingText.value = annotation.text
  editingStyle.value = {
    left: annotation.style.left,
    top: annotation.style.top
  }

  nextTick(() => {
    if (editInputRef.value) {
      editInputRef.value.focus()
      editInputRef.value.select()
    }
  })
}

function confirmEdit() {
  if (editingAnnotationIndex.value !== null && editingText.value.trim()) {
    const annotation = currentPageAnnotations.value[editingAnnotationIndex.value]
    if (annotation) {
      annotation.text = editingText.value
      // Create a new object to trigger reactivity
      allAnnotations.value[currentPage.value] = [...allAnnotations.value[currentPage.value]]
    }
  }
  cancelEdit()
}

function cancelEdit() {
  editingAnnotationIndex.value = null
  editingText.value = ''
}

function deleteAnnotation(index) {
  if (allAnnotations.value[currentPage.value]) {
    allAnnotations.value[currentPage.value].splice(index, 1)
    // Trigger reactivity
    allAnnotations.value[currentPage.value] = [...allAnnotations.value[currentPage.value]]
  }
  selectedAnnotationIndex.value = -1
}

function getFontName(fontFamily) {
  const fontMap = {
    'Helvetica': StandardFonts.Helvetica,
    'Times-Roman': StandardFonts.TimesRoman,
    'Courier': StandardFonts.Courier
  }
  return fontMap[fontFamily] || StandardFonts.Helvetica
}

async function savePdf() {
  if (!pdfDoc.value) return

  // Reload the original PDF to start fresh
  const workingDoc = await PDFDocument.load(originalPdfBytes.value)

  // Process all pages
  for (let pageIndex = 0; pageIndex < totalPages.value; pageIndex++) {
    const page = workingDoc.getPages()[pageIndex]
    const pageAnnotations = allAnnotations.value[pageIndex] || []
    
    if (pageAnnotations.length === 0) continue

    // Embed fonts
    const helvetica = await workingDoc.embedFont(StandardFonts.Helvetica)
    const timesRoman = await workingDoc.embedFont(StandardFonts.TimesRoman)
    const courier = await workingDoc.embedFont(StandardFonts.Courier)

    const { height } = page.getSize()

    // We need to get the canvas dimensions for this page
    // For simplicity, we'll use a standard ratio
    const pdfWidth = page.getWidth()
    const pdfHeight = height

    for (const annotation of pageAnnotations) {
      // Note: This is approximate since we don't store exact canvas dimensions per page
      // In a production app, you'd want to store canvas dimensions with each annotation
      const pdfX = (annotation.x / canvas.value.width) * pdfWidth
      const pdfY = pdfHeight - ((annotation.y / canvas.value.height) * pdfHeight)
      
      // Get the appropriate font
      let font = helvetica
      if (annotation.fontFamily === 'Times-Roman') font = timesRoman
      if (annotation.fontFamily === 'Courier') font = courier
      
      const colorObj = annotation.rgb
      
      page.drawText(annotation.text, {
        x: pdfX,
        y: pdfY,
        size: annotation.size,
        font,
        color: rgb(colorObj.r, colorObj.g, colorObj.b),
      })
    }
  }

  const newPdfBytes = await workingDoc.save()
  const blob = new Blob([newPdfBytes], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'edited-document.pdf'
  link.click()
}

async function resetPdf() {
  if (!originalPdfBytes.value) return

  // Create a deep copy of the original buffer
  const bufferCopy = new ArrayBuffer(originalPdfBytes.value.byteLength)
  new Uint8Array(bufferCopy).set(new Uint8Array(originalPdfBytes.value))
  
  pdfBytes.value = bufferCopy
  pdfDoc.value = await PDFDocument.load(bufferCopy)
  allAnnotations.value = Array(totalPages.value).fill(null).map(() => [])
  selectedAnnotationIndex.value = -1
  showTextInput.value = false
  editingAnnotationIndex.value = null
  currentPage.value = 0
  await renderPdf()
}

async function zoomIn() {
  if (scale.value < 3) {
    scale.value += 0.25
    await renderPdf()
  }
}

async function zoomOut() {
  if (scale.value > 0.5) {
    scale.value -= 0.25
    await renderPdf()
  }
}
</script>

<style scoped>
.pdf-viewer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f9f9fa 0%, #f3f3f3 100%);
  min-height: 100vh;
}

.toolbar {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  background: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  align-items: center;
  width: 100%;
  max-width: 1400px;
}

.toolbar-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.tool-select {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
}

.tool-select:focus {
  outline: none;
  border-color: #1976d2;
}

.page-info {
  padding: 8px 12px;
  background: #e3f2fd;
  border-radius: 6px;
  font-weight: 600;
  color: #1976d2;
}

.coord-input {
  width: 70px;
  padding: 8px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.coord-input:focus {
  outline: none;
  border-color: #1976d2;
}

.font-select {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.font-select:focus {
  outline: none;
  border-color: #1976d2;
}

.color-input {
  width: 50px;
  height: 40px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
}

.btn-nav, .btn-save, .btn-reset {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-nav {
  background: #667eea;
  color: white;
}

.btn-nav:hover:not(:disabled) {
  background: #764ba2;
  transform: translateY(-2px);
}

.btn-nav:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-save {
  background: #4caf50;
  color: white;
}

.btn-save:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.btn-reset {
  background: #ff9800;
  color: white;
}

.btn-reset:hover {
  background: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
}

.canvas-wrapper {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
  display: inline-block;
}

canvas {
  border: 1px solid #ccc;
  border-radius: 8px;
  display: block;
}

.annotation {
  position: absolute;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 4px;
}

.annotation:hover {
  border-color: #1976d2;
  background: rgba(255, 255, 255, 1);
}

.annotation.selected {
  border-color: #1976d2;
  background: #e3f2fd;
  box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
  z-index: 5;
}

.annotation-text {
  pointer-events: none;
}

.delete-btn, .edit-btn {
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0.8;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.delete-btn:hover {
  background: #d32f2f;
  transform: scale(1.1);
  opacity: 1;
}

.edit-btn {
  background: #2196F3;
  color: white;
}

.edit-btn:hover {
  background: #1976d2;
  transform: scale(1.1);
  opacity: 1;
}

.text-input-overlay {
  position: absolute;
  z-index: 10;
}

.inline-text-input {
  padding: 6px 10px;
  border: 2px solid #1976d2;
  border-radius: 4px;
  font-size: 16px;
  min-width: 150px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.inline-text-input:focus {
  outline: none;
  box-shadow: 0 6px 12px rgba(25, 118, 210, 0.3);
}

.annotation-edit-overlay {
  position: absolute;
  z-index: 15;
}

.annotation-edit-input {
  padding: 4px 8px;
  border: 2px solid #2196F3;
  border-radius: 4px;
  font-size: inherit;
  background: white;
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
  min-width: 100px;
}

.annotation-edit-input:focus {
  outline: none;
  box-shadow: 0 6px 12px rgba(33, 150, 243, 0.4);
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 10px 20px;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-zoom {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #667eea;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-zoom:hover {
  background: #764ba2;
  transform: scale(1.1);
}

.zoom-level {
  font-weight: 600;
  color: #667eea;
  min-width: 60px;
  text-align: center;
}
</style>
