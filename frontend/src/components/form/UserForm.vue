<template>
  <v-form
    @submit.prevent="onSubmit"
    ref="formRef"
    class="d-flex flex-column ga-5"
  >
    <v-text-field
      v-model="user.name"
      label="Nome"
      :rules="[rules.required]"
      required
    />
    <v-text-field
      v-model="user.email"
      label="Email"
      :rules="[rules.required, rules.email]"
      required
    />
    <v-text-field
      v-if="!user.id"
      v-model="user.password"
      label="Senha"
      type="password"
      autocomplete="new-password"
      :rules="[rules.required, rules.min(6)]"
      required
    />
    <v-select
      v-model="user.role_id"
      :items="roles"
      item-title="name"
      item-value="id"
      label="Cargo"
      :rules="[rules.required]"
      required
    />
    <v-btn type="submit" color="primary">
      {{ user.id ? "Atualizar" : "Cadastrar" }}
    </v-btn>
  </v-form>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import api from "../../api";
import type { User, Role } from "../../types";

const props = defineProps<{ userData?: User }>();
const emit = defineEmits<{
  (e: "saved"): void;
}>();

const user = ref<User>(
  props.userData
    ? { ...props.userData, password: "" }
    : ({ name: "", email: "", role_id: "", status: true, password: "" } as User)
);
const roles = ref<Role[]>([]);
const formRef = ref();
const error = ref("");

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

const rules = {
  required: (v: any) => !!v || "Campo obrigatório",
  email: (v: string) => /.+@.+\..+/.test(v) || "E-mail inválido",
  min: (min: number) => (v: string) =>
    (v && v.length >= min) || `Mínimo de ${min} caracteres`,
};

onMounted(async () => {
  const { data } = await api.get<Role[]>("/role");
  roles.value = data;
});

watch(
  () => props.userData,
  (val) => {
    if (val) user.value = { ...val, password: "" };
  }
);

async function onSubmit() {
  if (!(formRef.value as any).validate()) return;

  const payload = { ...user.value };
  if (!payload.password) delete payload.password;

  try {
    if (user.value.id) {
      await api.put(`/user/${user.value.id}`, payload);
    } else {
      await api.post("/user", payload);
    }
    emit("saved");
  } catch (e: any) {
    error.value = "Erro ao salvar usuário";
    showSnackbar(error.value, "error");
  }
}
</script>
