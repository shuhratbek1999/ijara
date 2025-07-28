<template>
  <main class="sub_category_elon bg-gray-50 w-full flex flex-col items-center">
    <div class="content flex xx:flex-col xl:flex-row justify-center w-11/12">
      <CategoryFilter @filters="filters" :filter="filterAll" class="xl:w-1/5" />
      <ElonListUser class="xl:w-4/5 ml-2 mt-10" :elons="filteredElonlar" />
    </div>
  </main>
</template>

<script setup>
import ElonListUser from "./ElonList.vue";
import CategoryFilter from "./CategoryFilter.vue";
import { watchEffect, ref, computed } from "vue";
const props = defineProps({
  sub: {
    type: Object,
    required: true,
  },
});
let SubElon = ref([]),
  filterAll = ref({}),
  filterValue = ref({});
const filters = (data) => {
  filterValue.value = data;
};
let marka = ref("");
const filteredElonlar = computed(() => {
  return SubElon.value.filter((elon) => {
    const meetsPriceCriteria =
      (!filterValue.value.min_price ||
        elon.price >= filterValue.value.min_price) &&
      (!filterValue.value.max_price ||
        elon.price <= filterValue.value.max_price);
    const meetsExtraCriteria = elon.elonExtra.every((extra) => {
      const filter = filterValue.value[extra.field_id];
      if (!filter) return true; // Agar filter yo'q bo'lsa, o'tkazib yubor
      if (typeof filter != "number") {
        return extra.values.toLowerCase().includes(filter.toLowerCase());
      } else {
        return extra.values >= filter;
      }
    });

    return meetsPriceCriteria && meetsExtraCriteria;
  });
});
watchEffect(() => {
  SubElon.value = [...props.sub.list];
  filterAll.value = props.sub.filter;
});
</script>

<style lang="scss" scoped></style>
