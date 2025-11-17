<template>
  <div class="draw-overlay" role="dialog" aria-modal="true" @keydown.escape.prevent="close">
    <div class="draw-modal" @click.stop>
      <div class="draw-header">
        <h3>Draw</h3>
        <button class="close-btn" @click="close" aria-label="Close"><i class="mdi mdi-close"></i></button>
      </div>

      <div class="draw-body">
        <div class="draw-toolbar">
          <button :class="['tool-btn', mode === 'pen' && 'active']" @click="setMode('pen')">
            <i class="mdi mdi-pencil"></i>
            <span>Pen</span>
          </button>
          <button :class="['tool-btn', mode === 'rect' && 'active']" @click="setMode('rect')">
            <i class="mdi mdi-square-outline"></i>
            <span>Rectangle</span>
          </button>
          <button class="tool-btn" @click="undo" :disabled="history.length===0">
            <i class="mdi mdi-undo"></i>
            <span>Undo</span>
          </button>
          <button class="tool-btn" @click="clearCanvas">
            <i class="mdi mdi-delete"></i>
            <span>Clear</span>
          </button>
          <div style="flex:1"></div>
          <button class="tool-btn save" @click="saveImage">
            <i class="mdi mdi-content-save"></i>
            <span>Save</span>
          </button>
        </div>

        <div class="canvas-wrap">
          <canvas ref="canvas" class="draw-canvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const emit = defineEmits(['close','save'])

const canvas = ref(null)
const ctx = ref(null)
const drawing = ref(false)
const mode = ref('pen') // 'pen' or 'rect'
const start = ref({ x:0, y:0 })
const currentRect = ref(null)
const history = ref([]) // store image data URLs for undo

function setMode(m) { mode.value = m }

function resizeCanvas() {
  const el = canvas.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const scale = window.devicePixelRatio || 1
  el.width = rect.width * scale
  el.height = rect.height * scale
  el.style.width = rect.width + 'px'
  el.style.height = rect.height + 'px'
  const c = el.getContext('2d')
  c.scale(scale, scale)
  ctx.value = c
  redrawFromHistory()
}

function getPos(e) {
  const rect = canvas.value.getBoundingClientRect()
  const x = (e.clientX - rect.left)
  const y = (e.clientY - rect.top)
  return { x, y }
}

function onPointerDown(e) {
  e.preventDefault()
  const p = getPos(e)
  drawing.value = true
  start.value = p
  if (mode.value === 'pen') {
    ctx.value.beginPath()
    ctx.value.moveTo(p.x, p.y)
    ctx.value.lineWidth = 2.5
    ctx.value.lineCap = 'round'
    ctx.value.strokeStyle = '#0b1a2e'
  } else if (mode.value === 'rect') {
    currentRect.value = { x: p.x, y: p.y, w: 0, h: 0 }
  }
}

function onPointerMove(e) {
  if (!drawing.value) return
  const p = getPos(e)
  if (mode.value === 'pen') {
    ctx.value.lineTo(p.x, p.y)
    ctx.value.stroke()
  } else if (mode.value === 'rect') {
    // redraw last state then draw preview rect
    redrawFromHistory()
    const r = currentRect.value
    r.w = p.x - r.x
    r.h = p.y - r.y
    ctx.value.strokeStyle = '#0b1a2e'
    ctx.value.lineWidth = 2
    ctx.value.setLineDash([6,4])
    ctx.value.strokeRect(r.x, r.y, r.w, r.h)
    ctx.value.setLineDash([])
  }
}

function onPointerUp(e) {
  if (!drawing.value) return
  drawing.value = false
  if (mode.value === 'rect' && currentRect.value) {
    const r = currentRect.value
    ctx.value.fillStyle = 'rgba(66,133,244,0.06)'
    ctx.value.strokeStyle = '#0b1a2e'
    ctx.value.lineWidth = 2
    ctx.value.fillRect(r.x, r.y, r.w, r.h)
    ctx.value.strokeRect(r.x, r.y, r.w, r.h)
    currentRect.value = null
  }
  pushHistory()
}

function pushHistory() {
  if (!canvas.value) return
  const url = canvas.value.toDataURL('image/png')
  history.value.push(url)
  // limit history
  if (history.value.length > 50) history.value.shift()
}

function undo() {
  if (history.value.length === 0) {
    clearCanvas()
    return
  }
  history.value.pop()
  redrawFromHistory()
}

function redrawFromHistory() {
  if (!ctx.value || !canvas.value) return
  ctx.value.clearRect(0,0,canvas.value.width, canvas.value.height)
  if (history.value.length === 0) return
  const img = new Image()
  img.onload = () => {
    // draw at CSS pixel size (canvas scaled internally)
    const rect = canvas.value.getBoundingClientRect()
    ctx.value.drawImage(img, 0, 0, rect.width, rect.height)
  }
  img.src = history.value[history.value.length - 1]
}

function clearCanvas() {
  if (!ctx.value || !canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  ctx.value.clearRect(0,0,canvas.value.width, canvas.value.height)
  history.value = []
}

function saveImage() {
  if (!canvas.value) return
  const data = canvas.value.toDataURL('image/png')
  emit('save', data)
  emit('close')
}

function close() {
  emit('close')
}

onMounted(() => {
  // set up canvas size and events
  const el = canvas.value
  if (!el) return
  // style the canvas to a comfortable drawing area
  el.width = 600
  el.height = 360
  el.style.width = '600px'
  el.style.height = '360px'
  ctx.value = el.getContext('2d')
  ctx.value.lineJoin = 'round'
  ctx.value.lineCap = 'round'

  // attach listeners
  el.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('resize', resizeCanvas)

  // initial history blank
  pushHistory()
})

onBeforeUnmount(() => {
  const el = canvas.value
  if (!el) return
  el.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.draw-overlay {
  position: fixed; inset: 0; display:flex; align-items:center; justify-content:center;
  background: rgba(8,12,20,0.45); z-index:13000; backdrop-filter: blur(6px);
}
.draw-modal { width: 640px; max-width: calc(100% - 40px); background: #fff; border-radius: 12px; box-shadow: 0 24px 60px rgba(6,12,30,0.35); overflow:hidden; }
.draw-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #eef2f7 }
.draw-header h3 { margin:0; font-size:18px }
.close-btn { background:transparent; border:none; font-size:18px; color:#475569; cursor:pointer }
.draw-body { padding:12px }
.draw-toolbar { display:flex; gap:8px; align-items:center; padding:6px 8px 12px; }
.tool-btn { display:flex; gap:8px; align-items:center; padding:8px 10px; border-radius:8px; border:1px solid #e6eefb; background:#fff; cursor:pointer; font-weight:600 }
.tool-btn.active { background:linear-gradient(90deg,#e8f0fe,#f6fbff); border-color:#d2e3fc }
.tool-btn.save { background:linear-gradient(90deg,#4285f4,#5a9ff5); color:#fff }
.canvas-wrap { padding:8px; display:flex; justify-content:center }
.draw-canvas { width:600px; height:360px; border-radius:8px; border:1px solid #e6eefb; box-shadow: 0 6px 20px rgba(12,18,30,0.06) }
</style>