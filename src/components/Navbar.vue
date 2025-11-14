<template>
  <v-app-bar color="white" prominent elevation="2" class="navbar-custom px-2 px-md-6">
    <template v-slot:prepend>
      <div class="d-flex align-center mr-4 logo-container animated-logo" @click="$router.push('/')" style="cursor: pointer;">
        <v-avatar size="48" class="mr-3 brand-avatar floating">
          <v-img src="../assets/logo.svg" alt="Docs Edit Logo" />
        </v-avatar>
        <div class="d-flex flex-column">
          <span class="text-h6 font-weight-bold brand-title gradient-text">Docs Edit</span>
          <span class="text-caption brand-subtitle">Document Workspace</span>
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
        { name: 'Profile', icon: 'mdi-account-outline', route: '/profile' },
        { name: 'Settings', icon: 'mdi-cog-outline', route: '/settings' },
        
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
  background: linear-gradient(to right, #ffffff 0%, #f8f9fa 100%) !important;
  border-bottom: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.brand-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  transition: transform 0.5s ease;
}

.brand-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;
}

.brand-subtitle {
  color: #6c757d !important;
  transition: all 0.3s ease;
}

.nav-btn {
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-btn:hover::after,
.active-nav-btn::after {
  width: 80%;
}

.nav-btn:hover {
  background-color: #f8f9fa !important;
  color: #667eea !important;
  transform: translateY(-1px);
}

.nav-text {
  position: relative;
  z-index: 1;
}

.animated-logo {
  transition: all 0.3s ease;
}

.animated-logo:hover .brand-avatar {
  transform: scale(1.1) rotate(5deg);
}

.login-btn {
  background: #4285f4 !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: #357ae8 !important;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.4);
  transform: translateY(-1px);
}

.login-btn:active {
  transform: translateY(0);
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
}

.brand-avatar {
  animation: subtle-pulse 3s ease-in-out infinite;
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
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
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
