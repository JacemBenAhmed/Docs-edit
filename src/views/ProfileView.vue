<template>
  <div class="profile-page">
    <!-- Background Effects -->
    <div class="profile-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>

    <v-container class="profile-container">
      <!-- Header Section -->
      <div class="profile-header-section">
        <div class="header-content">
          <h1 class="page-title">Profile <span class="gradient-text">Settings</span></h1>
          <p class="page-subtitle">Manage your account, preferences, and security settings</p>
        </div>
      </div>

      <v-row>
        <!-- Left Column - Profile Card & Stats -->
        <v-col cols="12" md="4">
          <!-- Profile Card -->
          <div class="profile-card-modern">
            <div class="profile-card-header">
              <div class="avatar-container">
                <v-avatar size="140" class="profile-avatar-main">
                  <v-img 
                    :src="user?.picture || user?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || user?.displayName || 'User')" 
                    :alt="user?.name || user?.displayName || 'User Avatar'"
                    cover
                  />
                  <div class="avatar-overlay">
                    <v-btn
                      icon
                      size="small"
                      color="white"
                      class="avatar-edit-btn"
                      @click="editProfile = true"
                    >
                      <v-icon size="20">mdi-camera</v-icon>
                    </v-btn>
                  </div>
                </v-avatar>
                <div class="online-indicator"></div>
              </div>
            </div>
            
            <div class="profile-card-body">
              <h2 class="user-name">{{ user?.name || user?.displayName || 'User' }}</h2>
              <p class="user-email">{{ user?.email || 'No email' }}</p>
              
              <div class="user-badges">
                <v-chip
                  color="primary"
                  size="small"
                  class="mr-2 mb-2"
                  prepend-icon="mdi-google"
                >
                  Google Account
                </v-chip>
                <v-chip
                  color="success"
                  size="small"
                  class="mb-2"
                  prepend-icon="mdi-check-circle"
                >
                  Verified
                </v-chip>
              </div>
              
              <div class="profile-stats-modern">
                <div class="stat-card">
                  <div class="stat-icon">
                    <v-icon color="#4f46e5" size="28">mdi-file-document-multiple</v-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-number">{{ userStats.documents }}</div>
                    <div class="stat-label">Documents</div>
                  </div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">
                    <v-icon color="#7c3aed" size="28">mdi-share-variant</v-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-number">{{ userStats.shared }}</div>
                    <div class="stat-label">Shared</div>
                  </div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">
                    <v-icon color="#06b6d4" size="28">mdi-cloud</v-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-number">{{ userStats.storage }}</div>
                    <div class="stat-label">Storage</div>
                  </div>
                </div>
              </div>
              
              <div class="profile-actions">
                <v-btn
                  block
                  color="primary"
                  size="large"
                  class="action-btn"
                  prepend-icon="mdi-pencil"
                  @click="editProfile = true"
                >
                  Edit Profile
                </v-btn>
                <v-btn
                  block
                  variant="outlined"
                  color="error"
                  size="large"
                  class="action-btn mt-3"
                  prepend-icon="mdi-logout"
                  @click="handleLogout"
                >
                  Logout
                </v-btn>
              </div>
            </div>
          </div>
          
          <!-- Storage Card -->
          <div class="storage-card-modern">
            <div class="storage-header">
              <v-icon color="primary" size="24" class="mr-2">mdi-cloud-outline</v-icon>
              <h3 class="storage-title">Storage Usage</h3>
            </div>
            
            <div class="storage-content">
              <div class="storage-info">
                <div class="storage-text">
                  <span class="storage-used">{{ userStats.usedStorage }}</span>
                  <span class="storage-total">of {{ userStats.totalStorage }}</span>
                </div>
                <div class="storage-percentage">{{ storagePercentage }}% used</div>
              </div>
              
              <v-progress-linear
                :model-value="storagePercentage"
                color="primary"
                height="12"
                rounded
                class="storage-progress"
              ></v-progress-linear>
              
              <div class="storage-breakdown">
                <div 
                  v-for="(item, index) in storageBreakdown" 
                  :key="index" 
                  class="breakdown-item"
                >
                  <div class="breakdown-header">
                    <div class="breakdown-info">
                      <v-icon :color="item.color" size="18" class="mr-2">{{ item.icon }}</v-icon>
                      <span class="breakdown-type">{{ item.type }}</span>
                    </div>
                    <span class="breakdown-size">{{ item.size }}</span>
                  </div>
                  <v-progress-linear
                    :model-value="item.percentage"
                    :color="item.color"
                    height="6"
                    rounded
                    class="breakdown-progress"
                  ></v-progress-linear>
                </div>
              </div>
              
              <v-btn
                block
                color="primary"
                variant="outlined"
                class="upgrade-btn"
                prepend-icon="mdi-cloud-upload"
              >
                Upgrade Storage
              </v-btn>
            </div>
          </div>
        </v-col>
        
        <!-- Right Column - Settings Tabs -->
        <v-col cols="12" md="8">
          <div class="settings-card-modern">
            <v-tabs 
              v-model="activeTab" 
              color="primary" 
              align-tabs="start"
              class="settings-tabs"
            >
              <v-tab value="account" class="settings-tab">
                <v-icon start size="20">mdi-account-cog</v-icon>
                Account
              </v-tab>
              <v-tab value="preferences" class="settings-tab">
                <v-icon start size="20">mdi-tune</v-icon>
                Preferences
              </v-tab>
              <v-tab value="notifications" class="settings-tab">
                <v-icon start size="20">mdi-bell</v-icon>
                Notifications
              </v-tab>
              <v-tab value="security" class="settings-tab">
                <v-icon start size="20">mdi-shield-lock</v-icon>
                Security
              </v-tab>
            </v-tabs>
            
            <v-window v-model="activeTab" class="settings-window">
              <!-- Account Tab -->
              <v-window-item value="account">
                <div class="settings-content">
                  <div class="settings-header">
                    <h3 class="settings-title">Account Settings</h3>
                    <p class="settings-description">Update your personal information and account details</p>
                  </div>
                  
                  <v-form class="settings-form">
                    <div class="form-group">
                      <label class="form-label">Display Name</label>
                      <v-text-field
                        v-model="accountSettings.name"
                        variant="outlined"
                        prepend-inner-icon="mdi-account"
                        placeholder="Enter your display name"
                        hide-details
                        density="comfortable"
                      ></v-text-field>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Email Address</label>
                      <v-text-field
                        v-model="accountSettings.email"
                        variant="outlined"
                        prepend-inner-icon="mdi-email"
                        disabled
                        hide-details
                        density="comfortable"
                      ></v-text-field>
                      <p class="form-hint">Email cannot be changed. It's linked to your Google account.</p>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Language</label>
                        <v-select
                          v-model="accountSettings.language"
                          :items="languageOptions"
                          variant="outlined"
                          prepend-inner-icon="mdi-translate"
                          hide-details
                          density="comfortable"
                        ></v-select>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">Timezone</label>
                        <v-select
                          v-model="accountSettings.timezone"
                          :items="timezoneOptions"
                          variant="outlined"
                          prepend-inner-icon="mdi-clock-time-four"
                          hide-details
                          density="comfortable"
                        ></v-select>
                      </div>
                    </div>
                    
                    <div class="form-actions">
                      <v-btn
                        color="primary"
                        size="large"
                        class="save-btn"
                        prepend-icon="mdi-content-save"
                        @click="saveAccountSettings"
                      >
                        Save Changes
                      </v-btn>
                    </div>
                  </v-form>
                </div>
              </v-window-item>
              
              <!-- Preferences Tab -->
              <v-window-item value="preferences">
                <div class="settings-content">
                  <div class="settings-header">
                    <h3 class="settings-title">Preferences</h3>
                    <p class="settings-description">Customize your workspace and editor settings</p>
                  </div>
                  
                  <div class="preferences-list">
                    <div class="preference-section">
                      <h4 class="section-title">Theme</h4>
                      <div class="preference-item">
                        <div class="preference-info">
                          <v-icon color="primary" size="22" class="mr-3">mdi-theme-light-dark</v-icon>
                          <div>
                            <div class="preference-name">Dark Mode</div>
                            <div class="preference-desc">Switch between light and dark theme</div>
                          </div>
                        </div>
                        <v-switch
                          v-model="preferences.darkMode"
                          color="primary"
                          hide-details
                          @change="toggleTheme"
                        ></v-switch>
                      </div>
                    </div>
                    
                    <v-divider class="my-4"></v-divider>
                    
                    <div class="preference-section">
                      <h4 class="section-title">Document Settings</h4>
                      <div class="preference-item">
                        <div class="preference-info">
                          <v-icon color="primary" size="22" class="mr-3">mdi-file-document</v-icon>
                          <div>
                            <div class="preference-name">Default Document View</div>
                            <div class="preference-desc">Choose how documents are displayed</div>
                          </div>
                        </div>
                        <v-select
                          v-model="preferences.defaultView"
                          :items="viewOptions"
                          variant="outlined"
                          density="compact"
                          hide-details
                          style="min-width: 150px;"
                        ></v-select>
                      </div>
                      
                      <div class="preference-item mt-4">
                        <div class="preference-info">
                          <v-icon color="primary" size="22" class="mr-3">mdi-sort</v-icon>
                          <div>
                            <div class="preference-name">Default Sort Order</div>
                            <div class="preference-desc">How documents are sorted by default</div>
                          </div>
                        </div>
                        <v-select
                          v-model="preferences.defaultSort"
                          :items="sortOptions"
                          variant="outlined"
                          density="compact"
                          hide-details
                          style="min-width: 150px;"
                        ></v-select>
                      </div>
                    </div>
                    
                    <v-divider class="my-4"></v-divider>
                    
                    <div class="preference-section">
                      <h4 class="section-title">Editor Settings</h4>
                      <div class="preference-item">
                        <div class="preference-info">
                          <v-icon color="primary" size="22" class="mr-3">mdi-auto-fix</v-icon>
                          <div>
                            <div class="preference-name">Auto Save</div>
                            <div class="preference-desc">Automatically save your work</div>
                          </div>
                        </div>
                        <v-switch
                          v-model="preferences.autoSave"
                          color="primary"
                          hide-details
                        ></v-switch>
                      </div>
                      
                      <div class="preference-item mt-4">
                        <div class="preference-info">
                          <v-icon color="primary" size="22" class="mr-3">mdi-spellcheck</v-icon>
                          <div>
                            <div class="preference-name">Spell Check</div>
                            <div class="preference-desc">Enable spell checking in editor</div>
                          </div>
                        </div>
                        <v-switch
                          v-model="preferences.spellCheck"
                          color="primary"
                          hide-details
                        ></v-switch>
                      </div>
                    </div>
                    
                    <div class="form-actions mt-6">
                      <v-btn
                        color="primary"
                        size="large"
                        class="save-btn"
                        prepend-icon="mdi-content-save"
                        @click="savePreferences"
                      >
                        Save Preferences
                      </v-btn>
                    </div>
                  </div>
                </div>
              </v-window-item>
              
              <!-- Notifications Tab -->
              <v-window-item value="notifications">
                <div class="settings-content">
                  <div class="settings-header">
                    <h3 class="settings-title">Notification Settings</h3>
                    <p class="settings-description">Control how and when you receive notifications</p>
                  </div>
                  
                  <div class="notifications-list">
                    <div 
                      v-for="(notification, key) in notifications" 
                      :key="key"
                      class="notification-item"
                    >
                      <div class="notification-info">
                        <v-icon :color="notificationIcons[key].color" size="24" class="mr-3">
                          {{ notificationIcons[key].icon }}
                        </v-icon>
                        <div>
                          <div class="notification-name">{{ notificationIcons[key].name }}</div>
                          <div class="notification-desc">{{ notificationIcons[key].description }}</div>
                        </div>
                      </div>
                      <v-switch
                        v-model="notifications[key]"
                        color="primary"
                        hide-details
                      ></v-switch>
                    </div>
                  </div>
                  
                  <div class="form-actions mt-6">
                    <v-btn
                      color="primary"
                      size="large"
                      class="save-btn"
                      prepend-icon="mdi-content-save"
                      @click="saveNotifications"
                    >
                      Save Notification Settings
                    </v-btn>
                  </div>
                </div>
              </v-window-item>
              
              <!-- Security Tab -->
              <v-window-item value="security">
                <div class="settings-content">
                  <div class="settings-header">
                    <h3 class="settings-title">Security Settings</h3>
                    <p class="settings-description">Manage your account security and privacy</p>
                  </div>
                  
                  <v-alert
                    type="info"
                    variant="tonal"
                    class="security-alert mb-6"
                  >
                    <div class="d-flex align-center">
                      <v-icon class="mr-3" size="24">mdi-google</v-icon>
                      <div>
                        <div class="font-weight-bold">Google Account Connected</div>
                        <div class="text-caption">Your account is secured through Google Authentication</div>
                      </div>
                    </div>
                  </v-alert>
                  
                  <div class="security-list">
                    <div class="security-item">
                      <div class="security-info">
                        <v-icon color="primary" size="24" class="mr-3">mdi-two-factor-authentication</v-icon>
                        <div>
                          <div class="security-name">Two-Factor Authentication</div>
                          <div class="security-desc">Add an extra layer of security to your account</div>
                        </div>
                      </div>
                      <v-switch
                        v-model="security.twoFactor"
                        color="primary"
                        hide-details
                      ></v-switch>
                    </div>
                    
                    <div class="security-item mt-4">
                      <div class="security-info">
                        <v-icon color="primary" size="24" class="mr-3">mdi-history</v-icon>
                        <div>
                          <div class="security-name">Login History</div>
                          <div class="security-desc">View your recent login activity</div>
                        </div>
                      </div>
                      <v-btn
                        variant="text"
                        color="primary"
                        @click="viewLoginHistory = true"
                      >
                        View
                      </v-btn>
                    </div>
                    
                    <div class="security-item mt-4">
                      <div class="security-info">
                        <v-icon color="primary" size="24" class="mr-3">mdi-devices</v-icon>
                        <div>
                          <div class="security-name">Connected Devices</div>
                          <div class="security-desc">Manage devices connected to your account</div>
                        </div>
                      </div>
                      <v-btn
                        variant="text"
                        color="primary"
                        @click="viewConnectedDevices = true"
                      >
                        Manage
                      </v-btn>
                    </div>
                  </div>
                  
                  <v-divider class="my-6"></v-divider>
                  
                  <div class="danger-zone">
                    <h4 class="danger-title">Danger Zone</h4>
                    <v-btn
                      variant="outlined"
                      color="error"
                      prepend-icon="mdi-delete"
                      class="danger-btn"
                      @click="confirmDeleteAccount = true"
                    >
                      Delete Account
                    </v-btn>
                    <p class="danger-warning">This action cannot be undone. All your data will be permanently deleted.</p>
                  </div>
                </div>
              </v-window-item>
            </v-window>
          </div>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Edit Profile Dialog -->
    <v-dialog v-model="editProfile" max-width="600" persistent>
      <v-card class="edit-dialog">
        <v-card-title class="dialog-header">
          <span>Edit Profile</span>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="editProfile = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="dialog-content">
          <div class="avatar-upload-section">
            <v-avatar size="120" class="edit-avatar">
              <v-img 
                :src="user?.picture || user?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(editProfileData.displayName || 'User')" 
                alt="User Avatar"
                cover
              />
            </v-avatar>
            <v-btn
              variant="outlined"
              color="primary"
              size="small"
              prepend-icon="mdi-camera"
              class="mt-3"
            >
              Change Photo
            </v-btn>
          </div>
          
          <v-form class="edit-form">
            <v-text-field
              v-model="editProfileData.displayName"
              label="Display Name"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              class="mb-4"
            ></v-text-field>
            
            <v-textarea
              v-model="editProfileData.bio"
              label="Bio"
              variant="outlined"
              prepend-inner-icon="mdi-text"
              rows="4"
              placeholder="Tell us about yourself..."
            ></v-textarea>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="editProfile = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-content-save"
            @click="saveProfile"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar 
      v-model="snackbar.show" 
      :timeout="3000" 
      location="bottom right"
      color="success"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import userService from '../services/userService.js'

export default {
  name: 'ProfileView',
  data() {
    return {
      activeTab: 'account',
      editProfile: false,
      viewLoginHistory: false,
      viewConnectedDevices: false,
      confirmDeleteAccount: false,
      
      user: null,
      
      editProfileData: {
        displayName: '',
        bio: ''
      },
      
      userStats: {
        documents: 0,
        shared: 0,
        storage: '0 GB',
        usedStorage: '0 GB',
        totalStorage: '15 GB',
        usedStorageBytes: 0,
        totalStorageBytes: 15 * 1024 * 1024 * 1024
      },
      
      storageBreakdown: [
        {
          type: 'Documents',
          size: '0 GB',
          percentage: 0,
          color: 'blue',
          icon: 'mdi-file-document'
        },
        {
          type: 'Images',
          size: '0 GB',
          percentage: 0,
          color: 'purple',
          icon: 'mdi-file-image'
        },
        {
          type: 'Presentations',
          size: '0 GB',
          percentage: 0,
          color: 'orange',
          icon: 'mdi-file-powerpoint'
        }
      ],
      
      accountSettings: {
        name: '',
        email: '',
        language: 'English',
        timezone: 'UTC-5 (Eastern Time)'
      },
      
      preferences: {
        darkMode: false,
        defaultView: 'Grid',
        defaultSort: 'Date Modified',
        autoSave: true,
        spellCheck: true
      },
      
      notifications: {
        shares: true,
        comments: true,
        edits: true,
        email: true
      },
      
      notificationIcons: {
        shares: {
          icon: 'mdi-share',
          name: 'Document Shares',
          description: 'Notify when someone shares a document with you',
          color: 'primary'
        },
        comments: {
          icon: 'mdi-comment',
          name: 'Comments',
          description: 'Notify when someone comments on your document',
          color: 'primary'
        },
        edits: {
          icon: 'mdi-pencil',
          name: 'Edits',
          description: 'Notify when someone edits your document',
          color: 'primary'
        },
        email: {
          icon: 'mdi-email',
          name: 'Email Notifications',
          description: 'Receive notifications via email',
          color: 'primary'
        }
      },
      
      security: {
        twoFactor: false
      },
      
      languageOptions: [
        'English',
        'Spanish',
        'French',
        'German',
        'Chinese',
        'Japanese'
      ],
      
      timezoneOptions: [
        'UTC-8 (Pacific Time)',
        'UTC-7 (Mountain Time)',
        'UTC-6 (Central Time)',
        'UTC-5 (Eastern Time)',
        'UTC+0 (Greenwich Mean Time)',
        'UTC+1 (Central European Time)',
        'UTC+8 (China Standard Time)',
        'UTC+9 (Japan Standard Time)'
      ],
      
      viewOptions: [
        'Grid',
        'List',
        'Compact'
      ],
      
      sortOptions: [
        'Date Modified',
        'Date Created',
        'Name (A-Z)',
        'Name (Z-A)',
        'Size'
      ],

      snackbar: {
        show: false,
        message: ''
      }
    }
  },
  computed: {
    storagePercentage() {
      return Math.round((this.userStats.usedStorageBytes / this.userStats.totalStorageBytes) * 100)
    }
  },
  mounted() {
    this.loadUserData()
    this.loadPreferences()
  },
  methods: {
    loadUserData() {
      const storedUser = userService.getUser()
      if (storedUser) {
        this.user = storedUser
        this.accountSettings.name = storedUser.name || storedUser.displayName || ''
        this.accountSettings.email = storedUser.email || ''
        this.editProfileData.displayName = storedUser.name || storedUser.displayName || ''
        this.editProfileData.bio = storedUser.bio || ''
      } else {
        // Redirect to home if not logged in
        this.$router.push('/')
      }
    },
    
    loadPreferences() {
      try {
        const savedPrefs = localStorage.getItem('userPreferences')
        if (savedPrefs) {
          this.preferences = { ...this.preferences, ...JSON.parse(savedPrefs) }
        }
        this.preferences.darkMode = !!this.$vuetify.theme?.global?.current?.value?.dark
      } catch (e) {
        console.error('Error loading preferences:', e)
      }
    },
    
    toggleTheme() {
      try {
        const next = this.preferences.darkMode ? 'dark' : 'light'
        if (this.$vuetify.theme?.global?.name) {
          this.$vuetify.theme.global.name.value = next
        }
        localStorage.setItem('theme', next)
        document.body.classList.add('theme-transition')
        setTimeout(() => { document.body.classList.remove('theme-transition') }, 500)
      } catch (e) {
        console.error('Error toggling theme:', e)
      }
    },
    
    saveProfile() {
      if (this.user) {
        this.user.name = this.editProfileData.displayName
        this.user.displayName = this.editProfileData.displayName
        this.user.bio = this.editProfileData.bio
        localStorage.setItem('user', JSON.stringify(this.user))
        this.showSnackbar('Profile updated successfully')
        this.editProfile = false
      }
    },
    
    saveAccountSettings() {
      if (this.user) {
        this.user.name = this.accountSettings.name
        this.user.displayName = this.accountSettings.name
        localStorage.setItem('user', JSON.stringify(this.user))
        this.showSnackbar('Account settings saved successfully')
      }
    },
    
    savePreferences() {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences))
      this.showSnackbar('Preferences saved successfully')
    },
    
    saveNotifications() {
      localStorage.setItem('userNotifications', JSON.stringify(this.notifications))
      this.showSnackbar('Notification settings saved successfully')
    },
    
    async handleLogout() {
      try {
        await userService.logout()
        // Disable Google auto-select
        try {
          window?.google?.accounts?.id?.disableAutoSelect?.()
        } catch (err) {
          console.warn('Failed to disable Google auto select', err)
        }
        this.$router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
        // Force logout even if there's an error
        this.$router.push('/')
      }
    },
    
    showSnackbar(message) {
      this.snackbar.message = message
      this.snackbar.show = true
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  position: relative;
  padding: 40px 0;
}

.profile-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float-orb 20s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -100px;
  left: -100px;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  bottom: -50px;
  right: -50px;
  animation-delay: 5s;
}

.profile-container {
  position: relative;
  z-index: 2;
}

.profile-header-section {
  margin-bottom: 40px;
  text-align: center;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: clamp(36px, 5vw, 48px);
  font-weight: 900;
  letter-spacing: -1px;
  color: #0f172a;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 18px;
  color: #64748b;
}

.gradient-text {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Profile Card */
.profile-card-modern {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
}

.profile-card-modern:hover {
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.15);
  transform: translateY(-2px);
}

.profile-card-header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  padding: 40px 20px 80px;
  position: relative;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.profile-avatar-main {
  border: 5px solid white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.profile-avatar-main:hover {
  transform: scale(1.05);
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-edit-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.online-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #10b981;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
}

.profile-card-body {
  padding: 60px 24px 24px;
  text-align: center;
}

.user-name {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.user-email {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 20px;
}

.user-badges {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.profile-stats-modern {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  padding: 24px 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.profile-actions {
  margin-top: 24px;
}

.action-btn {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.2px;
}

/* Storage Card */
.storage-card-modern {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.1);
  padding: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.storage-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.storage-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.storage-content {
  margin-top: 16px;
}

.storage-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.storage-text {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.storage-used {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
}

.storage-total {
  font-size: 16px;
  color: #64748b;
}

.storage-percentage {
  font-size: 14px;
  font-weight: 600;
  color: #4f46e5;
}

.storage-progress {
  margin-bottom: 24px;
}

.storage-breakdown {
  margin-bottom: 24px;
}

.breakdown-item {
  margin-bottom: 16px;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.breakdown-info {
  display: flex;
  align-items: center;
}

.breakdown-type {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.breakdown-size {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.breakdown-progress {
  margin-top: 4px;
}

.upgrade-btn {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
}

/* Settings Card */
.settings-card-modern {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
}

.settings-tabs {
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.settings-tab {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.settings-window {
  min-height: 500px;
}

.settings-content {
  padding: 32px;
}

.settings-header {
  margin-bottom: 32px;
}

.settings-title {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.settings-description {
  font-size: 16px;
  color: #64748b;
}

.settings-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.form-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  margin-top: 32px;
}

.save-btn {
  border-radius: 12px;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0.2px;
  padding: 0 32px;
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
}

.save-btn:hover {
  box-shadow: 0 12px 32px rgba(79, 70, 229, 0.4);
  transform: translateY(-2px);
}

/* Preferences */
.preferences-list {
  max-width: 700px;
}

.preference-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.preference-item:hover {
  background: #f1f5f9;
}

.preference-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.preference-name {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.preference-desc {
  font-size: 13px;
  color: #64748b;
}

/* Notifications */
.notifications-list {
  max-width: 700px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.notification-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.notification-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.notification-name {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.notification-desc {
  font-size: 13px;
  color: #64748b;
}

/* Security */
.security-alert {
  border-radius: 12px;
}

.security-list {
  max-width: 700px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.security-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.security-name {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.security-desc {
  font-size: 13px;
  color: #64748b;
}

.danger-zone {
  padding: 24px;
  background: #fef2f2;
  border-radius: 12px;
  border: 1px solid #fecaca;
}

.danger-title {
  font-size: 18px;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 16px;
}

.danger-btn {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
}

.danger-warning {
  font-size: 13px;
  color: #991b1b;
  margin-top: 8px;
}

/* Edit Dialog */
.edit-dialog {
  border-radius: 20px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 20px;
  font-weight: 700;
}

.dialog-content {
  padding: 32px;
}

.avatar-upload-section {
  text-align: center;
  margin-bottom: 32px;
}

.edit-avatar {
  border: 4px solid #e2e8f0;
  margin-bottom: 16px;
}

.edit-form {
  max-width: 500px;
  margin: 0 auto;
}

.dialog-actions {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
}

@keyframes float-orb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

/* Responsive */
@media (max-width: 960px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .profile-stats-modern {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .profile-card-body {
    padding: 60px 16px 16px;
  }
}

@media (max-width: 600px) {
  .profile-page {
    padding: 20px 0;
  }
  
  .settings-content {
    padding: 20px;
  }
  
  .preference-item,
  .notification-item,
  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
