<template>
  <div class="chat-container">
    <!-- Chat header -->
    <div
      class="chat-header bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md"
    >
      <div class="flex items-center">
        <div
          class="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold mr-3"
        >
          {{ otherUserId }}
        </div>
        <div>
          <h2 class="font-semibold text-lg">
            Chat with User {{ otherUserId }}
          </h2>
          <div class="flex items-center">
            <span
              :class="[
                'w-2 h-2 rounded-full mr-2',
                otherUserOnline ? 'bg-green-400' : 'bg-gray-400',
              ]"
            ></span>
            <span class="text-sm">{{
              otherUserOnline ? "Online" : "Offline"
            }}</span>
          </div>
        </div>
      </div>
      <button class="text-white hover:text-gray-200" @click="CloseChat">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Messages area -->
    <div
      ref="messagesContainer"
      class="messages-area flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="[
          'message mb-4 flex',
          msg.sender_id == currentUserId ? 'justify-end' : 'justify-start',
        ]"
      >
        <div
          :class="[
            'message-bubble max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
            msg.sender_id == currentUserId
              ? 'bg-indigo-500 text-white rounded-br-none'
              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm',
          ]"
        >
          <p class="message-text">{{ msg.message }}</p>
          <div class="message-meta flex justify-end items-center mt-1">
            <span class="text-xs opacity-70 mr-1">{{
              formatTime(msg.time)
            }}</span>
            <span
              v-if="msg.sender_id == currentUserId && msg.read"
              class="text-xs"
              :class="msg.read ? 'text-green-400' : 'text-gray-400'"
            >
              ✓✓
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Message input -->
    <div
      class="message-input bg-white dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-3"
    >
      <div class="flex items-center">
        <button
          @click="sendImg"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 mr-2 text-gray-500 dark:text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        <input
          v-model="newMessage"
          @keyup.enter="sendNewMessage"
          placeholder="Type your message..."
          class="flex-1 py-2 px-4 rounded-full bg-gray-100 dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-none"
        />

        <button
          @click="sendNewMessage"
          :disabled="!newMessage.trim()"
          :class="[
            'ml-2 p-2 rounded-full text-white',
            newMessage.trim()
              ? 'bg-indigo-500 hover:bg-indigo-600'
              : 'bg-gray-400 cursor-not-allowed',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import SocketioService from "@/socketio/index";
import { useChatStore } from "@/stores/chat";
import { getMessages } from "../composables/message";

const props = defineProps({
  otherUserId: [String, Number],
});
const emit = defineEmits(["chatClose"]);
const chatStore = useChatStore();
const route = useRoute();
const messagesContainer = ref(null);

// Data
const currentUserId = ref(localStorage.getItem("userID"));
const messages = ref([]);
const newMessage = ref("");
const otherUserOnline = ref(false);

const CloseChat = () => {
  emit("chatClose");
};

// Methods
const sendNewMessage = async () => {
  if (!newMessage.value.trim()) return;
  try {
    await SocketioService.sendMessage({
      receiverId: props.otherUserId,
      message: newMessage.value,
      read: false,
    });
    newMessage.value = "";
    scrollToBottom();
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const sendImg = () => {};

const socketRead = () => {
  SocketioService.onMessagesRead(({ receiverId }) => {
    messages.value = messages.value.map((msg) => {
      if (msg.receiverId == receiverId) {
        return { ...msg, read: true };
      }
      return msg;
    });
  });
};

const checkUnreadAndMarkAsRead = () => {
  if (Array.isArray(messages.value)) {
    const unreadMessages = messages.value.filter(
      (msg) => msg.sender_id == props.otherUserId && !msg.read
    );

    if (unreadMessages.length > 0) {
      SocketioService.markAsRead({
        receiverId: currentUserId.value,
        senderId: props.otherUserId,
      });

      messages.value = messages.value.map((msg) => {
        if (msg.sender_id == props.otherUserId && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });
    }
  }
};

const getMessage = async () => {
  try {
    messages.value = await getMessages({
      myId: currentUserId.value,
      otherUserId: props.otherUserId,
    });
    checkUnreadAndMarkAsRead();
    scrollToBottom();
  } catch (err) {
    console.error("Xatolik xabarlarni olishda:", err);
  }
};

const onReceverMessage = async () => {
  await SocketioService.onReceiveMessage((data) => {
    messages.value.push({
      receiverId: data.receiverId,
      sender_id: data.sender_id,
      message: data.message,
      time: data.time,
      read: data.read,
    });

    if (data.sender_id == props.otherUserId && !data.read) {
      SocketioService.markAsRead({
        senderId: data.sender_id,
        receiverId: data.receiverId,
      });

      messages.value = messages.value.map((msg) => {
        if (msg.sender_id == props.otherUserId && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });
    }
    scrollToBottom();
  });
};

// Lifecycle hooks
onMounted(async () => {
  if (props.otherUserId) {
    await SocketioService.joinRoom({
      myId: currentUserId.value,
      otherUserId: props.otherUserId,
    });
  }
  await onReceverMessage();
  await socketRead();
  await checkUnreadAndMarkAsRead();
  await getMessage();
});

watch(
  () => chatStore.chatMessage,
  (val) => {
    if (Object.keys(val).length != 0 && messages.value.length == 0) {
      messages.value.push(val);
      scrollToBottom();
    }
  },
  { immediate: true }
);

watch(
  () => props.otherUserId,
  () => {
    getMessage();
  }
);

watch(
  messages,
  () => {
    checkUnreadAndMarkAsRead();
  },
  { deep: true }
);
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0; /* 🔥 MUHIM: Flex itemlarda overflow uchun */
}

.messages-area {
  flex: 1;
  min-height: 0; /* 🔥 MUHIM: Overflow ishlashi uchun */
  overflow-y: auto;
}

.message-bubble {
  position: relative;
  word-wrap: break-word;
}

.message-bubble:after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border: 10px solid transparent;
}

.justify-end .message-bubble:after {
  right: 0;
  border-left-color: #6366f1;
  border-right: 0;
  border-bottom: 0;
  margin-bottom: -1px;
  margin-right: -10px;
}

.justify-start .message-bubble:after {
  left: 0;
  border-right-color: white;
  border-left: 0;
  border-bottom: 0;
  margin-bottom: -1px;
  margin-left: -10px;
}

.dark .justify-start .message-bubble:after {
  border-right-color: #374151;
}

/* 🔥 YANGI: Mobile responsive styles */
@media (max-width: 768px) {
  .chat-container {
    height: 100vh;
    max-height: -webkit-fill-available; /* 🔥 Mobile viewport fix */
  }

  .messages-area {
    height: calc(100vh - 120px);
    max-height: calc(100vh - 120px);
  }

  .message-input {
    position: sticky;
    bottom: 0;
    background: white;
    z-index: 10;
  }

  .message-bubble {
    max-width: 85% !important;
  }

  .chat-header {
    padding: 12px;
    position: sticky;
    top: 0;
    z-index: 20;
  }
}

@media (max-width: 640px) {
  .messages-area {
    padding: 10px;
  }

  .message-input {
    padding: 8px;
  }

  input {
    font-size: 16px; /* 🔥 iOS da zoom oldini olish */
  }
}

/* 🔥 YANGI: Inputni har doim ko'rinadigan qilish */
.message-input {
  flex-shrink: 0;
}

/* 🔥 YANGI: Virtual keyboard paytida inputni tepaga surish */
@media (max-height: 500px) {
  .messages-area {
    height: calc(100vh - 100px);
  }
}
</style>
