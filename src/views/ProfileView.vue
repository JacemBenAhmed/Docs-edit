<template>
  <div class="profile-view">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <!-- Profile Card -->
          <v-card class="profile-card mb-6" :class="$vuetify.theme.dark ? 'dark-card' : ''">
            <div class="profile-header">
              <div class="avatar-wrapper">
                <v-avatar size="120" class="profile-avatar">
                  <v-img :src="user.photoURL || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="User Avatar" />
                </v-avatar>
              </div>
            </div>
            <v-card-text class="text-center">
              <h2 class="text-h4 font-weight-bold mb-1">{{ user.displayName }}</h2>
              <p class="text-body-1 text-grey mb-4">{{ user.email }}</p>
              
              <div class="d-flex justify-center mb-4">
                <v-chip color="primary" class="mr-2">
                  <v-icon start>mdi-google</v-icon>
                  Google Account
                </v-chip>
                <v-chip color="success">
                  <v-icon start>mdi-check-circle</v-icon>
                  Verified
                </v-chip>
              </div>
              
              <div class="profile-stats d-flex justify-space-around mb-4">
                <div class="stat-item">
                  <div class="text-h5 font-weight-bold">{{ userStats.documents }}</div>
                  <div class="text-caption text-grey">Documents</div>
                </div>
                <div class="stat-item">
                  <div class="text-h5 font-weight-bold">{{ userStats.shared }}</div>
                  <div class="text-caption text-grey">Shared</div>
                </div>
                <div class="stat-item">
                  <div class="text-h5 font-weight-bold">{{ userStats.storage }}</div>
                  <div class="text-caption text-grey">Storage</div>
                </div>
              </div>
              
              <v-btn
                block
                color="primary"
                prepend-icon="mdi-pencil"
                class="mb-2"
                @click="editProfile = true"
              >
                Edit Profile
              </v-btn>
              <v-btn
                block
                variant="outlined"
                color="error"
                prepend-icon="mdi-logout"
                @click="logout"
              >
                Logout
              </v-btn>
            </v-card-text>
          </v-card>
          
          <!-- Storage Card -->
          <v-card class="storage-card" :class="$vuetify.theme.dark ? 'dark-card' : ''">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-cloud-outline</v-icon>
              Storage
            </v-card-title>
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-body-1">{{ userStats.usedStorage }} of {{ userStats.totalStorage }}</span>
                <span class="text-caption">{{ storagePercentage }}% used</span>
              </div>
              <v-progress-linear
                :model-value="storagePercentage"
                color="primary"
                height="8"
                rounded
              ></v-progress-linear>
              
              <div class="storage-breakdown mt-6">
                <h4 class="text-subtitle-1 font-weight-medium mb-3">Storage Breakdown</h4>
                <div v-for="(item, index) in storageBreakdown" :key="index" class="mb-3">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <div class="d-flex align-center">
                      <v-icon :color="item.color" size="small" class="mr-2">{{ item.icon }}</v-icon>
                      <span class="text-body-2">{{ item.type }}</span>
                    </div>
                    <span class="text-caption">{{ item.size }}</span>
                  </div>
                  <v-progress-linear
                    :model-value="item.percentage"
                    :color="item.color"
                    height="4"
                    rounded
                  ></v-progress-linear>
                </div>
              </div>
              
              <v-btn
                block
                color="primary"
                variant="outlined"
                class="mt-4"
                prepend-icon="mdi-cloud-upload"
              >
                Upgrade Storage
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="8">
          <!-- Settings Tabs -->
          <v-card :class="$vuetify.theme.dark ? 'dark-card' : ''">
            <v-tabs v-model="activeTab" color="primary" align-tabs="center">
              <v-tab value="account">
                <v-icon start>mdi-account-cog</v-icon>
                Account
              </v-tab>
              <v-tab value="preferences">
                <v-icon start>mdi-tune</v-icon>
                Preferences
              </v-tab>
              <v-tab value="notifications">
                <v-icon start>mdi-bell</v-icon>
                Notifications
              </v-tab>
              <v-tab value="security">
                <v-icon start>mdi-shield-lock</v-icon>
                Security
              </v-tab>
            </v-tabs>
            
            <v-window v-model="activeTab">
              <!-- Account Tab -->
              <v-window-item value="account">
                <v-card-text>
                  <h3 class="text-h5 font-weight-bold mb-4">Account Settings</h3>
                  
                  <v-form>
                    <v-text-field
                      v-model="accountSettings.name"
                      label="Display Name"
                      variant="outlined"
                      prepend-inner-icon="mdi-account"
                      class="mb-4"
                    ></v-text-field>
                    
                    <v-text-field
                      v-model="accountSettings.email"
                      label="Email Address"
                      variant="outlined"
                      prepend-inner-icon="mdi-email"
                      disabled
                      class="mb-4"
                    ></v-text-field>
                    
                    <v-select
                      v-model="accountSettings.language"
                      :items="languageOptions"
                      label="Language"
                      variant="outlined"
                      prepend-inner-icon="mdi-translate"
                      class="mb-4"
                    ></v-select>
                    
                    <v-select
                      v-model="accountSettings.timezone"
                      :items="timezoneOptions"
                      label="Timezone"
                      variant="outlined"
                      prepend-inner-icon="mdi-clock-time-four"
                      class="mb-4"
                    ></v-select>
                    
                    <div class="d-flex justify-end">
                      <v-btn
                        color="primary"
                        class="animated-btn"
                        @click="saveAccountSettings"
                      >
                        Save Changes
                      </v-btn>
                    </div>
                  </v-form>
                </v-card-text>
              </v-window-item>
              
              <!-- Preferences Tab -->
              <v-window-item value="preferences">
                <v-card-text>
                  <h3 class="text-h5 font-weight-bold mb-4">Preferences</h3>
                  
                  <v-list>
                    <v-list-subheader>Theme</v-list-subheader>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-theme-light-dark</v-icon>
                      </template>
                      <v-list-item-title>Dark Mode</v-list-item-title>
                      <template v-slot:append>
                        <v-switch
                          v-model="preferences.darkMode"
                          color="primary"
                          hide-details
                          @change="toggleTheme"
                        ></v-switch>
                      </template>
                    </v-list-item>
                    
                    <v-divider class="my-2"></v-divider>
                    <v-list-subheader>Document Settings</v-list-subheader>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-file-document</v-icon>
                      </template>
                      <v-list-item-title>Default Document View</v-list-item-title>
                      <template v-slot:append>
                        <v-select
                          v-model="preferences.defaultView"
                          :items="viewOptions"
                          variant="plain"
                          density="compact"
                          hide-details
                          class="max-width-150"
                        ></v-select>
                      </template>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-sort</v-icon>
                      </template>
                      <v-list-item-title>Default Sort Order</v-list-item-title>
                      <template v-slot:append>
                        <v-select
                          v-model="preferences.defaultSort"
                          :items="sortOptions"
                          variant="plain"
                          density="compact"
                          hide-details
                          class="max-width-150"
                        ></v-select>
                      </template>
                    </v-list-item>
                    
                    <v-divider class="my-2"></v-divider>
                    <v-list-subheader>Editor Settings</v-list-subheader>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-auto-fix</v-icon>
                      </template>
                      <v-list-item-title>Auto Save</v-list-item-title>
                      <template v-slot:append>
                        <v-switch
                          v-model="preferences.autoSave"
                          color="primary"
                          hide-details
                        ></v-switch>
                      </template>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-spellcheck</v-icon>
                      </template>
                      <v-list-item-title>Spell Check</v-list-item-title>
                      <template v-slot:append>
                        <v-switch
                          v-model="preferences.spellCheck"
                          color="primary"
                          hide-details
                        ></v-switch>
                      </template>
                    </v-list-item>
                  </v-list>
                  
                  <div class="d-flex justify-end mt-4">
                    <v-btn
                      color="primary"
                      class="animated-btn"
                      @click="savePreferences"
                    >
                      Save Preferences
                    </v-btn>
                  </div>
                </v-card-text>
              </v-window-item>
              
              <!-- Notifications Tab -->
              <v-window-item value="notifications">
                <v-card-text>
                  <h3 class="text-h5 font-weight-bold mb-4">Notification Settings</h3>
                  
                  <v-list>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-share</v-icon>
                      </template>
                      <v-list-item-title>Document Shares</v-list-item-title>
                      <v-list-item-subtitle>Notify when someone shares a document with you</v-list-item-subtitle>
                      <template v-slot:append>
                        <v-switch
                          v-model="notifications.shares"
                          color="primary"
                          hide-details
                        ></v-switch>
                      </template>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-comment</v-icon>
                      </template>
                      <v-list-item-title>Comments</v-list-item-title>
                      <v-list-item-subtitle>Notify when someone comments on your document</v-list-item-subtitle>
                      <template v-slot:append>
                        <v-switch
                          v-model="notifications.comments"
                          color="primary"
                          hide-details
                        ></v-switch>
                      </template>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-pencil</v-icon>
                      </template>
                      <v-list-item-title>Edits</v-list-item-title>
                      <v-list-item-subtitle>Notify when someone edits your document</v-list-item-subtitle>
                      <template v-slot:append>
                        <v-switch
                          v-model="notifications.edits"
                          color="primary"
                          hide-details
                        ></v-switch>
                      </template>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-email</v-icon>
                      </template>
                      <v-list-item-title>Email Notifications</v-list-item-title>
                      <v-list-item-subtitle>Receive notifications via email</v-list-item-subtitle>
                      <template v-slot:append>
                        <v-switch
                          v-model="notifications.email"
                          color="primary"
                          hide-details
                        ></v-switch>
                      </template>
                    </v-list-item>
                  </v-list>
                  
                  <div class="d-flex justify-end mt-4">
                    <v-btn
                      color="primary"
                      class="animated-btn"
                      @click="saveNotifications"
                    >
                      Save Notification Settings
                    </v-btn>
                  </div>
                </v-card-text>
              </v-window-item>
              
              <!-- Security Tab -->
              <v-window-item value="security">
                <v-card-text>
                  <h3 class="text-h5 font-weight-bold mb-4">Security Settings</h3>
                  
                  <v-alert
                    type="info"
                    variant="tonal"
                    class="mb-4"
                  >
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">mdi-google</v-icon>
                      <div>
                        <div class="font-weight-bold">Google Account Connected</div>
                        <div class="text-caption">Your account is secured through Google Authentication</div>
                      </div>
                    </div>
                  </v-alert>
                  
                  <v-list>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-two-factor-authentication</v-icon>
                      </template>
                      <v-list-item-title>Two-Factor Authentication</v-list-item-title>
                      <v-list-item-subtitle>Add an extra layer of security to your account</v-list-item-subtitle>
                      <template v-slot:append>
                        <v-switch
                          v-model="security.twoFactor"
                          color="primary"
                          hide-details
                        ></v-switch>
                      </template>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-history</v-icon>
                      </template>
                      <v-list-item-title>Login History</v-list-item-title>
                      <v-list-item-subtitle>View your recent login activity</v-list-item-subtitle>
                      <template v-slot:append>
                        <v-btn
                          variant="text"
                          color="primary"
                          @click="viewLoginHistory = true"
                        >
                          View
                        </v-btn>
                      </template>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-devices</v-icon>
                      </template>
                      <v-list-item-title>Connected Devices</v-list-item-title>
                      <v-list-item-subtitle>Manage devices connected to your account</v-list-item-subtitle>
                      <template v-slot:append>
                        <v-btn
                          variant="text"
                          color="primary"
                          @click="viewConnectedDevices = true"
                        >
                          Manage
                        </v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
                  
                  <v-divider class="my-4"></v-divider>
                  
                  <div class="d-flex flex-column">
                    <v-btn
                      variant="outlined"
                      color="error"
                      prepend-icon="mdi-delete"
                      class="mb-2"
                      @click="confirmDeleteAccount = true"
                    >
                      Delete Account
                    </v-btn>
                    <span class="text-caption text-grey">This action cannot be undone</span>
                  </div>
                </v-card-text>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Edit Profile Dialog -->
    <v-dialog v-model="editProfile" max-width="500">
      <v-card>
        <v-card-title>Edit Profile</v-card-title>
        <v-card-text>
          <v-form>
            <div class="text-center mb-4">
              <v-avatar size="100" class="mb-2">
                <v-img :src="user.photoURL" alt="User Avatar" />
              </v-avatar>
              <div>
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  prepend-icon="mdi-camera"
                >
                  Change Photo
                </v-btn>
              </div>
            </div>
            
            <v-text-field
              v-model="editProfileData.displayName"
              label="Display Name"
              variant="outlined"
              class="mb-3"
            ></v-text-field>
            
            <v-textarea
              v-model="editProfileData.bio"
              label="Bio"
              variant="outlined"
              rows="3"
              class="mb-3"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="editProfile = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="saveProfile"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :timeout="2500" location="bottom right">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" color="primary" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'ProfileView',
  data() {
    return {
      activeTab: 'account',
      editProfile: false,
      viewLoginHistory: false,
      viewConnectedDevices: false,
      confirmDeleteAccount: false,
      
      user: {
        displayName: 'John Doe',
        email: 'johndoe@gmail.com',
        photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocLFBdibT4uZGrBHSuU_D0rQiXzJ6YQwvAqJvB0xT_DF=s96-c',
        bio: 'Product Designer & Developer'
      },
      
      editProfileData: {
        displayName: 'John Doe',
        bio: 'Product Designer & Developer'
      },
      
      userStats: {
        documents: 24,
        shared: 8,
        storage: '2.4 GB',
        usedStorage: '2.4 GB',
        totalStorage: '15 GB',
        usedStorageBytes: 2.4 * 1024 * 1024 * 1024,
        totalStorageBytes: 15 * 1024 * 1024 * 1024
      },
      
      storageBreakdown: [
        {
          type: 'Documents',
          size: '1.2 GB',
          percentage: 50,
          color: 'blue',
          icon: 'mdi-file-document'
        },
        {
          type: 'Images',
          size: '800 MB',
          percentage: 33,
          color: 'purple',
          icon: 'mdi-file-image'
        },
        {
          type: 'Presentations',
          size: '400 MB',
          percentage: 17,
          color: 'orange',
          icon: 'mdi-file-powerpoint'
        }
      ],
      
      accountSettings: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
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
    try {
      this.preferences.darkMode = !!this.$vuetify.theme?.global?.current?.value?.dark
    } catch { this.preferences.darkMode = false }
  },
  methods: {
    toggleTheme() {
      try {
        const next = this.preferences.darkMode ? 'dark' : 'light'
        if (this.$vuetify.theme?.global?.name) {
          this.$vuetify.theme.global.name.value = next
        }
        localStorage.setItem('theme', next)
        document.body.classList.add('theme-transition')
        setTimeout(() => { document.body.classList.remove('theme-transition') }, 500)
      } catch {}
    },
    
    saveProfile() {
      this.user.displayName = this.editProfileData.displayName
      this.user.bio = this.editProfileData.bio
      this.editProfile = false
      this.showSnackbar('Profile updated successfully')
    },
    
    saveAccountSettings() {
      this.user.displayName = this.accountSettings.name
      this.showSnackbar('Account settings saved successfully')
    },
    
    savePreferences() {
      this.showSnackbar('Preferences saved successfully')
    },
    
    saveNotifications() {
      this.showSnackbar('Notification settings saved successfully')
    },
    
    logout() {
      // Implement logout functionality
      console.log('Logging out...')
      this.$router.push('/')
    },
    showSnackbar(message) {
      this.snackbar.message = message
      this.snackbar.show = true
    }
  }
}
</script>

<style scoped>
.profile-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.profile-header {
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.avatar-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -60px;
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}

.profile-stats {
  padding: 1rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.storage-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.animated-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  padding: 0 24px;
  border-radius: 30px;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.animated-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
}

.max-width-150 {
  max-width: 150px;
}

.dark-card {
  background: linear-gradient(145deg, #2d3748, #1a202c);
  color: #e2e8f0;
}
</style>