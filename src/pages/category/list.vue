<template>
  <div class="list overflow-x-auto">
    <a-table
      :columns="columns"
      :data-source="categoryAll"
      :pagination="{ pageSize: 50 }"
      :scroll="{ x: columns.length * 150, y: 400 }"
    >
    </a-table>
    <a-float-button type="primary" @click="handleAddCategory">
      <template #icon>
        <PlusCircleOutlined />
      </template>
    </a-float-button>
    <Modal
      :open="open"
      :styles="styles"
      @close="handleModalClose"
      @add="handleSubmit"
    >
      <template v-slot:category>
        <a-form
          :model="formState"
          name="category-form"
          autocomplete="off"
          class="w-full"
          @finish="handleSubmit"
        >
          <a-form-item
            name="sub_cat_id"
            label="Turkum"
            :rules="[{ required: true, message: 'Iltimos, turkumni tanlang!' }]"
            :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }"
            class="w-8/12"
          >
            <a-select
              v-model:value="formState.sub_cat_id"
              placeholder="Turkumni tanlang"
              @change="handleCategoryChange"
            >
              <a-select-option
                v-for="category in SubCategorys"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            name="name"
            label="Kategoriya nomi"
            :rules="[{ required: true, message: 'Iltimos, nom kiriting!' }]"
            :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }"
            class="w-8/12"
          >
            <a-input
              v-model:value="formState.name"
              placeholder="Masalan, Elektronika"
            />
          </a-form-item>
          <div class="fields w-full mt-4">
            <h2 class="text-lg font-semibold mb-2">Maydonlar</h2>
            <a-select
              v-model:value="formState.fields"
              show-search
              :filter-option="filterOption"
              mode="multiple"
              style="width: 100%"
              placeholder="Maydonlarni tanlang"
              @change="handleFieldsChange"
              :options="
                Fields.map((field) => ({
                  value: field.id,
                  label: field.field_name,
                }))
              "
            />
          </div>
        </a-form>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, h } from "vue";
import { message, Popconfirm } from "ant-design-vue";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import Modal from "@/components/modal.vue";

// Reactive state
const categoryAll = ref([]);
const SubCategorys = ref([]);
const Fields = ref([]);
const open = ref(false);
const categoryId = ref(null);
const loading = ref(false);

const formState = reactive({
  name: "",
  sub_cat_id: null,
  fields: [],
});

const styles = ref({
  title: "Kategoriyani boshqarish",
  width: "50%",
});

// Table columns
const columns = [
  {
    title: "Nomi",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Amallar",
    key: "action",
    customRender: ({ record }) => {
      return h("div", { class: "flex gap-4" }, [
        h(EditOutlined, {
          class: "text-blue-500 cursor-pointer",
          onClick: () => handleEdit(record.id),
        }),
        h(
          Popconfirm,
          {
            title: "Rostan ham o'chirmoqchimisiz?",
            onConfirm: () => handleDelete(record.id),
          },
          {
            default: () =>
              h(DeleteOutlined, {
                class: "text-red-500 cursor-pointer",
              }),
          }
        ),
      ]);
    },
  },
];

// Fetch all data
const fetchAllData = async () => {
  try {
    loading.value = true;
    await Promise.all([fetchCategories(), fetchSubCategories(), fetchFields()]);
  } catch (error) {
    message.error("Ma'lumotlarni yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

// Fetch categories
const fetchCategories = async () => {
  const response = await axios.get("category/all");
  categoryAll.value = response.data.data;
};

// Fetch subcategories
const fetchSubCategories = async () => {
  const response = await axios.get("subcategory/all");
  SubCategorys.value = response.data.data;
  if (SubCategorys.value.length > 0 && !formState.sub_cat_id) {
    formState.sub_cat_id = SubCategorys.value[0].id;
  }
};

// Fetch fields
const fetchFields = async () => {
  const response = await axios.get("fields/all");
  Fields.value = response.data.data;
};

// Fetch single category
const fetchCategory = async (id) => {
  try {
    loading.value = true;
    const response = await axios.get(`category/one/${id}`);
    const { fields, ...main } = response.data.data;
    formState.name = main.name;
    formState.sub_cat_id = main.sub_cat_id;
    if (fields[0] !== null) {
      formState.fields = fields.map((field) => field.id);
    }
    categoryId.value = id;
    open.value = true;
  } catch (error) {
    message.error("Kategoriyani yuklashda xatolik" + error);
  } finally {
    loading.value = false;
  }
};

// Form handlers
const handleAddCategory = () => {
  resetForm();
  open.value = true;
};

const handleEdit = (id) => {
  fetchCategory(id);
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`category/delete/${id}`);
    message.success("Kategoriya o'chirildi");
    await fetchCategories();
  } catch (error) {
    message.error("O'chirishda xatolik");
  }
};

const handleModalClose = () => {
  open.value = false;
  resetForm();
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    const payload = {
      name: formState.name,
      sub_cat_id: formState.sub_cat_id,
      fields: formState.fields.map((id) => ({ cat_id: id })),
    };
    if (categoryId.value) {
      // Update existing category
      await axios.patch(`category/update/${categoryId.value}`, payload);
      message.success("Kategoriya muvaffaqiyatli yangilandi");
    } else {
      // Create new category
      await axios.post("category/create", payload);
      message.success("Yangi kategoriya muvaffaqiyatli qo'shildi");
    }

    open.value = false;
    resetForm();
    await fetchCategories();
  } catch (error) {
    message.error("Amalni bajarishda xatolik");
  } finally {
    loading.value = false;
  }
};

const handleCategoryChange = (value) => {
  formState.sub_cat_id = value;
};

const handleFieldsChange = (selectedFields) => {
  formState.fields = selectedFields;
};

const filterOption = (input, option) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};

const resetForm = () => {
  formState.name = "";
  formState.sub_cat_id = SubCategorys.value[0]?.id || null;
  formState.fields = [];
  categoryId.value = null;
};

// Lifecycle hooks
onMounted(() => {
  fetchAllData();
});
</script>

<style scoped>
.list {
  position: relative;
  padding: 20px;
}

.fields {
  margin-top: 20px;
}
</style>
