<template>
  <div class="edit-view">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-6" :class="isDark ? 'dark-card' : ''">
            <div class="d-flex align-center justify-space-between mb-4">
              <div>
                <h1 class="text-h5 font-weight-bold">Editing Document</h1>
                <div class="text-subtitle-2 text-grey">ID: {{ $route.params.id }}</div>
              </div>
              <div class="d-flex ga-2">
                <v-btn variant="outlined" color="primary" prepend-icon="mdi-content-save" @click="save">
                  Save
                </v-btn>
                <v-btn color="primary" prepend-icon="mdi-export" @click="exportDoc">
                  Export
                </v-btn>
              </div>
            </div>

            <v-textarea
              v-model="content"
              rows="14"
              auto-grow
              variant="outlined"
              placeholder="Start writing..."
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

const content = ref('')
const theme = useTheme()
const isDark = computed(() => !!theme.global.current.value.dark)

function save() {
  console.log('Saving...')
}

function exportDoc() {
  console.log('Export...')
}
</script>

<style scoped>
.dark-card {
  background: linear-gradient(145deg, #2d3748, #1a202c);
  color: #e2e8f0;
}
</style>


