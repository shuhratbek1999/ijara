<template>
	<main class="sub_category_elon p-5">
		<div class="price flex flex-col mt-5">
			<h1 class="font-sans font-medium mb-2">price</h1>
			<div class="input flex">
				<input
					class="w-28 h-10 mr-1 outline-none indent-2"
					type="number"
					placeholder="мин. цена"
					v-model="filterValues.min_price"
					@input="InputMarka"
				/>
				<input
					class="w-28 h-10 outline-none indent-2"
					type="number"
					placeholder="макс. цена"
					v-model="filterValues.max_price"
					@input="InputMarka"
				/>
			</div>
		</div>
		<div class="brend" v-for="(item, index) in FilterList" :key="index">
			<div
				class="list_item my-6"
				v-for="(fil, index) in item.field_doc"
				:key="index"
			>
				<label
					v-if="
						fil.fields.field_type !== 'checkbox' &&
						fil.fields.field_type !== 'select'
					"
					class="font-sans font-medium mb-2"
					for=""
					>{{ fil.fields.field_name }}</label
				>
				<!-- {{ fil.fields.field_type }} -->
				<input
					v-if="fil.fields.field_type === 'text'"
					type="text"
					:placeholder="fil.fields.field_name"
					:id="'filter-' + fil.fields.id"
					v-model="filterValues[fil.fields.id]"
					@input="InputMarka"
					class="outline-none w-full h-10 indent-1"
				/>
				<input
					v-if="fil.fields.field_type === 'number'"
					type="number"
					:placeholder="fil.fields.field_name"
					:id="'filter-' + fil.fields.id"
					v-model="filterValues[fil.fields.id]"
					@input="InputMarka"
					class="outline-none w-full h-10 indent-1"
				/>
			</div>
		</div>
	</main>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
const emits = defineEmits(['filters']);
const props = defineProps({
	filter: {
		type: Object,
		required: true,
	},
});
const FilterList = ref({});
let filterValues = ref({});
const InputMarka = text => {
	emits('filters', filterValues.value);
};
watchEffect(() => {
	FilterList.value = props.filter;
});
</script>

<style lang="scss" scoped></style>
