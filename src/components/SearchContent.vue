<template>
	<div
		class="search_content z-40 absolute top-10 xl:left-11 p-5 border-black xx:w-full xl:w-11/12 h-max bg-white"
	>
		<ul class="sub_categoryList">
			<li
				class="flex w-full max-h-10 justify-start items-center cursor-pointer p-2 hover:bg-gray-200"
				v-for="(item, index) in SubCategory"
				:key="index"
				@click="CategoryClick(item)"
			>
				<span class="mr-2">
					<SearchOutlined />
				</span>
				<span class="mt-1">{{ item.name }}</span>
			</li>
		</ul>
		<ul class="category_list">
			<li v-for="(item, index) in Category" :key="index">
				<span>{{ item.name }}</span>
			</li>
		</ul>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
	searchText: {
		type: String,
		required: true,
	},
});
const emits = defineEmits(['search']);
let SubCategory = ref([]),
	Category = ref([]);
const CategoryClick = data => {
	if (data.main_cat_id) {
		router.push({ name: 'SubCategoryWithElon', params: { name: data.name } });
	}
	emits('search');
};
const AllSubcategory = () => {
	axios
		.get(`Subcategory/search/${props.searchText}`)
		.then(res => {
			SubCategory.value = res.data.data;
		})
		.catch(err => {
			message.warning(err);
		});
};
onMounted(() => {
	AllSubcategory();
});
</script>

<style lang="scss" scoped></style>
