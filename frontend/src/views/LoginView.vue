<template>
  <div class="login-bg">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="8" md="4">
          <v-card elevation="10" class="pa-6">
            <v-card-title class="justify-center">
              <v-icon color="primary" size="40">mdi-account-circle</v-icon>
            </v-card-title>
            <v-card-subtitle class="text-center mb-4">
              <span class="text-h6 font-weight-bold">Bem-vindo de volta!</span>
            </v-card-subtitle>
            <LoginForm />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import LoginForm from '../components/form/LoginForm.vue'
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  min-width: 100vw;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
}
</style>