<template>
  <v-dialog v-model="model" max-width="400">
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>
        <slot>
          {{ message }}
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="cancel">Cancelar</v-btn>
        <v-btn :color="confirmColor" variant="flat" @click="confirm">{{
          confirmText
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  confirmColor?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const model = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => (model.value = val)
);

watch(
  () => model.value,
  (val) => emit("update:modelValue", val)
);

function confirm() {
  emit("confirm");
  model.value = false;
}
function cancel() {
  emit("cancel");
  model.value = false;
}
</script>
