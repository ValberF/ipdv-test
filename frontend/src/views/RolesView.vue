<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="openForm(null)"
          ><v-icon class="mr-2">mdi-plus</v-icon>Novo Cargo</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <RolesList :roles="roles" @edit="openForm" @refresh="fetchRoles" />
      </v-col>
    </v-row>
    <v-dialog v-model="showForm" max-width="400">
      <v-card>
        <v-card-title>
          <span class="headline">{{
            editingRole ? "Editar Cargo" : "Novo Cargo"
          }}</span>
        </v-card-title>
        <v-card-text>
          <RoleForm :roleData="editingRole" @saved="onSaved" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import RolesList from "../components/list/RolesList.vue";
import RoleForm from "../components/form/RoleForm.vue";
import api from "../api";
import type { Role } from "../types";

const roles = ref<Role[]>([]);
const showForm = ref(false);
const editingRole = ref<Role | undefined>(undefined);

onMounted(fetchRoles);

async function fetchRoles() {
  const { data } = await api.get<Role[]>("/role");
  roles.value = data;
}

function openForm(role: Role | null) {
  editingRole.value = role ?? undefined;
  showForm.value = true;
}

async function onSaved() {
  showForm.value = false;
  await fetchRoles();
}
</script>
