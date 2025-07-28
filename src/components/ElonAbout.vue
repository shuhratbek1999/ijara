<template>
  <main
    class="elonAbout relative w-full bg-gray-50 flex flex-col items-center"
    v-if="Elon"
  >
    <!-- <h2>{{ elon.user }}</h2> -->
    <div
      class="elon_content my-4 w-11/12 flex xx:flex-col xl:flex-row justify-between"
    >
      <div class="elon_content_about xl:w-2/3 xl:mr-2">
        <div class="carousel bg-white py-3 rounded-md">
          <Carousel :carousel="Images" />
        </div>
        <ul class="information bg-white rounded-md my-3 p-5">
          <div class="description my-3">
            <h1 class="xl:text-xl xx:text-base font-bold">Description</h1>
            <p class="xx:text-xs xl:text-base">{{ Elon.description }}</p>
          </div>
          <li v-for="(item, index) in Elon.elonExtra" :key="index">
            <p>
              <span
                class="inline-block xx:text-xs xl:text-base mr-2 font-montserrat text-gray-700"
                v-if="item.values.length > 0"
                >{{ item.category_fields.field_name }}:</span
              >
              <span
                class="xx:text-xs xl:text-base"
                v-if="item.values.length > 0"
                >{{ item.values }}</span
              >
            </p>
          </li>
        </ul>
        <div
          class="user_contact my-4 p-5 flex justify-between bg-white rounded-md"
        >
          <div class="user_info">
            <h2 class="xl:text-xl xx:text-xs">Связаться с продавцом</h2>
            <div class="date_love flex items-center">
              <i class="material-icons xx:text-2xl xl:text-4xl mr-2"
                >person_pin</i
              >
              <div
                class="user my-2"
                v-if="Elon.user && Elon.user.user_date.length > 0"
              >
                <p v-if="Elon.user" class="xx:text-xs xl:text-base">
                  {{ Elon.user.name }}
                </p>
                <p
                  class="xx:text-xs xl:text-base"
                  v-if="Elon.user.user_date[0].isOnline"
                >
                  Online
                </p>
                <p class="xx:text-xs xl:text-base xl:w-44 xx:w-28" v-else>
                  {{
                    dayjs(Elon.user.user_date[0].down_date).format(
                      "YYYY [yil] D MMMM HH:mm:ss"
                    )
                  }}
                </p>
              </div>
            </div>
          </div>
          <div class="user_contact">
            <button
              class="bg-contactBg my-3 text-white xx:h-8 xx:w-40 xl:w-56 rounded xl:h-10"
              @click="XabarnomaClick(Elon)"
            >
              Сообщение
            </button>
            <p class="flex items-center my-3">
              <span><i class="material-icons mr-4">phone</i></span>
              <span class="font-bold" v-if="Elon.phone_number">{{
                Elon.phone_number
              }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="elon_user xl:w-1/3 xl:ml-2">
        <div class="user_contact w-full p-5 bg-white rounded-md">
          <div class="date_love flex justify-between items-center">
            <p class="xx:text-xs xl:text-base font-bold">
              {{ dayjs(Elon.create_at * 1000).format("YYYY [yil] D MMMM") }}
              Опубликовано
            </p>
            <span> <HeartOutlined /> </span>
          </div>
          <h2 class="xl:text-xl xx:text-base py-2">{{ Elon.name }}</h2>
          <p class="xl:text-2xl font-bold my-6">{{ Elon.price }} сум</p>
          <p class="my-3" @click="XabarnomaClick(Elon)">
            <button class="w-full rounded bg-contactBg py-2 text-white">
              Сообщение
            </button>
          </p>
          <p class="my-3">
            <button class="w-full rounded border-contactBg border-2 py-2">
              <span
                v-if="phone == false && Elon.phone_number"
                @click="phone = !phone"
                >Показать телефон</span
              >
              <span @click="phone = !phone" v-else>{{
                Elon.phone_number
              }}</span>
            </button>
          </p>
        </div>
        <div class="user_contact my-4 p-5 bg-white rounded-md">
          <h2 class="xx:text-base xl:text-xl">Пользователь</h2>
          <div class="date_love flex items-center my-2">
            <i class="material-icons text-4xl mr-2">person_pin</i>
            <div
              class="user"
              v-if="Elon.user && Elon.user.user_date.length > 0"
            >
              <p v-if="Elon.user">{{ Elon.user.name }}</p>
              <p v-if="Elon.user.user_date[0].isOnline">Online</p>
              <p v-else class="xx:text-xs xl:text-base xl:w-44 xx:w-28">
                {{
                  dayjs(Elon.user.user_date[0].down_date).format(
                    "YYYY [yil] D MMMM HH:mm:ss"
                  )
                }}
              </p>
            </div>
          </div>
          <div class="adress my-4 xx:text-xs xl:text-base">
            <p>Adress: {{ Elon.adress }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import dayjs from "dayjs";
import { ref, watchEffect } from "vue";
import { HeartOutlined } from "@ant-design/icons-vue";
import Carousel from "./Carausel.vue";
import { useRouter } from "vue-router";
import { Store } from "../stores/store";
import { useChatStore } from "@/stores/chat";
const myId = ref(localStorage.getItem("userID"));
const store = Store();
const chatStore = useChatStore();
const router = useRouter();
const props = defineProps({
  elon: {
    type: Object,
    required: true,
  },
});
const Images = ref([]),
  Elon = ref({}),
  phone = ref(false);
const XabarnomaClick = (elon) => {
  if (myId.value != elon.user?.id) {
    store.elonChat(elon);
    chatStore.setOtherUserId(Number(elon.user?.id));
    router.push({
      name: "Chats",
    });
  }
};
watchEffect(() => {
  if (props.elon.images) {
    Images.value = props.elon.images;
    Elon.value = props.elon;
  }
});
</script>

<style lang="scss" scoped></style>
