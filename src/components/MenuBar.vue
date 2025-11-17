<template>
  <div class="menubar-container">
    <!-- Top Row: File and Insert Menus -->
    <div class="menu-row">
      <div class="menu-group">
        <!-- File Menu -->
        <div class="dropdown-menu">
          <button class="menu-btn" @click="toggleFileMenu" type="button">
            File
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div v-if="showFileMenu" class="dropdown-content" @mouseleave="showFileMenu = false">
            <button @click="exportToPDF" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6"/>
              </svg>
              Download as PDF
            </button>
            <button @click="exportToWord" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6"/>
              </svg>
              Download as Word
            </button>
            <div class="dropdown-divider"></div>
            <button @click="printDocument" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Print
            </button>
            <div class="dropdown-divider"></div>
            <button  class="dropdown-item">
              <i class="mdi mdi-content-save"></i>
              Save
            </button>
          </div>
        </div>

        <!-- Insert Menu -->
        <div class="dropdown-menu">
          <button class="menu-btn" @click="toggleInsertMenu" type="button">
            Insert
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div v-if="showInsertMenu" class="dropdown-content" @mouseleave="showInsertMenu = false">
            <input 
              ref="imageInput" 
              type="file" 
              accept="image/*" 
              @change="handleImageUpload" 
              style="display: none;"
            />
            <button @click="triggerImageUpload" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              Image
            </button>
            <button @click="insertTable" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="3" y1="15" x2="21" y2="15"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
                <line x1="15" y1="3" x2="15" y2="21"/>
              </svg>
              Table
            </button>
            <button @click="insertLink" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Link
            </button>
            <button @click="insertTextBox" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 6H3"/>
                <path d="M21 12H8"/>
                <path d="M21 18H8"/>
                <path d="M3 12v6"/>
              </svg>
              Text Box
            </button>
            <div class="dropdown-divider"></div>
            <button @click="insertDrawing" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/>
                <path d="M9 18h1.3M3 22l3-7 6 6-7 3z"/>
              </svg>
              Drawing
            </button>
          </div>
        </div>

        <!-- Share Menu -->
        <div class="dropdown-menu">
          <button class="menu-btn" @click="toggleShareMenu" type="button">
            <i class="mdi mdi-share-variant" style="font-size:14px"></i>
            <span style="margin-left:6px">Share</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div v-if="showShareMenu" class="dropdown-content" @mouseleave="showShareMenu = false">
            <button class="dropdown-item" @click="openShare">
              <i class="mdi mdi-account-multiple" style="margin-right:8px"></i>
              Share with…
            </button>
          </div>
        </div>

        <!-- Tools Menu -->
        <div class="dropdown-menu">
          <button class="menu-btn" @click="toggleToolsMenu" type="button">
            <i class="mdi mdi-robot" style="font-size:14px"></i>
            <span style="margin-left:6px">Tools</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div v-if="showToolsMenu" class="dropdown-content" @mouseleave="showToolsMenu = false">
            <button class="dropdown-item" @click="runToolLocal('Grammar Correction')">
              <i class="mdi mdi-spellcheck" style="margin-right:8px"></i>
              Grammar Correction
            </button>
            <button class="dropdown-item" @click="runToolLocal('Syntax Error Detection')">
              <i class="mdi mdi-code-tags" style="margin-right:8px"></i>
              Syntax Error Detection
            </button>
            <button class="dropdown-item" @click="runToolLocal('Style Improvements')">
              <i class="mdi mdi-format-letter-case" style="margin-right:8px"></i>
              Style Improvements
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Formatting Tools -->
    <div class="menubar-gdocs">
      <div class="toolbar-group">
      <button class="gd-icon-btn" title="Undo" @click="performUndo" :disabled="!editor">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7v6h6"/>
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
        </svg>
      </button>
      <button class="gd-icon-btn" title="Redo" @click="performRedo" :disabled="!editor">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 7v6h-6"/>
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
        </svg>
      </button>
    </div>

    <div class="toolbar-divider"></div>

    <select
      v-model="fontFamily"
      @change="setFontFamily"
      class="gd-select font-select"
      title="Font"
    >
      <option value="Inter">Inter</option>
      <option value="Arial">Arial</option>
      <option value="Helvetica">Helvetica</option>
      <option value="Georgia">Georgia</option>
      <option value="Times New Roman">Times New Roman</option>
      <option value="Courier New">Courier New</option>
      <option value="Verdana">Verdana</option>
    </select>

    <select
      v-model="fontSize"
      @change="setFontSize"
      class="gd-select size-select"
      title="Font Size"
    >
      <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
    </select>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <button
        v-for="btn in formattingButtons"
        :key="btn.label"
        :title="btn.label"
        @click="btn.action()"
        :class="['gd-icon-btn', btn.isActive() && 'is-active']"
        :disabled="!editor"
      >
        <span v-html="btn.icon"></span>
      </button>
    </div>

    <div class="toolbar-divider"></div>

    
    <div class="toolbar-group">
      <div class="color-picker-wrapper">
        <button 
          @click="showTextColorPicker = !showTextColorPicker"
          class="gd-icon-btn color-btn"
          title="Text color"
          :disabled="!editor"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/>
            <path d="M9 18h1.3M3 22l3-7 6 6-7 3z"/>
          </svg>
          <div class="color-indicator" :style="{ backgroundColor: textColor }"></div>
        </button>
        <div v-if="showTextColorPicker" @mouseleave="showTextColorPicker = false" class="color-dropdown">
          <input type="color" v-model="textColor" @change="setTextColor" class="color-picker-input" />
        </div>
      </div>

      <div class="color-picker-wrapper">
        <button 
          @click="showHighlightPicker = !showHighlightPicker"
          class="gd-icon-btn color-btn"
          title="Highlight color"
          :disabled="!editor"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 11-6 6v3h9l3-3"/>
            <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>
          </svg>
          <div class="color-indicator" :style="{ backgroundColor: highlightColor }"></div>
        </button>
        <div v-if="showHighlightPicker" @mouseleave="showHighlightPicker = false" class="color-dropdown">
          <input type="color" v-model="highlightColor" @change="setHighlightColor" class="color-picker-input" />
        </div>
      </div>
    </div>

    <div class="toolbar-divider"></div>

    <!-- Alignment -->
    <div class="toolbar-group">
      <button
        v-for="btn in alignButtons"
        :key="btn.label"
        :title="btn.label"
        @click="btn.action()"
        :class="['gd-icon-btn', btn.isActive() && 'is-active']"
        :disabled="!editor"
      >
        <span v-html="btn.icon"></span>
      </button>
    </div>
    </div>

    <!-- Table Modal -->
    <div v-if="showTableModal" class="modal-overlay" @click="closeTableModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Insert Table</h3>
          <button class="modal-close" @click="closeTableModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="input-group">
            <label>Rows:</label>
            <input 
              type="number" 
              v-model.number="tableRows" 
              min="1" 
              max="20" 
              class="table-input"
            />
          </div>
          
          <div class="input-group">
            <label>Columns:</label>
            <input 
              type="number" 
              v-model.number="tableColumns" 
              min="1" 
              max="10" 
              class="table-input"
            />
          </div>
          
          <div class="table-preview-container">
            <p class="preview-label">Preview:</p>
            <div class="table-preview">
              <table class="preview-table">
                <tr v-for="row in tableRows" :key="row">
                  <td v-for="col in tableColumns" :key="col"></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeTableModal">Cancel</button>
          <button class="modal-btn add-btn" @click="addTable">Add Table</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import html2pdf from 'html2pdf.js'

const props = defineProps({ editor: Object })
const editor = computed(() => props.editor)

const fontFamily = ref('Inter')
const fontSize = ref('18')
const textColor = ref('#000000')
const highlightColor = ref('#ffff00')
const showTextColorPicker = ref(false)
const showHighlightPicker = ref(false)
const imageInput = ref(null)
const showFileMenu = ref(false)
const showInsertMenu = ref(false)
const showShareMenu = ref(false)
const showToolsMenu = ref(false)
const showTableModal = ref(false)
const tableRows = ref(3)
const tableColumns = ref(3)

const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36,40, 48, 72, 96]

const emit = defineEmits(['open-share','run-tool','open-draw'])

function toggleShareMenu() {
  showShareMenu.value = !showShareMenu.value
  showToolsMenu.value = false
  showFileMenu.value = false
}

function toggleToolsMenu() {
  showToolsMenu.value = !showToolsMenu.value
  showShareMenu.value = false
  showFileMenu.value = false
}

function openShare() {
  showShareMenu.value = false
  emit('open-share')
}

function runToolLocal(name) {
  showToolsMenu.value = false
  emit('run-tool', name)
}

watch(editor, (ed) => {
  if (!ed) return
  const attrs = ed.getAttributes('textStyle')
  fontFamily.value = attrs.fontFamily || 'Inter'
  fontSize.value = attrs.fontSize?.replace('px', '') || '18'
  textColor.value = ed.getAttributes('color')?.color || '#000000'
  highlightColor.value = attrs.backgroundColor || '#ffff00'
}, { immediate: true })

function setFontFamily() {
  if (!editor.value) return
  editor.value.chain().focus().setFontFamily(fontFamily.value).run()
}

function setFontSize() {
  if (!editor.value) return
  editor.value.chain().focus().setFontSize(fontSize.value + 'px').run()
}

function setTextColor() {
  if (!editor.value) return
  const { from, to } = editor.value.state.selection
  const selectedText = editor.value.state.doc.textBetween(from, to, '')
  
  if (selectedText) {
    editor.value
      .chain()
      .focus()
      .deleteSelection()
      .insertContent(`<span style="color: ${textColor.value};">${selectedText}</span>`)
      .run()
  }
  showTextColorPicker.value = false
}

function setHighlightColor() {
  if (!editor.value) return
  const { from, to } = editor.value.state.selection
  const selectedText = editor.value.state.doc.textBetween(from, to, '')
  
  if (selectedText) {
    editor.value
      .chain()
      .focus()
      .deleteSelection()
      .insertContent(`<span style="background-color: ${highlightColor.value};">${selectedText}</span>`)
      .run()
  }
  showHighlightPicker.value = false
}
function toggleFileMenu() {
  showFileMenu.value = !showFileMenu.value
  showInsertMenu.value = false
}

function toggleInsertMenu() {
  showInsertMenu.value = !showInsertMenu.value
  showFileMenu.value = false
}

function performUndo() {
  editor.value?.chain().focus().undo().run()
}

function performRedo() {
  editor.value?.chain().focus().redo().run()
}

function printDocument() {
  showFileMenu.value = false
  window.print()
}

function insertLink() {
  showInsertMenu.value = false
  const url = prompt('Enter URL:')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  }
}

function triggerImageUpload() {
  showInsertMenu.value = false
  imageInput.value?.click()
}

function insertTable() {
  showInsertMenu.value = false
  showTableModal.value = true
}

function closeTableModal() {
  showTableModal.value = false
  tableRows.value = 3
  tableColumns.value = 3
}

function addTable() {
  if (!editor.value) return
  
  try {
    // Initialize empty cell data
    const cellData = Array.from({ length: tableRows.value }, () => 
      Array(tableColumns.value).fill('')
    )
    
    // Insert custom table node
    editor.value.chain().focus().insertContent({
      type: 'tableHTML',
      attrs: {
        rows: tableRows.value,
        cols: tableColumns.value,
        cellData: cellData
      }
    }).run()
    
    closeTableModal()
  } catch (error) {
    console.error('Error inserting table:', error)
    alert('Error inserting table. Please refresh the page and try again.')
  }
}

function insertDrawing() {
  showInsertMenu.value = false
  emit('open-draw')
}

function handleImageUpload(event) {
  const file = event.target.files?.[0]
  if (!file || !editor.value) return
  
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }
  
  // Check file size (limit to 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB')
    return
  }
  
  // Convert image to base64 for embedding
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target.result
    editor.value.chain().focus().setImage({ 
      src: base64,
      alt: file.name,
      title: file.name
    }).run()
    
    // Show success message
    console.log('Image inserted successfully! Drag to move, Shift+Drag to resize.')
  }
  reader.onerror = () => {
    alert('Error reading image file')
  }
  reader.readAsDataURL(file)
  
  // Reset input to allow selecting the same file again
  event.target.value = ''
}

function insertTextBox() {
  showInsertMenu.value = false
  editor.value?.chain().focus().insertContent(
    '<div style="border: 2px solid #e5e7eb; padding: 12px; margin: 8px 0; border-radius: 4px; background: #f9fafb;">Text box content</div>'
  ).run()
}

async function exportToPDF() {
  showFileMenu.value = false
  if (!editor.value) return
  
  const content = editor.value.getHTML()
  
  const wrapper = document.createElement('div')
  wrapper.innerHTML = content
  wrapper.style.fontFamily = 'Inter, Arial, sans-serif'
  wrapper.style.fontSize = '18px'
  wrapper.style.lineHeight = '1.7'
  wrapper.style.color = '#202124'
  wrapper.style.padding = '40px'
  wrapper.style.background = 'white'
  wrapper.style.width = '210mm'
  wrapper.style.minHeight = '297mm'
  
  const opt = {
    margin: [15, 15, 15, 15],
    filename: 'document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait'
    }
  }
  
  try {
    await html2pdf().set(opt).from(wrapper).save()
  } catch (error) {
    console.error('PDF export error:', error)
    alert('Error generating PDF. Please try again.')
  }
}

function exportToWord() {
  showFileMenu.value = false
  if (!editor.value) return
  
  const content = editor.value.getHTML()
  
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Document</title>
        <style>
          body {
            font-family: 'Calibri', 'Inter', Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000000;
          }
          p {
            margin: 0 0 10pt 0;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          span[style*="color"] {
            color: inherit;
          }
          span[style*="background-color"] {
            background-color: inherit;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `
  
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  })
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'document.doc'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const formattingButtons = [
  { label: 'Bold', icon: boldIcon, action: () => editor.value.chain().focus().toggleBold().run(), isActive: () => editor.value?.isActive?.('bold') },
  { label: 'Italic', icon: italicIcon, action: () => editor.value.chain().focus().toggleItalic().run(), isActive: () => editor.value?.isActive?.('italic') },
  { label: 'Underline', icon: underlineIcon, action: () => editor.value.chain().focus().toggleUnderline().run(), isActive: () => editor.value?.isActive?.('underline') },
  { label: 'Strikethrough', icon: strikeIcon, action: () => editor.value.chain().focus().toggleStrike().run(), isActive: () => editor.value?.isActive?.('strike') },
]

const alignButtons = [
  { label: 'Align Left', icon: alignLeftIcon, action: () => editor.value.chain().focus().setTextAlign('left').run(), isActive: () => editor.value?.isActive?.({ textAlign: 'left' }) },
  { label: 'Align Center', icon: alignCenterIcon, action: () => editor.value.chain().focus().setTextAlign('center').run(), isActive: () => editor.value?.isActive?.({ textAlign: 'center' }) },
  { label: 'Align Right', icon: alignRightIcon, action: () => editor.value.chain().focus().setTextAlign('right').run(), isActive: () => editor.value?.isActive?.({ textAlign: 'right' }) },
  { label: 'Align Justify', icon: alignJustifyIcon, action: () => editor.value.chain().focus().setTextAlign('justify').run(), isActive: () => editor.value?.isActive?.({ textAlign: 'justify' }) },
]

const boldIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>`
const italicIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 4h-9m4 16H5m9-16L9 20"></path></svg>`
const underlineIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3m-6 15h6"></path></svg>`
const strikeIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17.5 10.5a6.5 6.5 0 0 0-11-5m11 5a6.5 6.5 0 0 1-11 5m11-5H3"></path></svg>`
const alignLeftIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>`
const alignCenterIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>`
const alignRightIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>`
const alignJustifyIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>`
</script>

<style scoped>
/* Container for both rows */
.menubar-container {
  background: #ffffff;
  border-bottom: 1px solid #e8eaed;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.05);
  user-select: none;
  overflow: visible; /* allow dropdowns and color pickers to escape */
  position: relative;
  z-index: 10001; /* keep menubar above document content */
}

/* Top Row - File/Insert Menus */
.menu-row {
  display: flex;
  align-items: center;
  padding: 12px 18px;
  border-bottom: 2px solid #e8eaed;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  box-shadow: 0 1px 3px rgba(60, 64, 67, 0.08);
}

/* Bottom Row - Formatting Tools */
.menubar-gdocs {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: #ffffff;
  overflow-x: auto;
}

/* Dropdown Menu Styles */
.menu-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-menu {
  position: relative;
  display: inline-block;
}

.menu-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: 2px solid #e8eaed;
  border-radius: 6px;
  background: #ffffff;
  color: #202124;
  font-family: 'Roboto', 'Arial', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(60, 64, 67, 0.15);
  letter-spacing: 0.3px;
}

.menu-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #dadce0;
  box-shadow: 0 2px 6px rgba(60, 64, 67, 0.2);
  transform: translateY(-1px);
}

.menu-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(60, 64, 67, 0.15);
  background: #f1f3f4;
}

.menu-btn:disabled {
  background: #f5f5f5;
  color: #80868b;
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

.menu-btn svg {
  stroke: #202124;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 220px;
  background: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 6px 0;
  animation: dropdownFadeIn 150ms ease-out;
}
.color-dropdown {
  z-index: 10050 !important; /* ensure color picker shows above everything */
}

.dropdown-content {
  z-index: 10050; /* make dropdowns appear above editor content and fixed toolbar */
}

@keyframes dropdownFadeIn {
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
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: #3c4043;
  font-family: 'Roboto', 'Arial', sans-serif;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-item:hover {
  background-color: #f1f3f4;
}

.dropdown-item svg {
  flex-shrink: 0;
  color: #5f6368;
}

.dropdown-divider {
  height: 1px;
  background-color: #e8eaed;
  margin: 6px 0;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background-color: #dadce0;
  margin: 0 6px;
}

/* Icon Button - Google Docs Style */
.gd-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #444746;
  cursor: pointer;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), 
              color 150ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.gd-icon-btn:hover:not(:disabled) {
  background-color: #f1f3f4;
}

.gd-icon-btn:active:not(:disabled) {
  background-color: #e8eaed;
}

.gd-icon-btn.is-active {
  background-color: #d3e3fd;
  color: #1a73e8;
}

.gd-icon-btn:disabled {
  color: #c4c7c5;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Color Picker Wrapper */
.color-picker-wrapper {
  position: relative;
  display: inline-block;
  z-index: 2000;
}

/* Color Button with Indicator */
.color-btn {
  position: relative;
}

.color-indicator {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 28px;
  border-radius: 1px;
}

/* Color Dropdown */
.color-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  padding: 8px;
  background: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  min-width: 140px;
}

.color-picker-input {
  width: 120px;
  height: 32px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  cursor: pointer;
}

.color-picker-input:hover {
  border-color: #5f6368;
}

/* Select Dropdowns - Google Docs Style */
.gd-select {
  height: 36px;
  padding: 0 28px 0 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: #3c4043;
  font-family: 'Roboto', 'Arial', sans-serif;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
              border-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23444746' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
}

.gd-select:hover {
  background-color: #f1f3f4;
  border-color: transparent;
}

.gd-select:focus {
  outline: none;
  background-color: #f1f3f4;
  border-color: #d2e3fc;
}

.gd-select option {
  background: #ffffff;
  color: #3c4043;
  padding: 8px;
}

/* Font Select Widths */
.font-select {
  min-width: 140px;
}

.size-select {
  width: 70px;
  min-width: 70px;
}

/* Scrollbar */
.menubar-gdocs::-webkit-scrollbar {
  height: 8px;
}

.menubar-gdocs::-webkit-scrollbar-track {
  background: transparent;
}

.menubar-gdocs::-webkit-scrollbar-thumb {
  background: #dadce0;
  border-radius: 4px;
}

.menubar-gdocs::-webkit-scrollbar-thumb:hover {
  background: #bdc1c6;
}

/* Ensure SVG icons have proper sizing */
.gd-icon-btn svg {
  display: block;
}

/* Table Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10002;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  animation: modalSlideIn 250ms ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 2px solid #e8eaed;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #202124;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #5f6368;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  transition: all 150ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #f1f3f4;
  color: #202124;
}

.modal-body {
  padding: 24px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #3c4043;
  margin-bottom: 8px;
}

.table-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e8eaed;
  border-radius: 6px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  transition: all 200ms ease;
}

.table-input:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}

.table-preview-container {
  margin-top: 24px;
}

.preview-label {
  font-size: 14px;
  font-weight: 600;
  color: #3c4043;
  margin-bottom: 12px;
}

.table-preview {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e8eaed;
  overflow: auto;
  max-height: 300px;
}

.preview-table {
  border-collapse: collapse;
  width: 100%;
  border: 2px solid #000000;
  background: #ffffff;
}

.preview-table td {
  border: 1px solid #000000;
  padding: 10px;
  min-width: 60px;
  min-height: 40px;
  text-align: center;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 2px solid #e8eaed;
  background: #f8f9fa;
  justify-content: flex-end;
}

.modal-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
  letter-spacing: 0.3px;
}

.cancel-btn {
  background: #ffffff;
  color: #5f6368;
  border: 2px solid #dadce0;
}

.cancel-btn:hover {
  background: #f1f3f4;
  border-color: #bdc1c6;
}

.add-btn {
  background: linear-gradient(135deg, #4285f4 0%, #5a9ff5 100%);
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(66, 133, 244, 0.3);
}

.add-btn:hover {
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
  box-shadow: 0 4px 8px rgba(66, 133, 244, 0.4);
  transform: translateY(-1px);
}

.add-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(66, 133, 244, 0.3);
}
</style>