<template>
  <v-container class="pa-4" style="height: 100%;">
    <h2 class="text-h5 mb-4">Assistant</h2>
    <AssistantChat />
  </v-container>
</template>

<script>
import AssistantChat from '@/components/AssistantChat.vue'

export default {
  name: 'AssistantView',
  components: { AssistantChat }
}
</script>

<style scoped>
:host, .v-container { height: 100%; }
</style>