<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="openForm()"><v-icon class="mr-2">mdi-plus</v-icon>Novo Usuário</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <UserList :users="users" @edit="openForm" @refresh="fetchUsers" />
      </v-col>
    </v-row>
    <v-dialog v-model="showForm" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">{{
            editingUser ? "Editar Usuário" : "Novo Usuário"
          }}</span>
        </v-card-title>
        <v-card-text>
          <UserForm :userData="editingUser" @saved="onSaved" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import UserList from "../components/list/UserList.vue";
import UserForm from "../components/form/UserForm.vue";
import api from "../api";
import type { User } from "../types";

const showForm = ref(false);
const editingUser = ref<User | undefined>(undefined);
const users = ref<User[]>([]);

function openForm(user?: User | null) {
  editingUser.value = user ?? undefined;
  showForm.value = true;
}

async function fetchUsers() {
  const { data } = await api.get<User[]>("/user");
  users.value = data;
}

async function onSaved() {
  showForm.value = false;
  await fetchUsers();
}

onMounted(fetchUsers);
</script>
