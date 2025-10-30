<template>
  <v-container fluid>
    <!-- Hero Section -->
    <v-row class="hero-section align-center">
      <v-col cols="12" md="6" class="text-center text-md-left">
        <h1 class="text-h2 font-weight-bold mb-4">Edit Documents <span class="gradient-text">Seamlessly</span></h1>
        <p class="text-body-1 mb-6">
          A modern platform for editing and managing your documents with Google Docs integration.
          Create, edit, and share your documents with ease.
        </p>
        <v-btn
          size="large"
          color="primary"
          class="start-btn px-8 py-3 pulse-on-hover"
          elevation="4"
          @click="$router.push('/upload')"
        >
          <v-icon class="mr-2 btn-icon-animate">mdi-rocket-launch</v-icon>
          Start Editing
        </v-btn>
      </v-col>
      <v-col cols="12" md="6" class="text-center">
        <div class="hero-image-container">
          <img src="../assets/hero-image.svg" alt="Document Editing" class="hero-image" />
        </div>
      </v-col>
    </v-row>

    <!-- How It Works Section -->
<v-container class="py-12">
      <h2 class="text-h4 text-center font-weight-bold mb-2">How It <span class="gradient-text">Works</span></h2>
      <p class="text-subtitle-1 text-center mb-8">Simple steps to manage your documents</p>
      
      <div class="steps-diagram-container">
        <img src="../assets/steps-diagram.svg" alt="Steps Diagram" class="steps-diagram" />
      </div>
    </v-container>
    
    <!-- Features Section -->
    <v-container class="py-12">
      <h2 class="text-h4 text-center font-weight-bold mb-10">Key <span class="gradient-text">Features</span></h2>
      
      <v-row>
        <v-col cols="12" md="4" v-for="(feature, index) in features" :key="index">
          <v-card class="feature-card pa-6" elevation="4" height="100%" :class="isDark ? 'dark-card' : ''">
            <div class="feature-icon-wrapper">
              <v-icon size="48" :color="feature.iconColor" class="mb-4 feature-icon">{{ feature.icon }}</v-icon>
            </div>
            <h3 class="text-h5 mb-3">{{ feature.title }}</h3>
            <p class="text-body-1">{{ feature.description }}</p>
            <v-btn
              variant="text"
              :color="feature.iconColor"
              class="learn-more-btn mt-4"
            >
              Learn More
              <v-icon end class="btn-icon-animate">mdi-arrow-right</v-icon>
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Call to Action -->
    <v-container class="py-12 my-8 cta-section">
      <v-row align="center">
        <v-col cols="12" class="text-center">
          <h2 class="text-h4 font-weight-bold mb-4">Ready to Get Started?</h2>
          <p class="text-body-1 mb-8">Join thousands of users who trust Docs Edit for their document needs</p>
          <v-btn
            size="large"
            color="primary"
            class="cta-button mx-2"
            elevation="4"
            rounded
          >
            <v-icon start>mdi-account-plus</v-icon>
            Sign Up Free
          </v-btn>
          <v-btn
            size="large"
            variant="outlined"
            class="cta-button-secondary mx-2"
            rounded
          >
            <v-icon start>mdi-play-circle</v-icon>
            Watch Demo
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = computed(() => !!theme.global.current.value.dark)

const features = [
  {
    title: 'Document Management',
    description: 'Organize all your documents in one place with powerful search and filtering.',
    icon: 'mdi-file-document-multiple',
    iconColor: 'primary',
  },
  {
    title: 'Google Docs Integration',
    description: 'Seamlessly connect with Google Docs for real-time editing and collaboration.',
    icon: 'mdi-google-drive',
    iconColor: 'secondary',
  },
  {
    title: 'Cloud Storage',
    description: 'Access your documents from anywhere with secure cloud storage and backup.',
    icon: 'mdi-cloud-outline',
    iconColor: 'accent',
  }
];
</script>

<style scoped>
.hero-section {
  min-height: 80vh;
  padding: 2rem 0;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-image-container {
  position: relative;
  max-width: 100%;
  height: auto;
}

.hero-image {
  max-width: 100%;
  height: auto;
  animation: float 6s ease-in-out infinite;
}

.start-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.feature-card {
  transition: all 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.feature-icon-wrapper {
  display: flex;
  justify-content: center;
}

.feature-icon {
  transition: all 0.3s ease;
  padding: 12px;
  border-radius: 50%;
  background-color: rgba(102, 126, 234, 0.1);
}

.feature-card:hover .feature-icon {
  transform: scale(1.2) rotate(5deg);
  background-color: rgba(102, 126, 234, 0.2);
}

.steps-diagram-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.steps-diagram {
  width: 100%;
  height: auto;
  filter: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

.steps-diagram:hover {
  filter: drop-shadow(0px 15px 30px rgba(0, 0, 0, 0.15));
  transform: translateY(-5px);
}

.dark-card {
  background-color: #1a202c !important;
  color: #e2e8f0 !important;
}

.learn-more-btn {
  transition: all 0.3s ease;
}

.learn-more-btn:hover {
  padding-right: 8px;
}

.btn-icon-animate {
  transition: transform 0.3s ease;
}

.learn-more-btn:hover .btn-icon-animate,
.start-btn:hover .btn-icon-animate {
  transform: translateX(4px);
}

.cta-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16px;
}

.cta-button {
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.cta-button-secondary {
  transition: all 0.3s ease;
  border: 2px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.cta-button-secondary:hover {
  transform: translateY(-3px);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>