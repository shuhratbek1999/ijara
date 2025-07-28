<template>
  <div class="users">
    <ul class="border-2 p-1 overflow-x-scroll">
      <li v-for="(item, index) in users" :key="index" class="m-2">
        <div class="name md:w-1/2 border-2 flex justify-between p-2">
          <h4>name:</h4>
          <h2>{{ item.name }}</h2>
        </div>
        <div
          class="email md:w-1/2 border-2 flex justify-between flex-wrap my-4 p-2"
        >
          <h4>email:</h4>
          <h2>{{ item.email }}</h2>
        </div>
        <div class="role md:w-1/2 border-2 flex justify-between p-2">
          <h4>role:</h4>
          <h2>{{ item.role }}</h2>
        </div>
      </li>
    </ul>
    <button
      class="py-2 px-6 bg-green-500 rounded-sm text-white hover:bg-green-600 transition-all my-4"
      @click="openModal"
    >
      Update
    </button>
    <Modal :open="open" :styles="styles" @close="close">
      <template v-slot:category>
        <a-form :model="dataForm" name="basic" autocomplete="off" class="mt-10">
          <a-form-item
            :name="['name']"
            label="Name"
            :rules="[{ required: true, message: 'name required' }]"
            :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }"
          >
            <a-input
              v-model:value="dataForm.name"
              placeholder="user name"
            ></a-input>
          </a-form-item>
          <a-form-item
            :name="['email']"
            label="Email"
            :rules="[{ required: true, message: 'email required' }]"
            :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }"
          >
            <a-input
              v-model:value="dataForm.email"
              placeholder="email adress"
            ></a-input>
          </a-form-item>
          <a-form-item
            :name="['password']"
            label="Password"
            :rules="[{ required: true, message: 'password required' }]"
            :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }"
          >
            <a-input-password
              v-model:value="dataForm.password"
              placeholder="password"
            />
          </a-form-item>
        </a-form>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { message } from "ant-design-vue";
import axios from "axios";
import { onMounted, ref, reactive } from "vue";
import Modal from "../../components/modal.vue";
const users = ref([]);
let open = ref(false),
  styles = ref({
    title: "user update",
    width: "90%",
  }),
  userID = ref(null);
let dataForm = reactive({
  name: "",
  email: "",
  password: "",
  role: "foydalanuvchi",
});
const openModal = () => {
  open.value = true;
};

const close = () => {
  axios
    .patch("user/update/" + userID.value, dataForm)
    .then((res) => {
      users.value = [];
      users.value = [res.data.data];
      open.value = false;
    })
    .catch((err) => {
      message.warning(err.response?.data?.message || "Xatolik yuz berdi");
    });
};
const oneUser = () => {
  axios
    .get("user/person")
    .then((res) => {
      users.value = [res.data.data];
      dataForm.name = res.data.data.name;
      dataForm.email = res.data.data.email;
      userID.value = res.data.data.id;
    })
    .catch((err) => {
      message.warning(err.response?.data?.message || "Xatolik yuz berdi");
    });
};
onMounted(() => {
  oneUser();
});
</script>

<style></style>
