<template>
  <v-form @submit.prevent="login" ref="formRef">
    <v-text-field
      v-model="form.email"
      label="E-mail"
      prepend-inner-icon="mdi-email-outline"
      type="email"
      autocomplete="email"
      :rules="[rules.required, rules.email]"
      class="mb-3"
      outlined
      dense
      color="primary"
    />
    <v-text-field
      v-model="form.password"
      label="Senha"
      prepend-inner-icon="mdi-lock-outline"
      type="password"
      autocomplete="current-password"
      :rules="[rules.required]"
      class="mb-4"
      outlined
      dense
      color="primary"
    />
    <v-btn
      :loading="loading"
      type="submit"
      color="primary"
      block
      large
      class="mb-2 d-flex align-center justify-center gap-2"
      elevation="2"
    >
      <v-icon class="mr-2">mdi-login</v-icon>
      <span>Entrar</span>
    </v-btn>
    <v-alert
      v-if="error"
      type="error"
      class="mt-2"
      border="start"
      colored-border
      elevation="2"
      dense
    >
      {{ error }}
    </v-alert>
  </v-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../store/auth'
import api from '../../api'

const form = reactive({
  email: '',
  password: ''
})
const error = ref('')
const loading = ref(false)
const formRef = ref()
const auth = useAuth()
const router = useRouter()

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) =>
    /.+@.+\..+/.test(v) || 'E-mail inválido',
}

async function login() {
  if (!(formRef.value as any).validate()) return
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.post('/auth/login', { email: form.email, password: form.password })
    auth.setToken(data.accessToken)
    if (data.refreshToken) auth.setRefreshToken(data.refreshToken)
    await auth.fetchUser()
    router.push('/')
  } catch (e: any) {
    error.value = e?.response?.data?.error || 'Usuário ou senha inválidos'
  } finally {
    loading.value = false
  }
}
</script>