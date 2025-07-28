<script setup>
import { onMounted } from "vue";
import SocketioService from "./socketio/index";
import { useRouter } from "vue-router";
import { useChatStore } from "./stores/chat";
const router = useRouter();
const chatStore = useChatStore();
onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) return;
  SocketioService.connect();
  SocketioService.onNotification((data) => {
    const myId = localStorage.getItem("userID");
    const { from, msg } = data;
    chatStore.setOtherUserId(from);
    chatStore.newMessage(msg);
    // roomga join bo'lish
    SocketioService.joinRoom({ myId, otherUserId: from });

    // router.push("/chat"); // query yo‘q!
  });
});
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
