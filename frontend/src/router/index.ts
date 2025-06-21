import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UsersView from '../views/UsersView.vue'
import RolesView from '../views/RolesView.vue'
import SidebarLayout from '../components/SidebarLayout.vue'
import { useAuth } from '../store/auth'

const routes: Array<RouteRecordRaw> = [
  { path: '/login', component: LoginView },
  {
    path: '/',
    component: SidebarLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/users' },
      { path: 'users', component: UsersView },
      { path: 'roles', component: RolesView },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuth()

  if (!auth.isInitialized) {
    await auth.initialize()
  }

  if (to.meta.requiresAuth) {
    if (!auth.token) {
      return next('/login')
    }

    if (auth.isTokenExpired(auth.token)) {
      const renewed = await auth.refreshAccessToken()

      if (!renewed) {
        return next('/login')
      }
    }

    if (!auth.user) {
      await auth.fetchUser()

      if (!auth.user) {
        return next('/login')
      }
    }
  }

  if (to.path === '/login' && auth.user && auth.token && !auth.isTokenExpired(auth.token)) {
    return next('/')
  }

  next()
})

export default router