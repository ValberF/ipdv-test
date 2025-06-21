<template>
  <div>
    <div class="d-flex align-center mb-4" style="gap: 16px">
      <v-text-field
        v-model="search"
        label="Pesquisar"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="flex-grow-1"
      />
    </div>

    <v-data-table
      :items="filteredUsers"
      :headers="headers"
      :items-per-page="5"
      :items-per-page-options="[5, 10, 25, 50, -1]"
      class="elevation-1"
    >
      <template #item.status="{ item }">
        <v-switch
          v-model="item.status"
          color="primary"
          inset
          :ripple="false"
          @change="toggleStatus(item)"
          hide-details
          :disabled="loading"
        />
      </template>
      <template #item.actions="{ item }">
        <v-icon @click="editUser(item)" class="mr-2" color="blue">mdi-pencil</v-icon>
        <v-icon @click="openDeleteDialog(item)" color="red">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <ConfirmDialog
      v-model="deleteDialog"
      title="Confirmar exclusão"
      :message="`Tem certeza que deseja apagar o usuário '${userToDelete?.name}'?`"
      confirm-text="Apagar"
      confirm-color="red"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { User } from "../../types";
import api from "../../api";
import ConfirmDialog from "./../ConfirmDialog.vue";

const props = defineProps<{ users: User[] }>();
const emit = defineEmits<{
  (e: "edit", user: User | null): void;
  (e: "refresh"): void;
}>();

const headers = [
  { title: "Nome", key: "name" },
  { title: "Email", key: "email" },
  { title: "Cargo", key: "role.name" },
  { title: "Ativo", key: "status" },
  { title: "Ações", key: "actions", sortable: false },
];

const loading = ref(false);
const search = ref("");
const deleteDialog = ref(false);
const userToDelete = ref<User | null>(null);

const filteredUsers = computed(() => {
  if (!search.value) return props.users;
  const term = search.value.toLowerCase();
  return props.users.filter((user) =>
    [user.name, user.email, user.role?.name]
      .filter(Boolean)
      .some((field) => field?.toLowerCase().includes(term))
  );
});

function editUser(user: User) {
  emit("edit", user);
}

function openDeleteDialog(user: User) {
  userToDelete.value = user;
  deleteDialog.value = true;
}

async function confirmDelete() {
  if (userToDelete.value) {
    await api.delete(`/user/${userToDelete.value.id}`);
    emit("refresh");
  }
  deleteDialog.value = false;
  userToDelete.value = null;
}

async function toggleStatus(user: User) {
  loading.value = true;
  try {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role_id: user.role?.id,
      status: user.status,
    };
    await api.put(`/user/${user.id}`, payload);
    emit("refresh");
  } finally {
    loading.value = false;
  }
}
</script>
