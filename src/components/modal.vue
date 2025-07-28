<template>
	<div class="modal">
		<a-modal
			v-model:open="open"
			:title="props.styles.title"
			:width="props.styles.width"
			okText="Saqlash"
			@ok="handleOk"
			@cancel="Cancel"
			@afterClose="handleModalClose"
			@afterOpen="handleModalOpen"
		>
			<slot name="category"></slot>
		</a-modal>
	</div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
const props = defineProps({
	open: {
		type: Boolean,
		required: true,
	},
	styles: {
		type: Object,
	},
});
const emit = defineEmits(['close', 'add']);
let open = ref(props.open);
const handleOk = () => {
	open.value = false;
	emit('add');
};
const Cancel = () => {
	open.value = false;
	emit('close');
};
const handleModalOpen = () => {
	nextTick(() => {
		const category_filter = document.querySelector('.category_filter');
		console.log(category_filter);

		if (category_filter) category_filter.focus();
	});
};
const handleModalClose = () => {
	document.querySelector('body').focus();
};
watch(
	() => props.open,
	(newVal, oldVal) => {
		open.value = newVal;
	}
);
</script>

<style scoped>
.modal {
	width: 100%;
}
</style>
