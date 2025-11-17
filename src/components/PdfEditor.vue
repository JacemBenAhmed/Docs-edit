<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-6">
    <DocumentSidebar :metadata="documentMetadata" :comments="documentComments" />
    <div class="mx-auto w-full px-6 editor-container">
      <div class="editor-workspace">
        <div class="editor-toolbar sticky-toolbar mx-auto" style="width: 210mm;">
          <MenuBar
            :editor="editor"
            class="rounded-xl shadow-2xl border-2 border-blue-100 bg-white/95 backdrop-blur-md transition-all duration-300 hover:shadow-xl"
            @open-share="openShareModal"
            @run-tool="runTool"
            @open-draw="openDrawModal"
          />
        </div>
        <div class="pages-container">
          <div class="document shadow-2xl rounded-lg bg-white transition-all duration-300 hover:shadow-3xl mx-auto" 
               style="width: 210mm; box-shadow: 0 10px 40px 0 rgba(60,60,90,0.12), 0 4px 20px 0 rgba(36,31,99,0.10); border:2px solid #e8f0fe; padding: 48px 60px; position: relative;">
            <EditorContent
              :editor="editor"
              class="prose prose-lg max-w-none w-full outline-none px-0 py-0"
              style="letter-spacing: .005em; line-height: 1.7;"
            />
          </div>
        </div>
      </div>
      <AiSidebar />
      <ShareModal v-if="showShareModal" :users="shareUsers" @close="showShareModal = false" @confirm="onShareConfirm" />
      <DrawCanvas v-if="showDrawModal" @close="showDrawModal = false" @save="onDrawSave" />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, defineExpose, onMounted } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Underline } from '@tiptap/extension-underline'
import { Extension } from '@tiptap/core'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import FontFamily from '@tiptap/extension-font-family'
import DraggableImage from '../extensions/DraggableImage.js'
import TableHTML from '../extensions/TableHTML.js'
import MenuBar from './MenuBar.vue'
import AiSidebar from './AiSidebar.vue'
import DocumentSidebar from './DocumentSidebar.vue'
import ShareModal from './ShareModal.vue'
import DrawCanvas from './DrawCanvas.vue'

const approxLines = 46  
const emptyParagraphs = Array.from({ length: approxLines }, () => '<p>&nbsp;</p>').join('')

// Document metadata
const documentMetadata = ref({
  author: 'You',
  createdDate: new Date('2024-11-01'),
  lastEdited: new Date(),
  version: 'v1.2',
  wordCount: 2847,
  pageCount: 5
})

// Document comments
const documentComments = ref([
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
  },
  {
    username: 'Jordan Lee',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    text: 'The conclusion is well-structured. Minor grammar fix needed in paragraph 3.'
  }
])

const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize || null,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

const MinimumLines = Extension.create({
  name: 'minimumLines',
  
  addProseMirrorPlugins() {
    const minLines = approxLines
    return [
      new this.editor.extensionManager.splittableMarks.constructor.Plugin({
        appendTransaction: (transactions, oldState, newState) => {
          const docChanged = transactions.some(tr => tr.docChanged)
          if (!docChanged) return null

          const { doc } = newState
          const paragraphCount = doc.childCount
          
          if (paragraphCount < minLines) {
            const tr = newState.tr
            const linesToAdd = minLines - paragraphCount
            
            for (let i = 0; i < linesToAdd; i++) {
              tr.insert(doc.content.size, newState.schema.nodes.paragraph.create())
            }
            
            return tr
          }
          
          return null
        }
      })
    ]
  }
})
const editor = ref(null)
const showSidebar = ref(false)
const showShareModal = ref(false)
const showDrawModal = ref(false)

// Sample users for the Share modal (replace with real data when available)
const shareUsers = ref([
  { name: 'Sarah Johnson', email: 'sarah.johnson@example.com', avatar: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Mike Chen', email: 'mike.chen@example.com', avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Alex Rivera', email: 'alex.rivera@example.com', avatar: 'https://i.pravatar.cc/150?img=25' },
  { name: 'Jordan Lee', email: 'jordan.lee@example.com', avatar: 'https://i.pravatar.cc/150?img=32' },
  { name: 'Priya Patel', email: 'priya.patel@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
])

function openShareModal() {
  showShareModal.value = true
}

function runTool(name) {
  // Presentational only - show a lightweight notification
  alert(`${name} — this is a UI-only demo action.`)
}

function openDrawModal() {
  showDrawModal.value = true
}

function onDrawSave(base64) {
  showDrawModal.value = false
  if (!editor.value) return
  try {
    // Insert image at current selection / cursor
    editor.value.chain().focus().setImage({ src: base64 }).run()
    // feedback
    console.log('Inserted drawing into document')
  } catch (err) {
    console.error('Error inserting drawing:', err)
  }
}

function onShareConfirm(selected) {
  showShareModal.value = false
  // For now, just log the selected collaborators. In production, call API.
  console.log('Shared with:', selected)
  alert(`Shared with ${selected.length} collaborator(s).`)
}
const prompt = ref("")
const chat = ref([
  { role: 'ai', content: '👋 Hi! Ask me anything about your writing.' }
])

function sendAi() {
  if (!prompt.value.trim()) return
  chat.value.push({ role: 'user', content: prompt.value })
  setTimeout(() => {
    chat.value.push({ role: 'ai', content: '🪄 (AI would reply here.)' })
  }, 650)
  prompt.value = ''
}

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'editor-line',
          },
        },
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      DraggableImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      TableHTML
      
    ],
    content: emptyParagraphs,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
      handleKeyDown: (view, event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
          return false
        }
        
        const { state } = view
        const { selection, doc } = state
        
        if (event.key === 'Backspace' || event.key === 'Delete') {
          if (selection.from === 0 && selection.to === doc.content.size) {
            event.preventDefault()
            const tr = state.tr
            tr.deleteRange(0, doc.content.size)
            for (let i = 0; i < 46; i++) {
              tr.insert(i === 0 ? 0 : tr.doc.content.size, state.schema.nodes.paragraph.create())
            }
            view.dispatch(tr)
            return true
          }
        }
        return false
      },
    },
  })
  
  setupImageResize()
})

function setupImageResize() {
  let isResizing = false
  let currentImage = null
  let startX, startY, startWidth, startHeight
  
  document.addEventListener('mousedown', (e) => {
    const target = e.target
    if (target.classList.contains('editor-image') && e.shiftKey) {
      isResizing = true
      currentImage = target
      startX = e.clientX
      startY = e.clientY
      startWidth = currentImage.offsetWidth
      startHeight = currentImage.offsetHeight
      e.preventDefault()
    }
  })
  
  document.addEventListener('mousemove', (e) => {
    if (!isResizing || !currentImage) return
    
    const width = startWidth + (e.clientX - startX)
    const height = startHeight + (e.clientY - startY)
    
    if (width > 50) {
      currentImage.style.width = width + 'px'
      currentImage.style.height = 'auto'
    }
  })
  
  document.addEventListener('mouseup', () => {
    if (isResizing && currentImage && editor.value) {
      const { view } = editor.value
      const pos = view.posAtDOM(currentImage, 0)
      const node = view.state.doc.nodeAt(pos)
      
      if (node) {
        const { tr } = view.state
        tr.setNodeMarkup(pos, null, {
          ...node.attrs,
          width: currentImage.style.width,
        })
        view.dispatch(tr)
      }
    }
    
    isResizing = false
    currentImage = null
  })
}

function getHTML() {
  return editor.value?.getHTML() || ''
}
defineExpose({ getHTML })

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.editor-container {
  max-width: 1800px;
  position: relative;
  padding-bottom: 140px;
  padding-right: 480px; /* reduced space for smaller sidebar */
  padding-left: 320px; /* space for left document sidebar */
  transition: padding-right 260ms ease, padding-left 260ms ease;
}

.editor-workspace {
  width: 100%;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1400px) {
  .editor-container {
    padding-right: 360px;
    padding-left: 280px;
  }
}

@media (max-width: 1200px) {
  .editor-container {
    padding-right: 280px;
    padding-left: 240px;
  }
}

@media (max-width: 768px) {
  .editor-container {
    padding-right: 0; /* remove right padding on small screens */
    padding-left: 0; /* remove left padding on small screens */
  }
}

:deep(*::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(*::-webkit-scrollbar-track) {
  background: #f0f4ff;
  border-radius: 10px;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: linear-gradient(135deg, #4285f4, #5a9ff5);
  border-radius: 10px;
  transition: all 0.3s ease;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background: linear-gradient(135deg, #3367d6, #4a8be8);
}

.pages-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* center document */
}

.prose :deep(p) {
  min-height: 38px;
  padding: 8px 30px;
  margin: 0 20px;
  border-bottom: 1.5px dashed #d1d5db;
  transition: all .3s ease;
  background: transparent;
  display: block;
  line-height: 22px;
  cursor: text;
  position: relative;
  font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 18px;
  color: #202124;
}

.prose :deep(p:empty::before) {
  content: '\00a0';
  display: inline;
  color: transparent;
  pointer-events: none;
}

.prose :deep(p:hover) {
  border-bottom: 1px dashed #93c5fd;
}

.prose :deep(p:focus) {
  border-bottom: 2px solid #4285f4;
  background: linear-gradient(to right, transparent, rgba(66, 133, 244, 0.03), transparent);
}

/* Remove default browser focus outline for the editor container and ensure no black border shows
   when the editable area (ProseMirror) or inner elements receive focus. Keep caret and
   editable behavior intact. */
:deep(.ProseMirror), .prose :deep(.ProseMirror) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

:deep(.ProseMirror):focus, :deep(.ProseMirror[contenteditable="true"]:focus), .prose :deep(.ProseMirror:focus) {
  outline: none !important;
  box-shadow: none !important;
}

/* Also prevent the browser from showing a focus ring on elements inside the editor */
.prose :deep(*:focus) {
  outline: none !important;
  box-shadow: none !important;
}

::selection {
  background: rgba(66, 133, 244, 0.25);
  color: inherit;
}

/* Ensure inline styles are applied */
.prose :deep(span[style]) {
  display: inline;
}

.prose :deep(span[style*="color"]) {
  display: inline;
}

.prose :deep(span[style*="background-color"]) {
  display: inline;
  padding: 2px 0;
}

/* Default text color for all editor content */
.prose :deep(*) {
  color: inherit;
}

.prose {
  color: #202124;
}

/* Multi-page styling */
.pages-container {
  display: flex;
  flex-direction: column;
}

.document {
  position: relative;
}

/* Page break after every 23 lines */
.prose :deep(p:nth-child(23n)) {
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 2px dashed #cbd5e1 !important;
  position: relative;
}

.prose :deep(p:nth-child(23n))::after {
  content: '--- Page Break ---';
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
  letter-spacing: 2px;
  white-space: nowrap;
  background: white;
  padding: 0 20px;
  pointer-events: none;
  user-select: none;
}

/* Add page number counter after every 23 lines */
.prose :deep(p:nth-child(23n)) {
  counter-increment: page;
}

.prose :deep(p:nth-child(23n))::before {
  content: 'Page ' counter(page);
  position: absolute;
  bottom: 10px;
  right: 20px;
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
  pointer-events: none;
  user-select: none;
}

.prose {
  counter-reset: page 0;
}

/* Google Docs-like button styles */
:deep(.menubar-button) {
  border-radius: 4px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: white;
  border: 1px solid #dadce0;
  color: #202124;
}

/* Sticky toolbar wrapper adjustments (placement, sticky behavior, shadow/transition) */
.sticky-toolbar {
  /* Use fixed positioning so the toolbar remains visible reliably across scroll containers */
  position: fixed;
  top: 96px; /* placed below the app navbar for proper spacing */
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  margin-bottom: 10px;
  transition: box-shadow 260ms ease, transform 260ms ease, backdrop-filter 260ms ease;
  will-change: transform, box-shadow;
}

/* Add subtle elevation to the inner MenuBar when the toolbar is fixed */
.sticky-toolbar :deep(.rounded-xl) {
  transition: box-shadow 260ms ease, transform 260ms ease;
  box-shadow: 0 10px 30px rgba(12,18,30,0.09);
  transform: translateY(-2px);
}

/* Slightly raise the menubar for better ergonomics */
.sticky-toolbar :deep(.menubar-container) {
  transform: translateY(-6px);
  transition: transform 220ms ease;
  overflow: visible; /* ensure dropdowns are not clipped */
  z-index: 10000;
}

/* Add spacing to the top of the editor workspace so fixed toolbar doesn't overlap content */
.editor-workspace {
  padding-top: 180px; /* ensure content is below the fixed toolbar */
}

@media (max-width: 920px) {
  .sticky-toolbar { top: 80px; }
  .editor-workspace { padding-top: 200px; }
}

:deep(.menubar-button:hover) {
  background-color: #f1f3f4;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3);
}

:deep(.menubar-button.is-active) {
  background-color: #e8f0fe;
  color: #1a73e8;
  border-color: #d2e3fc;
}

:deep(.menubar-button svg) {
  width: 18px;
  height: 18px;
}

:deep(.primary-button) {
  background-color: #4285f4;
  color: white;
  border-color: #4285f4;
}

:deep(.primary-button:hover) {
  background-color: #1a73e8;
  box-shadow: 0 1px 3px rgba(66, 133, 244, 0.4);
}

:deep(.menu-dropdown) {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(60, 64, 67, 0.2);
  border: 1px solid #dadce0;
  overflow: hidden;
}

:deep(.menu-dropdown-item) {
  padding: 8px 16px;
  transition: background-color 0.2s;
}

:deep(.menu-dropdown-item:hover) {
  background-color: #f1f3f4;
}

/* Image Styles - Draggable and Resizable */
.prose :deep(.editor-image) {
  max-width: 100%;
  height: auto;
  cursor: grab;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: inline-block;
  margin: 12px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  user-select: none;
}

.prose :deep(.editor-image:hover) {
  box-shadow: 0 6px 20px rgba(66, 133, 244, 0.35);
  border-color: #4285f4;
  transform: translateY(-2px);
}

.prose :deep(.editor-image:active) {
  cursor: grabbing;
  transform: scale(0.98);
}

.prose :deep(.editor-image.ProseMirror-selectednode) {
  outline: 3px solid #4285f4;
  outline-offset: 3px;
  box-shadow: 0 8px 24px rgba(66, 133, 244, 0.5);
  border-color: #4285f4;
}

/* Resize indicator when holding Shift */
.prose :deep(.editor-image):after {
  content: '⇲ Shift+Drag to resize';
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(66, 133, 244, 0.9);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1000;
}

.prose :deep(.editor-image:hover):after {
  opacity: 1;
}

/* Image resize handles */
.prose :deep(.editor-image-wrapper) {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.prose :deep(.editor-image-wrapper.selected) {
  outline: 2px solid #4285f4;
}

.prose :deep(.editor-image-wrapper .resize-handle) {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #4285f4;
  border: 2px solid white;
  border-radius: 50%;
  cursor: nwse-resize;
  bottom: -5px;
  right: -5px;
  z-index: 10;
}
</style>