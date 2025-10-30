<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

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

<template>
  <v-app>
    <Navbar />
    
    <v-main class="app-surface">
      <!-- Router View -->
      <router-view />
    </v-main>
    
    <!-- Footer -->
    <Footer />
  </v-app>
</template>

<style scoped>
.app-surface {
  background-color: #F8FAFC;
}
.hero-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.1;
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  opacity: 0.1;
}

.min-height-500 {
  min-height: 500px;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.hero-image {
  filter: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1));
  transition: transform 0.5s ease;
  animation: float 6s ease-in-out infinite;
}

.hero-image:hover {
  transform: translateY(-10px);
}

.steps-diagram-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  overflow: hidden;
}

.steps-diagram {
  width: 100%;
  max-width: 800px;
  height: auto;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
  transition: all 0.5s ease;
}

.steps-diagram:hover {
  transform: scale(1.02);
  filter: drop-shadow(0 15px 30px rgba(102, 126, 234, 0.3));
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

.start-btn {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(102, 126, 234, 0.3);
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  transition: all 0.5s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.2) rotate(5deg);
}

.dark-card {
  background: linear-gradient(145deg, #2d3748, #1a202c);
  color: #e2e8f0;
}
</style>


<style>
/* App-wide styles using Vuetify theme */
</style>
