<template>
  <header
    class="homePage relative z-40 w-full flex flex-col justify-center items-center"
  >
    <div
      class="nav_link_top h-10 bg-cityBg w-full flex justify-center items-center"
    >
      <div
        class="nav_link_top_content w-11/12 flex items-center justify-between"
      >
        <div class="nav_item flex items-center">
          <i class="material-icons xx:text-base xl:text-3xl">location_on</i>
          <a
            href="#"
            class="font-montserrat xx:text-xx xl:text-base ml-1 underline"
            >Andijon</a
          >
        </div>
        <div class="nav_item_right flex">
          <p
            class="px-4 cursor-pointer font-montserrat xx:text-xx xl:text-sm relative"
            v-for="(menu, index) in Menus"
            :key="index"
            @click="Menu(menu)"
          >
            {{ menu }}
            <span
              class="absolute -right-3 text-sm -top-1 w-5 h-5 rounded-full bg-yellow-100 flex justify-center items-center"
              v-if="msgCount != 0 && menu == 'Chat'"
              >{{ msgCount }}</span
            >
          </p>
        </div>
      </div>
    </div>
    <div
      class="nav_link_footer xx:w-full xx:justify-center xl:w-11/12 flex items-center xl:justify-start"
    >
      <div
        class="logo_category xx:hidden xl:flex items-center justify-between w-103"
      >
        <div class="logo flex items-center" @click="Home">
          <img :src="LogoImg" class="w-20 h-20 cursor-pointer" alt="" />
          <p
            class="font-montserrat cursor-pointer text-blue-900 font-bold xl:text-xl"
          >
            Elon Market
          </p>
        </div>
        <div class="logo_cat">
          <button
            class="flex items-center rounded font-montserrat bg-cityBg py-2 px-6"
            @click="Category"
          >
            <i class="material-icons text-blue-600">filter_none</i>
            <span class="ml-2 text-sm text-blue-600 font-bold">Catalog</span>
          </button>
        </div>
      </div>
      <div
        class="logo_search flex justify-center xx:my-2 xl:my-0 mx-1 xx:w-11/12 xl:w-6/12 relative"
      >
        <a-input-search
          class="w-full xl:ml-10"
          placeholder="Search for products and categories"
          enter-button
          v-model:value="searchText"
          size="large"
          @input="SearchProduct"
        />
        <transition name="search">
          <SearchContent
            @search="search"
            :searchText="searchText"
            v-if="searchShow"
          />
        </transition>
      </div>
      <div class="nav_menu xx:hidden xl:flex w-3/12 justify-end">
        <div
          class="nav_menu_item w-1/3 font-montserrat text-sm flex items-center justify-end cursor-pointer"
          v-for="(item, index) in NavMenu"
          :key="index"
          @click="Menu(item.name)"
        >
          <HeartOutlined class="mr-2" v-if="item.icon == 'wishes'" />
          <i class="material-icons mr-2" v-else>{{ item.icon }}</i>
          <span class="font-montserrat">{{ item.name }}</span>
        </div>
      </div>
    </div>
    <transition name="category">
      <div
        class="category_list absolute top-32 bg-white -mt-2 w-full flex justify-center xl:h-93"
        v-if="show"
      >
        <div class="content w-11/12 flex">
          <div
            class="main_category xl:w-1/5 h-full border-r-2 flex flex-col justify-center"
          >
            <div
              class="main_category_list flex items-center justify-between px-3 cursor-pointer py-3 hover:text-blue-700 transition-all hover:bg-cityBg"
              :class="[mainCatId == item.id ? 'bg-cityBg' : '']"
              v-for="(item, index) in MainAllCategory"
              :key="index"
              @click="MainClickCategory(item)"
            >
              <p class="flex items-center">
                <i class="material-icons mr-1 text-blue-600">{{
                  Icons[index].icon
                }}</i>
                {{ item.name }}
              </p>
              <span class="icon">
                <RightOutlined />
              </span>
            </div>
          </div>
          <div class="sub_category xl:w-4/5 px-5" v-if="SubCategory.length > 0">
            <h1 class="text-xl font-bold flex items-center">
              <span>{{ SubCategory[0].main_cat }}</span>
              <span class="icon text-sm ml-2">
                <RightOutlined />
              </span>
            </h1>
            <ul class="sub_category_list flex flex-wrap">
              <li
                class="sub_category_list text-sm w-1/3 my-3 cursor-pointer"
                v-for="(sub, index) in SubCategory"
                :key="index"
              >
                <h2
                  class="font-bold hover:text-blue-700 transition-all"
                  @click="SubCategoryChange(sub.name)"
                >
                  {{ sub.name }}
                </h2>
                <ul class="child" v-if="sub.categories.length > 0">
                  <li
                    class="list"
                    v-for="(child, index) in sub.categories"
                    :key="index"
                  >
                    <p
                      class="hover:text-blue-700 transition-all text-gray-500"
                      @click="ChildChangeName(child.name)"
                    >
                      {{ child.name }}
                    </p>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
    <div
      class="mobile_menu xx:w-full xx:z-20 xx:flex xx:bg-white xx:border-t-0.1 xx:py-2 xx:fixed xx:bottom-0 xl:hidden"
    >
      <div
        class="menu_item w-1/4 flex flex-col items-center"
        @click="Menu('Home')"
      >
        <p><HomeOutlined /></p>
        <p class="text-xs">Главная</p>
      </div>
      <div class="menu_item w-1/4 flex flex-col items-center" @click="Catalog">
        <p><SearchOutlined /></p>
        <p class="text-xs">каталог</p>
      </div>
      <div class="menu_item w-1/4 flex flex-col items-center">
        <p><HeartFilled /></p>
        <p class="text-xs">избранное</p>
      </div>
      <div class="menu_item w-1/4 flex flex-col items-center">
        <p><UserOutlined /></p>
        <p class="text-xs">профилъ</p>
      </div>
    </div>
    <MobileCatalog v-if="mobilShow" />
  </header>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
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
  {
    name: "Login",
    icon: "person_outline",
  },
  {
    name: "Wishes",
    icon: "wishes",
  },
]);
const Catalog = () => {
  mobilShow.value = !mobilShow.value;
  emits("mobilCat", mobilShow.value);
};
const search = () => {
  searchText.value = "";
};
const Icons = ref([
  {
    id: 1,
    icon: "directions_transit",
  },
  {
    id: 2,
    icon: "face_retouching_natural",
  },
  {
    id: 3,
    icon: "directions_transit",
  },
  {
    id: 4,
    icon: "headphones",
  },
  {
    id: 5,
    icon: "domain",
  },
  {
    id: 6,
    icon: "emoji_nature",
  },
  {
    id: 7,
    icon: "house",
  },
  {
    id: 8,
    icon: "business",
  },
  {
    id: 9,
    icon: "woman",
  },
  {
    id: 10,
    icon: "sports_esports",
  },
]);
const SearchProduct = (value) => {
  searchShow.value = !searchShow.value;
};
const Category = () => {
  show.value = !show.value;
};
const SubCategoryChange = (name) => {
  // console.log(name);
  router.push({ name: "SubCategoryWithElon", params: { name: name } });
  show.value = false;
};
const ChildChangeName = (name) => {
  router.push({ name: "CategoryWithElon", params: { name: name } });
  show.value = false;
};
const Home = () => {
  router.push("/");
};
const Menu = (name) => {
  switch (name) {
    case "Login":
      router.push({ path: "/login" });
      break;
    case "Wishes":
      router.push({ path: "/login" });
      break;
    case "Elon Joylash":
      if (token) {
        router.push({ path: "/elon_add" });
      } else {
        router.push({ path: "/login" });
      }
      break;
    case "Profil":
      router.push({ path: "/dashboard/user" });
      break;
    case "Home":
      router.push({ path: "/" });
      break;
    case "Chat":
      router.push({ path: "/chat" });
      break;
    default:
      break;
  }
};
const MainClickCategory = (item) => {
  const { subcategories, ...data } = item;
  if (Array.isArray(subcategories) && subcategories.length > 0) {
    subcategories[0].main_cat = data.name;
    mainCatId.value = data.id;
    SubCategory.value = subcategories;
  } else {
    message.warn("sub kategoriya mavjud emas");
  }
};
const MainCategory = () => {
  axios
    .get("category/mainCatAll")
    .then((res) => {
      MainAllCategory.value = res.data.data;
    })
    .catch((err) => {
      message.warning(err);
    });
};
watch(
  () => chatStore.messageCount,
  (val) => {
    if (val != 0) {
      msgCount.value = val;
    }
  },
  { immediate: true }
);
onMounted(() => {
  MainCategory();
});
</script>

<style scoped>
.category-enter-from,
.category-leave-to {
  opacity: 0;
}
.category-enter-active,
.category-leave-active {
  transition: opacity 1s ease;
}
.search-enter-from,
.search-leave-to {
  opacity: 0;
}
.search-enter-active,
.search-leave-active {
  transition: opacity 1s ease;
}
</style>
