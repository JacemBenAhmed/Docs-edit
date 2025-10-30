<template>
  <div class="menubar-gdocs">
    <!-- Undo/Redo -->
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

    <!-- Font Family -->
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

    <!-- Font Size -->
    <select
      v-model="fontSize"
      @change="setFontSize"
      class="gd-select size-select"
      title="Font Size"
    >
      <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
    </select>

    <div class="toolbar-divider"></div>

    <!-- Formatting Buttons -->
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

    <!-- Text Color -->
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

    <div class="toolbar-divider"></div>

    <!-- Insert -->
    <div class="toolbar-group">
      <button class="gd-icon-btn" title="Insert link" @click="insertLink" :disabled="!editor">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </button>
      <button class="gd-icon-btn" title="Insert image" @click="insertImage" :disabled="!editor">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </button>
      <button class="gd-icon-btn" title="Insert text box" @click="insertTextBox" :disabled="!editor">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 6H3"/>
          <path d="M21 12H8"/>
          <path d="M21 18H8"/>
          <path d="M3 12v6"/>
        </svg>
      </button>
    </div>

    <div class="toolbar-divider"></div>

    <!-- Export PDF -->
    <button class="export-pdf-btn" title="Export as PDF" @click="exportToPDF" :disabled="!editor">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6"/>
        <path d="M12 18v-6"/>
        <path d="m9 15 3 3 3-3"/>
      </svg>
      <span class="export-text">PDF</span>
    </button>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useEditor } from '@tiptap/vue-3'

const props = defineProps({ editor: Object })
const editor = computed(() => props.editor)

const fontFamily = ref('Inter')
const fontSize = ref('18')
const textColor = ref('#000000')
const highlightColor = ref('#ffff00')
const showTextColorPicker = ref(false)
const showHighlightPicker = ref(false)

const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72, 96]

// Watch editor changes
watch(editor, (ed) => {
  if (!ed) return
  const attrs = ed.getAttributes('textStyle')
  fontFamily.value = attrs.fontFamily || 'Inter'
  fontSize.value = attrs.fontSize?.replace('px', '') || '18'
  textColor.value = ed.getAttributes('color')?.color || '#000000'
  highlightColor.value = attrs.backgroundColor || '#ffff00'
}, { immediate: true })

// Actions
function setFontFamily() {
  if (!editor.value) return
  // Use the setFontFamily command from FontFamily extension
  editor.value.chain().focus().setFontFamily(fontFamily.value).run()
}

function setFontSize() {
  if (!editor.value) return
  // Use the setFontSize command from custom FontSize extension
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
function performUndo() {
  editor.value?.chain().focus().undo().run()
}

function performRedo() {
  editor.value?.chain().focus().redo().run()
}

function insertLink() {
  const url = prompt('Enter URL:')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  }
}

function insertImage() {
  const url = prompt('Enter image URL:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

function insertTextBox() {
  // Insert a styled div that acts as a text box
  editor.value?.chain().focus().insertContent(
    '<div style="border: 2px solid #e5e7eb; padding: 12px; margin: 8px 0; border-radius: 4px; background: #f9fafb;">Text box content</div>'
  ).run()
}

function exportToPDF() {
  if (!editor.value) return
  
  // Get the HTML content from the editor
  const content = editor.value.getHTML()
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600')
  
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Arial&family=Georgia&family=Courier+New&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 0.75in;
    }
    
    body {
      font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      font-size: 18px;
      line-height: 1.7;
      color: #202124;
      padding: 0;
      margin: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
    
    p {
      margin: 0.5em 0;
      min-height: 1.2em;
    }
    
    span[style] {
      display: inline;
    }
    
    span[style*="color"],
    span[style*="background-color"] {
      display: inline;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  </style>
</head>
<body>${content}</body>
</html>`
  
  printWindow.document.write(htmlContent)
  
  printWindow.document.close()
  
  // Wait for content to load, then trigger print dialog
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}

// Button Groups
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

// Icons (SVG)
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
/* Google Docs-style Menu Bar */
.menubar-gdocs {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  background: #ffffff;
  border-bottom: 1px solid #e8eaed;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.05);
  overflow-x: auto;
  user-select: none;
}

/* Toolbar Groups */
.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

/* Toolbar Divider */
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
  width: 32px;
  height: 32px;
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
  height: 3px;
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
  z-index: 9999;
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
  height: 32px;
  padding: 0 24px 0 10px;
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

/* Export PDF Button */
.export-pdf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 4px;
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3);
}

.export-pdf-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1557b0 0%, #1a73e8 100%);
  box-shadow: 0 2px 4px 0 rgba(26, 115, 232, 0.4);
  transform: translateY(-1px);
}

.export-pdf-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3);
}

.export-pdf-btn:disabled {
  background: #e8eaed;
  color: #80868b;
  cursor: not-allowed;
  box-shadow: none;
}

.export-pdf-btn svg {
  display: block;
}

.export-text {
  font-weight: 600;
  letter-spacing: 0.3px;
}
</style>