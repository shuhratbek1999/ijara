<template>
  <div class="content max-sm:w-10/12 bg-gray-800 p-5 md:w-103 rounded-md">
    <div class="logo">
      <img
        class="w-24"
        src="https://themes.coderthemes.com/konrix_r/assets/logo-light-9db6a5f0.png"
        alt="logo"
      />
    </div>
    <a-form
      :model="props.form"
      name="basic"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      class="mt-10"
    >
      <slot name="fullname"></slot>
      <a-form-item
        :name="['email']"
        label="Email Address"
        :rules="[{ type: 'email', required: true }]"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <a-input v-model:value="props.form.email" placeholder="email adress" />
      </a-form-item>
      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <a-input-password
          v-model:value="props.form.password"
          placeholder="password"
        />
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ span: 24 }">
        <div class="item w-full flex justify-between">
          <a-checkbox v-model:checked="props.form.remember">{{
            props.form.checked
          }}</a-checkbox>
          <div
            v-if="props.form.forget"
            class="forgot font-bold text-blue-700 cursor-pointer"
            @click="Register('forget')"
          >
            Forget Password?
          </div>
        </div>
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 24 }">
        <a-button class="w-full" type="primary" html-type="submit">
          {{ props.form.button }}
        </a-button>
      </a-form-item>
    </a-form>

    <div class="link flex justify-center items-center">
      <div
        class="link_items border-0.1 p-2 rounded border-gray-500 md:mx-2 max-sm:mx-1 flex items-center cursor-pointer"
        v-for="(item, index) in links"
        :key="index"
      >
        <i
          class="material-icons md:w-10 lg:w-10 xl:w-10 max-sm:w-7"
          :class="[
            item.name == 'Github' ? 'text-blue-800' : '',
            item.name == 'Google' ? 'text-red-900' : '',
            item.name == 'Facebook' ? 'text-blue-800' : '',
          ]"
        >
          {{ item.icon }}
        </i>
        <span class="text-gray-400 font-medium md:text-sm max-sm:text-xx">{{
          item.name
        }}</span>
      </div>
    </div>
    <div class="account py-5 flex justify-center">
      <span class="text-gray-400 text-sm">
        {{ props.form.question }}
        <span
          class="text-blue-600 font-medium cursor-pointer"
          @click="Register(props.form.questions)"
        >
          {{ props.form.questions }}
        </span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { reactive, inject, onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import * as jwt_decode from "jwt-decode";
const router = useRouter();
const emit = defineEmits(["register"]);
const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
});
const userData = ref(null);
const links = reactive([
  {
    name: "Github",
    icon: "home",
  },
  {
    name: "Google",
    icon: "Google",
  },
  {
    name: "Facebook",
    icon: "facebook",
  },
]);
const onFinish = (values) => {
  emit("register");
};
const onFinishFailed = (errorInfo) => {
  errorInfo.errorFields.forEach((item) => {
    message.error(`${item.errors[0]}`);
  });
};
const Register = (name) => {
  switch (name) {
    case "Register":
      router.push("/register");
      break;
    case "forget":
      router.push("/recover-password");
      break;
    case "Log In":
      router.push("/login");
      break;
    default:
      break;
  }
};
// const Google = async(name) => {
//     try{
//        window.google.accounts.id.initialize({
//           client_id: '927068781504-p7r9k1l0u8q398tu2qjf2ruh2scvcp40.apps.googleusercontent.com',
//           callbakc: handlerGoogle,
//           ux_mode: 'popup'
//     })
//     window.google.accounts.id.prompt()
//     }
//     catch(error){
//       console.log(error)
//     }
// }
// const handlerGoogle = (response) => {
//  const userObject = jwt_decode(response.credential)
//       userData.value = userObject;
//       console.log(userData.value);
// }
</script>

<style lang="scss" scoped></style>
