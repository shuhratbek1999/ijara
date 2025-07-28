<template>
	<div class="carausel xl:mt-2 lg:mt-2 xx:mt-2 w-full flex justify-center">
		<a-carousel class="w-11/12 rounded-lg" autoplay arrows>
			<template #prevArrow>
				<div class="custom-slick-arrow" style="left: 10px; z-index: 1">
					<left-circle-outlined />
				</div>
			</template>
			<template #nextArrow>
				<div class="custom-slick-arrow" style="right: 10px">
					<right-circle-outlined />
				</div>
			</template>
			<div
				class="text-red-400 relative"
				v-for="(item, index) in Images"
				:key="index"
			>
				<img v-if="item.img" :src="item.img" class="w-full h-full" alt="" />
				<picture v-else>
					<source
						:srcset="BASE_URL + 'img/' + item.url"
						media="(orientation: portrait)"
					/>
					<img
						class="absolute top-0 left-1/2 right-1/2 -translate-x-1/2"
						:src="BASE_URL + 'img/' + item.url"
						alt=""
					/>
				</picture>
			</div>
		</a-carousel>
	</div>
</template>

<script setup>
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import { inject, ref, watchEffect } from 'vue';
const BASE_URL = inject('BASE_URL');
const props = defineProps({
	carousel: {
		type: Array,
		required: true,
	},
});
const Images = ref();
watchEffect(() => {
	Images.value = props.carousel;
});
</script>

<style scoped>
:deep(.slick-slide) {
	text-align: center;
	height: 400px;
	background: #364d79;
	overflow: hidden;
	border-radius: 10px;
}

:deep(.slick-arrow.custom-slick-arrow) {
	width: 35px;
	height: 35px;
	font-size: 29px;
	color: #fff;
	background-color: rgba(31, 45, 61, 0.11);
	transition: ease all 0.3s;
	opacity: 0.3;
	z-index: 1;
}
:deep(.slick-arrow.custom-slick-arrow:before) {
	display: none;
}
:deep(.slick-arrow.custom-slick-arrow:hover) {
	color: #fff;
	opacity: 0.5;
}

:deep(.slick-slide h3) {
	color: #fff;
}
@media (min-width: 360px) {
	:deep(.slick-slide) {
		text-align: center;
		height: 200px;
		background: #364d79;
		overflow: hidden;
		border-radius: 10px;
	}
}
@media (min-width: 1024px) {
	:deep(.slick-slide) {
		text-align: center;
		height: 450px;
		background: #364d79;
		overflow: hidden;
		border-radius: 10px;
		display: flex;
		justify-content: center;
	}
}
</style>
