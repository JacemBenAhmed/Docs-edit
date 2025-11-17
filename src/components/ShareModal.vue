<template>
  <div class="share-modal-overlay" role="dialog" aria-modal="true">
    <div class="share-modal" @click.stop>
      <div class="share-header">
        <h3>Share with…</h3>
        <button class="close-btn" @click="$emit('close')" aria-label="Close">
          <i class="mdi mdi-close"></i>
        </button>
      </div>

      <div class="share-body">
        <div class="search-row">
          <i class="mdi mdi-magnify search-icon"></i>
          <input
            v-model="query"
            @input="onSearch"
            placeholder="Search people or email"
            class="search-input"
            aria-label="Search users"
          />
        </div>

        <div class="users-list" role="list" tabindex="0">
          <div
            v-for="user in filteredUsers"
            :key="user.email"
            class="user-row"
            role="listitem"
          >
            <label class="user-label">
              <input type="checkbox" v-model="selectedMap[user.email]" />
              <img :src="user.avatar" alt="avatar" class="avatar" />
              <div class="user-meta">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-email">{{ user.email }}</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="share-footer">
        <button class="btn cancel" @click="$emit('close')">Cancel</button>
        <button class="btn confirm primary" @click="confirmShare">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
const props = defineProps({
  users: { type: Array, default: () => [] },
  initialSelected: { type: Array, default: () => [] }
})
const emit = defineEmits(['close', 'confirm'])

const query = ref('')
const selectedMap = ref({})

// initialize selected map from initialSelected
watch(
  () => props.initialSelected,
  (val) => {
    selectedMap.value = {}
    val.forEach(e => (selectedMap.value[e.email || e] = true))
  },
  { immediate: true }
)

const onSearch = () => {}

const filteredUsers = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.users
  return props.users.filter(u => {
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    )
  })
})

function confirmShare() {
  const selected = props.users.filter(u => selectedMap.value[u.email])
  emit('confirm', selected)
}
</script>

<style scoped>
.share-modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(11, 22, 40, 0.45);
  z-index: 12000;
  backdrop-filter: blur(6px) saturate(120%);
}
.share-modal {
  width: 560px;
  max-width: calc(100% - 40px);
  background: linear-gradient(180deg, #ffffff, #fbfdff);
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(12,18,30,0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 220ms cubic-bezier(.2,.9,.2,1), opacity 180ms ease;
}
.share-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #eef2f7;
}
.share-header h3 { margin:0; font-size:18px; color:#0b1a2e; font-weight:700 }
.close-btn { background:transparent; border:none; color:#516074; font-size:20px; cursor:pointer }
.share-body { padding: 14px 18px; }
.search-row { display:flex; align-items:center; gap:8px; background:#f6f9ff; padding:8px 10px; border-radius:10px }
.search-input { flex:1; border:none; background:transparent; outline:none; font-size:14px; padding:6px }
.search-icon { color:#6b7280; font-size:20px }
.users-list { margin-top:12px; max-height:320px; overflow:auto; padding-right:6px }
.user-row { padding:8px 6px; border-radius:8px; transition:background 160ms }
.user-row:hover { background:linear-gradient(90deg, rgba(66,133,244,0.04), transparent) }
.user-label { display:flex; align-items:center; gap:12px; width:100%; cursor:pointer }
.avatar { width:40px; height:40px; border-radius:999px; object-fit:cover; border:1px solid #e6eefb }
.user-meta { display:flex; flex-direction:column }
.user-name { font-weight:600; color:#0b1a2e }
.user-email { font-size:13px; color:#52606d }
.share-footer { display:flex; gap:12px; justify-content:flex-end; padding:14px 18px; border-top:1px solid #eef2f7 }
.btn { padding:8px 14px; border-radius:8px; border:1px solid transparent; font-weight:600; cursor:pointer }
.btn.cancel { background:#ffffff; color:#334155; border-color:#e6eefb }
.btn.confirm.primary { background:linear-gradient(90deg,#4285f4,#5a9ff5); color:#fff }

/* Scrollbar inside modal */
.users-list::-webkit-scrollbar { width:10px }
.users-list::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#cfe0ff,#a6c8ff); border-radius:10px }
</style>
