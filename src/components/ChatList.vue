<template>
  <div class="chat-list">
    <div
      v-for="conversation in conversations"
      :key="conversation.id"
      @click="selectConversation(conversation)"
      class="conversation-item"
    >
      <div class="user-info">
        <img :src="getOtherUser(conversation).avatar" alt="User" />
        <div>
          <h4>{{ getOtherUser(conversation).name }}</h4>
          <p>{{ conversation.listing.title }}</p>
        </div>
      </div>
      <div class="message-preview">
        <p>{{ conversation.lastMessage.message }}</p>
        <span>{{ formatDate(conversation.lastMessage.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  conversations: Array,
});

const emit = defineEmits(["select"]);

const getOtherUser = (conversation) => {
  return conversation.sender[0].id === currentUser.value.id
    ? conversation.receiver[0]
    : conversation.sender[0];
};

const selectConversation = (conversation) => {
  emit("select", {
    listingId: conversation.id,
    otherUserId: getOtherUser(conversation).id,
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleString();
};
</script>
