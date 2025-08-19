import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useWishesStore = defineStore("wishes", () => {
  const wishes = ref([]);

  // Wishlarni localStoragedan yuklash
  const loadFromStorage = () => {
    const saved = localStorage.getItem("user_wishes");
    if (saved) {
      wishes.value = JSON.parse(saved);
    }
  };

  // Wishlarni localStoragesa saqlash
  const saveToStorage = () => {
    localStorage.setItem("user_wishes", JSON.stringify(wishes.value));
  };

  // Wish qo'shish
  const addToWishes = (item) => {
    const existingIndex = wishes.value.findIndex((w) => w.id === item.id);
    if (existingIndex === -1) {
      wishes.value.push({
        ...item,
        added_date: new Date().toISOString(),
        status: "active",
      });
      saveToStorage();
      return true;
    }
    return false;
  };

  // Wishdan o'chirish
  const removeFromWishes = (id) => {
    wishes.value = wishes.value.filter((w) => w.id !== id);
    saveToStorage();
  };

  // Wishlarni olish
  const getWishes = computed(() => wishes.value);

  // Wish bor-yo'qligini tekshirish
  const isInWishes = (id) => {
    return wishes.value.some((w) => w.id === id);
  };

  // Dastlabki yuklash
  loadFromStorage();

  return {
    wishes,
    addToWishes,
    removeFromWishes,
    getWishes,
    isInWishes,
  };
});
