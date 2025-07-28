<template>
	<section
		class="catalog absolute top-10 h-screen z-50 overflow-y-hidden bg-white w-full"
	>
		<div class="main_catalog flex flex-wrap" v-if="subCategoryAll.length == 0">
			<div
				class="main_catalog w-103 m-1 flex justify-center items-center text-sm p-2 h-20 bg-cityBg rounded-lg"
				v-for="(main, index) in MainAllCategory"
				:key="index"
				@click="MainCategoryClick(main)"
			>
				<span class="font-Atyp">{{ main.name }}</span>
			</div>
		</div>
		<div
			class="main_catalog flex flex-wrap"
			v-else-if="childCategoryAll.length == 0"
		>
			<div
				class="main_catalog w-103 m-1 flex justify-center items-center text-sm p-2 h-20 bg-cityBg rounded-lg"
				v-for="(sub, index) in subCategoryAll"
				:key="index"
				@click="subCategoryClick(sub)"
			>
				<span class="font-Atyp text-center">{{ sub.name }}</span>
			</div>
		</div>
		<div class="main_catalog flex flex-wrap" v-else>
			<div
				class="main_catalog w-103 m-1 flex justify-center items-center text-sm p-2 h-20 bg-cityBg rounded-lg"
				v-for="(child, index) in childCategoryAll"
				:key="index"
				@click="childCategoryClick(child)"
			>
				<span class="font-Atyp text-center">{{ child.name }}</span>
			</div>
		</div>
	</section>
</template>

<script setup>
import { message } from 'ant-design-vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
let MainAllCategory = ref([]),
	subCategoryAll = ref([]),
	childCategoryAll = ref([]);
const MainCategoryClick = main => {
	subCategoryAll.value = [];
	subCategoryAll.value = [...main.subcategories];
};
const subCategoryClick = sub => {
	childCategoryAll.value = [];
	if (sub.categories.length > 0) {
		childCategoryAll.value = [...sub.categories];
	} else {
		router.push({ name: 'SubCategoryWithElon', params: { name: sub.name } });
	}
};
const childCategoryClick = child => {
	if (child.name) {
		router.push({ name: 'CategoryWithElon', params: { name: child.name } });
	}
};
const MainCategory = () => {
	axios
		.get('category/mainCatAll')
		.then(res => {
			MainAllCategory.value = res.data.data;
		})
		.catch(err => {
			message.warning(err);
		});
};
onMounted(() => {
	MainCategory();
});
</script>

<style lang="scss" scoped></style>
