<template>
  <ElonForm :update="OneElon" />
</template>

<script setup>
import { message } from "ant-design-vue";
import axios from "axios";
import { onMounted, ref, inject } from "vue";
import { useRoute } from "vue-router";
import ElonForm from "./add.vue";
const route = useRoute();
const FILE_URL = inject("BASE_URL");
let OneElon = ref({});
const ElonOne = () => {
  axios
    .get("elon/one/" + route.params.id)
    .then((res) => {
      for (let key of res.data.data.images) {
        key.url = FILE_URL + "img/" + key.url;
      }
      OneElon.value = { ...res.data.data };
      // console.log(OneElon.value);

      OneElon.value.category_id = res.data.data.category_id;
      OneElon.value.subcategory_id = res.data.data.subcategory_id;
    })
    .catch((err) => {
      message.warning(err);
    });
};
onMounted(() => {
  ElonOne();
});
</script>

<style lang="scss" scoped></style>
