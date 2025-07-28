<template>
    <div class="home text-red-500">
        Home Vue
        <component :is="$buttons" type="primary">Click Me</component>
        <a-pagination v-model:current="current" :total="50" show-less-items />
        <a-input class="w-96" v-model:value="value" placeholder="Basic usage" />
        <div>
        <a-button type="primary" @click="showModal">Open Modal</a-button>
            <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            </a-modal>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const current = ref(2);
const value = ref()
let open = ref(false)
const showModal = () => {
    open.value = !open.value
}
const handleOk = () => {
    open.value = false
}
</script>

<style scoped>

</style>