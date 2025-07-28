<template>
  <div class="emoji-picker-container">
    <div class="emoji-categories">
      <button
        v-for="category in categories"
        :key="category"
        @click="activeCategory = category"
        :class="{ active: activeCategory === category }"
      >
        {{ categoryIcons[category] }}
      </button>
    </div>

    <div class="emoji-grid">
      <button
        v-for="emoji in filteredEmojis"
        :key="emoji"
        @click="selectEmoji(emoji)"
        class="emoji"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Oddiy emoji kolleksiyasi (to'liq ro'yxatni emoji-picker kutubxonasidan olish yaxshiroq)
const emojis = {
  "Smileys & Emotion": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣"],
  People: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤏", "✌️"],
  Animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
  Food: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇"],
};

const categories = Object.keys(emojis);
const activeCategory = ref(categories[0]);

const categoryIcons = {
  "Smileys & Emotion": "😀",
  People: "👋",
  Animals: "🐶",
  Food: "🍏",
};

const filteredEmojis = computed(() => {
  return emojis[activeCategory.value];
});

const emit = defineEmits(["emoji-selected"]);

const selectEmoji = (emoji) => {
  emit("emoji-selected", emoji);
};
</script>

<style scoped>
.emoji-picker-container {
  width: 250px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.emoji-categories {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.emoji-categories button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
}

.emoji-categories button.active {
  background: #f0f0f0;
  border-radius: 4px;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  max-height: 200px;
  overflow-y: auto;
}

.emoji {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.emoji:hover {
  background-color: #f0f0f0;
}
</style>
