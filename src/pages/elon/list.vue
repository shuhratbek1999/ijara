<template>
	<div class="list">
		<a-table
			:columns="columns"
			:data-source="data"
			:pagination="{ pageSize: 50 }"
			:scroll="{ y: 400 }"
		>
			<template #bodyCell="{ column, record }">
				<template v-if="column.title == 'status'">
					<a-button v-if="record.status == 'tasdiqlanmagan'" danger>
						{{ record.status }}
					</a-button>
					<a-button type="primary" v-else-if="record.status == 'tasdiqlangan'">
						{{ record.status }}
					</a-button>
				</template>
			</template>
		</a-table>
		<a-float-button type="primary" @click="AddElon">
			<template #icon>
				<PlusCircleOutlined />
			</template>
		</a-float-button>
	</div>
</template>

<script setup>
import { h, onMounted, reactive, render, ref, inject } from 'vue';
import {
	EditOutlined,
	DeleteOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons-vue';
import { Popconfirm, message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment';
const Socket = inject('socket');
const router = useRouter();
const columns = [
	{
		title: 'Name',
		dataIndex: 'name',
		width: 150,
	},
	{
		title: 'category',
		dataIndex: 'category_name',
		width: 150,
	},
	{
		title: 'date time',
		dataIndex: 'create_at',
		customRender: ({ record }) => {
			return moment(record.create_at * 1000).format('YYYY-MM-DD HH:mm:ss');
		},
	},
	{
		title: 'price',
		dataIndex: 'price',
	},
	{
		title: 'status',
		dataIndex: 'status',
	},
	{
		title: 'Action',
		dataIndex: 'action',
		customRender: ({ record }) => {
			return h('span', [
				h(EditOutlined, {
					onClick: () => updateMulk(record.id),
					style: { cursor: 'pointer', marginRight: '15px' },
				}),
				h(
					Popconfirm,
					{
						title: 'Are you sure to delete this record?',
						onConfirm: () => deleteId(record.id),
						onCancel: () => console.log('Delete canceled'),
					},
					{
						default: () => h(DeleteOutlined, { style: { cursor: 'pointer' } }),
					}
				),
			]);
		},
	},
];
let data = ref([]);
const updateMulk = id => {
	router.push('/elon_update/' + id);
};
const deleteId = id => {
	axios.delete('elon/delete/' + id).then(res => {
		if (res.data.success) {
			allElon();
		} else {
			message.warning(`${res.data.message}`);
		}
	});
};
const AddElon = () => {
	router.push('/elon_add');
};
const allElon = () => {
	axios.get('elon/userOne').then(res => {
		if (res.data.success) {
			for (let key of res.data.data) {
				key.name = `${key.name.substring(0, 15)}....`;
			}
			data.value = res.data.data;
		} else {
			message.warning(`${res.data.message}`);
		}
	});
};
onMounted(() => {
	allElon();
	Socket.newElon(() => {
		allElon();
	});
});
</script>

<style scoped></style>
