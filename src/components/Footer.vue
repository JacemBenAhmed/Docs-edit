<template>
  <v-footer class="footer" :class="isDark ? 'dark-footer' : ''">
    <v-container>
      <v-row>
        <!-- Logo and Description -->
        <v-col cols="12" md="4" class="mb-6 mb-md-0">
          <div class="d-flex align-center mb-4">
            <v-avatar size="40" class="mr-3 brand-avatar">
              <v-img src="../assets/logo.svg" alt="Docs Edit Logo" />
            </v-avatar>
            <span class="text-h6 font-weight-bold gradient-text">Docs Edit</span>
          </div>
          <p class="text-body-2 mb-4">
            A modern document editing platform that helps you create, edit, and share documents with ease.
            Seamlessly integrated with Google Docs.
          </p>
          <div class="social-links">
            <v-btn icon variant="text" class="mr-2 social-icon">
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon variant="text" class="mr-2 social-icon">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon variant="text" class="mr-2 social-icon">
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
            <v-btn icon variant="text" class="mr-2 social-icon">
              <v-icon>mdi-linkedin</v-icon>
            </v-btn>
            <v-btn icon variant="text" class="social-icon">
              <v-icon>mdi-github</v-icon>
            </v-btn>
          </div>
        </v-col>
        
        <!-- Quick Links -->
        <v-col cols="12" sm="6" md="2" class="mb-6 mb-md-0">
          <h4 class="text-subtitle-1 font-weight-bold mb-4">Quick Links</h4>
          <v-list density="compact" class="footer-list">
            <v-list-item to="/" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-home</v-icon>
                Home
              </v-list-item-title>
            </v-list-item>
            <v-list-item to="/documents" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-file-document-multiple</v-icon>
                Documents
              </v-list-item-title>
            </v-list-item>
            <v-list-item to="/upload" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-cloud-upload</v-icon>
                Upload
              </v-list-item-title>
            </v-list-item>
            <v-list-item to="/profile" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-account</v-icon>
                Profile
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        
        <!-- Resources -->
        <v-col cols="12" sm="6" md="2" class="mb-6 mb-md-0">
          <h4 class="text-subtitle-1 font-weight-bold mb-4">Resources</h4>
          <v-list density="compact" class="footer-list">
            <v-list-item href="#" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-help-circle</v-icon>
                Help Center
              </v-list-item-title>
            </v-list-item>
            <v-list-item href="#" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-book-open</v-icon>
                Documentation
              </v-list-item-title>
            </v-list-item>
            <v-list-item href="#" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-video</v-icon>
                Tutorials
              </v-list-item-title>
            </v-list-item>
            <v-list-item href="#" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-frequently-asked-questions</v-icon>
                FAQs
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        
        <!-- Legal -->
        <v-col cols="12" sm="6" md="2" class="mb-6 mb-md-0">
          <h4 class="text-subtitle-1 font-weight-bold mb-4">Legal</h4>
          <v-list density="compact" class="footer-list">
            <v-list-item href="#" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-shield</v-icon>
                Privacy Policy
              </v-list-item-title>
            </v-list-item>
            <v-list-item href="#" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-file-document</v-icon>
                Terms of Service
              </v-list-item-title>
            </v-list-item>
            <v-list-item href="#" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-cookie</v-icon>
                Cookie Policy
              </v-list-item-title>
            </v-list-item>
            <v-list-item href="#" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-license</v-icon>
                Licenses
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        
        <!-- Contact -->
        <v-col cols="12" sm="6" md="2">
          <h4 class="text-subtitle-1 font-weight-bold mb-4">Contact</h4>
          <v-list density="compact" class="footer-list">
            <v-list-item href="mailto:support@docsedit.com" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-email</v-icon>
                Email Us
              </v-list-item-title>
            </v-list-item>
            <v-list-item href="tel:+1234567890" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-phone</v-icon>
                Call Us
              </v-list-item-title>
            </v-list-item>
            <v-list-item href="#" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-message</v-icon>
                Live Chat
              </v-list-item-title>
            </v-list-item>
            <v-list-item href="#" class="footer-list-item">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
                Find Us
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      
      <!-- Bottom Bar -->
      <v-row class="mt-8 pt-4 border-top">
        <v-col cols="12" md="6" class="text-center text-md-left">
          <span class="text-caption">
            &copy; {{ new Date().getFullYear() }} Docs Edit. All rights reserved.
          </span>
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-right">
          <v-btn variant="text" size="small" class="text-caption mr-2">
            Privacy
          </v-btn>
          <v-btn variant="text" size="small" class="text-caption mr-2">
            Terms
          </v-btn>
          <v-btn variant="text" size="small" class="text-caption">
            Sitemap
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    isDark() {
      try { return !!this.$vuetify.theme?.global?.current?.value?.dark } catch { return false }
    }
  }
}
</script>

<style scoped>
.footer {
  padding: 4rem 0 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.dark-footer {
  background-color: #1a202c;
  border-top: 1px solid #2d3748;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: transform 0.3s ease;
}

.social-icon {
  transition: all 0.3s ease;
}

.social-icon:hover {
  transform: translateY(-3px);
  color: #667eea !important;
}

.footer-list {
  background-color: transparent !important;
}

.footer-list-item {
  padding-left: 0;
  min-height: 36px;
  transition: all 0.3s ease;
}

.footer-list-item:hover {
  transform: translateX(5px);
}

.footer-list-item:hover .v-list-item-title {
  color: #667eea;
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.dark-footer .border-top {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>