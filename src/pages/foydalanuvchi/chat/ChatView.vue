<template>
  <div class="grid grid-cols-3 h-screen">
    <!-- Chap: kelgan foydalanuvchilar -->
    <div class="border-r p-4 overflow-y-auto">
      <div
        v-for="user in receivedUsers"
        :key="user.id"
        @click="selectUser(user)"
        class="p-2 hover:bg-gray-100 cursor-pointer rounded"
        :class="{ 'bg-blue-100': selectedUser?.id === user.id }"
      >
        {{ user.sender?.name }}
      </div>
    </div>

    <!-- O'ng: tanlangan foydalanuvchi bilan chat -->
    <div class="col-span-2">
      <ChatContent
        v-if="selectedUser || chatStore.otherUserId"
        :otherUserId="selectedUser?.sender_id || chatStore.otherUserId"
      />
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        Foydalanuvchini tanlang
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ChatContent from "@/components/ChatContent.vue";
import { useChatStore } from "@/stores/chat";
import { getMyIncomingUsers } from "@/composables/message";

const chatStore = useChatStore();
const receivedUsers = ref([]);
const selectedUser = ref(null);

const selectUser = (user) => {
  selectedUser.value = user;
  chatStore.otherUserId = user.sender_id; // bu ChatContent.vue uchun
};
onMounted(async () => {
  // Menga yozgan foydalanuvchilar ro‘yxatini olish
  receivedUsers.value = await getMyIncomingUsers(); // bu backenddan oladi
  // console.log(receivedUsers.value);
});
</script>
