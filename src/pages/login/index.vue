<template>
	<div class="login h-screen flex justify-center items-center bg-gray-900">
		<Login :form="formState" @register="register" />
	</div>
</template>

<script setup>
import axios from 'axios';
import { reactive } from 'vue';
import Login from '../../components/login.vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
const router = useRouter();
const formState = reactive({
	email: '',
	password: '',
	remember: true,
	forget: true,
	checked: 'Remember me',
	button: 'Log in',
	question: "Don't have an account ?",
	questions: 'Register',
});
const register = () => {
	const data = {};
	data.email = formState.email;
	data.password = formState.password;
	axios.post('user/login', data).then(res => {
		if (res.data.success) {
			localStorage.setItem('token', res.data.data.token);
			localStorage.setItem('role', res.data.data.role);
			localStorage.setItem('userID', res.data.data.id);
			message.success('xush kelibsiz!');
			if (res.data.data.role == 'Admin') {
				router.push('/dashboard');
			} else {
				router.push('/');
			}
		} else {
			message.warning(`${res.data.message}`);
		}
	});
};
</script>

<style scoped>
.ant-form-item-label {
	color: white !important;
}
</style>
