<template>
  <Popup v-model="isShow" @hide="hide" width="500px" title="Thanh toán">
    <div class="p-4">
      <div id="bill-html">
        <div class="text-center font-bold text-2xl mb-2">Coffee Shop</div>
        <div class="text-center">Address</div>
        <div class="text-center">Điện thoại: 0123456789</div>
        <div class="text-center font-bold text-xl mt-2">PHIẾU THANH TOÁN</div>
        <div class="flex">
          <div class="w-1/2 mr-2">N.V: Admin</div>
          <div class="w-1/2 ml-2">HĐ: 12345</div>
        </div>
        <div class="flex">
          <div class="w-1/2 mr-2">Giờ vào: 3:00 PM</div>
          <div class="w-1/2 ml-2">Giờ ra: 4:00PM</div>
        </div>
        <div class="flex font-bold">
          <div class="w-1/2 mr-2">Khu vực: {{ currentTable.group }}</div>
          <div class="w-1/2 ml-2">Bàn: {{ currentTable.name }}</div>
        </div>
        <div class="flex mt-2">
          <div class="w-4/12 px-2 text-center font-bold border-1px border-black">Món</div>
          <div class="w-2/12 px-2 text-center font-bold border-1px border-black">S.L</div>
          <div class="w-2/12 px-2 text-center font-bold border-1px border-black">
            Đ.Giá
          </div>
          <div class="w-2/12 px-2 text-center font-bold border-1px border-black">CK</div>
          <div class="w-2/12 px-2 text-center font-bold border-1px border-black">
            T.Tiền
          </div>
        </div>
        <div
          v-for="(item, iIndex) in currentTable.bill.items"
          class="flex"
          :key="`bill-order-item-${iIndex}`"
        >
          <div class="w-4/12 px-2 border-1px border-black">{{ item.name }}</div>
          <div class="w-2/12 px-2 text-right border-1px border-black">
            {{ item.quantity }}
          </div>
          <div class="w-2/12 px-2 text-right border-1px border-black">
            {{ item.price }}
          </div>
          <div class="w-2/12 px-2 text-right border-1px border-black">
            {{ item.decrease }}
          </div>
          <div class="w-2/12 px-2 text-right border-1px border-black">
            {{ getItemTotal(item) }}
          </div>
        </div>
        <div class="flex mt-2">
          <div class="w-1/2 mr-2">Giờ in: {{ $formatDate(new Date()) }}</div>
          <div class="w-1/2 ml-2 font-bold">
            Thành tiền: {{ currentTable.bill.total }}
          </div>
        </div>
        <div class="flex justify-center mt-2">
          <div class="w-5/6 h-[1px] bg-black"></div>
        </div>
        <div class="pt-1 text-center">Cảm ơn quý khách, hẹn gặp lại!</div>
      </div>
    </div>
    <template v-slot:buttons>
      <div class="flex justify-end p-3">
        <button
          class="bg-blue-500 w-1/2 text-white hover:bg-blue-700 background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 rounded-sm mr-2"
          type="button"
          @click="printBill"
        >
          In hoá đơn
        </button>
        <button
          class="bg-green-500 w-1/2 text-white hover:bg-green-700 background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 rounded-sm ml-2"
          type="button"
        >
          Xác nhận
        </button>
      </div>
    </template>
  </Popup>
</template>

<script>
import Popup from "./Popup.vue";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    currentTable: {
      type: Object,
      default: () => ({}),
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
  computed: {},
  data: () => ({
    isShow: false,
  }),
  methods: {
    hide() {
      this.$emit("update:modelValue", false);
    },
    printBill() {
      this.$htmlToPaper("bill-html");
    },
    getItemTotal(item) {
      return (item.price || 0) * item.quantity - (item.decrease || 0);
    },
  },
};
</script>
