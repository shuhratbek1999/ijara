<template>
  <section>
    <NavbarMenu />
    <CategoryElonList :sub="oneSubcategoryElon" />
    <Footer />
  </section>
</template>

<script setup>
import NavbarMenu from "@/components/NavbarMenu.vue";
import Footer from "@/components/Footer.vue";
import CategoryElonList from "@/components/CategoryElonList.vue";
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
const route = useRoute();
let oneSubcategoryElon = ref({
  filter: [],
  list: [],
});
const allElonCategory = () => {
  oneSubcategoryElon.value.list = [];
  axios
    .get(`category/categoryByName/${route.params.name}`)
    .then((res) => {
      if (res.data.success) {
        const { field_doc, elons, ...data } = res.data.data;
        oneSubcategoryElon.value.filter = field_doc;
        oneSubcategoryElon.value.list = elons;
      } else {
        message.warning(res.data.message);
      }
    })
    .catch((err) => {
      message.warning(err);
    });
};
watch(
  () => route.params.name,
  () => {
    allElonCategory();
  }
);
onMounted(() => {
  allElonCategory();
});
</script>

<style lang="scss" scoped></style>
