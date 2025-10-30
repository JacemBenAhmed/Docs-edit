<template>
  <div class="pdf-editor-view">
    <PdfViewer />
  </div>
</template>

<script setup>
import PdfViewer from '../components/PdfViewer.vue'
</script>

<style scoped>
.pdf-editor-view {
  height: 100vh;
  width: 100%;
}
</style>