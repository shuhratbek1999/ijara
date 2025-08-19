<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <div class="elons-grid">
      <template v-for="(elon, index) in Elons" :key="'elon-' + index">
        <!-- Kategoriya guruhi -->
        <div v-if="elon?.elons" class="category-section mb-12">
          <h2
            class="category-title text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200 relative"
          >
            {{ elon.name }}
            <span
              class="absolute bottom-0 left-0 w-14 h-0.5 bg-gradient-to-r from-blue-500 to-green-500"
            ></span>
          </h2>
          <div
            class="elons-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          >
            <div
              v-for="(item, itemIndex) in elon.elons"
              :key="'item-' + itemIndex"
              class="elon-card bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 cursor-pointer fade-in-up"
              :style="'animation-delay: ' + itemIndex * 0.1 + 's'"
              @click="AboutElon(item.name)"
            >
              <div
                class="elon-image-container relative w-full h-56 overflow-hidden bg-gray-50"
              >
                <img
                  :src="getImageUrl(item.images)"
                  :alt="item.name"
                  class="elon-image w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  @error="handleImageError"
                />
                <div
                  class="elon-overlay absolute inset-0 bg-gradient-to-b from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex justify-end p-4"
                >
                  <button
                    class="favorite-btn rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:scale-110"
                    :class="
                      isInWishes(item.id)
                        ? 'bg-red-100 text-red-600'
                        : 'bg-white/90 hover:bg-white'
                    "
                    @click.stop="toggleWish(item)"
                  >
                    <i class="material-icons">
                      {{ isInWishes(item.id) ? "favorite" : "favorite_border" }}
                    </i>
                  </button>
                </div>
                <div
                  v-if="!getImageUrl(item.images)"
                  class="image-placeholder absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400"
                >
                  <i class="material-icons text-5xl">image</i>
                </div>
              </div>

              <div class="elon-content p-5">
                <h3
                  class="elon-title text-lg font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight"
                >
                  {{ item.name }}
                </h3>
                <p class="elon-address text-gray-600 text-sm mb-3 line-clamp-1">
                  {{ item.adress }}
                </p>
                <div
                  class="elon-price text-xl font-bold text-green-700 flex items-center"
                >
                  {{ formatPrice(item.price, item.pay_type) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Yakka elon -->
        <div
          v-else
          class="elon-card bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 cursor-pointer fade-in-up"
          :style="'animation-delay: ' + index * 0.1 + 's'"
          @click="AboutElon(elon.name)"
        >
          <div
            class="elon-image-container relative w-full h-56 overflow-hidden bg-gray-50"
          >
            <img
              :src="getImageUrl(elon.images)"
              :alt="elon.name"
              class="elon-image w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              @error="handleImageError"
            />
            <div
              class="elon-overlay absolute inset-0 bg-gradient-to-b from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex justify-end p-4"
            >
              <button
                class="favorite-btn rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:scale-110"
                :class="
                  isInWishes(elon.id)
                    ? 'bg-red-100 text-red-600'
                    : 'bg-white/90 hover:bg-white'
                "
                @click.stop="toggleWish(elon)"
              >
                <i class="material-icons">
                  {{ isInWishes(elon.id) ? "favorite" : "favorite_border" }}
                </i>
              </button>
            </div>
            <div
              v-if="!getImageUrl(elon.images)"
              class="image-placeholder absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400"
            >
              <i class="material-icons text-5xl">image</i>
            </div>
          </div>

          <div class="elon-content p-5">
            <h3
              class="elon-title text-lg font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight"
            >
              {{ elon.name }}
            </h3>
            <p class="elon-address text-gray-600 text-sm mb-3 line-clamp-1">
              {{ elon.adress }}
            </p>
            <div
              class="elon-price text-xl font-bold text-green-700 flex items-center"
            >
              {{ formatPrice(elon.price, elon.pay_type) }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, inject } from "vue";
import { useRouter } from "vue-router";
import { Store } from "../stores/store";
import { message } from "ant-design-vue";
import Favourite from "@/assets/icons/hird.svg";
import { useWishesStore } from "@/stores/wishes";
const props = defineProps({
  elons: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const router = useRouter();
const store = Store();
const BASE_URL = inject("BASE_URL");
const Elons = ref(props.elons);
const wishesStore = useWishesStore();
// Format narx
const formatPrice = (price, payType) => {
  const formattedPrice = new Intl.NumberFormat("ru-RU").format(price);
  return `${formattedPrice} ${payType === "summ" ? "So'm" : "$"}`;
};
const isInWishes = (id) => {
  return wishesStore.isInWishes(id);
};
const toggleWish = (item) => {
  if (isInWishes(item.id)) {
    wishesStore.removeFromWishes(item.id);
    message.success("Istaklardan o'chirildi");
  } else {
    const success = wishesStore.addToWishes(item);
    if (success) {
      message.success("Istaklarga qo'shildi");
    } else {
      message.info("Bu e'lon allaqachon istaklarda");
    }
  }
};
// Rasm URL
const getImageUrl = (images) => {
  if (Array.isArray(images) && images.length > 0 && images[0]?.url) {
    return BASE_URL + "img/" + images[0].url;
  }
  return null;
};

// Rasm xatosi
const handleImageError = (event) => {
  event.target.style.display = "none";
  const placeholder =
    event.target.parentElement.querySelector(".image-placeholder");
  if (placeholder) {
    placeholder.classList.remove("hidden");
  }
};

// E'lon haqida
const AboutElon = (name) => {
  router.push({ name: "AboutElon", query: { name } });
};

// Favorite
const Favorite = (elon) => {
  store.addFavorite(elon);
  message.success("Sevimlilarga qo'shildi");
};

// Props o'zgarishini kuzatish
watch(
  () => props.elons,
  (newVal) => {
    Elons.value = newVal;
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.fade-in-up {
  animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
