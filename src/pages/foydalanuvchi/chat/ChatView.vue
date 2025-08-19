<template>
  <div class="chat-layout flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Users list sidebar -->
    <div
      class="users-sidebar w-full sm:w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto"
    >
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          Chatlar
        </h2>
        <div class="relative mt-3">
          <input
            type="text"
            placeholder="Qidirish..."
            v-model="search"
            @input="Searching"
            class="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <svg
            class="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div
        v-if="receivedUsers.length > 0"
        class="divide-y divide-gray-200 dark:divide-gray-700 my-2"
      >
        <div
          v-for="user in receivedUsers"
          :key="user.id"
          @click="selectUser(user)"
          class="user-item px-4 py-3 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
          :class="{
            'bg-indigo-50 dark:bg-gray-700 border-r-4 border-indigo-500':
              selectedUser?.id === user.id,
          }"
        >
          <div class="relative">
            <div
              class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-gray-600 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold"
            >
              {{ user.sender?.name?.charAt(0)?.toUpperCase() || "U" }}
            </div>
            <span
              v-if="user.online"
              class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"
            ></span>
          </div>
          <div class="ml-3 flex-1 overflow-hidden">
            <div class="flex justify-between items-center">
              <h3
                class="text-sm font-medium text-gray-900 dark:text-white truncate"
              >
                {{ user.sender?.name || "Nomaʼlum" }}
              </h3>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{
                formatLastMessageTime(user.last_message_time)
              }}</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
              {{ user.last_message || "No messages yet" }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="p-4 text-center text-gray-500 dark:text-gray-400">
        <p>Hozircha xabarlar yo'q</p>
      </div>
    </div>

    <!-- Chat content area -->
    <div class="chat-content flex-1 flex flex-col">
      <div v-if="selected" class="flex-1 overflow-hidden">
        <ChatContent
          :otherUserId="selectedUser?.sender_id || chatStore.otherUserId"
          :key="selectedUser?.sender_id || chatStore.otherUserId"
          @chatClose="chatClose"
        />
      </div>
      <div
        v-else
        class="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400"
      >
        <div class="w-24 h-24 mb-4 text-indigo-200 dark:text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-medium mb-2">Chatni boshlang</h3>
        <p class="text-center max-w-md px-4">
          Chapdagi ro'yxatdan foydalanuvchini tanlang <br />yoki yangi suhbat
          boshlang
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import ChatContent from "@/components/ChatContent.vue";
import { useChatStore } from "@/stores/chat";
import { getMyIncomingUsers } from "@/composables/message";
import { useRouter } from "vue-router";
const chatStore = useChatStore();
const receivedUsers = ref([]);
const selectedUser = ref(null);
const router = useRouter();
let search = ref(""),
  selected = ref(false);
const selectUser = (user) => {
  selectedUser.value = user;
  chatStore.otherUserId = user.sender_id;
  selected.value = true;
};
const chatClose = () => {
  selectedUser.value = {};
  selected.value = false;
  // chatStore.otherUserId = 0;
};
const getMessage = async () => {
  try {
    receivedUsers.value = await getMyIncomingUsers();
    if (receivedUsers.value?.error_code != 401) {
      receivedUsers.value = receivedUsers.value.map((user) => ({
        ...user,
        online: Math.random() > 0.3, // 70% online bo'lishi uchun
        last_message: user.last_message || "No messages yet",
        last_message_time: user.last_message_time || new Date(),
      }));
      selected.value = !selected.value;
    } else {
      router.push("/login");
    }
    // Mock online status - aslida bu backenddan kelishi kerak
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
const Searching = () => {
  if (search.value.length != 0) {
    const result = receivedUsers.value.filter((usr) => {
      return usr.sender?.name
        ?.toLowerCase()
        .includes(search.value.toLowerCase());
    });
    receivedUsers.value = result;
  } else {
    console.log("Qidiruv bo‘sh");
    getMessage();
  }
};
const formatLastMessageTime = (time) => {
  if (!time) return "";
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
const countMessage = (data, count) => {
  console.log(data, count);
};
onMounted(() => {
  getMessage();
});
watch(
  () => chatStore.messageCount,
  (val) => {
    countMessage(chatStore.chatMessage, val);
  }
);
</script>

<style scoped>
.chat-layout {
  min-height: 100vh;
}

.users-sidebar {
  scrollbar-width: thin;
  scrollbar-color: #c7d2fe #f5f3ff;
}

.users-sidebar::-webkit-scrollbar {
  width: 6px;
}

.users-sidebar::-webkit-scrollbar-track {
  background: #f5f3ff;
}

.users-sidebar::-webkit-scrollbar-thumb {
  background-color: #c7d2fe;
  border-radius: 3px;
}

.dark .users-sidebar::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark .users-sidebar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

@media (max-width: 640px) {
  .users-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .chat-layout {
    flex-direction: column;
  }

  .chat-content {
    min-height: 70vh;
  }
}
</style>
