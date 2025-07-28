<template>
	<div class="home">
		<NavbarMenu />
		<CommentForm :elon="ElonOne" />
		<Footer />
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavbarMenu from '../../../components/NavbarMenu.vue';
import CommentForm from '../../../components/CommentAddForm.vue';
import Footer from '../../../components/Footer.vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const ElonOne = ref([]);
const AllElon = () => {
	axios
		.get('elon/names', {
			params: {
				name: route.query.name,
			},
		})
		.then(res => {
			ElonOne.value = res.data.data;
		})
		.catch(err => {
			message.warning(err);
		});
};
onMounted(() => {
	AllElon();
});
</script>

<style lang="scss" scoped></style>
