<template>
  <div class="flex flex-row items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-white via-blue-50 to-white shadow-lg rounded-xl border border-blue-100 select-none overflow-x-auto justify-center mx-auto backdrop-blur-sm">
    <!-- Text styles -->
    <button v-for="btn in formattingButtons" :key="btn.label" :title="btn.label"
      @click="editor && btn.action && btn.action()"
      :class="toolbarBtn(btn.isActive && editor && btn.isActive())"
      :disabled="!editor"
    >
      <span v-html="btn.icon"></span>
    </button>
    <!-- Headings dropdown -->
    <div class="relative ml-2">
      <button @click="showHeadings = !showHeadings"
        :class="toolbarBtn(false) + ' min-w-[48px] flex justify-center items-center gap-1'">
        <svg viewBox="0 0 24 24" width="22" height="22" class="inline"><text x="1" y="17" font-size="17" font-weight="bold">H</text></svg>
        <svg class="inline" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 9l6 6 6-6"/></svg>
      </button>
      <div v-if="showHeadings" @mouseleave="showHeadings = false" class="absolute left-0 z-10 mt-2 w-28 bg-white border border-blue-200 rounded-lg shadow-xl overflow-hidden">
        <button v-for="h in [1,2,3]" :key="h" @click="setHeading(h); showHeadings=false"
          type="button" class="w-full px-4 py-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white text-left font-medium transition-all duration-200">
          H{{h}}
        </button>
      </div>
    </div>
    <!-- Lists -->
    <button v-for="btn in listButtons" :key="btn.label" :title="btn.label"
      @click="editor && btn.action && btn.action()"
      :class="toolbarBtn(btn.isActive && editor && btn.isActive())"
      :disabled="!editor"
    >
      <span v-html="btn.icon"></span>
    </button>
    <!-- Alignment -->
    <button v-for="btn in alignButtons" :key="btn.label" :title="btn.label"
      @click="editor && btn.action && btn.action()"
      :class="toolbarBtn(btn.isActive && editor && btn.isActive())"
      :disabled="!editor"
    >
      <span v-html="btn.icon"></span>
    </button>
    <!-- Link, Undo, Redo -->
    <button v-for="btn in miscButtons" :key="btn.label" :title="btn.label"
      @click="editor && btn.action && btn.action()"
      :class="toolbarBtn(btn.isActive && editor && btn.isActive())"
      :disabled="!editor"
    >
      <span v-html="btn.icon"></span>
    </button>
    <!-- Spacer then Font Size and Colors -->
    <span class="mx-2"></span>
    <select v-model="fontSize" class="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 mr-2 bg-white hover:border-blue-300 shadow hover:shadow-md cursor-pointer" style="width:80px;" title="Font Size">
      <option value="16">16px</option>
      <option value="20">20px</option>
      <option value="24">24px</option>
      <option value="32">32px</option>
    </select>
    <input type="color" v-model="color" @input="changeColor" class="w-9 h-9 border-2 border-gray-200 rounded-lg mx-1 cursor-pointer hover:border-blue-400 transition-all duration-200 shadow hover:shadow-md" title="Text Color" />
    <input type="color" v-model="bgColor" @input="changeBgColor" class="w-9 h-9 border-2 border-gray-200 rounded-lg mx-1 cursor-pointer hover:border-blue-400 transition-all duration-200 shadow hover:shadow-md" title="Highlight Color" />
    <!-- Export PDF Button -->
    <span class="mx-2"></span>
    <button @click="exportToPDF" :class="toolbarBtn(false)" title="Export to PDF">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6"/>
        <path d="M12 18v-6"/>
        <path d="m9 15 3 3 3-3"/>
      </svg>
      <span class="text-xs ml-1">PDF</span>
    </button>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ editor: Object })
const editor = props.editor
const fontSize = ref('16')
const color = ref('#000000')
const bgColor = ref('#ffffff')
const showHeadings = ref(false)

function changeFontSize() {
  editor.chain().focus().setMark('textStyle', { fontSize: fontSize.value + 'px' }).run()
}
function changeColor() { editor.chain().focus().setColor(color.value).run() }
function changeBgColor() { editor.chain().focus().setMark('textStyle', { backgroundColor: bgColor.value }).run() }
function setHeading(h) { editor.chain().focus().toggleHeading({ level: h }).run() }

function exportToPDF() {
  const currentEditor = props.editor
  if (!currentEditor) {
    alert('Editor not ready. Please try again.')
    return
  }
  
  // Get the HTML content from the editor
  const content = currentEditor.getHTML()
  
  // Create print window
  const printWindow = window.open('', '_blank')
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Document - Export</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        
        @media print {
          html, body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: white !important;
          }
          
          .page-container {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
          }
        }
        
        html {
          background: #f5f5f5;
          padding: 20px 0;
        }
        
        body {
          width: 210mm;
          min-height: 297mm;
          margin: 20px auto;
          padding: 0;
          background: white;
        }
        
        .page-container {
          width: 210mm;
          min-height: 297mm;
          padding: 48px 60px;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border: 1px solid #e0e0e0;
          font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', serif;
          font-size: 18px;
          line-height: 1.7;
        }
        
        p {
          min-height: 38px;
          padding: 8px 30px;
          margin: 0 20px;
          border-bottom: 1.5px dashed #d1d5db;
          line-height: 22px;
        }
        
        /* Remove page break indicators for print */
        p:nth-child(23n) {
          border-bottom: 1.5px dashed #d1d5db !important;
          margin-bottom: 0 !important;
          padding-bottom: 8px !important;
        }
        
        h1, h2, h3 {
          margin: 20px 20px 10px 20px;
          padding: 0 30px;
        }
        
        strong { font-weight: 600; }
        em { font-style: italic; }
        u { text-decoration: underline; }
        
        ul, ol {
          margin: 10px 20px;
          padding-left: 50px;
        }
      </style>
    </head>
    <body>
      <div class="page-container">
        ${content}
      </div>
    </body>
    </html>
  `)
  
  printWindow.document.close()
  
  // Wait for content to load then print
  printWindow.onload = function() {
    setTimeout(() => {
      printWindow.print()
      // Close window after printing (optional)
      setTimeout(() => printWindow.close(), 100)
    }, 250)
  }
}

const formattingButtons = [
  { label: 'Bold', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 5h6a3 3 0 0 1 0 6H7zm0 6h7a3 3 0 1 1 0 6H7z"/></svg>', action: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive('bold') },
  { label: 'Italic', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M9 7h7m-4 0-4 10"/></svg>', action: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive('italic') },
  { label: 'Underline', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M6 4v7a6 6 0 1 0 12 0V4m-9 16h6"/></svg>', action: () => editor.chain().focus().toggleUnderline().run(), isActive: () => editor.isActive('underline') },
  { label: 'Strikethrough', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M6 12h12M12 6a3 3 0 0 1 3 3c0 2-3 3-3 3"/></svg>', action: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive('strike') },
]
const listButtons = [
  { label: 'Numbered List', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 6h14M7 12h14m-14 6h14"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>', action: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive('orderedList') },
  { label: 'Bulleted List', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 6h14M7 12h14m-14 6h14"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>', action: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive('bulletList') },
]
const alignButtons = [
  { label: 'Align Left', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="4" rx="1.5" fill="currentColor"/><rect x="4" y="14" width="10" height="4" rx="1.5" fill="currentColor"/></svg>', action: () => editor.chain().focus().setTextAlign('left').run(), isActive: () => editor.isActive({ textAlign: 'left' }) },
  { label: 'Align Center', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><rect x="7" y="6" width="10" height="4" rx="1.5" fill="currentColor"/><rect x="4" y="14" width="16" height="4" rx="1.5" fill="currentColor"/></svg>', action: () => editor.chain().focus().setTextAlign('center').run(), isActive: () => editor.isActive({ textAlign: 'center' }) },
  { label: 'Align Right', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><rect x="10" y="6" width="10" height="4" rx="1.5" fill="currentColor"/><rect x="4" y="14" width="16" height="4" rx="1.5" fill="currentColor"/></svg>', action: () => editor.chain().focus().setTextAlign('right').run(), isActive: () => editor.isActive({ textAlign: 'right' }) },
]
const miscButtons = [
  { label: 'Link', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M10 13a5 5 0 0 0 7-7l-1-1a5 5 0 0 0-7 7l1 1m0 4v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2M8 15v-2M14 19v-2"/></svg>', action: () => { const url = prompt('Enter link:'); if (url) editor.chain().focus().setLink({ href: url }).run() }, isActive: () => editor.isActive('link') },
  { label: 'Undo', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M9 14l-4-4 4-4m12 6a9 9 0 1 0-9 9v-5"/></svg>', action: () => editor.chain().focus().undo().run(), isActive: null },
  { label: 'Redo', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M15 10l4 4-4 4M3 10a9 9 0 0 1 9 9v-5"/></svg>', action: () => editor.chain().focus().redo().run(), isActive: null },
]

const toolbarBtn = (active) => [
  'rounded-lg px-3 py-2 flex items-center justify-center min-w-[38px]',
  'transition-all duration-200 ease-in-out',
  'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1',
  active 
    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transform hover:scale-105' 
    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white shadow hover:shadow-md',
  'font-medium',
].join(' ')
</script>
