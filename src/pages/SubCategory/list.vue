<template>
  <div class="list overflow-x-auto">
    <a-input
      class="w-full my-2"
      v-model:value="search"
      placeholder="search field name"
    />
    <a-table
      :columns="columns"
      :data-source="Searching"
      :pagination="{ pageSize: 50 }"
      :scroll="{ x: columns.length * 150, y: 400 }"
    >
    </a-table>
    <a-float-button type="primary" @click="AddCategory">
      <template #icon>
        <PlusCircleOutlined />
      </template>
    </a-float-button>
  </div>
  <Modal :open="open" :styles="styles" @close="ModalClose" @add="Add">
    <template v-slot:category>
      <a-form :model="dataForm" name="basic" autocomplete="off" class="w-full">
        <a-form-item
          :name="['dataForm.main_cat_id']"
          label="Turkum"
          :rules="[{ required: true, message: 'Please input category_id!' }]"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
          class="w-8/12"
        >
          <a-select
            ref="select"
            v-model:value="dataForm.main_cat_id"
            @change="handleChange"
          >
            <a-select-option
              v-for="(item, index) in SubCategorys"
              :key="index"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :name="['name']"
          label="iltimos, nom kiriting"
          :rules="[{ required: true, message: 'Please input name!' }]"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
          class="w-8/12"
        >
          <a-input
            v-model:value="dataForm.name"
            placeholder="Masalan, Elektronika"
          />
        </a-form-item>
        <div class="fields w-full">
          <h1>Fields</h1>
          <a-select
            show-search
            :filter-option="filterOption"
            mode="multiple"
            style="width: 100%"
            placeholder="Please select"
            @change="handleFields"
          >
            <a-select-option
              v-for="cat in Fields"
              :key="cat.id"
              :value="cat.id"
              >{{ cat.field_name }}</a-select-option
            >
          </a-select>
        </div>
      </a-form>
    </template>
  </Modal>
</template>

<script setup>
import Modal from "@/components/modal.vue";
import { h, reactive, ref, onMounted, computed } from "vue";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons-vue";
import { Popconfirm, message } from "ant-design-vue";
import { useRouter } from "vue-router";
import axios from "axios";
const router = useRouter();
let categoryAll = ref([]),
  categoryId = ref(null),
  SubCategorys = ref([]),
  Fields = ref([]),
  search = ref("");
const dataForm = reactive({
  name: "",
  main_cat_id: 1,
  fields: [],
});
let open = ref(false),
  styles = ref({
    title: "Kategoriyani tanlang",
    width: "90%",
  });
const columns = [
  {
    title: "Main category",
    dataIndex: "category_name",
    width: 100,
  },
  {
    title: "Category",
    dataIndex: "name",
    width: 100,
  },
  {
    title: "Action",
    dataIndex: "action",
    width: 100,
    customRender: ({ record }) => {
      return h("span", [
        h(EditOutlined, {
          onClick: () => updateMulk(record.id),
          style: { cursor: "pointer", marginRight: "15px" },
        }),
        h(
          Popconfirm,
          {
            title: "Are you sure to delete this record?",
            onConfirm: () => deleteId(record.id),
            onCancel: () => console.log("Delete canceled"),
          },
          {
            default: () => h(DeleteOutlined, { style: { cursor: "pointer" } }),
          }
        ),
      ]);
    },
  },
];
const updateMulk = async (id) => {
  categoryId.value = id;
  open.value = true;
  await oneCategory(id);
};
const oneCategory = (id) => {
  axios
    .get("subcategory/one/" + id)
    .then((res) => {
      dataForm.name = res.data.data.name;
      dataForm.main_cat_id = res.data.data.main_cat.id;
    })
    .catch((err) => {
      message.error(err);
    });
};
const deleteId = (id) => {
  axios.delete("subcategory/delete/" + id).then((res) => {
    if (res.data) {
      allCategory();
    }
  });
};
const Add = () => {
  open.value = false;
  //   console.log(dataForm);
  if (categoryId.value == null) {
    axios
      .post("subcategory/create", dataForm)
      .then(async (res) => {
        if (res.data.data) {
          clearForma();
          await allCategory();
        }
      })
      .catch((err) => {
        message.warning(err);
      });
  } else {
    axios
      .patch("subcategory/update/" + categoryId.value, dataForm)
      .then(async (res) => {
        categoryId.value = null;
        clearForma();
        await allCategory();
      })
      .catch((err) => {
        message.warning(err);
      });
  }
};
const clearForma = () => {
  (dataForm.name = ""), (dataForm.main_cat_id = 1);
};
const handleChange = (change) => {
  console.log(change);
};
const handleFields = (change) => {
  let field;
  for (let key of change) {
    if (key != undefined) {
      field = {
        sub_id: key,
      };
    }
  }
  dataForm.fields.push(field);
};
const filterOption = (input, option) => {
  const matchingField = Fields.value.find((field) => field.id == option.value);
  return (
    matchingField &&
    matchingField.field_name.toLowerCase().includes(input.toLowerCase())
  );
};
const Searching = computed(() => {
  if (search.value.length > 0) {
    let category = categoryAll.value.filter((fil) =>
      fil.name.toLowerCase().includes(search.value.toLowerCase())
    );
    return category;
  }
  return categoryAll.value;
});
const AddCategory = () => {
  open.value = true;
  clearForma();
};
const ModalClose = () => {
  open.value = false;
};
const allCategory = () => {
  axios
    .get("subcategory/all")
    .then((res) => {
      message.success(`${res.data.message}`);
      categoryAll.value = res.data.data;
    })
    .catch((err) => {
      message.warning(err);
    });
};
const MainAllCategory = () => {
  axios
    .get("subcategory/admin_mainCategory")
    .then((res) => {
      //   console.log(res.data);
      SubCategorys.value = res.data.data;
    })
    .catch((err) => {
      message.warning(err);
    });
};
const AllFields = () => {
  axios
    .get("fields/all")
    .then((res) => {
      Fields.value = res.data.data;
    })
    .catch((err) => {
      message.warning(err);
    });
};
onMounted(() => {
  allCategory();
  MainAllCategory();
  AllFields();
});
</script>

<style scoped></style>
