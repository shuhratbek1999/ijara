<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Sarlavha -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Mening istaklarim</h1>
      <p class="text-gray-600">Siz saqlab qoʻygan barcha eʼlonlar</p>
    </div>

    <!-- Filtr va saralash -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm"
    >
      <div class="flex items-center gap-2">
        <span class="text-gray-700 font-medium"
          >{{ filteredWishes.length }} ta e'lon</span
        >
      </div>

      <div class="flex flex-wrap gap-3">
        <button
          v-for="filter in filters"
          :key="filter.key"
          @click="setActiveFilter(filter.key)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeFilter === filter.key
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- E'lonlar ro'yxati -->
    <div
      v-if="filteredWishes.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="wish in filteredWishes"
        :key="'wish-' + wish.id"
        class="bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 cursor-pointer relative"
      >
        <!-- O'chirish tugmasi (yuqori o'ngda) -->
        <button
          @click.stop="removeFromWishes(wish)"
          class="absolute top-4 right-4 z-10 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:bg-red-50 hover:text-red-600"
          title="Istakdan o'chirish"
        >
          <i class="material-icons text-red-500">delete</i>
        </button>

        <div
          class="relative w-full h-56 overflow-hidden bg-gray-50"
          @click="viewDetails(wish)"
        >
          <img
            :src="getImageUrl(wish.images)"
            :alt="wish.name"
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            @error="handleImageError"
          />
          <div
            v-if="!getImageUrl(wish.images)"
            class="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400"
          >
            <i class="material-icons text-5xl">image</i>
          </div>
        </div>

        <div class="p-5">
          <h3
            class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight"
          >
            {{ wish.name }}
          </h3>
          <p class="text-gray-600 text-sm mb-3 line-clamp-1">
            {{ wish.adress }}
          </p>
          <div class="flex justify-between items-center">
            <div class="text-xl font-bold text-green-700">
              {{ formatPrice(wish.price, wish.pay_type) }}
            </div>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                wish.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : wish.status === 'sold'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700',
              ]"
            >
              {{ getStatusText(wish.status) }}
            </span>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100">
            <div
              class="flex justify-between items-center text-sm text-gray-500"
            >
              <span>Qo'shilgan: {{ formatDate(wish.added_date) }}</span>
              <button
                @click.stop="viewDetails(wish)"
                class="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                Ko'rish
                <i class="material-icons text-base">arrow_forward</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bo'sh holat -->
    <div v-else class="text-center py-16 px-8 bg-white rounded-2xl shadow-sm">
      <div
        class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
      >
        <i class="material-icons text-4xl text-gray-400">favorite_border</i>
      </div>
      <h3 class="text-2xl font-semibold text-gray-700 mb-3">Istaklar bo'sh</h3>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">
        Siz hali hech qanday e'lonni istaklarga qo'shmagansiz. E'lonlarni
        saqlash uchun ♡ belgisini bosing.
      </p>
      <button
        @click="goToMainPage"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
      >
        <i class="material-icons">search</i>
        E'lonlarni ko'rish
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useWishesStore } from "@/stores/wishes";
const router = useRouter();
const wishesStore = useWishesStore();
// Filtrlash variantlari
const filters = [
  { key: "all", label: "Barchasi" },
  { key: "active", label: "Faol" },
  { key: "sold", label: "Sotilgan" },
  { key: "archived", label: "Arxiv" },
];
const BASE_URL = inject("BASE_URL");
const activeFilter = ref("all");
const showDeleteConfirm = ref(false);
const wishToDelete = ref(null);
const wishes = computed(() => wishesStore.getWishes);
// Filtrlangan istaklar
const filteredWishes = computed(() => {
  if (activeFilter.value === "all") {
    return wishes.value;
  }
  return wishes.value.filter((wish) => wish.status === activeFilter.value);
});

// Format narx
const formatPrice = (price, payType) => {
  const formattedPrice = new Intl.NumberFormat("ru-RU").format(price);
  return `${formattedPrice} ${payType === "summ" ? "So'm" : "$"}`;
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
};
const removeFromWishes = (wish) => {
  wishesStore.removeFromWishes(wish.id);
  message.success("Istaklardan o'chirildi");
};
// Status matni
const getStatusText = (status) => {
  const statusMap = {
    active: "Faol",
    sold: "Sotilgan",
    archived: "Arxiv",
  };
  return statusMap[status] || status;
};

// Sana formatlash
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Filtrni o'rnatish
const setActiveFilter = (filter) => {
  activeFilter.value = filter;
};

// O'chirishni tasdiqlash
const confirmRemoveWish = () => {
  if (wishToDelete.value) {
    wishes.value = wishes.value.filter((w) => w.id !== wishToDelete.value.id);
    message.success("E'lon istaklardan o'chirildi");
  }
  showDeleteConfirm.value = false;
  wishToDelete.value = null;
};

// Batafsil ko'rish
const viewDetails = (wish) => {
  router.push({ name: "AboutElon", query: { name: wish.name } });
};

// Asosiy sahifaga o'tish
const goToMainPage = () => {
  router.push({ name: "Home" });
};
</script>

<style scoped>
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

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
