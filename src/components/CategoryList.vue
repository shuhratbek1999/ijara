<template>
  <div class="category-selector">
    <!-- Mobile Navigation -->
    <div class="mobile-nav" v-if="subCategoryList.length > 0">
      <button @click="goBack" class="back-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Orqaga
      </button>
      <div class="current-level">{{ currentLevelName }}</div>
    </div>

    <!-- Main Category Grid -->
    <div v-if="subCategoryList.length === 0" class="main-category-grid">
      <div
        v-for="(main, index) in store.categorys"
        :key="'main' + index"
        class="category-card"
        @click="MainCategory(main)"
      >
        <div class="category-icon">
          <img :src="main.icon" :alt="main.name" />
        </div>
        <span class="category-name">{{ main.name }}</span>
        <div
          class="category-arrow"
          v-if="main.subcategories && main.subcategories.length > 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Subcategory Layout -->
    <div v-else class="subcategory-layout">
      <div class="category-column">
        <div class="column-title">Asosiy kategoriyalar</div>
        <div class="category-list">
          <div
            v-for="(main, index) in store.categorys"
            :key="'main2' + index"
            class="category-item"
            :class="{ active: mainId == main.id }"
            @click="MainCategory(main)"
          >
            <div class="category-info">
              <div class="category-icon small">
                <img :src="main.icon" :alt="main.name" />
              </div>
              <span>{{ main.name }}</span>
            </div>
            <svg
              v-if="main.subcategories && main.subcategories.length > 0"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="category-column">
        <div class="column-title">Pastki kategoriyalar</div>
        <div class="category-list">
          <div
            v-for="(sub, index) in subCategoryList"
            :key="'sub' + index"
            class="category-item"
            :class="{ active: subId == sub.id }"
            @click="SubCategory(sub)"
          >
            <div class="category-info">
              <span>{{ sub.name }}</span>
            </div>
            <svg
              v-if="sub.categories && sub.categories.length > 0"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div v-if="categoryList.length > 0" class="category-column">
        <div class="column-title">Kategoriyalar</div>
        <div class="category-list">
          <div
            v-for="(child, index) in categoryList"
            :key="'child' + index"
            class="category-item"
            @click="ChildCategory(child)"
          >
            <div class="category-info">
              <span>{{ child.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCategoryStore } from "@/stores/category";
import { onMounted, ref, computed } from "vue";
const store = useCategoryStore();
const emit = defineEmits(["close", "data"]);

let mainId = ref(),
  subId = ref(),
  catId = ref(),
  subCategoryList = ref([]),
  categoryList = ref([]),
  UpdateCategory = ref({});

const currentLevelName = computed(() => {
  if (categoryList.length > 0) return "Kategoriyalar";
  if (subCategoryList.length > 0) return "Pastki kategoriyalar";
  return "Asosiy kategoriyalar";
});

const MainCategory = (data) => {
  const { subcategories, ...main } = data;
  if (subcategories && subcategories.length > 0) {
    subCategoryList.value = [...subcategories];
    mainId.value = main.id;
    UpdateCategory.value = main;
  } else {
    emit("data", {
      mainId: mainId.value,
      UpdateCategorys: UpdateCategory.value,
    });
    emit("close");
  }
};

const SubCategory = (data) => {
  const { categories, ...main } = data;
  if (categories && categories.length > 0) {
    categoryList.value = [...categories];
    subId.value = main.id;
    UpdateCategory.value.subcategories = main;
  } else {
    UpdateCategory.value.subcategories = main;
    subId.value = main.id;
    emit("data", {
      subId: subId.value,
      mainId: mainId.value,
      UpdateCategorys: UpdateCategory.value,
    });
    emit("close", false);
    store.getCategoryId({ id: main.id, type: "subcategory" });
  }
};

const ChildCategory = (child) => {
  UpdateCategory.value.categories = child;
  catId.value = child.id;
  emit("data", {
    subId: subId.value,
    mainId: mainId.value,
    catId: catId.value,
    UpdateCategorys: UpdateCategory.value,
  });
  emit("close", false);
  store.getCategoryId({ type: "category", id: child.id });
};

const goBack = () => {
  if (categoryList.length > 0) {
    categoryList.value = [];
  } else if (subCategoryList.length > 0) {
    subCategoryList.value = [];
  }
};

onMounted(() => {
  store.getCategory();
});
</script>

<style scoped>
.category-selector {
  font-family: "Inter", sans-serif;
  color: #333;
}

/* Mobile Navigation */
.mobile-nav {
  display: none;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
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
}

.current-level {
  font-weight: 600;
  margin-left: 1rem;
}

/* Main Category Grid */
.main-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.category-icon img {
  width: 24px;
  height: 24px;
}

.category-name {
  font-weight: 500;
  text-align: center;
  font-size: 0.875rem;
}

.category-arrow {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  color: #9ca3af;
}

/* Subcategory Layout */
.subcategory-layout {
  display: flex;
  gap: 1rem;
  height: 400px;
}

.category-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.column-title {
  padding: 1rem;
  font-weight: 600;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.category-list {
  flex: 1;
  overflow-y: auto;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.category-item:hover {
  background-color: #f3f4f6;
}

.category-item.active {
  background-color: #e0e7ff;
  color: #3730a3;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-icon.small {
  width: 32px;
  height: 32px;
  margin-bottom: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .mobile-nav {
    display: flex;
  }

  .subcategory-layout {
    flex-direction: column;
    height: auto;
    gap: 0.5rem;
  }

  .category-column {
    flex: none;
    max-height: 200px;
  }

  .main-category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .category-card {
    padding: 1rem 0.5rem;
  }

  .category-icon {
    width: 40px;
    height: 40px;
  }

  .category-icon img {
    width: 20px;
    height: 20px;
  }

  .category-name {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .main-category-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .category-card {
    padding: 0.75rem 0.5rem;
  }

  .category-item {
    padding: 0.5rem;
  }
}

/* Scrollbar Styling */
.category-list::-webkit-scrollbar {
  width: 6px;
}

.category-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.category-list::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 3px;
}

.category-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
