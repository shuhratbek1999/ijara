<template>
	<footer class="footer w-full flex flex-col items-center pt-10 mb-20">
		<ul class="footer_menu flex xx:flex-col xl:flex-row w-11/12 mb-10">
			<li
				class="footer_menu_list xx:w-11/12 xx:my-2 xl:my-0 xl:w-1/4"
				v-for="(menu, index) in FooterMenu"
				:key="index"
			>
				<p class="font-bold font-montserrat xx:flex xl:block">
					<span @click="MenuTitleClick(menu.title)">{{ menu.title }}</span>
					<i class="material-icons xx:inline-block xl:hidden"
						>keyboard_arrow_down</i
					>
				</p>
				<ul
					v-if="menu.lists"
					class="xl:block"
					:class="[menuTitle == menu.title ? 'xx:block' : 'xx:hidden']"
				>
					<li class="my-3" v-for="(list, index) in menu.lists" :key="index">
						<p
							class="font-montserrat text-sm text-gray-600 cursor-pointer"
							v-if="!list.name"
						>
							{{ list }}
						</p>
						<p v-else class="flex items-center">
							<i class="material-icons mr-2 text-rose-700">{{ list.icon }}</i>
							<span class="font-montserrat text-sm text-gray-600">{{
								list.name
							}}</span>
						</p>
					</li>
					<div v-if="menu.icons">
						<h1 class="mb-5 text-xl font-montserrat font-bold">
							Elon в соцсетях
						</h1>
						<ul class="flex w-7/12 justify-between">
							<li v-for="(item, index) in menu.icons" :key="index">
								<i
									v-if="item.icon == 'telegram'"
									class="material-icons text-2xl text-blue-600"
									>{{ item.icon }}</i
								>
								<component
									:is="item.icon"
									class="text-red-700"
									style="font-size: 24px"
								/>
							</li>
						</ul>
					</div>
				</ul>
			</li>
		</ul>
		<div
			class="footer_about xx:py-0 xl:py-2 w-11/12 flex xx:flex-col xl:flex-row xx:h-48 xl:h-20 items-center border-t-2"
		>
			<div
				class="footer_about_title flex py-2 xx:flex-col xl:flex-row xx:w-11/12 xl:w-1/2"
			>
				<p class="mr-2 font-medium font-montserrat text-sm cursor-pointer">
					Соглашение о конфиденциальности
				</p>
				<p class="font-medium font-montserrat text-sm cursor-pointer">
					Пользовательское соглашение
				</p>
			</div>
			<div
				class="ramz xx:w-11/12 xl:w-1/2 flex justify-end text-gray-500 text-sm"
			>
				<p>«2024© ООО «ELON MARKET». ИНН 993941226. Все права защищены»</p>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { ref } from 'vue';
import {
	InstagramOutlined,
	FacebookOutlined,
	YoutubeOutlined,
} from '@ant-design/icons-vue';
const FooterMenu = ref([
	{
		title: 'O нас',
		lists: ['Пункты выдачи', 'Вакансии'],
	},
	{
		title: 'Пользователям',
		lists: ['Связаться с нами', 'Вопрос - Ответ'],
	},
	{
		title: 'Для предпринимателей',
		lists: ['Продавайте на Uzum', 'Вход для продавцов', 'Открыть пункт выдачи'],
	},
	{
		title: 'Скачать приложение',
		lists: [
			{
				name: 'App Store',
				icon: 'apple',
			},
			{
				name: 'Google Play',
				icon: 'smart_display',
			},
		],
		icons: [
			{
				icon: InstagramOutlined,
			},
			{
				icon: 'telegram',
			},
			{
				icon: FacebookOutlined,
			},
			{
				icon: YoutubeOutlined,
			},
		],
	},
]);
let menuTitle = ref('');
const MenuTitleClick = title => {
	menuTitle.value = title;
};
</script>

<style lang="scss" scoped></style>
