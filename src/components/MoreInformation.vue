<script setup>
import { ref, watch, watchEffect } from "vue";
import BaseButton from "./BaseButton.vue";
import BaseInput from "./BaseInput.vue";
import { useCategoryStore } from "@/stores/category";
const props = defineProps({
  fields: {
    type: Array,
    default: () => [],
  },
});
const store = useCategoryStore();
const emit = defineEmits(["update:fields", "buttons"]);

const Fields = ref([]);
const Buttons = ref({ variantBtn: "shaxsiy", stateBtn: "yangi" });
let isFromCategory = false;

watch(
  () => store.OneCategory,
  (newCategory) => {
    if (newCategory && Array.isArray(newCategory.fields)) {
      isFromCategory = true;
      Fields.value = JSON.parse(JSON.stringify(newCategory.fields));
    }
  },
  { immediate: true }
);

watch(
  () => props.fields,
  (newVal) => {
    if (!isFromCategory && Array.isArray(newVal)) {
      Fields.value = JSON.parse(JSON.stringify(newVal));
    }
    isFromCategory = false;
  },
  { immediate: true }
);

// Fields => modelValue (faqat haqiqiy o‘zgarishda)
watch(
  Fields,
  (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(props.fields)) {
      emit("update:fields", JSON.parse(JSON.stringify(newVal)));
    }
  },
  { deep: true }
);

const Shaxsiy = (text) => {
  switch (text) {
    case "shaxsiy":
    case "biznes":
      Buttons.value.variantBtn = text;
      break;
    case "yangi":
    case "ishlatilingan":
      Buttons.value.stateBtn = text;
      break;
  }
};
</script>

<template>
  <div class="informations">
    <h2 class="text-2xl font-sans font-bold mb-2">Qo'shimcha malumot</h2>
    <div class="buttons">
      <h4>shaxsiy yoki biznes*</h4>
      <div class="buttons my-2 flex gap-4">
        <BaseButton
          class="w-44"
          :variant="Buttons.variantBtn == 'shaxsiy' ? 'danger' : 'secondary'"
          @click="Shaxsiy('shaxsiy')"
          >Shaxsiy shaxs</BaseButton
        >
        <BaseButton
          class="w-44"
          :variant="Buttons.variantBtn == 'biznes' ? 'danger' : 'secondary'"
          @click="Shaxsiy('biznes')"
          >Biznes</BaseButton
        >
      </div>
    </div>
    <div class="state">
      <h4>Holati</h4>
      <div class="buttons my-2 flex gap-4">
        <BaseButton
          class="w-44"
          :variant="Buttons.stateBtn == 'yangi' ? 'danger' : 'secondary'"
          @click="Shaxsiy('yangi')"
          >Yangi</BaseButton
        >
        <BaseButton
          class="w-44"
          :variant="
            Buttons.stateBtn == 'ishlatilingan' ? 'danger' : 'secondary'
          "
          @click="Shaxsiy('ishlatilingan')"
          >Ishlatilgan</BaseButton
        >
      </div>
    </div>
    <div
      class="fields grid max-sm:grid-cols-1 max-md:grid-cols-1 max-md:w-5/12 max-sm:w-11/12 my-4"
    >
      <!-- {{ Fields }} -->
      <div
        class="fields_list flex my-2"
        :class="[
          field.field_type == 'checkbox'
            ? 'flex-row items-center'
            : 'flex-col-reverse',
        ]"
        v-for="(field, index) in Fields"
        :key="'field' + index"
      >
        <!-- {{ field }} -->
        <BaseInput
          v-model="field.values"
          :type="
            [
              field.field_type
                ? field.field_type
                : field.category_fields?.field_type,
            ][0]
          "
          :class="[
            field.field_type == 'checkbox'
              ? 'w-6 h-6'
              : 'max-sm:w-11/12 md:w-3/12 h-10',
          ]"
          class="mr-2 bg-gray-200 focus:outline-none indent-4"
        />
        <label for="" v-if="field.category_fields">{{
          field.category_fields.field_name
        }}</label>
        <label for="" v-else>{{ field.field_name }}</label>
        <!-- <span>{{ field }}</span> -->
      </div>
    </div>
  </div>
</template>
