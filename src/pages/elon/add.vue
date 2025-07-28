<template>
  <div class="mulk_add flex flex-col items-center bg-slate-200">
    <div class="forma w-full flex flex-col items-center justify-center">
      <h1 class="w-11/12 my-5 text-3xl font-bold">Reklama yarating</h1>
      <div class="name__category w-11/12 bg-white p-4 rounded-xl my-4">
        <h2 class="text-2xl font-bold font-sans my-2">
          Batafsil tasvirlab bering
        </h2>
        <div class="form__name">
          <label for="">ismni belgileng*</label> <br />
          <BaseInput
            :placeholder="'Masalan, Iphone 12 kafolatli'"
            ref="nameRef"
            height="40px"
            :rules="[
              required(),
              minLength(20, 'kamida 20ta belgi bolishi kerak'),
            ]"
            v-model="Elon.name"
            class="bg-gray-200 focus:outline-none indent-4 max-sm:w-full md:w-2/3 xl:w-1/2 lg:w-1/2"
          ></BaseInput>
        </div>
        <div class="form_category mt-4">
          <label cl for="">Turkum*</label> <br />
          <div
            class="category flex xl:w-[30%] md:w-1/2 lg:w-1/3 sm:w-2/3 justify-between items-center bg-gray-200 p-4 cursor-pointer"
            @click="ModalOpen"
          >
            <div
              class="category_select flex w-80 justify-between items-center"
              v-if="Object.keys(UpdateCategory).length == 0"
            >
              <span>Kategoriyani tanlang</span>
              <img :src="Arrows" alt="Arrows" class="w-5 h-5" />
            </div>
            <div
              class="update_cat w-full flex justify-between items-center"
              v-else
            >
              <div
                class="img w-10 h-10 rounded-full bg-red-100 flex justify-center items-center"
              >
                <img
                  :src="categorySelect?.icon"
                  alt="main icon"
                  class="w-6 h-6"
                />
              </div>
              <div class="info">
                <h2 class="font-bold font-sans" v-if="!categorySelect?.sub_cat">
                  {{ categorySelect?.categories?.name }}
                </h2>
                <h2 class="font-bold font-sans" v-else>
                  {{ categorySelect?.name }}
                </h2>
                <span
                  class="text-sm font-sans"
                  v-if="categorySelect?.subcategories"
                  >{{ categorySelect?.subcategories?.name }}/</span
                >
                <span class="text-sm font-sans" v-else>{{
                  categorySelect?.sub_cat?.name
                }}</span>
                <span v-if="categorySelect?.main_cat">
                  {{ categorySelect?.main_cat?.name }}
                </span>
                /
                <span
                  class="text-sm font-sans"
                  v-if="!categorySelect?.sub_cat"
                  >{{ categorySelect?.name }}</span
                >
                <span class="text-sm font-sans" v-else>{{
                  categorySelect?.sub_cat?.main_cat?.name
                }}</span>
              </div>
              <div class="button underline-offset-4 underline">
                O'zgartirish
              </div>
            </div>
          </div>
          <BaseModal
            :show="open"
            :label="'Kategoriyani tanlang'"
            :component="CategoryListComponent"
            @close="ModalClose"
            @data="ModalData"
            width="max-w-5xl"
          ></BaseModal>
        </div>
      </div>
      <div class="img w-11/12 bg-white rounded-xl p-4">
        <h1 class="text-2xl font-sans font-bold">Surat</h1>
        <br />
        <span class="text-sm font-sans my-4 inline-block"
          >Birinchi fotosurat e'lonning muqovasida bo'ladi. Tartibni
          o'zgartirish uchun torting.</span
        >
        <ElonImage v-model="Elon.images" />
      </div>
      <div class="description w-11/12 bg-white rounded-xl p-4 my-4">
        <h2 class="font-sans text-2xl my-4 font-bold">Tavsif*</h2>
        <textarea
          v-model="Elon.description"
          class="w-9/12 h-52 p-2 bg-gray-200 rounded focus:outline-none indent-3"
          placeholder="Reklamadan qanday tafsilotlarni bilmoqchi ekanligingizni o'ylab ko'ring va ularni tavsif qo'shing"
        ></textarea>
        <p v-if="error" class="text-red-500 mt-1">{{ error }}</p>
        <br />
      </div>
      <div class="price w-11/12 bg-white rounded-xl p-4 my-4">
        <ElonPrice
          v-model:price="Elon.price"
          v-model:pay_type="Elon.pay_type"
          v-model:price_agreement="Elon.price_agreement"
          ref="priceRef"
        />
      </div>
      <div class="information w-11/12 bg-white rounded-xl p-4 my-4">
        <MoreInformation v-model:fields="Elon.fields" @buttons="Buttons" />
      </div>
      <div class="adress w-11/12 bg-white rounded-xl p-4 my-4">
        <h2 class="text-2xl font-sans font-bold">Manzil*</h2>
        <BaseInput
          v-model="Elon.adress"
          type="text"
          class="w-80 bg-gray-200 focus:outline-none h-10 indent-4 rounded-sm my-3"
          placeholder="manzil kiriting..."
        />
      </div>
      <div class="contact w-11/12 bg-white rounded-xl p-4 my-4">
        <Contact ref="ContactRef" v-model="Elon" @contact="ContactInfo" />
      </div>
      <div
        class="buttons w-11/12 bg-white rounded-xl p-4 my-4 flex justify-end"
      >
        <BaseButton variant="primary" @click="Saqlash">Saqlash</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watchEffect, markRaw, computed, watch } from "vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseModal from "@/components/BaseModal.vue";
import CategoryList from "@/components/CategoryList.vue";
import ElonImage from "@/components/ElonImage.vue";
import ElonPrice from "@/components/ElonPrice.vue";
import MoreInformation from "@/components/MoreInformation.vue";
import Contact from "@/components/elon/Contact.vue";
import { useElonStore } from "@/stores/elon";
import Arrows from "@/assets/icons/arrows.svg";
import { useValidation } from "@/composables/useValidation";
import { required, minLength } from "@/utils/rules";
const CategoryListComponent = markRaw(CategoryList);
import MobileCatalog from "@/components/MobileCatalog.vue";
const store = useElonStore();
import { message } from "ant-design-vue";
import { useRoute } from "vue-router";
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
    Elon.subcategory_id = null;
  } else if (subId && Elon.subcategory_id !== subId) {
    Elon.subcategory_id = subId;
    Elon.category_id = null;
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
  // Elon.fields = [];
  const isValidPrice = await priceRef.value?.validate?.();
  const isValidInfo = await ContactRef.value?.validate?.();
  const isValidName = await nameRef.value?.validate?.();
  if (!isValidPrice && !isValidInfo && !isValidName) {
    message.error("Validatsiyadan o'tmadi");
    return;
  }
  // console.log(Elon.fields, Elon);
  if (Elon.fields.length > 0) {
    Elon.fields = Elon.fields.map((val) => ({
      field_id: val.field_id ? val.field_id : val.id,
      values: val.values,
    }));
  }
  if (route.name === "ElonUpdate") {
    await store.createElon(Elon, false);
  } else {
    await store.createElon(Elon);
  }
};
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
</style>
