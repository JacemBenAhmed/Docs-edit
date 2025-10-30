import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './assets/modern-styles.css'
import './assets/micro-interactions.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#9C27B0',
          accent: '#E91E63',
          error: '#DC2626',
          info: '#0EA5E9',
          success: '#16A34A',
          warning: '#F59E0B',
          background: '#F8FAFC',
          surface: '#FFFFFF',
        },
      },
    },
  },
})

// Force light mode and ignore any saved preference
try {
  if (vuetify.theme?.global?.name) {
    vuetify.theme.global.name.value = 'light'
  }
  localStorage.setItem('theme', 'light')
} catch {}

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')
