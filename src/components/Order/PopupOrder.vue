<script setup>
import CheckedIcon from "../../assets/images/success-green-check-mark-icon.png";
</script>
<template>
  <Popup v-model="isShow" @hide="hide" :save="saveOrder" width="1360px">
    <template v-slot:title>
      <div class="flex items-center justify-between">
        <h4 class="text-2xl font-semibold">Order cho bàn số ABC</h4>
        <div class="ml-4">
          {{ new Date().toISOString() }}
        </div>
      </div>
    </template>
    <div class="flex flex-wrap h-[calc(100vh_-_170px)] overflow-y-auto">
      <div class="flex flex-col h-full overflow-y-auto w-full xl:w-4/12 bg-blue-400 p-2">
        <div class="mb-2 flex-0 text-white">
          <span class="text-md font-semibold">Phải trả:</span>
          <span class="text-xl font-bold">100.000</span>
        </div>
        <div class="flex flex-col overflow-y-auto flex-1 rounded-md">
          <div class="flex border-b-[1px] bg-yellow-500 font-semibold flex-0 text-white">
            <div class="w-3/12 p-1 border-r-[1px] text-center">Tên</div>
            <div class="w-2/12 p-1 border-r-[1px] text-center">S.L</div>
            <div class="w-2/12 p-1 border-r-[1px] text-center">Giá</div>
            <div class="w-2/12 p-1 border-r-[1px] text-center">Giảm</div>
            <div class="w-2/12 p-1 border-r-[1px] text-center">T.Tiền</div>
            <div class="w-1/12 p-1 text-center"></div>
          </div>
          <div v-if="formData.items.length" class="flex-1 overflow-y-auto">
            <div
              v-for="(item, index) in formData.items"
              class="bg-white text-black text-sm"
              :key="`order-item-${index}`"
            >
              <div class="flex border-b-[1px]">
                <div class="w-3/12 p-1 border-r-[1px]">Item {{ item.name }}</div>
                <div class="w-2/12 p-1 border-r-[1px]">
                  <input
                    v-model="item.quantity"
                    type="number"
                    class="outline-none max-w-full border-[1px] rounded-sm"
                  />
                </div>
                <div class="w-2/12 p-1 border-r-[1px] text-right">{{ item.price }}</div>
                <div class="w-2/12 p-1 border-r-[1px]">
                  <input
                    v-model="item.decrease"
                    type="number"
                    class="outline-none max-w-full border-[1px] rounded-sm"
                  />
                </div>
                <div class="w-2/12 p-1 border-r-[1px] text-right">
                  {{ getItemTotal(item) }}
                </div>
                <div class="w-1/12 p-1 text-center">
                  <button
                    class="text-red-500 font-semibold hover:text-black"
                    @click="removeItem(index)"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="bg-white text-black text-center italic p-5">
            Chưa có sản phẩm nào được chọn.
          </div>
        </div>
        <div class="flex flex-wrap pt-2 flex-0">
          <div class="w-1/2 flex px-2 mb-2">
            <div class="flex-[0_0_100px] text-right pr-2 text-white font-semibold">
              Tổng tiền
            </div>
            <div>
              <input
                :value="totalBill"
                type="number"
                class="bg-gray-300 rounded-sm border-[1px] w-full outline-none"
                disabled
              />
            </div>
          </div>
          <div class="w-1/2 flex px-2 mb-2">
            <div class="flex-[0_0_100px] text-right pr-2 text-white font-semibold">
              Giảm bill
            </div>
            <div>
              <input
                v-model="formData.decreaseBill"
                type="number"
                class="bg-white rounded-sm border-[1px] w-full outline-none"
              />
            </div>
          </div>
          <div class="w-1/2 flex px-2 mb-2">
            <div class="flex-[0_0_100px] text-right pr-2 text-white font-semibold">
              Phí D.Vụ
            </div>
            <div>
              <input
                v-model="formData.serviceFee"
                type="number"
                class="bg-white rounded-sm border-[1px] w-full outline-none"
              />
            </div>
          </div>
          <div class="w-1/2 flex px-2 mb-2">
            <div class="flex-[0_0_100px] text-right pr-2 text-white font-semibold">
              Thuế
            </div>
            <div>
              <input
                v-model="formData.vat"
                type="number"
                class="bg-white rounded-sm border-[1px] w-full outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="w-full xl:w-8/12 p-2 h-full overflow-auto flex flex-col bg-slate-100">
        <div class="p-2 rounded mb-2 border-b-2 bg-white">
          <input
            v-model="keyword"
            type="text"
            placeholder="Nhập mã hoặc tên..."
            class="outline-none rounded-md border-[1px] px-2 py-1 w-full"
          />
        </div>
        <div class="flex flex-wrap -mx-1">
          <div
            v-for="(product, pIndex) in computedProducts"
            :key="`product-item-${pIndex}`"
            class="w-1/2 md:w-1/4 xl:w-1/6 px-1 mb-1"
          >
            <div
              class="border-[1px] flex p-1 rounded-md hover:bg-gray-200 cursor-pointer bg-white relative"
              :class="checkIsChecked(product) ? 'border-green-500' : ''"
              @click="addItem(product)"
            >
              <img
                v-if="checkIsChecked(product)"
                :src="CheckedIcon"
                alt=""
                class="absolute -top-1 -right-1"
                width="20"
              />
              <div
                class="flex-[0_0_50px] h-[100px] bg-cover bg-center bg-no-repeat"
                :style="`background-image: url(${product.image})`"
              ></div>
              <div class="flex-1 flex flex-col p-1">
                <div class="flex-1 font-semibold">{{ product.name }}</div>
                <div>
                  <div class="text-blue-400">{{ product.unit }}</div>
                  <div class="text-sm text-red-500 font-semibold">
                    {{ product.price }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Popup>
</template>

<script>
import Popup from "../Popup.vue";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Popup,
  },
  watch: {
    modelValue(v) {
      this.isShow = v;
    },
  },
  computed: {
    totalBill() {
      return this.formData.items.reduce((result, item) => {
        result += this.getItemTotal(item);
        return result;
      }, 0);
    },
    computedProducts() {
      let result = JSON.parse(JSON.stringify(this.products));
      if (this.keyword) {
        const regex = new RegExp(this.keyword, "gi");
        result = result.filter(
          (e) =>
            (e.id && String(e.id).match(regex)) || (e.name && String(e.name).match(regex))
        );
      }
      return result;
    },
  },
  data: () => ({
    keyword: null,
    formData: {
      items: [],
      decreaseBill: 0,
      serviceFee: 0,
      vat: 0,
    },
    products: Array.from(Array(50).keys()).map((e) => ({
      id: `product-${e}`,
      name: `Sản phẩm ${e}`,
      price: e * 1000,
      image: "https://via.placeholder.com/50x100",
      unit: e % 2 ? "Lon" : "Cái",
    })),
    isShow: false,
  }),
  methods: {
    hide() {
      this.$emit("update:modelValue", false);
    },
    saveOrder() {
      this.hide();
    },
    getItemTotal(item) {
      return (item.price || 0) * item.quantity - (item.decrease || 0);
    },
    addItem(item) {
      const index = this.formData.items.findIndex((e) => e.id === item.id);
      if (index === -1) {
        this.formData.items.push({
          ...JSON.parse(JSON.stringify(item)),
          quantity: 1,
          decrease: 0,
        });
      } else {
        this.formData.items[index].quantity++;
      }
    },
    removeItem(index) {
      this.formData.items.splice(index, 1);
    },
    checkIsChecked(product) {
      return this.formData.items.some((e) => e.id === product.id);
    },
  },
};
</script>

<style></style>
