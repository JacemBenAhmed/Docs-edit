<template>
  <div class="dashboard-view">
    <v-container>
      <!-- Header -->
      <v-row class="mb-6">
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <div>
            <h1 class="text-h4 font-weight-bold gradient-text">Dashboard</h1>
            <div class="text-subtitle-2 text-grey">Key metrics and recent activity</div>
          </div>
          <div class="d-flex ga-2">
            <v-btn variant="outlined" color="primary" prepend-icon="mdi-refresh" @click="refresh">
              Refresh
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Stat Cards -->
      <v-row class="mb-6">
        <v-col v-for="card in statCards" :key="card.title" cols="12" sm="6" md="3">
          <v-card class="pa-4 hover-card" elevation="3" :class="isDark ? 'dark-card' : ''">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey">{{ card.title }}</div>
                <div class="text-h5 font-weight-bold mt-1">{{ card.value }}</div>
              </div>
              <v-avatar size="40" :color="card.color + '-lighten-4'">
                <v-icon :color="card.color">{{ card.icon }}</v-icon>
              </v-avatar>
            </div>
            <div class="d-flex align-center mt-3">
              <v-icon size="18" :color="card.trend >= 0 ? 'success' : 'error'">
                {{ card.trend >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
              </v-icon>
              <span class="ml-1 text-caption" :class="card.trend >= 0 ? 'text-success' : 'text-error'">
                {{ Math.abs(card.trend) }}%
              </span>
              <span class="ml-2 text-caption text-grey">vs last week</span>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Activity Chart -->
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4" elevation="3" :class="isDark ? 'dark-card' : ''">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-subtitle-1 font-weight-medium">Activity Over Time</div>
              <v-select
                v-model="range"
                :items="ranges"
                density="compact"
                variant="outlined"
                hide-details
                class="max-width-150"
              ></v-select>
            </div>

            <div v-if="chartError" class="text-caption text-error pa-4">
              {{ chartError }} (showing placeholder data)
            </div>

            <div class="position-relative">
              <canvas ref="chartEl" height="72"></canvas>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = computed(() => !!theme.global.current.value.dark)

const statCards = ref([
  { title: 'Users', value: '1,248', trend: 12, icon: 'mdi-account-group', color: 'primary' },
  { title: 'Active Sessions', value: '312', trend: 5, icon: 'mdi-flash', color: 'secondary' },
  { title: 'Uploads', value: '5,432', trend: 8, icon: 'mdi-cloud-upload', color: 'success' },
  { title: 'Errors', value: '12', trend: -3, icon: 'mdi-alert-circle', color: 'error' },
])

const range = ref('Last 7 days')
const ranges = ['Last 7 days', 'Last 30 days', 'Last 90 days']
const chartEl = ref(null)
let chartInstance = null
const chartError = ref('')

function generateData(days) {
  const data = []
  for (let i = days - 1; i >= 0; i--) {
    data.push(Math.round(50 + Math.random() * 150))
  }
  return data
}

function getDays() {
  if (range.value === 'Last 7 days') return 7
  if (range.value === 'Last 30 days') return 30
  return 90
}

async function renderChart() {
  if (!chartEl.value) return

  const dataPoints = generateData(getDays())

  try {
    const { default: Chart } = await import(/* @vite-ignore */ 'chart.js/auto').catch(() => ({ default: null }))
    if (!Chart) throw new Error('Chart.js not installed')

    if (chartInstance) {
      chartInstance.destroy()
    }

    chartInstance = new Chart(chartEl.value.getContext('2d'), {
      type: 'line',
      data: {
        labels: dataPoints.map((_, i) => i + 1),
        datasets: [
          {
            label: 'Activity',
            data: dataPoints,
            borderColor: isDark.value ? '#90caf9' : '#667eea',
            backgroundColor: isDark.value ? 'rgba(144,202,249,0.2)' : 'rgba(102,126,234,0.2)',
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: true, grid: { display: false } },
          y: { display: true, grid: { color: isDark.value ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' } },
        },
        plugins: { legend: { display: false } },
      },
    })
    chartError.value = ''
  } catch (e) {
    chartError.value = e.message
    // Fallback: draw a very simple placeholder line
    const ctx = chartEl.value.getContext('2d')
    const w = chartEl.value.width
    const h = chartEl.value.height
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = isDark.value ? '#90caf9' : '#667eea'
    ctx.beginPath()
    dataPoints.forEach((v, i) => {
      const x = (i / (dataPoints.length - 1)) * w
      const y = h - (v / 200) * h
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  }
}

function refresh() {
  renderChart()
}

onMounted(() => {
  renderChart()
})

watch([range, isDark], () => {
  renderChart()
})
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hover-card { transition: all 0.3s ease; }
.hover-card:hover { transform: translateY(-6px); box-shadow: 0 16px 30px rgba(0,0,0,0.08); }
.dark-card { background: linear-gradient(145deg, #2d3748, #1a202c); color: #e2e8f0; }
.max-width-150 { max-width: 150px; }
.position-relative { position: relative; min-height: 280px; }
canvas { width: 100% !important; height: 260px !important; }
</style>


