<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-6">
    <div class="mx-auto w-full px-6" style="max-width: 1800px;">
      <div style="display: grid; grid-template-columns: 70% 30%; gap: 24px; align-items: start;">
        <!-- Main Editing Workspace (70% width) -->
        <div style="width: 100%;">
          <!-- Sticky/affix Toolbar -->
          <div class="sticky top-0 z-40 mb-3 mx-auto" style="width: 210mm;">
            <MenuBar :editor="editor" class="rounded-xl shadow-2xl border-2 border-blue-100 bg-white/95 backdrop-blur-md transition-all duration-300 hover:shadow-xl"/>
          </div>
          <!-- Continuous Document with Visual Page Breaks -->
          <div class="pages-container">
            <div class="document shadow-2xl rounded-lg bg-white transition-all duration-300 hover:shadow-3xl mx-auto" 
                 style="width: 210mm; box-shadow: 0 10px 40px 0 rgba(60,60,90,0.12), 0 4px 20px 0 rgba(36,31,99,0.10); border:2px solid #e8f0fe; padding: 48px 60px; position: relative;">
              <EditorContent
                :editor="editor"
                class="prose prose-lg max-w-none w-full outline-none text-[18px] px-0 py-0"
                style="font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', serif; letter-spacing: .005em; line-height: 1.7;"
              />
            </div>
          </div>
        </div>
        <!-- AI Assistant Sidebar on Right (30% width) -->
        <div class="sticky" style="top: 24px; align-self: start;">
          <AiSidebar />
        </div>
      </div>
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
import MenuBar from './MenuBar.vue'
import AiSidebar from './AiSidebar.vue'

const approxLines = 46  // 2 pages worth of lines (23 per page)
const emptyParagraphs = Array.from({ length: approxLines }, () => '<p>&nbsp;</p>').join('')

// Custom extension to maintain minimum lines
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
      Color,
      
    ],
    content: emptyParagraphs,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
      handleKeyDown: (view, event) => {
        // Prevent Ctrl+A + Delete from removing all content
        if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
          return false
        }
        
        // Prevent deleting all content
        const { state } = view
        const { selection, doc } = state
        
        if (event.key === 'Backspace' || event.key === 'Delete') {
          // Check if trying to delete everything
          if (selection.from === 0 && selection.to === doc.content.size) {
            event.preventDefault()
            // Clear content but keep structure (46 lines = 2 pages)
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
})

function getHTML() {
  return editor.value?.getHTML() || ''
}
defineExpose({ getHTML })

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
/* Custom Scrollbar */
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

::selection {
  background: rgba(66, 133, 244, 0.25);
  color: inherit;
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
</style>