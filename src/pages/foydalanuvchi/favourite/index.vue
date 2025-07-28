<template>
  <div class="favourite">
    <NavbarMenu @mobilCat="mobilCat" />
    <div class="elon bg-gray-200 py-4">
      <ElonListUser
        class="w-11/12 m-auto"
        v-if="mobilCatBoolean == false"
        :elon="ElonAll"
        :favorite="favorite"
      />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import NavbarMenu from "../../../components/NavbarMenu.vue";
import ElonListUser from "../../../components/UserElonList.vue";
import Footer from "../../../components/Footer.vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { Store } from "@/stores/store";
const store = Store();
const ElonAll = ref([]);
let mobilCatBoolean = ref(false),
  favorite = ref(false);
const mobilCat = (data) => {
  mobilCatBoolean.value = data;
};
const StoreElon = () => {
  ElonAll.value = store.FavoritesElon;
  favorite.value = true;
};
onMounted(() => {
  StoreElon();
});
</script>

<style lang="scss" scoped></style>
