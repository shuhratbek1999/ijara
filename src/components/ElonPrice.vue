<script setup>
import { reactive, ref, watch, computed } from "vue";
import BaseButton from "./BaseButton.vue";
import BaseInput from "./BaseInput.vue";
import { required, isNumber } from "@/utils/rules";

const emit = defineEmits([
  "update:price",
  "update:pay_type",
  "update:price_agreement",
]);

const props = defineProps({
  price: {
    type: Number,
    default: 0,
  },
  pay_type: {
    type: String,
    default: "summ",
  },
  price_agreement: {
    type: Boolean,
    default: false,
  },
});

// Ichki o'zgaruvchilar
const ElonPrices = ref({
  price: props.price,
  pay_type: props.pay_type,
  price_agreement: props.price_agreement,
});

const isUpdatingInternally = ref(false);
const priceRef = ref(null);
const variantBtn = ref("sotish");
const types = reactive(["summ", "evro"]);
const priceBool = ref(true);

// Parentdan kelgan prop qiymatlarini kuzatish
watch(
  () => [props.price, props.pay_type, props.price_agreement],
  ([newPrice, newPayType, newPriceAgreement]) => {
    isUpdatingInternally.value = true;
    ElonPrices.value = {
      price: newPrice,
      pay_type: newPayType,
      price_agreement: newPriceAgreement,
    };
    isUpdatingInternally.value = false;
  },
  { immediate: true }
);

// Ichki o'zgarishlarni parentga yuborish
watch(
  ElonPrices,
  (newVal) => {
    if (isUpdatingInternally.value) return;

    emit("update:price", newVal.price);
    emit("update:pay_type", newVal.pay_type);
    emit("update:price_agreement", newVal.price_agreement);
  },
  { deep: true }
);

const Sotish = (key) => {
  variantBtn.value = key;
  priceBool.value = key === "sotish";
};

const validate = async () => {
  const results = await Promise.all([priceRef.value?.validate?.()]);
  return results.every((f) => f === true);
};

const handleChange = (val) => {
  ElonPrices.value.pay_type = val;
};

const handleSwitchChange = (checked) => {
  ElonPrices.value.price_agreement = checked;
};

defineExpose({ validate });
</script>

<template>
  <div class="price">
    <div class="buttons flex gap-4">
      <BaseButton
        class="w-44"
        :variant="variantBtn == 'sotish' ? 'danger' : 'secondary'"
        @click="Sotish('sotish')"
      >
        Sotish
      </BaseButton>
      <BaseButton
        class="w-44"
        :variant="variantBtn == 'ayirboshlash' ? 'danger' : 'secondary'"
        @click="Sotish('ayirboshlash')"
      >
        Ayirboshlash
      </BaseButton>
    </div>
    <div class="price md:w-[27%] sm:w-2/3 my-4" v-if="priceBool">
      <div class="content flex items-center justify-between gap-4">
        <div class="input w-8/12">
          <span class="block mb-4">Narxi*</span>
          <BaseInput
            ref="priceRef"
            :model-value="ElonPrices.price"
            @update:modelValue="(val) => (ElonPrices.price = val)"
            :rules="[required(), isNumber('Narx raqam bolishi kerak')]"
            type="number"
            placeholder="10000..."
            width="100%"
            height="40px"
            class="bg-gray-300 focus:outline-none rounded-sm indent-2"
          />
        </div>
        <a-select
          ref="select"
          :value="ElonPrices.pay_type"
          @change="handleChange"
          class="my-select mt-10 w-36 overflow-hidden"
        >
          <a-select-option
            v-for="(item, index) in types"
            :key="index"
            :value="item"
          >
            {{ item }}
          </a-select-option>
        </a-select>
      </div>
      <div class="flex items-center justify-between my-4">
        <p>Kelishuv mumkin</p>
        <a-switch
          :checked="ElonPrices.price_agreement"
          @change="handleSwitchChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-select :deep(.ant-select-selector) {
  height: 40px !important;
  width: 100%;
  display: flex;
  align-items: center;
  overflow-x: hidden;
}
</style>
