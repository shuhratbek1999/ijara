<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      :collapsed="state.collapsed"
      width="250"
      class="site-layout-background"
    >
      <div class="topNavbar h-20 m-4">
        <NavbarTop />
      </div>
      <a-menu
        id="dddddd"
        :openKeys="state.openKeys"
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        :items="items"
        theme="dark"
        @click="handleClick"
        @openChange="onOpenChange"
      ></a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <Header @collapsed="CollapsedToogle" />
      </a-layout-header>
      <a-layout-content class="p-5">
        <dashboardContent></dashboardContent>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        <Footer />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { h, reactive, watch, ref } from "vue";
import NavbarTop from "./TopNavbar.vue";
import Footer from "./ContentFooter.vue";
import dashboardContent from "./Content.vue";
import Header from "./Header.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const role = localStorage.getItem("role");
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  AccountBookOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
const state = reactive({
  selectedKeys: [],
  openKeys: [],
  collapsed: false,
  preOpenKeys: ["sub1", "sub2", "sub3", "sub4", "sub5"],
});
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const generateMenuItems = (role) => {
  const commonItems = [
    getItem("E'lon", "sub1", () => h(AppstoreOutlined), [
      getItem("E'lonlar royhati", "1"),
    ]),
    {
      type: "divider",
    },
    getItem(
      "",
      "sub2",
      () => h(AppstoreOutlined),
      [getItem("Personal information", "7")],
      "group"
    ),
    getItem(
      "",
      "sub3",
      () => h(AppstoreOutlined),
      [getItem("Saytga qaytish", "8")],
      "group"
    ),
  ];
  if (role === "Admin") {
    commonItems.splice(
      1,
      0,
      getItem("Category", "sub4", () => h(SettingOutlined), [
        getItem("Sub Category", "3"),
        getItem("Category ro'yhati", "2"),
      ]),
      getItem("Admin uchun", "sub5", () => h(AppstoreOutlined), [
        getItem("E'lonni tasdiqlash", "5"),
        getItem("E'lonlar ro'yhati", "6"),
      ]),
      { type: "divider" }
    );
  }
  return commonItems;
};
const items = reactive(generateMenuItems(role));
// Menyu elementi bosilganda bajariladigan funksiya
const handleClick = (e) => {
  switch (e.key) {
    case "1":
      router.push("/dashboard/elon");
      break;
    case "2":
      if (role === "Admin") {
        router.push("/dashboard/category");
      } else {
        message.warning("sizda ruxsat yo'q");
      }
      break;
    case "8":
      router.push("/");
      break;
    case "5":
      router.push("/dashboard/elon_confirmation");
      break;
    case "6":
      router.push("/dashboard/admin_elon");
      break;
    case "7":
      router.push("/dashboard/user");
      break;
    case "3":
      router.push("/dashboard/subcategory/list");
    default:
      break;
  }
};
const onOpenChange = (key) => {
  const latestOpen = key.find((x) => state.openKeys.indexOf(x) === -1);
  if (state.preOpenKeys.indexOf(latestOpen) === -1) {
    state.openKeys = key;
  } else {
    state.openKeys = latestOpen ? [latestOpen] : [];
  }
};
const CollapsedToogle = () => {
  state.collapsed = !state.collapsed;
  state.openKeys = state.collapsed ? [] : state.preOpenKeys;
};
watch(
  () => localStorage.getItem("role"),
  (newRole) => {
    state.selectedKeys = [];
    state.openKeys = [];
    items.splice(0, items.length, ...generateMenuItems(newRole));
  }
);
</script>

<style scoped>
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}
</style>
