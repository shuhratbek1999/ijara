<template>
  <div class="chat-room w-full">
    <div class="chat-header">
      <h2>Chat Room</h2>
      <span v-if="otherUserOnline" class="online-status online">Online</span>
      <span v-else class="online-status offline">Offline</span>
    </div>

    <div
      class="messages overflow-y-scroll h-[600px] bg-gray-300 p-4"
      ref="messagesContainer"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="[
          'message',
          msg.sender_id == currentUserId ? 'sent' : 'received',
        ]"
      >
        <div class="message-content flex">
          <p>{{ msg.message }}</p>
          <span
            v-if="msg.sender_id == currentUserId && msg.read"
            title="O‘qilgan"
            style="color: green"
            class="text-xs mt-6"
          >
            ✔️✔️
          </span>
          <span class="mt-6 inline-block text-xs">{{
            formatTime(msg.time)
          }}</span>
        </div>
      </div>
    </div>

    <div class="message-input grid gap-2">
      <button @click="sendImg">
        <FileIcon />
      </button>
      <input
        v-model="newMessage"
        @keyup.enter="sendNewMessage"
        placeholder="Xabar yozing..."
      />
      <button @click="sendNewMessage" :disabled="!newMessage.trim()">
        <SendIcon />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from "vue";
import { useRoute } from "vue-router";
import SocketioService from "@/socketio/index";
import { useChatStore } from "@/stores/chat";
import { getMessages } from "../composables/message";
import SendIcon from "@/components/SendIcon.vue";
import FileIcon from "@/components/FileIcon.vue";
const props = defineProps({
  otherUserId: [String, Number],
});

const chatStore = useChatStore();
const route = useRoute();
const messagesContainer = ref(null);

// Data
const currentUserId = ref(localStorage.getItem("userID")); // ✅ siz
const messages = ref([]);
const newMessage = ref("");
const otherUserOnline = ref(false);
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
    scroolChat();
  } catch (err) {
    console.error("Xabar yuborishda xato:", err);
  }
};
const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
const scroolChat = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};
const sendImg = () => {};
const socketRead = () => {
  SocketioService.onMessagesRead(({ receiverId }) => {
    // console.log(messages.value, receiverId);
    messages.value = messages.value.map((msg) => {
      if (msg.receiverId == receiverId) {
        // console.log(msg, readerId);
        chatStore.messageCount -= 1;
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
    scroolChat();
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

    // Faqat boshqa userdan kelgan bo‘lsa va hali o‘qilmagan bo‘lsa
    if (data.sender_id == props.otherUserId && !data.read) {
      SocketioService.markAsRead({
        senderId: data.sender_id,
        receiverId: data.receiverId,
      });

      // 🔄 messages ichida mark as read holatini yangilaymiz
      messages.value = messages.value.map((msg) => {
        if (msg.sender_id == props.otherUserId && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });
      scroolChat();
    }
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
    }
  },
  { immediate: true }
);
watch(
  () => props.otherUserId,
  () => {
    getMessage(); // yangi user uchun xabarlarni olib kelish
  }
);

watch(
  messages,
  () => {
    checkUnreadAndMarkAsRead();
  },
  { deep: true }
);
// onUnmounted(() => {
//   SocketioService.disconnect();
// });
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  padding: 15px;
  background-color: #4a76a8;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.online-status {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.online-status.online {
  background-color: #5cb85c;
}

.online-status.offline {
  background-color: #d9534f;
}

/* .messages {
  flex: 1;
  padding: 15px;
  overflow-y: scroll;
  background-color: #e4e0e0;
  height: 400px;
} */

.message {
  margin-bottom: 15px;
  display: flex;
}

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
}

.message.sent .message-content {
  background-color: #dcf8c6;
}

.message.received .message-content {
  background-color: #ffffff;
}

.message-time {
  display: block;
  font-size: 0.7rem;
  color: #666;
  margin-top: 5px;
  text-align: right;
}

.message-input {
  padding: 10px;
  border-top: 1px solid #ddd;
  display: flex;
  background-color: white;
}

.message-input input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
}

.message-input button {
  margin-left: 10px;
  padding: 10px 15px;
  background-color: #4a76a8;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.message-input button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
