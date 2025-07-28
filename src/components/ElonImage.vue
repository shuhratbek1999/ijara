<!-- ElonImage.vue -->
<template>
  <a-upload
    :file-list="fileList"
    list-type="picture-card"
    :before-upload="handleBeforeUpload"
    :on-remove="handleRemove"
  >
    <div v-if="fileList.length < 8">
      <div style="margin-top: 8px">Upload</div>
    </div>
  </a-upload>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const fileList = ref(props.modelValue || []);

watch(
  () => props.modelValue,
  (val) => {
    fileList.value = val || [];
  }
);

// Faqat tanlab qo‘shadi
const handleBeforeUpload = (file) => {
  const uid = Date.now() + "-" + file.name;

  fileList.value = [
    ...fileList.value,
    {
      uid,
      name: file.name,
      originFileObj: file, // keyin yuborish uchun saqlab qo‘yamiz
      status: "ready",
    },
  ];

  emit("update:modelValue", fileList.value);

  return false; // avtomatik upload bo‘lmasin
};

const handleRemove = (file) => {
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid);
  emit("update:modelValue", fileList.value);
};
</script>
