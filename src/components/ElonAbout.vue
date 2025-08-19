<template>
  <main class="elon-detail bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto">
      <!-- Asosiy kontent -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Chap qism (rasmlar va tavsif) -->
        <div class="w-full lg:w-2/3">
          <!-- Karusel -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <Carousel :carousel="Images" />
          </div>

          <!-- Tavsif va xususiyatlar -->
          <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-4">
              {{ Elon.name }}
            </h1>

            <div class="mb-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-3">Tavsif</h2>
              <p class="text-gray-700 leading-relaxed">
                {{ Elon.description }}
              </p>
            </div>

            <div v-if="Elon.elonExtra && Elon.elonExtra.length > 0">
              <h2 class="text-xl font-semibold text-gray-800 mb-3">
                Xususiyatlar
              </h2>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li
                  v-for="(item, index) in Elon.elonExtra"
                  :key="index"
                  class="bg-gray-50 p-3 rounded-lg"
                >
                  <p class="text-gray-700" v-if="item.values?.length > 0">
                    <span class="font-medium text-gray-900"
                      >{{ item.category_fields.field_name }}:</span
                    >
                    <span class="ml-2">{{ item.values }}</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <!-- Sotuvchi bilan bog'lanish -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div class="flex items-center">
                <div class="relative">
                  <div
                    class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold"
                  >
                    {{ Elon.user?.name?.charAt(0) || "U" }}
                  </div>
                  <span
                    v-if="Elon.user?.user_date?.[0]?.isOnline"
                    class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"
                  ></span>
                </div>
                <div class="ml-4">
                  <p class="font-medium text-gray-900">
                    {{ Elon.user?.name || "Nomaʼlum foydalanuvchi" }}
                  </p>
                  <p class="text-sm text-gray-500">
                    <span v-if="Elon.user?.user_date?.[0]?.isOnline"
                      >Online</span
                    >
                    <span v-else>
                      Oxirgi marta
                      {{
                        dayjs(Elon.user?.user_date?.[0]?.down_date).format(
                          "D MMMM, HH:mm"
                        )
                      }}
                    </span>
                  </p>
                </div>
              </div>

              <div class="flex flex-col w-full sm:w-auto gap-3">
                <button
                  @click="XabarnomaClick(Elon)"
                  class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  Xabar yuborish
                </button>
                <button
                  @click="phone = !phone"
                  class="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                    />
                  </svg>
                  <span v-if="phone && Elon.phone_number">{{
                    Elon.phone_number
                  }}</span>
                  <span v-else>Telefon raqam</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- O'ng qism (narx va qisqa ma'lumot) -->
        <div class="w-full lg:w-1/3">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-6">
            <!-- Narx va asosiy ma'lumotlar -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm text-gray-500">
                  {{ dayjs(Elon.create_at * 1000).format("D MMMM, YYYY") }}
                </span>
                <button
                  class="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <HeartOutlined class="text-xl" />
                </button>
              </div>

              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                {{ Elon.price }} so'm
              </h2>

              <div class="flex flex-col gap-3 mt-6">
                <button
                  @click="XabarnomaClick(Elon)"
                  class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  Xabar yuborish
                </button>
                <button
                  @click="phone = !phone"
                  class="w-full py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                    />
                  </svg>
                  <span v-if="phone && Elon.phone_number">{{
                    Elon.phone_number
                  }}</span>
                  <span v-else>Telefon raqam</span>
                </button>
              </div>
            </div>

            <!-- Sotuvchi haqida -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Sotuvchi</h3>

              <div class="flex items-center">
                <div class="relative">
                  <div
                    class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold"
                  >
                    {{ Elon.user?.name?.charAt(0) || "U" }}
                  </div>
                  <span
                    v-if="Elon.user?.user_date?.[0]?.isOnline"
                    class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"
                  ></span>
                </div>
                <div class="ml-4">
                  <p class="font-medium text-gray-900">
                    {{ Elon.user?.name || "Nomaʼlum foydalanuvchi" }}
                  </p>
                  <p class="text-sm text-gray-500">
                    <span v-if="Elon.user?.user_date?.[0]?.isOnline"
                      >Online</span
                    >
                    <span v-else>
                      Oxirgi marta
                      {{
                        dayjs(Elon.user?.user_date?.[0]?.down_date).format(
                          "D MMMM, HH:mm"
                        )
                      }}
                    </span>
                  </p>
                </div>
              </div>

              <div class="mt-4">
                <p class="text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 inline-block mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{{ Elon.adress || "Manzil koʻrsatilmagan" }}</span>
                </p>
              </div>
            </div>
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

const Images = ref([]);
const Elon = ref({});
const phone = ref(false);

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

<style scoped>
.elon-detail {
  min-height: calc(100vh - 80px);
}

@media (max-width: 1024px) {
  .elon-detail {
    padding-bottom: 80px;
  }
}
</style>
