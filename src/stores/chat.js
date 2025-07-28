import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    otherUserId: null,
    chatMessage: {},
    messageCount: 0,
  }),
  actions: {
    setOtherUserId(id) {
      this.otherUserId = id;
    },
    newMessage(msg) {
      this.chatMessage = { ...msg };
      this.messageCount += 1;
    },
  },
});
