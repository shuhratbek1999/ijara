import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import animal from "@/assets/icons/animal.svg";
import baby from "@/assets/icons/baby.svg";
import bag from "@/assets/icons/bag.svg";
import bino from "@/assets/icons/bino.svg";
import car from "@/assets/icons/car.svg";
import laptop from "@/assets/icons/laptop.svg";
import phone from "@/assets/icons/phone.svg";
import sport from "@/assets/icons/sport.svg";
const icons = [laptop, bino, baby, car, bag, animal, bino, phone, bag, sport];
export const useCategoryStore = defineStore("category", () => {
  const categorys = ref([]);
  const OneCategory = ref({});
  const loading = ref(false);
  const error = ref(null);
  async function getCategory() {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get("category/mainCatAll");
      const data = response.data.data;
      categorys.value = data.map((cat, index) => {
        const icon = icons[index % icons.length];
        return {
          ...cat,
          icon,
        };
      });
    } catch (err) {
      error.value = err.message || "xatolik yuz berdi";
    } finally {
      loading.value = false;
    }
  }
  async function createCategory(data) {
    await createAddressApi(data);
    await getCategory();
  }
  async function getCategoryId({ id, type }) {
    // console.log(id, type);
    const response = await axios.get("category/oneId/", {
      params: { id: id, type: type },
    });
    OneCategory.value = response.data.data;
    console.log(response.data);
  }
  async function deleteCategory(id) {
    await deleteAddressApi(id);
    await getCategory();
  }
  async function updateCategory(id, data) {
    const response = await updateAddressApi(id, data);
    currentAddress.value = response.data;
    await getCategory();
  }
  return {
    categorys,
    OneCategory,
    loading,
    error,
    getCategory,
    createCategory,
    getCategoryId,
    deleteCategory,
    updateCategory,
  };
});
