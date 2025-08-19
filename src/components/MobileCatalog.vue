<template>
  <section class="catalog-overlay" @click.self="$emit('close')">
    <div class="catalog-container">
      <!-- Header with Breadcrumbs -->
      <div class="catalog-header">
        <button
          v-if="subCategoryAll.length > 0 || childCategoryAll.length > 0"
          @click="goBack"
          class="back-button"
        >
          <i class="material-icons">arrow_back</i>
          Orqaga
        </button>
        <h2 class="catalog-title">
          {{ currentLevelTitle }}
        </h2>
        <button @click="$emit('close')" class="close-button">
          <i class="material-icons">close</i>
        </button>
      </div>

      <!-- Breadcrumbs -->
      <div
        class="breadcrumbs"
        v-if="subCategoryAll.length > 0 || childCategoryAll.length > 0"
      >
        <span @click="resetCatalog" class="breadcrumb-item"
          >Asosiy kategoriyalar</span
        >
        <i class="material-icons breadcrumb-divider">chevron_right</i>
        <span
          v-if="subCategoryAll.length > 0 && childCategoryAll.length === 0"
          class="breadcrumb-item active"
          >Pastki kategoriyalar</span
        >
        <span
          v-else-if="childCategoryAll.length > 0"
          class="breadcrumb-item active"
          >Kategoriyalar</span
        >
      </div>

      <!-- Categories Grid -->
      <div class="categories-grid">
        <!-- Main Categories -->
        <div
          v-if="subCategoryAll.length === 0 && childCategoryAll.length === 0"
          class="categories-container"
        >
          <div
            v-for="(main, index) in MainAllCategory"
            :key="'main-' + index"
            class="category-card main-category"
            @click="MainCategoryClick(main)"
          >
            <div class="category-icon">
              <i class="material-icons">{{ getCategoryIcon(main.name) }}</i>
            </div>
            <span class="category-name">{{ main.name }}</span>
            <i
              class="material-icons arrow-icon"
              v-if="main.subcategories && main.subcategories.length > 0"
            >
              keyboard_arrow_right
            </i>
          </div>
        </div>

        <!-- Sub Categories -->
        <div
          v-else-if="childCategoryAll.length === 0"
          class="categories-container"
        >
          <div
            v-for="(sub, index) in subCategoryAll"
            :key="'sub-' + index"
            class="category-card sub-category"
            @click="subCategoryClick(sub)"
          >
            <span class="category-name">{{ sub.name }}</span>
            <i
              class="material-icons arrow-icon"
              v-if="sub.categories && sub.categories.length > 0"
            >
              keyboard_arrow_right
            </i>
          </div>
        </div>

        <!-- Child Categories -->
        <div v-else class="categories-container">
          <div
            v-for="(child, index) in childCategoryAll"
            :key="'child-' + index"
            class="category-card child-category"
            @click="childCategoryClick(child)"
          >
            <span class="category-name">{{ child.name }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="MainAllCategory.length === 0" class="empty-state">
        <i class="material-icons">category</i>
        <p>Kategoriyalar yuklanmoqda...</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { message } from "ant-design-vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const emit = defineEmits(["close"]);

let MainAllCategory = ref([]);
let subCategoryAll = ref([]);
let childCategoryAll = ref([]);

// Computed properties
const currentLevelTitle = computed(() => {
  if (childCategoryAll.value.length > 0) return "Kategoriyalar";
  if (subCategoryAll.value.length > 0) return "Pastki kategoriyalar";
  return "Barcha kategoriyalar";
});

// Methods
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    Transport: "directions_car",
    Elektronika: "devices",
    Koʻngilochar: "sports_esports",
    Moda: "checkroom",
    "Uy-roʻzgʻor": "home",
    Qurilish: "construction",
    "Bolalar tovarlari": "child_friendly",
    Hayvonlar: "pets",
    "Xobbi va ijod": "palette",
    Xizmatlar: "miscellaneous_services",
    Taʼlim: "school",
    Sport: "fitness_center",
  };

  return iconMap[categoryName] || "category";
};

const MainCategoryClick = (main) => {
  if (main.subcategories && main.subcategories.length > 0) {
    subCategoryAll.value = [...main.subcategories];
  } else {
    router.push({ name: "MainCategoryWithElon", params: { name: main.name } });
    emit("close");
  }
};

const subCategoryClick = (sub) => {
  if (sub.categories && sub.categories.length > 0) {
    childCategoryAll.value = [...sub.categories];
  } else {
    router.push({ name: "SubCategoryWithElon", params: { name: sub.name } });
    emit("close");
  }
};

const childCategoryClick = (child) => {
  if (child.name) {
    router.push({ name: "CategoryWithElon", params: { name: child.name } });
    emit("close");
  }
};

const goBack = () => {
  if (childCategoryAll.value.length > 0) {
    childCategoryAll.value = [];
  } else if (subCategoryAll.value.length > 0) {
    subCategoryAll.value = [];
  }
};

const resetCatalog = () => {
  subCategoryAll.value = [];
  childCategoryAll.value = [];
};

const MainCategory = () => {
  axios
    .get("category/mainCatAll")
    .then((res) => {
      MainAllCategory.value = res.data.data;
    })
    .catch((err) => {
      message.warning(err.message || "Kategoriyalarni yuklashda xatolik");
    });
};

onMounted(() => {
  MainCategory();
});
</script>

<style scoped>
.catalog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.catalog-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

.catalog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: #e0e7ff;
}

.catalog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.breadcrumb-item {
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
  font-size: 0.875rem;
}

.breadcrumb-item:hover {
  color: #3b82f6;
}

.breadcrumb-item.active {
  color: #374151;
  cursor: default;
}

.breadcrumb-divider {
  color: #9ca3af;
  font-size: 1rem;
  margin: 0 0.5rem;
}

.categories-grid {
  max-height: 60vh;
  overflow-y: auto;
  padding: 1rem;
}

.categories-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.category-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 60px;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.main-category {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
}

.sub-category {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.child-category {
  background: white;
  border: 1px solid #f1f5f9;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  color: #3b82f6;
}

.category-name {
  font-weight: 500;
  color: #374151;
  flex: 1;
}

.arrow-icon {
  color: #9ca3af;
  transition: transform 0.2s;
}

.category-card:hover .arrow-icon {
  color: #3b82f6;
  transform: translateX(2px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-state .material-icons {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #d1d5db;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .catalog-overlay {
    padding: 10px;
    align-items: flex-end;
  }

  .catalog-container {
    max-height: 90vh;
    border-radius: 20px 20px 0 0;
    max-width: none;
  }

  .categories-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .catalog-header {
    padding: 1rem;
  }

  .categories-grid {
    padding: 0.75rem;
  }

  .category-card {
    padding: 0.75rem;
    min-height: 50px;
  }

  .category-name {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .categories-container {
    grid-template-columns: 1fr;
  }

  .catalog-title {
    font-size: 1.125rem;
  }

  .breadcrumbs {
    padding: 0.75rem 1rem;
  }
}

/* Scrollbar Styling */
.categories-grid::-webkit-scrollbar {
  width: 6px;
}

.categories-grid::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.categories-grid::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.categories-grid::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
