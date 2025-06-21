<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <v-list class="d-flex flex-column fill-height">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="!auth.isInitialized">Carregando...</span>
              <span v-else>Olá, {{ user?.name || "Usuário" }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
        <v-list-item to="/users" prepend-icon="mdi-account-multiple" :class="{ 'v-list-item--active': $route.path === '/users' }" link>
          <v-list-item-title>Usuários</v-list-item-title>
        </v-list-item>
        
        <v-list-item to="/roles" prepend-icon="mdi-briefcase" :class="{ 'v-list-item--active': $route.path === '/roles' }" link>
          <v-list-item-title>Cargos</v-list-item-title>
        </v-list-item>
        
        <v-spacer />
        
        <v-list-item @click="logoutAndRedirect" prepend-icon="mdi-logout" style="cursor: pointer">
          <v-list-item-title>Sair</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useAuth } from "../store/auth";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const auth = useAuth();
const { user, logout } = auth;
const router = useRouter();

onMounted(async () => {
  await auth.initialize();
});

async function logoutAndRedirect() {
  await logout();
  router.push("/login");
}
</script>