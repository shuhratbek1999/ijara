import { io } from "socket.io-client";
import router from "@/router";
const url = "http://176.53.163.29:7005";
class SocketioService {
  socket = null;
  joinedRooms = new Set();

  // **1. Connect - token o'zgarishi mumkin, shuning uchun to'g'ri bog'lash**
  connect() {
    if (this.socket && this.socket.connected) {
      console.warn("Socket allaqachon ulanib bo‘lgan!");
      return;
    }

    const token = localStorage.getItem("token");
    this.socket = io(url, {
      query: { token },
      reconnection: true, // **Agar ulanmasa, qayta urinish**
      reconnectionAttempts: 5, // **5 martagacha urinish**
      reconnectionDelay: 3000, // **3 soniyadan keyin qayta urinish**
    });

    this.socket.on("connect", () => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.user_id;
        // 🔥 SHU YERDA EMIT QILINYAPTI
        this.socket.emit("register_user", userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
      //   console.log("Connected to socket server");
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("Socket uzildi:", reason);
    });

    this.socket.on("connect_error", (err) => {
      if (err.message === "Authentication error: Invalid token") {
        localStorage.removeItem("token"); // eski tokenni o‘chir
        router.push("/login"); // login sahifaga yo‘naltir
      }
      console.error("Socket xatosi:", err);
    });
  }

  // **2. Roomga qo‘shilish**
  joinRoom({ myId, otherUserId }) {
    if (!this.socket) return;
    const room = `room_${[myId, otherUserId].sort((a, b) => a - b).join("_")}`;
    if (this.joinedRooms.has(room)) {
      console.log("Allaqachon qo‘shilgan:", room);
      return;
    }
    this.socket.emit("join_room", { myId, otherUserId }, (response) => {
      if (response.success) {
        this.joinedRooms.add(room); // ✅ Faqat bir marta join qilinadi
        console.log("Roomga qo‘shildik:", room);
      } else {
        console.error("Roomga qo‘shilishda xatolik:", response.error);
      }
    });
  }

  // **3. Xabar yuborish**
  sendMessage({ receiverId, myId, message, read }) {
    if (!this.socket || !this.socket.connected) {
      console.warn("Socket ulanmagan!");
      return;
    }
    this.socket.emit("send_private_message", {
      receiverId,
      message,
      read,
    });
  }
  markAsRead({ receiverId, senderId }) {
    this.socket.emit("mark_as_read", { receiverId, senderId });
  }

  onMessagesRead(callback) {
    if (!this.socket) return;
    this.socket.off("messages_read");
    this.socket.on("messages_read", (data) => {
      callback(data);
    });
  }
  isOnlineUser(callback) {
    if (!this.socket) return;
    this.socket.on("user_online", (data) => {
      callback(data);
    });
  }
  isOfflineUser(callback) {
    if (!this.socket) return;
    this.socket.on("user_offline", (data) => {
      callback(data);
    });
  }
  // **4. Xabarlarni qabul qilish**
  onReceiveMessage(callback) {
    if (!this.socket) return;
    this.socket.off("receive_private_message"); // Eski listenerlarni olib tashlash
    this.socket.on("receive_private_message", (data) => {
      callback(data);
    });
  }
  onNotification(callback) {
    if (!this.socket) return;
    this.socket.off("new_notification"); // Eski listenerlarni olib tashlash
    this.socket.on("new_notification", (data) => {
      callback(data);
    });
  }
  // **5. Yangi e'lonni olish**
  newElon(callback) {
    if (!this.socket) return;
    this.socket.off("newElon");
    this.socket.on("newElon", callback);
  }

  // **6. Yangilangan e'lonni olish**
  updateElon(callback) {
    if (!this.socket) return;
    this.socket.off("updateElon");
    this.socket.on("updateElon", callback);
  }

  // **7. Disconnect qilish**
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketioService();
