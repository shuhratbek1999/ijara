<template>
  <div class="elon__list w-11/12 mx-auto my-4">
    <div
      class="list__item my-8"
      :class="[
        elon?.elons
          ? ''
          : 'grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
      ]"
      v-for="(elon, index) in Elons"
      :key="'elon' + index"
    >
      <div class="lists" v-if="elon?.elons">
        <h1 class="font-sans text-3xl font-bold mb-8">{{ elon.name }}</h1>
        <div
          class="items grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            class="elon w-full cursor-pointer"
            v-for="(item, index) in elon.elons"
            :key="'item' + index"
            @click="AboutElon(item.name)"
          >
            <div
              class="img w-full rounded-3xl relative overflow-hidden"
              v-if="Array.isArray(item.images) && item.images.length > 0"
            >
              <img
                :src="BASE_URL + 'img/' + item.images?.[0]?.url"
                class="rounded-3xl h-52 w-full object-cover hover:scale-110 transition-all"
                alt="images elon"
              />
              <img
                :src="Favourite"
                alt="favourite img"
                class="absolute right-5 top-5"
              />
            </div>
            <h2 class="name font-sans font-bold text-xl">{{ item.name }}</h2>
            <div class="font-sans font-light my-2">{{ item.adress }}</div>
            <div class="price text-xl font-montserrat font-bold">
              {{ item.price }}
              <span v-if="item.pay_type == 'summ'" class="text-sm font-normal"
                >So'm</span
              >
              <span v-else class="text-sm font-normal">$</span>
            </div>
          </div>
        </div>
      </div>
      <div class="lists2" v-else>
        <div
          class="img w-full rounded-3xl relative overflow-hidden cursor-pointer"
          v-if="Array.isArray(elon.images) && elon.images.length > 0"
        >
          <img
            :src="BASE_URL + 'img/' + elon.images[0]?.url"
            class="rounded-3xl h-52 w-full object-cover hover:scale-110 transition-all"
            alt="images elon"
          />
          <img
            :src="Favourite"
            alt="favourite img"
            class="absolute right-5 top-5"
          />
        </div>
        <h2 class="name font-sans font-bold text-xl">{{ elon.name }}</h2>
        <div class="font-sans font-light my-2">{{ elon.adress }}</div>
        <div class="price text-xl font-montserrat font-bold">
          {{ elon.price }}
          <span v-if="elon.pay_type == 'summ'" class="text-sm font-normal"
            >So'm</span
          >
          <span v-else class="text-sm font-normal">$</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { message } from "ant-design-vue";
import Favourite from "@/assets/icons/hird.svg";
import axios from "axios";
import { onMounted, ref, inject, watchEffect, computed } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { Store } from "../stores/store";
const store = Store();
const router = useRouter();
const props = defineProps({
  elons: {
    type: Array,
    required: true,
  },
});
const Elons = ref(props.elons),
  BASE_URL = inject("BASE_URL");
let favorites_id = ref(null);
const AboutElon = (name) => {
  router.push({ name: "AboutElon", query: { name: name } });
};
const Favorite = (elon) => {
  favorites_id.value = elon.id;
  store.addFavorite(elon);
  router.push("/favorites");
};
const isSub = computed(() => {
  return Elons.value.map((item) => {
    if (item.subcategories) {
      return true;
    } else {
      return false;
    }
  });
});
const FilterList = computed(() => {});
watchEffect(() => {
  Elons.value = props.elons;
});
</script>

<style lang="scss" scoped></style>
