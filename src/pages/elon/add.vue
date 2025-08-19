<template>
  <div class="mulk_add min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Reklama yarating</h1>

      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          Batafsil tasvirlab bering
        </h2>

        <!-- Nomi -->
        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-2">Nomi*</label>
          <BaseInput
            placeholder="Masalan, Iphone 12 kafolatli"
            ref="nameRef"
            height="48px"
            :rules="[
              required(),
              minLength(20, 'Kamida 20ta belgi boʻlishi kerak'),
            ]"
            v-model="Elon.name"
            class="w-full md:w-2/3 lg:w-1/2 bg-gray-100 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Kategoriya -->
        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-2">Turkum*</label>
          <div
            @click="ModalOpen"
            class="bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-4 cursor-pointer border border-gray-300 w-full md:w-1/2 lg:w-1/3"
          >
            <div
              v-if="!Object.keys(UpdateCategory).length"
              class="flex justify-between items-center"
            >
              <span class="text-gray-500">Kategoriyani tanlang</span>
              <img :src="Arrows" alt="Arrows" class="w-5 h-5 text-gray-400" />
            </div>
            <div v-else class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="bg-red-100 p-2 rounded-full">
                  <img :src="categorySelect?.icon" alt="Icon" class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-bold">
                    {{
                      categorySelect?.categories?.name || categorySelect?.name
                    }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{
                      categorySelect?.subcategories?.name ||
                      categorySelect?.sub_cat?.name
                    }}
                  </p>
                </div>
              </div>
              <span class="text-blue-500 underline">O'zgartirish</span>
            </div>
          </div>
          <BaseModal
            :show="open"
            :label="'Kategoriyani tanlang'"
            :component="CategoryListComponent"
            @close="ModalClose"
            @data="ModalData"
            width="max-w-5xl"
          />
        </div>
      </div>

      <!-- Rasm qismi -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Rasmlar</h2>
        <p class="text-gray-600 mb-4">
          Birinchi fotosurat e'lonning muqovasida bo'ladi. Tartibni o'zgartirish
          uchun torting.
        </p>
        <ElonImage v-model="Elon.images" />
      </div>

      <!-- Tavsif -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Tavsif*</h2>
        <textarea
          v-model="Elon.description"
          class="w-full h-48 p-4 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Reklamadan qanday tafsilotlarni bilmoqchi ekanligingizni o'ylab ko'ring va ularni tavsif qo'shing"
        ></textarea>
        <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      </div>

      <!-- Narx -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <ElonPrice
          v-model:price="Elon.price"
          v-model:pay_type="Elon.pay_type"
          v-model:price_agreement="Elon.price_agreement"
          ref="priceRef"
        />
      </div>

      <!-- Qo'shimcha ma'lumotlar -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <MoreInformation v-model:fields="Elon.fields" @buttons="Buttons" />
      </div>

      <!-- Manzil -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Manzil*</h2>
        <BaseInput
          v-model="Elon.adress"
          type="text"
          class="w-full md:w-80 bg-gray-100 border border-gray-300 rounded-lg px-4 h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Manzil kiriting..."
        />
      </div>

      <!-- Kontakt -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <Contact ref="ContactRef" v-model="Elon" @contact="ContactInfo" />
      </div>

      <!-- Tugmalar -->
      <div class="bg-white rounded-xl shadow-md p-6 flex justify-end">
        <BaseButton
          variant="primary"
          @click="Saqlash"
          class="px-8 py-3 text-lg font-medium rounded-md"
        >
          Saqlash
        </BaseButton>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  reactive,
  ref,
  watchEffect,
  markRaw,
  computed,
  watch,
  onMounted,
} from "vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseModal from "@/components/BaseModal.vue";
import CategoryList from "@/components/CategoryList.vue";
import ElonImage from "@/components/ElonImage.vue";
import ElonPrice from "@/components/ElonPrice.vue";
import MoreInformation from "@/components/MoreInformation.vue";
import Contact from "@/components/elon/Contact.vue";
import { useElonStore } from "../../stores/elon";
import Arrows from "@/assets/icons/arrows.svg";
import { useValidation } from "@/composables/useValidation";
import { required, minLength } from "@/utils/rules";
const CategoryListComponent = markRaw(CategoryList);
import MobileCatalog from "@/components/MobileCatalog.vue";
const store = useElonStore();
import { message } from "ant-design-vue";
import { useRoute } from "vue-router";
import axios from "axios";
const { error, validate } = useValidation([
  required("Izoh shart"),
  minLength(30, "Kamida 30 ta belgi bo‘lishi kerak"),
]);
let updatedOnce = ref(false),
  UpdateCategory = ref({}),
  open = ref(false),
  SubCategory = ref([]),
  Elon = reactive({
    name: "",
    description: "",
    category_id: 0,
    subcategory_id: 0,
    price: 0,
    price_agreement: false,
    status: "tasdiqlanmagan",
    pay_type: "summ",
    adress: "",
    email: "",
    foydalanish: "shaxsiy",
    holati: "yangi",
    contact_name: "",
    phone_number: "",
    images: [],
    Comment: [],
    fields: [],
  });
const priceRef = ref(null),
  ContactRef = ref(null),
  nameRef = ref(null);
const route = useRoute();
const props = defineProps({
  update: {
    type: Object,
  },
});
const ModalClose = () => {
  open.value = false;
};
const ModalOpen = () => {
  open.value = true;
};
const ModalData = (data) => {
  updatedOnce.value = false; // Shunda loop bo'lmaydi
  const { UpdateCategorys, subId, catId } = data;
  if (
    JSON.stringify(UpdateCategory.value) !== JSON.stringify(UpdateCategorys)
  ) {
    UpdateCategory.value = JSON.parse(JSON.stringify(UpdateCategorys));
  }
  if (catId && Elon.category_id !== catId) {
    Elon.category_id = catId;
    Elon.subcategory_id = 0;
  } else if (subId && Elon.subcategory_id !== subId) {
    Elon.subcategory_id = subId;
    Elon.category_id = 0;
  }
};
const categorySelect = computed(() => {
  return UpdateCategory.value;
});
const ContactInfo = (data) => {
  const { contact_name, email, phone_number } = data;
  Elon.contact_name = contact_name;
  Elon.email = email;
  Elon.phone_number = phone_number;
};
const Buttons = (data) => {
  const { variantBtn, stateBtn } = data;
  Elon.foydalanish = variantBtn;
  Elon.holati = stateBtn;
};
const Saqlash = async () => {
  try {
    const isValidPrice = await priceRef.value?.validate?.();
    const isValidInfo = await ContactRef.value?.validate?.();
    const isValidName = await nameRef.value?.validate?.();

    if (!isValidPrice || !isValidInfo || !isValidName) {
      message.error("Maydonlarni to'ldirishda xatolik!");
      return;
    }
    if (Elon.fields.length > 0) {
      Elon.fields = Elon.fields.map((val) => ({
        field_id: val.field_id ? val.field_id : val.id,
        values: val.values,
      }));
      console.log(Elon.fields);
    }
    if (route.name === "ElonUpdate") {
      await store.createElon(Elon, false);
    } else {
      await store.createElon(Elon);
    }
  } catch (err) {
    console.error("Saqlashda xato:", err);
    message.error(err.message || "E'lonni saqlashda xatolik yuz berdi");
  }
};
onMounted(async () => {
  let userID = localStorage.getItem("userID");
  let user = await axios.get("user/one/" + userID);
  if (user.data?.data) {
    Elon.contact_name = user.data?.data?.name;
    Elon.email = user.data?.data?.email;
  }
});
watch(
  () => props.update,
  (val) => {
    if (!val || updatedOnce.value) return;
    const { category, elonExtra, images, subcategory, ...data } = val;
    Elon = { ...Elon, ...data };
    Elon.images = Array.isArray(images)
      ? images.map((img, index) => ({
          uid: String(-index - 1),
          name: `image-${index}`,
          status: "done",
          url: img.url,
        }))
      : [];
    Elon.fields = elonExtra ? JSON.parse(JSON.stringify(elonExtra)) : [];
    UpdateCategory.value = category ? { ...category } : { ...subcategory };
    updatedOnce.value = true; // bu faqat update paytida ishlaydi
    // console.log(Elon, "elon");
  }
  // { immediate: true } // bu muhim!
);

watchEffect(() => {
  if (open.value == false) {
    SubCategory.value = [];
  }
});
</script>
<style scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
/* Asosiy konteyner */
.mulk_add {
  background-color: #f8fafc;
}

/* Forma elementlari uchun umumiy stillar */
label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

/* Input va textarea uchun focus holati */
input:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

/* Kategoriya tanlash bo'limi */
.category-select {
  transition: all 0.2s ease;
}

.category-select:hover {
  background-color: #edf2f7;
}

/* Responsive dizayn uchun media querylar */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  h1 {
    font-size: 1.75rem;
  }

  h2 {
    font-size: 1.5rem;
  }
}

/* Animatsiyalar */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
