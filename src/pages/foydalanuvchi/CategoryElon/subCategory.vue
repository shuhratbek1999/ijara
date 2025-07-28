<template>
	<section>
		<NavbarMenu />
		<CategoryElonList :sub="oneSubcategoryElon" />
		<Footer />
	</section>
</template>

<script setup>
import NavbarMenu from '../../../components/NavbarMenu.vue';
import Footer from '../../../components/Footer.vue';
import CategoryElonList from '../../../components/CategoryElonList.vue';
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
const router = useRouter();
const route = useRoute();
let oneSubcategoryElon = ref({
	filter: [],
	list: [],
});
const allElonSubCategoryOne = () => {
	oneSubcategoryElon.value.list = [];
	axios
		.get(`Subcategory/sub/${route.params.name}`)
		.then(res => {
			// console.log(res.data.data, route.params.name);
			if (res.data.data) {
				const { categories, ...data } = res.data.data;
				for (let key of categories) {
					for (let i of key.elons) {
						data.elon.push(i);
					}
				}
				// console.log(data.elon);
				oneSubcategoryElon.value.filter = categories;
				oneSubcategoryElon.value.list = data.elon;
			}
		})
		.catch(err => {
			message.warning(err);
		});
};
watch(
	() => route.params.name,
	() => {
		allElonSubCategoryOne();
	}
);
onMounted(() => {
	allElonSubCategoryOne();
});
</script>

<style lang="scss" scoped></style>
