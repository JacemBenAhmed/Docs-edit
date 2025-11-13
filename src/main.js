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

// Google OAuth
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

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

// Initialize Google OAuth
document.addEventListener('DOMContentLoaded', function() {
  // Wait for Google API to load
  const checkGoogleAPI = setInterval(() => {
    if (window.google && window.google.accounts) {
      clearInterval(checkGoogleAPI);
      
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          // This will be handled by the component that needs the response
          const event = new CustomEvent('google-login-response', { detail: response });
          window.dispatchEvent(event);
        },
        auto_select: false
      });
      
      console.log('Google OAuth initialized successfully');
    }
  }, 100);
});

app.mount('#app')
