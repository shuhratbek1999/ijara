<script setup>
import { ref, watch, watchEffect } from "vue";
import BaseInput from "../BaseInput.vue";
import { required, minLength, email } from "@/utils/rules";

// 1. Props orqali tashqi malumotni olish
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      contact_name: "",
      email: "",
      phone_number: "",
    }),
  },
});

const emit = defineEmits(["update:modelValue", "contact"]);

// 2. Local contact ref
const contact = ref({
  contact_name: "",
  email: "",
  phone_number: "",
});

// 3. Parentdan kelgan qiymatni yuklash
watchEffect(() => {
  if (props.modelValue) {
    contact.value = { ...props.modelValue };
  }
});

// 4. Emit qilamiz har safar contact o‘zgarsa
watch(
  contact,
  (val) => {
    emit("update:modelValue", val); // v-model uchun
    emit("contact", val); // optional
  },
  { deep: true }
);

// 5. Validatsiya
const nameRef = ref(null),
  emailRef = ref(null),
  phoneRef = ref(null);

const validate = async () => {
  const results = await Promise.all([
    nameRef.value?.validate?.(),
    emailRef.value?.validate?.(),
    phoneRef.value?.validate?.(),
  ]);
  return results.every((r) => r === true);
};

defineExpose({ validate });
</script>

<template>
  <div class="contact w-11/12 bg-white rounded-xl p-4 my-4">
    <h1 class="text-2xl font-sans font-bold">Bog'lanish uchun ma'lumot</h1>
    <form action="">
      <label>Bog'lanish uchun shaxs</label> <br />
      <BaseInput
        v-model="contact.contact_name"
        ref="nameRef"
        :rules="[required(), minLength(4, 'Eng kamida 4 ta belgi')]"
        placeholder="Ismingizni kiriting..."
        class="w-80 bg-gray-200 focus:outline-none h-10 indent-4 rounded-sm my-3"
      />

      <label>E-pochta manzili*</label> <br />
      <BaseInput
        v-model="contact.email"
        ref="emailRef"
        :rules="[required(), email()]"
        placeholder="Email kiriting..."
        class="w-80 bg-gray-200 focus:outline-none h-10 indent-4 rounded-sm my-3"
      />

      <label>Telefon raqam*</label> <br />
      <BaseInput
        v-model="contact.phone_number"
        ref="phoneRef"
        :rules="[required(), minLength(9, 'Eng kamida 9 ta belgi')]"
        type="phone"
        placeholder="Telefon kiriting..."
        class="w-80 bg-gray-200 focus:outline-none h-10 indent-4 rounded-sm my-3"
      />
    </form>
  </div>
</template>
