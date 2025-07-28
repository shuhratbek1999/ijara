<template>
	<div class="userelon">
		<ul class="userelon__list flex flex-wrap justify-start">
			<li
				class="userelon__item xl:w-108 xx:w-105 bg-white rounded m-1 cursor-pointer"
				v-for="(item, index) in Elon"
				:key="index"
				@click="AboutElon(item)"
			>
				<div class="main__img w-full xl:h-52 xx:h-44 overflow-hidden">
					<img
						:src="BASE_URL + 'img/' + item.images[0].url"
						alt="images"
						class="list__img w-full h-full transition-all rounded hover:scale-125"
					/>
				</div>
				<div
					class="main__item__info flex flex-col items-center xl:my-4 xx:my-2"
				>
					<div
						class="main_info_title w-10/12 flex justify-between items-center"
					>
						<h1 class="info__title w-9/12 xx:text-xs xl:text-base">
							{{ item.name }} {{ favorite }}
						</h1>
						<span :class="[favorite === true ? 'text-red-700' : 'text-black']"
							><HeartOutlined
						/></span>
					</div>
					<h2
						class="main__info__price w-10/12 font-bold xx:text-xs xl:text-base"
					>
						{{ item.price }} сум
					</h2>
					<p class="main__info__adress w-10/12 text-xs font-sans">
						{{ item.adress }}
					</p>
					<p class="main__info__date w-10/12 text-xs mt-4">
						{{ dayjs().format('MMMM D, YYYY h:mm A') }}
					</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { HeartOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import { onMounted, ref, inject, watchEffect, computed } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
const router = useRouter();
const props = defineProps({
	elon: {
		type: Array,
		required: true,
	},
	favorite: {
		type: Boolean,
	},
});
let Elon = ref(props.elon),
	BASE_URL = inject('BASE_URL'),
	favorite = ref(props.favorite);
const AboutElon = data => {
	router.push({ name: 'AboutElon', query: { name: data.name } });
};
const isSub = computed(() => {
	return Elon.value.map(item => {
		if (item.subcategories) {
			return true;
		} else {
			return false;
		}
	});
});
const FilterList = computed(() => {});
watchEffect(() => {
	Elon.value = props.elon;
});
</script>

<style scoped></style>
