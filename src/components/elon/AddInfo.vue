<template>
  <div class="Add_Information w-full bg-white rounded-md p-5 my-4">
    <h1 class="text-xl font-medium font-sans">Qo'shimcha ma'lumot</h1>
    <div class="business flex items-end">
      <div class="busines_top">
        <h4>Shaxsiy yoki biznes</h4>
        <button
          class="private border-2 w-44 rounded m-1 h-9 hover:bg-sky-400 hover:text-white"
          :class="[
            Elon.foydalanish == 'shaxsiy' ? 'bg-sky-400 text-white' : '',
          ]"
          @click="Busines(true)"
        >
          shaxsiy
        </button>
      </div>
      <button
        class="busines border-2 w-44 rounded m-1 h-9 hover:bg-sky-400 hover:text-white"
        :class="[Elon.foydalanish == 'biznes' ? 'bg-sky-400 text-white' : '']"
        @click="Busines(false)"
      >
        biznes
      </button>
    </div>
    <div class="State flex items-end">
      <div class="state_top">
        <h4>Holati</h4>
        <button
          class="private border-2 w-44 rounded m-1 h-9 hover:bg-sky-400 hover:text-white"
          :class="[Elon.holati == 'ishlatilgan' ? 'bg-sky-400 text-white' : '']"
          @click="Holat(true)"
        >
          ishlatilgan
        </button>
      </div>
      <button
        class="busines border-2 w-44 rounded m-1 h-9 hover:bg-sky-400 hover:text-white"
        :class="[Elon.holati == 'yangi' ? 'bg-sky-400 text-white' : '']"
        @click="Holat(false)"
      >
        yangi
      </button>
    </div>
    <div class="forma">
      <div
        class="forma_item w-80"
        v-for="(form, index) in FieldsForma"
        :key="index"
      >
        <div class="checkbox border-red-500" v-if="form.category_fields">
          <label :for="form.category_fields.field_name">{{
            form.category_fields.field_name
          }}</label>
          <a-input
            v-if="form.category_fields.field_type !== 'checkbox'"
            v-model:value="form.values"
            :type="form.category_fields.field_type"
            :placeholder="form.category_fields.field_name"
          />
          <a-input
            v-else
            v-model:value="form.values"
            type="checkbox"
            :placeholder="form.category_fields.field_name"
          />
        </div>
        <div
          class="text flex items-center"
          :class="[form.field_type == 'checkbox' ? 'w-1/2' : 'w-full']"
          v-else
        >
          <label
            class="px-4 w-80"
            v-if="form.field_name"
            :for="form.field_name"
            >{{ form.field_name }}</label
          >
          <a-input
            class="my-1"
            v-if="form.field_type !== 'checkbox'"
            v-model:value="form.values"
            :type="form.field_type"
            :placeholder="form.field_name"
          />
          <a-input
            v-else
            v-model:value="form.values"
            type="checkbox"
            :true-value="true"
            :false-value="false"
            class="h-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { reactive, ref, watchEffect } from "vue";

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
});
let Elon = reactive(props.info),
  busines = ref(false),
  FieldsForma = ref([]);

const Busines = (boolean) => {
  boolean ? (Elon.foydalanish = "shaxsiy") : (Elon.foydalanish = "biznes");
};
const Holat = (boolean) => {
  boolean ? (Elon.holati = "ishlatilgan") : (Elon.holati = "yangi");
};
const oneFieldCategory = (id) => {
  axios
    .get("subcategory/field_one/" + id)
    .then((res) => {
      FieldsForma.value = res.data.data;
    })
    .catch((err) => {
      message.warning(err);
    });
};
watchEffect(() => {
  if (Elon.field_id) {
    oneFieldCategory(Elon.field_id);
  }
});
</script>

<style></style>
