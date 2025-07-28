<script setup>
import { useValidation } from "@/composables/useValidation";
import { ref, watch } from "vue";

const model = defineModel({ type: [String, Number, Boolean], default: "" });

const props = defineProps({
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  width: String,
  height: String,
  rules: Array,
});

const emit = defineEmits(["update:modelValue"]);
const inputRef = ref(null);
const error = ref("");

// ✅ validate function
const validate = () => {
  error.value = "";
  for (const rule of props.rules || []) {
    const result = rule(model.value);
    if (result !== true) {
      error.value = result;
      return false;
    }
  }
  return true;
};

// 🔁 sync external model
watch(model, (val) => {
  emit("update:modelValue", val);
  validate(); // real-time validation (optional)
});

// 👇 parentga ochib beramiz
defineExpose({ validate });
</script>

<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :style="{ width, height }"
    v-model="model"
    ref="inputRef"
    v-bind="$attrs"
    class="border p-2 rounded h-10"
    :class="[
      error != '' ? 'outline-2 outline-double outline-red-500' : 'outline-none',
    ]"
  />
  <br />
  <span v-if="error" class="text-red-500 text-sm mt-1 bg-white">{{
    error
  }}</span>
</template>

<style scoped>
input:-webkit-autofill {
  box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: black !important;
}
</style>
