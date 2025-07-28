<template>
	<section class="w-full flex justify-center bg-gray-50 py-10">
		<div class="comment w-11/12 flex xx:flex-col xl:flex-row">
			<ul class="comment_list xl:w-2/3" v-if="Elon.comments">
				<h2 class="font-bold mb-2 xl:text-xl">
					Отзывы <span class="text-xs">{{ commentLength }}</span>
				</h2>
				<p
					v-if="commentLength == 0"
					class="xx:mt-16 xl:w-2/3 flex flex-col items-center"
				>
					Помогите другим пользователям с выбором — будьте первым, кто поделится
					своим мнением об этом товаре.
				</p>
				<li
					v-for="(com, index) in Elon.comments"
					:key="index"
					class="border-b-0.1 pt-2 xl:h-32 xx:h-32 flex justify-between border-b-gray-600"
				>
					<div class="info">
						<h2 class="font-bold font-montserrat">{{ com.name }}</h2>
						<a-rate
							class="my-1 xx:text-sm xl:text-xl"
							v-model:value="com.rating"
							allow-half
							@change="Rating"
						/>
						<p class="xx:text-xs xl:text-base">{{ com.comment_text }}</p>
					</div>
					<p class="date xx:text-xs xl:text-sm">
						{{ dayjs(com.create_at).format('YYYY [yil] D MMMM HH:mm:ss') }}
					</p>
				</li>
			</ul>
			<div class="comment_add xx:mt-16 xl:w-1/3 flex flex-col items-center">
				<h2 class="border-b-0.1 mb-6 border-gray-500 xx:w-full xl:w-1/2 pb-1">
					<p v-if="commentLength != 0 && RatingAll != 0">
						<span>{{ RatingAll / commentLength }}</span>
						<span>/ 5</span>
					</p>
					<p v-else>Нет оценок</p>
				</h2>
				<a-button
					@click="CommentAdd(Elon.name)"
					class="xl:w-1/2 xx:w-full h-10"
					type="primary"
					>Написать отзыв</a-button
				>
			</div>
		</div>
	</section>
</template>

<script setup>
import dayjs from 'dayjs';
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
	elon: {
		type: Object,
		required: true,
	},
});
const Elon = ref({});
const Rating = ret => {
	console.log(ret);
};
const CommentAdd = name => {
	router.push({ path: '/review', query: { name: name } });
};
const commentLength = computed(() => {
	if (Elon.value.comments) {
		return Elon.value.comments.length;
	}
	return 0;
});
const RatingAll = computed(() => {
	let AllRating = 0;
	if (Elon.value.comments) {
		Elon.value.comments.map(item => {
			AllRating += item.rating;
		});
	}
	return AllRating;
});
watchEffect(() => {
	Elon.value = props.elon;
});
</script>

<style lang="scss" scoped></style>
