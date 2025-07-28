<template>
	<div class="xabarnoma fixed z-20 bottom-0 right-10 w-97 border-2">
		<div class="xabarnoma__header w-full flex flex-col items-center">
			<div
				class="xabarnoma__header_user w-full p-2 flex justify-between items-center bg-white h-14 border-b-0.1"
			>
				<h1>{{ Xabarnoma.user_name }}</h1>
				<p class="cursor-pointer" @click="Close">
					<CloseOutlined />
				</p>
			</div>
			<div
				class="xabarnoma__header_elon w-full p-2 flex justify-between items-center bg-white"
			>
				<img
					class="w-12 h-12"
					:src="BASE_URL + 'img/' + Xabarnoma.img.url"
					alt=""
				/>
				<p>
					<span class="block">{{ Xabarnoma.name }}</span>
					<span class="font-medium">{{ Xabarnoma.price }} сум</span>
				</p>
				<p>ID: {{ Xabarnoma.id }}</p>
			</div>
		</div>
		<div
			class="xabarnoma__content w-full h-56 bg-gray-200 p-2 overflow-y-scroll"
		>
			<div
				v-for="(message, index) in Messages"
				:key="index"
				class="message flex flex-col items-end my-1"
			>
				<!-- {{ message }} -->
				<p
					class="bg-cyan-500 py-1 px-4 rounded-xl text-white"
					v-if="message.data.text"
				>
					<span>{{ message.data.text }}</span>
					<span class="text-xx pt-2 ml-1 inline-block">{{
						message.data.time
					}}</span>
				</p>
				<img
					v-if="message.data.img"
					class="w-40 h-40"
					:src="message.img"
					alt="images"
				/>
			</div>
		</div>
		<div class="xabarnoma__footer p-2 flex bg-white">
			<a-upload :before-upload="handleFileUpload" :show-upload-list="false">
				<FileImageFilled class="text-3xl cursor-pointer text-blue-500" />
			</a-upload>
			<div class="pdf">
				<FilePdfFilled class="text-xl mx-2 cursor-pointer" />
			</div>
			<a-input-group compact>
				<a-input
					v-model:value="text"
					placeholder="напишите сообщение..."
					style="width: calc(100% - 80px)"
				/>
				<a-button @click="Send(Xabarnoma)" type="primary">Submit</a-button>
			</a-input-group>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, inject, onMounted } from 'vue';
import {
	CloseOutlined,
	FileImageFilled,
	FilePdfFilled,
} from '@ant-design/icons-vue';
const Socket = inject('socket');
const BASE_URL = inject('BASE_URL');
const props = defineProps({
	xabar: {
		type: Object,
	},
});
let senderId = parseFloat(localStorage.getItem('userID'));
const emits = defineEmits(['close']);
let Xabarnoma = ref(props.xabar),
	Messages = ref([]),
	text = ref('');
const Close = () => {
	emits('close', false);
};
const handleFileUpload = file => {
	// console.log('Yuklangan fayl:', file);
	const reader = new FileReader();
	reader.onload = e => {
		Messages.value.push({ img: e.target.result });
	};
	reader.readAsDataURL(file);
	return false; // Fayl yuklanishini bloklaymiz
};
const Send = Xabar => {
	const newMessage = {
		text: text.value,
		time: new Date().toLocaleTimeString(),
	};
	Socket.sendMessage({
		message: newMessage,
		senderId,
		receiverId: Xabar.user_id,
	});
	// Messages.value.push({ data: newMessage });
	text.value = '';
};
watch(
	() => props.xabar,
	() => {
		Xabarnoma.value = props.xabar;
	}
);
// onMounted(() => {
// 	let senderId = parseFloat(localStorage.getItem('userID'));
// 	let receiverId = Xabarnoma.value.user_id;
// 	if (senderId) {
// 		// Socket.connect();
// 		Socket.joinRoom({ senderId, receiverId }); // Faqat userID yuboramiz
// 		Socket.onReceiveMessage(data => {
// 			Messages.value.push(data);
// 		});
// 	}
// });
</script>

<style scoped></style>
