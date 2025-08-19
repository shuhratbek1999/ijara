import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
export const useElonStore = defineStore("elons", () => {
  const route = useRoute();
  const router = useRouter();
  const Elon = ref([]);
  const OneElon = ref({});
  const loading = ref(false);
  const error = ref(null);
  async function getElon() {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get("category/mainCatAll");
      //   const data = response.data.data;
      //   categorys.value = data.map((cat, index) => {
      //     const icon = icons[index % icons.length];
      //     return {
      //       ...cat,
      //       icon,
      //     };
      //   });
    } catch (err) {
      error.value = err.message || "xatolik yuz berdi";
    } finally {
      loading.value = false;
    }
  }
  async function createElon(Elon, update = true) {
    try {
      const formData = new FormData();
      Elon.images.forEach((item) => {
        item.url = item.url?.split("/").pop();
        item.originFileObj
          ? formData.append("img", item.originFileObj)
          : formData.append("img", item.url);
      });

      formData.append("name", Elon.name);
      formData.append("description", Elon.description);
      formData.append("category_id", Elon.category_id);
      formData.append("subcategory_id", Elon.subcategory_id);
      formData.append("price", Elon.price);
      formData.append("status", Elon.status);
      formData.append("adress", Elon.adress);
      formData.append("email", Elon.email);
      formData.append("pay_type", Elon.pay_type);
      formData.append("phone_number", Elon.phone_number);
      formData.append("contact_name", Elon.contact_name);
      formData.append("foydalanish", Elon.foydalanish);
      formData.append("holati", Elon.holati);
      formData.append("price_agreement", Elon.price_agreement);
      formData.append("fields", JSON.stringify(Elon.fields));

      let response;

      if (update) {
        response = await axios.post("elon/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.patch(
          "elon/update/" + route.params.id,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.data.success) {
        message.success(
          response.data.message || "Amaliyot muvaffaqiyatli bajarildi"
        );
        router.push("/dashboard/elon");
      } else {
        message.warning(response.data.message || "Xatolik yuz berdi");
      }

      return response.data;
    } catch (error) {
      console.error("Xato:", error);
      message.error(error.response?.data?.message || "Server xatosi");
      throw error;
    }
  }
  async function updateCategory(id, data) {
    const response = await updateAddressApi(id, data);
    currentAddress.value = response.data;
    await getCategory();
  }
  return {
    Elon,
    OneElon,
    loading,
    error,
    getElon,
    createElon,
    updateCategory,
  };
});
