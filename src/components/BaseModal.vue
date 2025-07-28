<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/20 z-10"
    @click="$emit('close')"
  />
  <div
    v-if="show"
    class="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full px-4"
    :class="width"
  >
    <div
      class="bg-white rounded-2xl shadow-lg w-full p-6 relative max-h-[90vh]"
    >
      <!-- Header -->
      <header class="relative w-full">
        <h1 class="text-xl sm:text-2xl font-bold font-sans">{{ label }}</h1>
        <button
          @click="$emit('close')"
          class="absolute -top-2 right-0 text-gray-500 hover:text-black text-3xl"
        >
          &times;
        </button>
      </header>

      <!-- Content -->
      <main class="my-6">
        <component
          :is="component"
          @close="$emit('close')"
          @data="(payload) => $emit('data', payload)"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  label: String,
  width: {
    type: String,
    default: "max-w-md",
  },
  component: Object,
});
defineEmits(["close", "data"]);
</script>
