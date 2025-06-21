<template>
  <v-form @submit.prevent="onSubmit" ref="formRef" class="d-flex flex-column ga-5">
    <v-text-field
      v-model="role.name"
      label="Nome do Cargo"
      :rules="[rules.required]"
      required
    />
    <v-btn type="submit" color="primary">
      {{ role.id ? "Atualizar" : "Cadastrar" }}
    </v-btn>
    <div v-if="error" class="text-error mt-2">{{ error }}</div>
  </v-form>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import api from "../../api";
import type { Role } from "../../types";

const props = defineProps<{ roleData?: Role }>();
const emit = defineEmits<{
  (e: "saved"): void;
}>();

const role = ref<Role>(
  props.roleData ? { ...props.roleData } : ({ name: "" } as Role)
);

const formRef = ref();
const error = ref("");

const rules = {
  required: (v: any) => !!v || "Campo obrigatório",
};

watch(
  () => props.roleData,
  (val) => {
    if (val) role.value = { ...val };
  }
);

async function onSubmit() {
  const { valid } = await (formRef.value as any).validate();
  if (!valid) return;

  try {
    if (role.value.id) {
      await api.put(`/role/${role.value.id}`, role.value);
    } else {
      await api.post("/role", role.value);
    }
    emit("saved");
  } catch (e: any) {
    error.value = "Erro ao salvar cargo";
  }
}
</script>