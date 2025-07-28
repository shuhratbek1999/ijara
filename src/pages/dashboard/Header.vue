<template>
	<div class="header flex justify-between items-center h-full">
		<div class="icons text-white flex items-center">
			<i class="material-icons mr-4 cursor-pointer" @click="Menu">menu</i>
			<i class="material-icons cursor-pointer">search</i>
		</div>
		<div class="profil">
			<div class="account flex items-center">
				<a-dropdown class="mt-2" :trigger="['click']">
					<a class="ant-dropdown-link text-white" @click.prevent>
						<i class="material-icons">account_circle</i>
					</a>
					<template #overlay>
						<a-menu class="w-40" @click="handleClick">
							<a-menu-item key="0">
								<div class="about flex items-center">
									<i class="material-icons text-sm mr-2">person_outline</i>
									Person
								</div>
							</a-menu-item>
							<a-menu-item key="1">
								<div class="image flex items-center">
									<i class="material-icons text-sm mr-2">image</i> image
								</div>
							</a-menu-item>
							<a-menu-divider />
							<a-menu-item key="2">
								<div class="out flex items-center">
									<i class="material-icons text-sm mr-2">logout</i>Log out
								</div>
							</a-menu-item>
						</a-menu>
					</template>
				</a-dropdown>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const emit = defineEmits(['collapsed']);
const handleClick = e => {
	switch (e.key) {
		case '0':
			router.push({ path: '/dashboard/user' });
			break;
		case '1':
			router.push({ path: '' });
			break;
		case '2':
			router.push({ path: '/login' });
			break;
		default:
			break;
	}
};
const Menu = () => {
	emit('collapsed');
};
</script>

<style scoped></style>
