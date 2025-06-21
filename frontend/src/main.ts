import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import router from './router' 
import { useAuth } from './store/auth'
import { setAuthStore } from './api'

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)
app.mount('#app')

const auth = useAuth()
auth.setupTokenRefreshInterval()

setAuthStore(auth)

document.addEventListener('visibilitychange', async () => {
  if (!document.hidden && auth.token && auth.user) {
    await auth.checkTokenAndRefresh()
  }
})

window.addEventListener('beforeunload', () => {
})