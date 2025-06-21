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
      :items="filteredRoles"
      :headers="headers"
      :items-per-page="5"
      :items-per-page-options="[5, 10, 25, 50, -1]"
      class="elevation-1"
    >
      <template #item.actions="{ item }">
        <v-icon @click="editRole(item)" class="mr-2" color="blue">mdi-pencil</v-icon>
        <v-icon @click="openDeleteDialog(item)" color="red">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <ConfirmDialog
      v-model="deleteDialog"
      title="Confirmar exclusão"
      :message="`Tem certeza que deseja apagar o cargo '${roleToDelete?.name}'?`"
      confirm-text="Apagar"
      confirm-color="red"
      @confirm="confirmDelete"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Role } from "../../types";
import api from "../../api";
import ConfirmDialog from "./../ConfirmDialog.vue";

const props = defineProps<{ roles: Role[] }>();
const emit = defineEmits<{
  (e: "edit", role: Role | null): void;
  (e: "refresh"): void;
}>();

const headers = [
  { title: "Nome", key: "name" },
  { title: "Ações", key: "actions", sortable: false },
];

const search = ref("");
const deleteDialog = ref(false);
const roleToDelete = ref<Role | null>(null);

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

function showSnackbar(text: string, color: string = "success") {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
}

const filteredRoles = computed(() => {
  if (!search.value) return props.roles;
  const term = search.value.toLowerCase();
  return props.roles.filter((role) => role.name.toLowerCase().includes(term));
});

function editRole(role: Role) {
  emit("edit", role);
}

function openDeleteDialog(role: Role) {
  roleToDelete.value = role;
  deleteDialog.value = true;
}

async function confirmDelete() {
  if (roleToDelete.value) {
    try {
      await api.delete(`/role/${roleToDelete.value.id}`);
      emit("refresh");
      showSnackbar("Cargo excluído com sucesso!", "success");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Erro ao excluir cargo.";
      showSnackbar(msg, "error");
    }
  }
  deleteDialog.value = false;
  roleToDelete.value = null;
}
</script>
