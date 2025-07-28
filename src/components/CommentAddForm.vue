<template>
	<section class="comment_add flex justify-center bg-gray-50">
		<div class="content w-11/12" v-if="oneElon">
			<div
				class="back flex items-center cursor-pointer mt-2 text-sm"
				@click="router.go(-1)"
			>
				<i class="material-icons text-xl mr-1">keyboard_backspace</i>
				<span>Назад</span>
			</div>
			<div class="content_forma xl:w-3/4 py-6 xx:w-full">
				<h1 class="font-montserrat xl:text-base xx:text-xs">
					Ваш отзыв о товаре <span class="font-bold">{{ oneElon.name }}</span>
				</h1>
				<div class="img_name flex my-8" v-if="oneElon.images">
					<img
						:src="BASE_URL + 'img/' + oneElon.images[0].url"
						class="w-20 h-20 mr-4"
						alt=""
					/>
					<p>
						<span class="block font-montserrat xl:text-base xx:text-xs">{{
							oneElon.name
						}}</span>
						<span
							class="font-montserrat xl:text-base xx:text-xs"
							v-if="oneElon.user"
							>Продавец
							<span class="text-cyan-400">{{ oneElon.user.name }}</span></span
						>
					</p>
				</div>
				<div class="rating">
					<h2 class="font-montserrat xl:text-base xx:text-xs font-bold my-4">
						Оцените товар
					</h2>
					<a-rate v-model:value="Comment.rating" allow-half />
				</div>
				<div class="line xl:w-8/12 xx:w-full h-0.3 bg-gray-500 my-10"></div>
				<a-form
					:model="Comment"
					name="basic"
					:label-col="{ span: 8 }"
					:wrapper-col="{ span: 16 }"
					autocomplete="off"
					@finish="onFinish"
					@finishFailed="onFinishFailed"
				>
					<h1 class="font-bold mb-4 xl:text-xl xx:text-xs font-montserrat">
						Поделитесь отзывом о товаре
					</h1>
					<a-form-item
						name="name"
						:rules="[
							{
								required: true,
								message: 'Это поле является обязательным для заполнения',
							},
						]"
					>
						<a-input
							v-model:value="Comment.name"
							placeholder="Введите ваше имя"
							class="h-12"
						/>
					</a-form-item>

					<a-form-item
						name="comment_text"
						:rules="[
							{
								required: true,
								message: 'Это поле является обязательным для заполнения',
							},
						]"
					>
						<a-textarea
							:rows="6"
							v-model:value="Comment.comment_text"
							placeholder="Напишите отзыв"
						/>
					</a-form-item>
					<a-form-item :wrapper-col="{ offset: 0, span: 16 }">
						<a-button
							type="primary"
							class="w-full my-4 h-12 font-bold font-montserrat"
							html-type="submit"
							>Отправить отзыв</a-button
						>
					</a-form-item>
				</a-form>
			</div>
		</div>
	</section>
</template>

<script setup>
import { message } from 'ant-design-vue';
import axios from 'axios';
import { inject, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const BASE_URL = inject('BASE_URL');
const oneElon = ref({});
let Comment = ref({
	comment_text: '',
	elon_id: null,
	rating: 0,
	name: '',
});
const props = defineProps({
	elon: {
		type: Object,
		required: true,
	},
});
const onFinishFailed = errorInfo => {
	console.log(errorInfo);
};
const onFinish = values => {
	const { name, comment_text } = values;
	Comment.value.comment_text = comment_text;
	Comment.value.name = name;
	Comment.value.elon_id = oneElon.value.id;
	axios
		.post('comment/create', Comment.value)
		.then(result => {
			if (!result.data.success) {
				message.warning(result.data.message);
				router.push('/register');
			} else {
				router.go(-1);
			}
		})
		.catch(err => {
			message.warning(err);
		});
};
watchEffect(() => {
	oneElon.value = props.elon[0];
});
</script>

<style lang="scss" scoped></style>
