<template>
  <div class="notification-badge" @click="showNotifications" v-if="count > 0">
    {{ count }}
    <div class="notifications-dropdown" v-if="showDropdown">
      <div
        v-for="notif in notifications"
        :key="notif._id"
        class="notification-item"
      >
        <p>{{ notif.message }}</p>
        <small>{{ formatTime(notif.createdAt) }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import ChatService from "@/socketio/index";

export default {
  setup() {
    const count = ref(0);
    const notifications = ref([]);
    const showDropdown = ref(false);

    const formatTime = (dateString) => {
      return new Date(dateString).toLocaleString();
    };

    const showNotifications = () => {
      showDropdown.value = !showDropdown.value;
      if (showDropdown.value) {
        // Notificationlarni o'qilgan deb belgilash
        count.value = 0;
      }
    };

    onMounted(() => {
      ChatService.connect();

      ChatService.onNotification((notification) => {
        notifications.value.unshift(notification);
        count.value++;

        // Browser notification (ixtiyoriy)
        if (Notification.permission === "granted") {
          new Notification("Yangi xabar", {
            body: notification.message,
          });
        }
      });
    });

    onUnmounted(() => {
      ChatService.disconnect();
    });

    return {
      count,
      notifications,
      showDropdown,
      showNotifications,
      formatTime,
    };
  },
};
</script>
