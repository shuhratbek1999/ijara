<template>
  <div class="home">
    <NavbarMenu />
    <Carausel :carousel="Images" />
    <ElonAbout :elon="ElonAll" />
    <ElonList :elons="CategoryElon" />
    <ElonCommentAll :elon="ElonAll" />
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import NavbarMenu from "@/components/NavbarMenu.vue";
import Carausel from "@/components/Carausel.vue";
import ElonAbout from "@/components/ElonAbout.vue";
import ElonList from "@/components/ElonList.vue";
import ElonCommentAll from "@/components/OneElonCommentAll.vue";
import Footer from "@/components/Footer.vue";
import Car1 from "/images/car5.webp";
import Car2 from "/images/car6.jpg";
import Car3 from "/images/car9.png";
import Car4 from "/images/car8.webp";
import axios from "axios";
import { message } from "ant-design-vue";
import { useRoute } from "vue-router";
const route = useRoute();
const ElonAll = ref({});
const Images = ref([
  { img: Car1 },
  { img: Car2 },
  { img: Car3 },
  { img: Car4 },
]);
let CategoryElon = ref([]);
const OneCategoryAllElon = () => {
  if (ElonAll.value.category_name) {
    axios
      .get("subcategory/suboneall_elon", {
        params: {
          name: ElonAll.value?.subcategory?.main_cat?.name,
          id: ElonAll.value.id,
        },
      })
      .then((res) => {
        CategoryElon.value = res.data.data;
      })
      .catch((err) => {
        message.warning(err);
      });
  }
};
const AllElon = () => {
  axios
    .get("elon/names", {
      params: {
        name: route.query.name,
      },
    })
    .then((res) => {
      ElonAll.value = res.data.data[0];
      OneCategoryAllElon();
    })
    .catch((err) => {
      message.warning(err);
    });
};
watch(
  () => route.query.name,
  () => {
    AllElon();
  }
);
onMounted(() => {
  AllElon();
});
</script>

<style lang="scss" scoped></style>
