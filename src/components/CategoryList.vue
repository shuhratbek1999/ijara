<script setup>
import { useCategoryStore } from "@/stores/category";
import { onMounted, ref } from "vue";
import rightIcon from "@/assets/icons/right.svg";
const store = useCategoryStore();
const emit = defineEmits(["close", "data"]);
let mainId = ref(),
  subId = ref(),
  catId = ref(),
  subCategoryList = ref([]),
  categoryList = ref([]),
  UpdateCategory = ref({});
const MainCategory = (data) => {
  const { subcategories, ...main } = data;
  if (subcategories.length != 0) {
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
  if (categories.length != 0) {
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
    // console.log(main.id);
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

onMounted(() => {
  // console.log("salomm");
  store.getCategory();
});
</script>

<template>
  <div class="category_list">
    <div
      class="main_category grid md:grid-cols-3 max-sm:grid-cols-2 gap-2 justify-around"
      v-if="subCategoryList.length == 0"
    >
      <div
        class="category_lists h-15 bg-gray-300 rounded-lg flex justify-start px-4 items-center cursor-pointer gap-2"
        v-for="(main, index) in store.categorys"
        :key="'main' + index"
        @click="MainCategory(main)"
      >
        <div
          class="img w-10 h-10 rounded-full bg-white flex items-center justify-center"
        >
          <img :src="main.icon" alt="main icon" class="w-6 h-6" />
        </div>
        <span>{{ main.name }}</span>
      </div>
    </div>
    <div class="subCategory flex w-full gap-2" v-else>
      <div class="main_list overflow-y-scroll rounded-sm w-1/3">
        <div
          class="list_item cursor-pointer flex justify-between items-center p-2 border-b-2"
          :class="[mainId == main.id ? 'bg-gray-300' : 'bg-white']"
          v-for="(main, index) in store.categorys"
          :key="'main2' + index"
          @click="MainCategory(main)"
        >
          <span>{{ main.name }}</span>
          <img v-if="mainId" :src="rightIcon" alt="rightIcon" />
        </div>
      </div>
      <div class="sub_list w-1/3 overflow-y-scroll rounded-sm">
        <div
          class="list_item p-2 flex justify-between items-center cursor-pointer border-b-2"
          :class="[subId == sub.id ? 'bg-gray-300' : 'bg-white']"
          v-for="(sub, index) in subCategoryList"
          :key="'sub' + index"
          @click="SubCategory(sub)"
        >
          <span>{{ sub.name }}</span>
          <img v-if="subId || mainId" :src="rightIcon" alt="rightIcon" />
        </div>
      </div>
      <div class="child_list w-1/3">
        <div
          class="list_item flex items-center p-2 border-b-2 cursor-pointer"
          v-for="(child, index) in categoryList"
          :key="'child' + index"
          @click="ChildCategory(child)"
        >
          {{ child.name }}
        </div>
      </div>
    </div>
  </div>
</template>
