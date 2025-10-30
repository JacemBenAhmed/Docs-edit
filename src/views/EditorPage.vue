<template>
  <div class="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center">
    <div class="w-full max-w-[1300px] min-h-screen flex flex-col items-center justify-center relative">
      <button
        @click="exportToPdf"
        class="fixed top-12 right-16 z-50 bg-primary-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-primary-700 transition text-lg"
      >
        Export as PDF
      </button>
      <PdfEditor ref="editorRef" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PdfEditor from '../components/PdfEditor.vue'
import { PDFDocument } from 'pdf-lib'

const editorRef = ref(null)

const exportToPdf = async () => {
  const html = editorRef.value?.getHTML?.() || ''
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([794, 1123]) // A4 px at 96dpi
  page.drawText('PDF export is coming soon. WYSIWYG html2canvas to pdf logic can be plugged here.')
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.pdf'
  a.click()
  URL.revokeObjectURL(url)
}
</script>
