import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MyDocumentsView from '../views/MyDocumentsView.vue'
import UploadView from '../views/UploadView.vue'
import ProfileView from '../views/ProfileView.vue'
import EditView from '../views/EditView.vue'
import DashboardView from '../views/DashboardView.vue'
import PdfEditor from '../components/PdfEditor.vue'
import AssistantView from '../views/AssistantView.vue'
import { Editor } from '@tiptap/vue-3'

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null && localStorage.getItem('user') !== null
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: EditView
  },
  {
    path: '/documents',
    name: 'documents',
    component: MyDocumentsView
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next(); 
      } else {
        next({ path: '/', query: { login: 'true' }});
      }
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  
  {
    path: '/settings',
    name: 'settings',
    redirect: '/profile'
  },
  {
    path: '/pdf-editor',
    name: 'pdf-editor',
    component: PdfEditor
  },
  {
    path: '/assistant',
    name: 'assistant',
    component: AssistantView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue')  
  }
 

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router