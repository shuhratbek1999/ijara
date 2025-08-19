<template>
  <div class="login h-screen flex justify-center items-center bg-gray-900">
    <div class="content bg-gray-800 p-5 md:w-103 rounded-md">
      <div class="logo">
        <img
          class="w-24"
          src="https://themes.coderthemes.com/konrix_r/assets/logo-light-9db6a5f0.png"
          alt="logo"
        />
      </div>
      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        class="mt-10"
      >
        <a-form-item
          :name="['email']"
          label="Email Address"
          :rules="[{ type: 'email', required: true }]"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
        >
          <a-input v-model:value="formState.email" placeholder="email adress" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 24 }">
          <a-button class="w-full" type="primary" html-type="submit"
            >Reset Password</a-button
          >
        </a-form-item>
      </a-form>
      <div class="account py-5 flex justify-center">
        <span class="text-gray-400 text-sm">
          Back to
          <span class="text-blue-600 font-medium cursor-pointer" @click="Login">
            Login
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { reactive, ref } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
const router = useRouter();
const formState = reactive({
  email: "",
});
const randomCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
const onFinish = (values) => {
  let code = ref(`${randomCode()}`);
  values.code = code.value;
  axios.patch("user/reset", values).then((res) => {
    if (res.data) {
      message.success(res.data.message);
    }
    router.push("/login");
  });
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const Login = () => {
  router.push("/login");
};
</script>

<style scoped>
.ant-form-item-label {
  color: white !important;
}
</style>
