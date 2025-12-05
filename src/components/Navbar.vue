<template>
  <v-app-bar color="white" prominent elevation="2" class="navbar-custom px-2 px-md-6">
    <template v-slot:prepend>
      <div class="d-flex align-center mr-4 logo-container animated-logo" @click="$router.push('/')" style="cursor: pointer;">
        <div class="logo-wrapper mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" class="brand-logo">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" rx="20" fill="url(#logoGrad)"/>
            <rect x="25" y="20" width="70" height="85" rx="6" fill="white"/>
            <line x1="35" y1="40" x2="85" y2="40" stroke="#4f46e5" stroke-width="3" stroke-linecap="round"/>
            <line x1="35" y1="55" x2="85" y2="55" stroke="#4f46e5" stroke-width="3" stroke-linecap="round"/>
            <line x1="35" y1="70" x2="75" y2="70" stroke="#4f46e5" stroke-width="3" stroke-linecap="round"/>
            <path d="M85,25 L88,32 L95,32 L89,36 L92,43 L85,39 L78,43 L81,36 L75,32 L82,32 Z" fill="#fbbf24" stroke="white" stroke-width="1"/>
            <path d="M30,85 L45,70 L52,77 L37,92 Z" fill="white"/>
            <circle cx="52" cy="77" r="3" fill="#fbbf24"/>
          </svg>
        </div>
        <div class="d-flex flex-column">
          <span class="text-h6 font-weight-bold brand-title gradient-text">Edity</span>
          <span class="text-caption brand-subtitle">Your Documents Workspace</span>
        </div>
      </div>
    </template>

    <div class="d-none d-md-flex align-center ml-8">
      <v-btn
        v-for="link in navigationLinks"
        :key="link.name"
        :prepend-icon="link.icon"
        variant="text"
        class="mx-2 nav-btn animated-border"
        :class="{ 'active-nav-btn': $route && $route.path === link.route }"
        :color="isDark ? 'white' : 'grey-darken-1'"
        @click="$router.push(link.route)"
        @mouseover="animateIcon(link.name)"
      >
        <span class="nav-text">{{ link.name }}</span>
      </v-btn>
    </div>

    <v-spacer></v-spacer>

    <div class="d-flex align-center ga-2">
      <!-- Auth Area: Sign In button or Profile Menu -->
      <v-btn
        v-if="!user"
        variant="text"
        color="grey-darken-1"
        prepend-icon="mdi-login"
        class="login-btn text-none"
        :loading="isLoading"
        :disabled="isLoading"
        @click="startGoogleLogin"
      >
        Sign Up
      </v-btn>

      <!-- User Profile - Shows when logged in -->
      <div v-else class="d-flex align-center">
        <v-menu v-model="profileMenu" :close-on-content-click="false" location="bottom">
          <template v-slot:activator="{ props }">
            <v-avatar
              v-bind="props"
              size="40"
              class="ml-2 user-avatar"
              style="cursor: pointer; border: 2px solid #667eea;"
            >
              <v-img v-if="user?.picture" :src="user.picture" alt="User Profile" />
              <v-icon v-else>mdi-account</v-icon>
            </v-avatar>
          </template>
          
          <v-card min-width="200" class="profile-menu-card">
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img v-if="user?.picture" :src="user.picture" alt="User Profile" />
                    <v-icon v-else>mdi-account</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ user?.name || 'User' }}</v-list-item-title>
                <v-list-item-subtitle>{{ user?.email || '' }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-divider></v-divider>
              
              <v-list-item prepend-icon="mdi-account-cog" title="Settings" @click="$router.push('/profile')"></v-list-item>
              <v-list-item prepend-icon="mdi-logout" title="Logout" @click="logout"></v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>

      <!-- Mobile Menu -->
      <v-btn
        icon
        variant="text"
        color="grey-darken-1"
        class="d-md-none"
        @click="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </div>

    <!-- Mobile Search -->
    <v-expand-transition>
      <div v-if="showSearch" class="pa-4">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search documents..."
          variant="outlined"
          density="compact"
          hide-details
          clearable
          @click:clear="showSearch = false"
        ></v-text-field>
      </div>
    </v-expand-transition>
  </v-app-bar>

  <!-- Mobile Drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="right">
    <v-list nav density="compact">
      <v-list-item title="Menu" subtitle="Navigation" class="mb-2">
        <template v-slot:append>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="drawer = false"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item
        v-for="link in navigationLinks"
        :key="link.name"
        :prepend-icon="link.icon"
        :title="link.name"
        @click="navigate(link.route)"
      ></v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item
        prepend-icon="mdi-magnify"
        title="Search"
        @click="showSearch = true; drawer = false"
      ></v-list-item>

      <v-list-item prepend-icon="mdi-cog-outline" title="Settings"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import userService from '../services/userService.js'
import { jwtDecode } from 'jwt-decode'

export default {
  name: 'Navbar',
  data() {
    return {
      drawer: false,
      searchQuery: '',
      showSearch: false,
      isLoading: false,
      user: null,
      profileMenu: false,
      _googleAuthListener: null,
      navigationLinks: [
        { name: 'Home', icon: 'mdi-home-outline', route: '/' },
        { name: 'Dashboard', icon: 'mdi-view-dashboard-outline', route: '/dashboard' },
        { name: 'Documents', icon: 'mdi-file-document-multiple-outline', route: '/documents' },
        { name: 'New Document', icon: 'mdi-file', route: '/pdf-editor' },
        
      ]
    }
  },
  mounted() {
    this.loadUserFromStorage()
    this.registerGoogleListener()
  },
  beforeUnmount() {
    if (this._googleAuthListener) {
      window.removeEventListener('google-login-response', this._googleAuthListener)
      this._googleAuthListener = null
    }
  },
  methods: {
    registerGoogleListener() {
      if (this._googleAuthListener) return
      this._googleAuthListener = (event) => {
        if (event?.detail) {
          this.handleGoogleLogin(event.detail)
        }
      }
      window.addEventListener('google-login-response', this._googleAuthListener)
    },

    startGoogleLogin() {
      if (this.isLoading) return

      const googleId = window?.google?.accounts?.id
      if (!googleId) {
        console.error('Google Sign-In library not ready')
        alert('Google Sign-In is not ready yet. Please try again in a moment.')
        return
      }

      this.isLoading = true

      googleId.prompt((notification) => {
        if (notification.isNotDisplayed?.()) {
          console.warn('Google prompt was not displayed', notification.getNotDisplayedReason?.())
          this.isLoading = false
        } else if (notification.isSkippedMoment?.()) {
          console.warn('Google prompt was skipped', notification.getSkippedReason?.())
          this.isLoading = false
        } else if (notification.isDismissedMoment?.()) {
          console.warn('Google prompt was dismissed', notification.getDismissedReason?.())
          this.isLoading = false
        }
      })
    },

     animateIcon(linkName) {
       // This method will be used for icon animations on hover
       const icons = document.querySelectorAll('.nav-btn .v-icon')
       icons.forEach(icon => {
         if (icon.closest('.nav-btn').textContent.includes(linkName)) {
           icon.classList.add('icon-pulse')
           setTimeout(() => {
             icon.classList.remove('icon-pulse')
           }, 500)
         }
       })
     },
    
    async handleGoogleLogin(response) {
      console.log('🔹 Google login response:', response)
      
      this.isLoading = true
      try {
        const credential = response.credential
        
        const decodedCredential = jwtDecode(credential)
        console.log('📋 Decoded credential:', {
          email: decodedCredential.email,
          name: decodedCredential.name,
          picture: decodedCredential.picture,
          sub: decodedCredential.sub,
          aud: decodedCredential.aud,
          exp: new Date(decodedCredential.exp * 1000).toLocaleString(),
          iat: new Date(decodedCredential.iat * 1000).toLocaleString(),
          nbf: new Date(decodedCredential.nbf * 1000).toLocaleString()
        })
        
        const userCredentials = {
          email: decodedCredential.email,
          name: decodedCredential.name,
          picture: decodedCredential.picture,
          sub: decodedCredential.sub,
          aud: decodedCredential.aud,
          exp: new Date(decodedCredential.exp * 1000).toLocaleString(),
          iat: new Date(decodedCredential.iat * 1000).toLocaleString(),
          nbf: new Date(decodedCredential.nbf * 1000).toLocaleString()
        };

        console.log('🔹 User credentials to send to backend:', userCredentials);


        const result = await userService.googleLogin(userCredentials)
        console.log('📦 Full result from backend:', result)
        
        if (result.user) {
          this.user = result.user
          console.log('✅ Login successful - User set:', this.user)
        } else {
          console.error('❌ No user in response')
          throw new Error('No user data received from backend')
        }
        
        console.log('🔍 Checking localStorage:', {
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user')
        })
        
        this.$forceUpdate()
      } catch (err) {
        console.error('❌ Login error:', err)
        alert('Login failed: ' + err.message)
      } finally {
        this.isLoading = false
      }
    },

    loadUserFromStorage() {
      const storedUser = userService.getUser()
      const token = userService.getToken()
      if (storedUser && token) {
        this.user = storedUser
        console.log('✅ User loaded from localStorage:', this.user)
      } else {
        this.user = null
      }
      
      // Load theme preference from localStorage
      // Force light mode
      try {
        if (this.$vuetify.theme?.global?.name) {
          this.$vuetify.theme.global.name.value = 'light'
        }
        localStorage.setItem('theme', 'light')
      } catch {}
    },

    async logout() {
      userService.logout()
      this.user = null
      console.log('🚪 Logged out - localStorage cleared')
      try {
        window?.google?.accounts?.id?.disableAutoSelect?.()
      } catch (err) {
        console.warn('Failed to disable Google auto select', err)
      }
      this.navigate('/')
    },

    navigate(route) {
      this.$router.push(route)
      this.drawer = false
    }
  }
}
</script>




<style scoped>
.navbar-custom {
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
  padding: 6px 12px;
  z-index: 1000 !important;
  position: relative;
}

.logo-wrapper {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 14px;
  padding: 8px;
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: visible;
}

.logo-wrapper::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  padding: 2px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.3), rgba(124, 58, 237, 0.3));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logo-container:hover .logo-wrapper::before {
  opacity: 1;
}

.brand-logo {
  width: 100%;
  height: 100%;
  display: block;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
}

.logo-container:hover .logo-wrapper {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
}

.brand-title {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;
  font-size: 22px;
  letter-spacing: -0.3px;
  font-weight: 800;
}

.brand-subtitle {
  color: #6c757d !important;
  transition: all 0.3s ease;
}

.nav-btn {
  font-weight: 600;
  letter-spacing: 0.1px;
  padding: 10px 14px;
  border-radius: 12px;
  color: #0f172a !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  position: relative;
  overflow: hidden;
}

.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 16px;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #4f46e5, #22d3ee);
  transition: width 0.25s ease;
  border-radius: 999px;
}

.nav-btn:hover::after,
.active-nav-btn::after {
  width: calc(100% - 32px);
}

.nav-btn:hover {
  background: rgba(99, 102, 241, 0.08) !important;
  color: #4f46e5 !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(79, 70, 229, 0.18);
}

.nav-text {
  position: relative;
  z-index: 1;
}

.logo-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 4px 8px;
  border-radius: 12px;
}

.logo-container:hover {
  background: rgba(79, 70, 229, 0.05);
  transform: translateX(-2px);
}

.animated-logo {
  transition: all 0.3s ease;
}

.login-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #22d3ee 100%) !important;
  color: white !important;
  font-weight: 700;
  text-transform: none;
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.28);
  transition: all 0.25s ease;
}

.login-btn:hover {
  box-shadow: 0 16px 32px rgba(79, 70, 229, 0.32);
  transform: translateY(-1px);
}

:deep(.v-btn:hover) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.v-btn--active) {
  color: #667eea !important;
  font-weight: 600;
}

.navbar-custom {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05) !important;
  z-index: 1001 !important;
}

.logo-wrapper {
  animation: subtle-pulse 4s ease-in-out infinite;
}

.icon-pulse {
  animation: iconPulse 0.5s ease;
}

@keyframes iconPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes subtle-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 16px rgba(79, 70, 229, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

/* Theme transition */
:global(.theme-transition) {
  transition: background-color 0.5s ease, color 0.5s ease;
}

:global(.theme-transition *) {
  transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
}

.user-avatar {
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
}

.profile-menu-card {
  overflow: hidden;
  border-radius: 12px;
}
</style>
