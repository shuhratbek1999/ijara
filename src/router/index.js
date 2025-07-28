import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../pages/dashboard/dashboard.vue";
const Home = () => import("../pages/foydalanuvchi/home/homePage.vue");

const ElonList = () => import("../pages/elon/list.vue");
const ElonUpdate = () => import("../pages/elon/update.vue");

const ElonListAdmin = () => import("../pages/admin/elonlar.vue");
const ElonStatus = () => import("../pages/admin/status.vue");

const BuyurtmaAdd = () => import("../pages/buyurtma/add.vue");
const BuyurtmaList = () => import("../pages/buyurtma/list.vue");

const userAdd = () => import("../pages/user/add.vue");

const CategoryList = () => import("../pages/category/list.vue");

const SubcategoryList = () => import("../pages/SubCategory/list.vue");

const Register = () => import("../pages/login/add.vue");
const Login = () => import("../pages/login/index.vue");
const ResetPassword = () => import("../pages/login/reset.vue");

const ElonComment = () =>
  import("../pages/foydalanuvchi/ElonAbout/ElonComment.vue");
const ElonAbout = () => import("../pages/foydalanuvchi/ElonAbout/index.vue");

const CategoryElon = () =>
  import("../pages/foydalanuvchi/CategoryElon/categoryElon.vue");
const SubCategoryElon = () =>
  import("../pages/foydalanuvchi/CategoryElon/subCategory.vue");

const Chat = () => import("../pages/foydalanuvchi/chat/ChatView.vue");
const Favorites = () => import("../pages/foydalanuvchi/favourite/index.vue");
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/elon_about",
    name: "AboutElon",
    component: ElonAbout,
  },
  {
    path: "/favorites",
    name: "FavoritesElon",
    component: Favorites,
  },
  {
    path: "/chat",
    name: "Chats",
    component: Chat,
  },
  {
    path: "/category/:name",
    name: "CategoryWithElon",
    component: CategoryElon,
  },
  {
    path: "/subcategory/:name",
    name: "SubCategoryWithElon",
    component: SubCategoryElon,
  },
  {
    path: "/review",
    name: "ElonComment",
    component: ElonComment,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/recover-password",
    name: "RecoverPassword",
    component: ResetPassword,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/elon_add",
    name: "elonAdd",
    component: () => import("../pages/elon/add.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/elon_update/:id",
    name: "ElonUpdate",
    component: ElonUpdate,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: "elon",
        name: "Elon",
        component: ElonList,
      },
      {
        path: "admin_elon",
        name: "ElonList",
        component: ElonListAdmin,
      },
      {
        path: "elon_confirmation",
        name: "Confirmation",
        component: ElonStatus,
      },
      {
        path: "buyurtma",
        name: "Buyurtma",
        component: BuyurtmaList,
      },
      {
        path: "buyurtma_add",
        name: "Buyurtma add",
        component: BuyurtmaAdd,
      },
      {
        path: "category",
        name: "CategoryList",
        component: CategoryList,
        meta: { requiresAdmin: true },
      },
      {
        path: "subcategory/list",
        name: "SubCategoryList",
        component: SubcategoryList,
      },
      {
        path: "user",
        name: "User add",
        component: userAdd,
      },
    ],
  },
];

const router = new createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition; // Bu foydalanuvchi "back" yoki "forward" tugmachasini bosganda o'sha joyga qaytaradi.
    } else {
      return { top: 0 }; // Har doim sahifaning eng yuqorisiga skroll qiladi.
    }
  },
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  if (to.meta.requiresAdmin && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});
export default router;
