<template>
  <header class="site-header">
    <!-- Top Navigation -->
    <div class="top-nav">
      <div class="container">
        <div class="location">
          <i class="material-icons">location_on</i>
          <a href="#" class="location-link">Andijon</a>
        </div>
        <div class="top-menu">
          <button
            v-for="(menu, index) in Menus"
            :key="index"
            @click="Menu(menu)"
            class="menu-item"
          >
            {{ menu }}
            <span
              v-if="msgCount != 0 && menu == 'Chat'"
              class="notification-badge"
            >
              {{ msgCount }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Navigation -->
    <div class="main-nav">
      <div class="container">
        <!-- Logo and Catalog -->
        <div class="brand-section">
          <div class="logo" @click="Home">
            <img :src="LogoImg" alt="Elon Market Logo" />
            <span class="brand-name">Elon Market</span>
          </div>
          <button class="catalog-btn" @click="Category">
            <i class="material-icons">filter_none</i>
            <span>Catalog</span>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="search-section">
          <div class="search-container">
            <a-input-search
              v-model:value="searchText"
              placeholder="Search for products and categories"
              enter-button
              size="large"
              @input="SearchProduct"
              class="search-input"
            />
            <transition name="fade">
              <SearchContent
                v-if="searchShow"
                @search="search"
                :searchText="searchText"
                class="search-results"
              />
            </transition>
          </div>
        </div>

        <!-- User Menu -->
        <div class="user-menu">
          <button
            v-for="(item, index) in NavMenu"
            :key="index"
            @click="Menu(item.name)"
            class="user-menu-item"
          >
            <HeartOutlined v-if="item.icon == 'wishes'" class="icon" />
            <i v-else class="material-icons">{{ item.icon }}</i>
            <span>{{ item.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Category Dropdown -->
    <transition name="slide-down">
      <div class="category-dropdown" v-if="show">
        <div class="container">
          <div class="category-content">
            <div class="main-categories">
              <div
                v-for="(item, index) in MainAllCategory"
                :key="index"
                @click="MainClickCategory(item)"
                :class="['category-item', { active: mainCatId == item.id }]"
              >
                <div class="category-info">
                  <i class="material-icons">{{
                    Icons[index]?.icon || "category"
                  }}</i>
                  <span>{{ item.name }}</span>
                </div>
                <RightOutlined class="arrow" />
              </div>
            </div>

            <div class="sub-categories" v-if="SubCategory.length > 0">
              <h2 class="subcategory-title">
                {{ SubCategory[0].main_cat }}
                <RightOutlined class="arrow-sm" />
              </h2>
              <div class="subcategory-grid">
                <div
                  v-for="(sub, index) in SubCategory"
                  :key="index"
                  class="subcategory-item"
                >
                  <h3
                    @click="SubCategoryChange(sub.name)"
                    class="subcategory-name"
                  >
                    {{ sub.name }}
                  </h3>
                  <ul
                    v-if="sub.categories && sub.categories.length > 0"
                    class="child-categories"
                  >
                    <li
                      v-for="(child, cIndex) in sub.categories"
                      :key="cIndex"
                      @click="ChildChangeName(child.name)"
                      class="child-item"
                    >
                      {{ child.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Mobile Bottom Navigation -->
    <div class="mobile-nav sm:hidden md:flex">
      <button @click="Home('Home')" class="mobile-nav-item">
        <HomeOutlined />
        <span>Главная</span>
      </button>
      <button @click="Home('Catalog')" class="mobile-nav-item">
        <SearchOutlined />
        <span>Каталог</span>
      </button>
      <button class="mobile-nav-item" @click="Home('Sevimli')">
        <HeartFilled />
        <span>Избранное</span>
      </button>
      <button class="mobile-nav-item" @click="Home('Profil')">
        <UserOutlined />
        <span>Профиль</span>
      </button>
      <button class="mobile-nav-item burger-menu-btn" @click="toggleBurgerMenu">
        <i class="material-icons">menu</i>
        <span>Ещё</span>
      </button>
    </div>
    <div
      class="burger-menu-overlay"
      :class="{ active: burgerMenuOpen }"
      @click="closeBurgerMenu"
    >
      <div class="burger-menu-content" @click.stop>
        <div class="burger-menu-header">
          <h3>Меню</h3>
          <button class="close-btn" @click="closeBurgerMenu">
            <i class="material-icons">close</i>
          </button>
        </div>
        <div class="burger-menu-items">
          <button @click="navigateTo('Elon Joylash')" class="burger-menu-item">
            <i class="material-icons">add_circle</i>
            <span>Elon Joylash</span>
          </button>
          <button @click="navigateTo('Chat')" class="burger-menu-item">
            <i class="material-icons">chat</i>
            <span>Chat</span>
            <span v-if="msgCount > 0" class="notification-badge">{{
              msgCount
            }}</span>
          </button>
          <!-- Boshqa menyu elementlari kerak bo'lsa -->
        </div>
      </div>
    </div>
    <!-- {{ mobilShow }} -->
    <!-- Mobile Catalog -->
    <MobileCatalog v-if="mobilShow" @close="close" />
  </header>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import {
  HeartOutlined,
  RightOutlined,
  HomeOutlined,
  SearchOutlined,
  HeartFilled,
  UserOutlined,
} from "@ant-design/icons-vue";
import MobileCatalog from "./MobileCatalog.vue";
import SearchContent from "./SearchContent.vue";
import LogoImg from "/images/logo.png";
import axios from "axios";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useChatStore } from "@/stores/chat";

const router = useRouter();
const chatStore = useChatStore();
const emits = defineEmits(["mobilCat"]);
const burgerMenuOpen = ref(false);
const token = ref(localStorage.getItem("token"));
let show = ref(false),
  mobilShow = ref(false),
  searchShow = ref(false),
  searchText = ref(""),
  MainAllCategory = ref([]),
  SubCategory = ref([]),
  mainCatId = ref(null),
  msgCount = ref(0);

const Menus = ref(["Elon Joylash", "Profil", "Chat"]);
const NavMenu = ref([
  { name: "Login", icon: "person_outline" },
  { name: "Wishes", icon: "wishes" },
]);

const Icons = ref([
  { icon: "directions_transit" },
  { icon: "face_retouching_natural" },
  { icon: "directions_transit" },
  { icon: "headphones" },
  { icon: "domain" },
  { icon: "emoji_nature" },
  { icon: "house" },
  { icon: "business" },
  { icon: "woman" },
  { icon: "sports_esports" },
]);

// Methods
const close = () => {
  mobilShow.value = !mobilShow.value;
};
const toggleBurgerMenu = () => {
  burgerMenuOpen.value = !burgerMenuOpen.value;
};
const closeBurgerMenu = () => {
  burgerMenuOpen.value = false;
};
const navigateTo = (name) => {
  closeBurgerMenu();
  Menu(name); // Sizning mavjud Menu funksiyangiz
};
const search = () => {
  searchText.value = "";
};

const SearchProduct = () => {
  searchShow.value = searchText.value.length > 0;
};

const Category = () => {
  show.value = !show.value;
};

const SubCategoryChange = (name) => {
  router.push({ name: "SubCategoryWithElon", params: { name } });
  show.value = false;
};

const ChildChangeName = (name) => {
  router.push({ name: "CategoryWithElon", params: { name } });
  show.value = false;
};

const Home = (name) => {
  switch (name) {
    case "Home":
      mobilShow.value = false;
      emits("mobilCat", mobilShow.value);
      router.push("/");
      break;
    case "Catalog":
      mobilShow.value = !mobilShow.value;
      emits("mobilCat", mobilShow.value);
      break;
    case "Sevimli":
      mobilShow.value = false;
      emits("mobilCat", mobilShow.value);
      router.push("/wishes");
      break;
    case "Profil":
      router.push("/dashboard/user");
    default:
      break;
  }
};

const Menu = (name) => {
  const routes = {
    Login: "/login",
    Wishes: "/wishes",
    "Elon Joylash": token.value ? "/elon_add" : "/login",
    Profil: "/dashboard/user",
    Home: "/",
    Chat: "/chat",
  };

  if (routes[name]) {
    router.push(routes[name]);
  }
};

const MainClickCategory = (item) => {
  if (item.subcategories && item.subcategories.length > 0) {
    mainCatId.value = item.id;
    SubCategory.value = item.subcategories.map((sub) => ({
      ...sub,
      main_cat: item.name,
    }));
  } else {
    message.warning("Sub kategoriya mavjud emas");
  }
};

const MainCategory = () => {
  axios
    .get("category/mainCatAll")
    .then((res) => {
      MainAllCategory.value = res.data.data;
    })
    .catch((err) => {
      message.warning(err.message);
    });
};
// Watchers
watch(
  () => chatStore.messageCount,
  (val) => {
    msgCount.value = val;
  },
  { immediate: true }
);

// Lifecycle
onMounted(() => {
  MainCategory();
});
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Top Navigation */
.top-nav {
  background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%);
  color: white;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.top-nav .container {
  justify-content: space-between;
}

.location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.location-link {
  color: white;
  text-decoration: underline;
}

.top-menu {
  display: flex;
  gap: 1.5rem;
}

.menu-item {
  position: relative;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: opacity 0.2s;
}

.menu-item:hover {
  opacity: 0.8;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

/* Main Navigation */
.main-nav {
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.main-nav .container {
  gap: 2rem;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-width: 200px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.logo img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1e40af;
}

.catalog-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.catalog-btn:hover {
  background: #dbeafe;
}

/* Search Section */
.search-section {
  flex: 1;
  max-width: 600px;
}

.search-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  margin-top: -4px;
}

/* User Menu */
.user-menu {
  display: flex;
  gap: 1.5rem;
  min-width: 150px;
  justify-content: flex-end;
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #4b5563;
  transition: color 0.2s;
  white-space: nowrap;
}

.user-menu-item:hover {
  color: #2563eb;
}

.user-menu-item .icon {
  font-size: 1.25rem;
}

/* Category Dropdown */
.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
}

.category-content {
  display: flex;
  min-height: 350px;
}

.main-categories {
  width: 250px;
  border-right: 1px solid #e5e7eb;
  padding: 1rem 0;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.category-item:hover,
.category-item.active {
  background-color: #f3f4f6;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-info i {
  color: #3b82f6;
}

.arrow {
  color: #9ca3af;
  font-size: 0.75rem;
}

.sub-categories {
  flex: 1;
  padding: 1.5rem;
}

.subcategory-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.arrow-sm {
  color: #9ca3af;
  font-size: 0.875rem;
}

.subcategory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.subcategory-item {
  padding: 0.5rem;
}

.subcategory-name {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.subcategory-name:hover {
  color: #2563eb;
}

.child-categories {
  list-style: none;
  padding: 0;
  margin: 0;
}

.child-item {
  padding: 0.25rem 0;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
}

.child-item:hover {
  color: #2563eb;
}

/* Mobile Navigation */
/* .mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 0.5rem 0;
  z-index: 90;
} */

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0.5rem;
  color: #4b5563;
  font-size: 0.75rem;
  width: 25%;
  cursor: pointer;
}

.mobile-nav-item:hover {
  color: #2563eb;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.burger-menu-btn {
  position: relative;
}

/* Burger menu overlay */
.burger-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.burger-menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Burger menu content */
.burger-menu-content {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 1001;
}

.burger-menu-overlay.active .burger-menu-content {
  transform: translateY(0);
}

.burger-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.burger-menu-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;
}

.burger-menu-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.burger-menu-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: none;
  border: none;
  text-align: left;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.burger-menu-item:hover {
  background-color: #f5f5f5;
}

.burger-menu-item i {
  font-size: 24px;
  color: #2563eb;
}

.burger-menu-item span {
  font-size: 16px;
  color: #333;
}

.burger-menu-item .notification-badge {
  position: absolute;
  right: 15px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 6px;
  color: #4b5563;
  font-size: 12px;
  flex: 1;
  cursor: pointer;
  max-width: 20%;
}

.mobile-nav-item i {
  font-size: 20px;
}

@media (max-width: 380px) {
  .mobile-nav-item {
    font-size: 11px;
    padding: 4px;
  }

  .mobile-nav-item i {
    font-size: 18px;
  }

  .burger-menu-content {
    padding: 15px;
  }

  .burger-menu-item {
    padding: 12px;
  }

  .burger-menu-item i {
    font-size: 22px;
  }

  .burger-menu-item span {
    font-size: 15px;
  }
}
/* Responsive Design */
@media (max-width: 1024px) {
  .brand-section {
    min-width: auto;
  }
  .mobile-nav {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 0.5rem 0;
    z-index: 90;
  }
  .user-menu {
    display: none;
  }

  .main-nav .container {
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .top-nav {
    display: none;
  }
  .mobile-nav {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 0.5rem 0;
    z-index: 90;
  }

  .main-nav {
    padding: 0.75rem 0;
  }

  .container {
    padding: 0 0.5rem;
  }

  .brand-name {
    display: none;
  }

  .catalog-btn span {
    display: none;
  }

  .catalog-btn {
    padding: 0.5rem;
  }

  .category-content {
    flex-direction: column;
  }

  .main-categories {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .mobile-nav {
    display: flex;
  }
}

@media (max-width: 640px) {
  .logo img {
    width: 40px;
    height: 40px;
  }

  .search-section {
    max-width: none;
  }

  .subcategory-grid {
    grid-template-columns: 1fr;
  }
}
</style>
