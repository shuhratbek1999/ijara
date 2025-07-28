<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    :class="[
      'inline-flex items-center justify-center font-medium rounded-sm px-4 py-2 transition-all duration-200',
      variantClasses,
      {
        'opacity-50 cursor-not-allowed': loading || disabled,
      },
    ]"
    @click="handleClick"
  >
    <span
      v-if="loading"
      class="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent rounded-full border-white"
    ></span>
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  type: { type: String, default: "button" },
  variant: {
    type: String,
    default: "primary", // primary | secondary | danger
  },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["click"]);

const handleClick = (e) => {
  if (!props.loading && !props.disabled) {
    emit("click", e);
  }
};

const variantClasses = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    case "danger":
      return "bg-red-600 text-white hover:bg-red-700";
    case "primary":
    default:
      return "bg-blue-600 text-white hover:bg-blue-700";
  }
});
</script>
