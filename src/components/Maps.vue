<template></template>

<script setup>
import { computed, onMounted, ref } from 'vue';
const MapsKey = ref('AIzaSyAst9ESLBbOGja0UU58Gt1hQlW9NFeCLUw');
const emit = defineEmits(['adress_change']);
const map = ref(null);
const geocoder = ref(null);
let adress = ref('');
onMounted(() => {
	const script = document.createElement('script');
	script.src = `https://maps.googleapis.com/maps/api/js?key=${MapsKey.value}&callback=initMap&v=weekly`;
	script.async = true;
	script.defer = true;
	script.onerror = () => {
		console.error('Google Maps API ni yuklashda xatolik yuz berdi.');
	};
	window.initMap = () => {
		const location = { lat: 41.2995, lng: 69.2401 };
		map.value = new google.maps.Map(document.getElementById('map'), {
			center: location,
			zoom: 10,
		});
		geocoder.value = new google.maps.Geocoder();
		google.maps.event.addListener(map.value, 'click', event => {
			const latLng = event.latLng;
			// Geocoding orqali manzilni olish
			geocoder.value.geocode({ location: latLng }, (res, status) => {
				if (status === google.maps.GeocoderStatus.OK && res[0]) {
					adress.value = res[0].formatted_address;
					emit('adress_change', adress.value);
				} else {
					console.log('manzil topilmadi');
				}
			});
		});
		// google.maps.Marker yordamida marker qo'yish
		new google.maps.Marker({
			position: location,
			map: map.value,
			title: 'Toshkent!',
		});
	};
	document.head.appendChild(script);
});
</script>

<style scoped>
@media (max-width: 1280px) {
	#map {
		height: 400px;
		width: 500px;
	}
}
@media (max-width: 768px) {
	#map {
		height: 400px;
		width: 400px;
	}
}
@media (max-width: 480px) {
	#map {
		height: 260px;
		width: 300px;
	}
}
@media (max-width: 360px) {
	#map {
		height: 260px;
		width: 260px;
	}
}
</style>
