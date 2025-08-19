<template>
  <div class="status overflow-x-auto">
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="{ pageSize: 50 }"
      :scroll="{ x: columns.length * 150, y: 400 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'action'">
          <a-button type="primary">
            <a-popconfirm
              title="Do you want to change the status?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="Tasdiqlash(record)"
              @cancel="cancel"
            >
              <a href="#">tasdiqlash</a>
            </a-popconfirm>
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { h, onMounted, reactive, render, ref, onUnmounted } from "vue";
import { PlusCircleOutlined } from "@ant-design/icons-vue";
import { Popconfirm, message } from "ant-design-vue";
import { useRouter } from "vue-router";
import axios from "axios";
import moment from "moment";
import SocketioService from "../../socketio/index";
const router = useRouter();
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    width: 150,
  },
  {
    title: "category",
    dataIndex: "category_name",
    width: 150,
  },
  {
    title: "date time",
    dataIndex: "create_at",
    customRender: ({ record }) => {
      return moment(record.create_at * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "price",
    dataIndex: "price",
  },
  {
    title: "status",
    dataIndex: "status",
  },
  {
    title: "Action",
    dataIndex: "action",
    customRender: ({ record }) => {
      return h("span", [
        h(Popconfirm, {
          title: "Are you sure to delete this record?",
          onConfirm: () => deleteId(record.id),
          onCancel: () => console.log("Delete canceled"),
        }),
      ]);
    },
  },
];
let data = ref([]);
const updateMulk = (id) => {
  router.push("/elon_update/" + id);
};
const Tasdiqlash = async (data) => {
  try {
    await SocketioService.updateElonStatus(data.id);
    message.success("E'lon tasdiqlandi!");
  } catch (error) {
    message.error(error.message || "Tasdiqlashda xatolik");
  }
};
const cancel = (e) => {
  message.error("Click on No");
};
const deleteId = (id) => {
  axios.delete("elon/delete/" + id).then((res) => {
    if (res.data.success) {
      allElon();
    } else {
      message.warning(`${res.data.message}`);
    }
  });
};
const allElon = () => {
  axios.get("elon/allElonAdmin").then((res) => {
    if (res.data) {
      if (res.data.success) {
        for (let key of res.data.data) {
          key.name = `${key.name.substring(0, 15)}....`;
        }
        data.value = res.data.data;
      } else {
        message.warning(`${res.data.message}`);
      }
    }
  });
};
onMounted(() => {
  allElon();
  // SocketioService.connect();
  SocketioService.socket.on("newElon", () => {
    allElon();
  });
  SocketioService.socket.on("updateElon", () => {
    allElon();
  });
});
onUnmounted(() => {
  SocketioService.socket.off("newElon");
  SocketioService.socket.off("updateElon");
});
</script>

<style scoped></style>
