<template>
	<div class="login h-screen flex justify-center items-center bg-gray-900">
		<Login :form="formState" @register="register">
			<template v-slot:fullname>
				<a-form-item
					:name="['name']"
					label="Full Name"
					:rules="[{ required: true, message: 'Please input fullname!' }]"
					:label-col="{ span: 24 }"
					:wrapper-col="{ span: 24 }"
				>
					<a-input v-model:value="formState.name" placeholder="fullname" />
				</a-form-item>
			</template>
		</Login>
	</div>
</template>

<script setup>
import { reactive } from 'vue';
import Login from '../../components/login.vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const formState = reactive({
	name: '',
	email: '',
	password: '',
	remember: true,
	forget: false,
	checked: 'I accept Terms and Conditions',
	button: 'Register',
	question: 'Already have account ?',
	questions: 'Log In',
	role: 'foydalanuvchi',
});
const register = () => {
	axios.post('user/create', formState).then(res => {
		if (res.data.data) {
			message.success('user add success');
			router.push('/login');
		}
	});
};
</script>

<style scoped></style>
