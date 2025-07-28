import { defineStore } from 'pinia';
import { ref } from 'vue';

export const Store = defineStore('elon', () => {
	let FavoritesElon = [],
		userID = ref(null),
		chatElon = ref({});
	function addFavorite(data) {
		if (FavoritesElon.length > 0) {
			let elonId = FavoritesElon.findIndex(el => el.id === data.id);
			// console.log(elonId);
			if (elonId === -1) {
				FavoritesElon.push(data);
			}
		} else {
			FavoritesElon.push(data);
		}
	}
	function elonChat(data) {
		chatElon.value = { ...data };
	}
	return { addFavorite, FavoritesElon, userID, elonChat, chatElon };
});
