<template>
  <div class="home">
    <NavbarMenu @mobilCat="mobilCat" />
    <Carausel v-if="mobilCatBoolean == false" :carousel="Images" />
    <ElonList v-if="mobilCatBoolean == false" :elons="ElonAll" />
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NavbarMenu from "@/components/NavbarMenu.vue";
import Carausel from "@/components/Carausel.vue";
import ElonList from "@/components/ElonList.vue";
import Footer from "@/components/Footer.vue";
import Car1 from "/images/car5.webp";
import Car2 from "/images/car6.jpg";
import Car3 from "/images/car9.png";
import Car4 from "/images/car8.webp";
import axios from "axios";
import { message } from "ant-design-vue";
const ElonAll = ref([]);
const Images = ref([
  { img: Car1 },
  { img: Car2 },
  { img: Car3 },
  { img: Car4 },
]);
let mobilCatBoolean = ref(false);
const mobilCat = (data) => {
  mobilCatBoolean.value = data;
};
const AllElon = () => {
  axios
    .get("subcategory/sub_elon")
    .then((res) => {
      if (res.data?.data) {
        ElonAll.value = res.data.data;
      }
    })
    .catch((err) => {
      message.warning(err);
    });
};
onMounted(() => {
  AllElon();
});
</script>

<style lang="scss" scoped></style>
