<template>
  <Popup
    v-model="isShow"
    @hide="onHidePopup"
    :save="saveOrder"
    :closeOnSave="false"
    persistent
    width="1360px"
  >
    <template v-slot:title>
      <div class="flex items-center justify-between">
        <h4 class="text-2xl font-semibold">Order cho bàn {{ currentTable.name }}</h4>
        <div class="ml-4 font-semibold text-blue-500 flex-[0_0_200px]">
          Giờ: {{ billCreatedTime }}
        </div>
      </div>
    </template>
    <div class="flex flex-wrap h-[calc(100vh_-_170px)] overflow-y-auto">
      <div class="flex flex-col h-full overflow-y-auto w-full xl:w-4/12 bg-blue-400 p-2">
        <div class="mb-2 flex-0 text-white flex items-center justify-between">
          <div class="font-bold text-xl">
            Danh sách món
          </div>
          <div>
            <span class="text-md font-semibold">Tổng: {{ $numberWithCommas(totalItems) }}</span>
            <span class="text-xl font-bold">{{  }}</span>
          </div>
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
              <div class="flex items-center border-b-[1px]">
                <div class="w-3/12 p-1 border-r-[1px]">{{ item.name }}</div>
                <div class="w-2/12 p-1 border-r-[1px]">
                  <input
                    :id="`input-quantity-${index}`"
                    v-model="item.quantity"
                    @input="hasChange = true"
                    type="number"
                    min="0"
                    class="outline-none max-w-full border-1px rounded-sm"
                  />
                </div>
                <div
                  class="w-2/12 p-1 border-r-[1px] text-right truncate"
                  :title="$numberWithCommas(item.price)"
                >
                  {{ $numberWithCommas(item.price) }}
                </div>
                <div class="w-2/12 p-1 border-r-[1px]">
                  <InputMoney
                    v-model="item.decrease"
                    @input="hasChange = true"
                    class="outline-none max-w-full border-1px rounded-sm"
                  />
                </div>
                <div
                  class="w-2/12 p-1 border-r-[1px] text-right truncate"
                  :title="$numberWithCommas(getItemTotal(item))"
                >
                  {{ $numberWithCommas(getItemTotal(item)) }}
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
        <div class="flex flex-wrap pt-4 flex-0 border-t-2">
          <div class="w-1/2 flex px-2 mb-2">
            <div class="flex-[0_0_100px] text-right pr-2 text-white font-semibold">
              Phí D.Vụ
            </div>
            <div>
              <InputMoney
                v-model="formData.serviceFee"
                @input="hasChange = true"
                class="bg-white rounded-sm border-1px w-full outline-none"
              />
            </div>
          </div>
          <div class="w-1/2 flex px-2 mb-2">
            <div class="flex-[0_0_100px] text-right pr-2 text-white font-semibold">
              Giảm bill
            </div>
            <div>
              <InputMoney
                v-model="formData.decreaseBill"
                @input="hasChange = true"
                class="bg-white rounded-sm border-1px w-full outline-none"
              />
            </div>
          </div>
          <div class="w-1/2 flex px-2 mb-2">
            <div class="flex-[0_0_100px] text-right pr-2 text-white font-semibold">
              Thuế
            </div>
            <div>
              <InputMoney
                v-model="formData.vat"
                @input="hasChange = true"
                class="bg-white rounded-sm border-1px w-full outline-none"
              />
            </div>
          </div>
          <div class="w-1/2 flex px-2">
            <div class="flex-[0_0_100px] text-right pr-2 text-white font-semibold">
              Tổng tiền
            </div>
            <div>
              <input
                :value="$numberWithCommas(totalBill)"
                class="bg-gray-300 rounded-sm border-1px w-full outline-none"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
      <div class="w-full xl:w-8/12 p-2 h-full overflow-auto flex flex-col">
        <div class="p-2 rounded mb-2 border-b-2 bg-white">
          <input
            v-model="keyword"
            @input="hasChange = true"
            type="text"
            placeholder="Nhập mã hoặc tên..."
            class="outline-none rounded-md border-1px px-2 py-1 w-full"
          />
        </div>
        <div class="flex flex-wrap -mx-[4px]">
          <div
            v-for="(product, pIndex) in computedProducts"
            :key="`product-item-${pIndex}`"
            class="w-1/2 md:w-1/4 xl:w-1/6 px-[4px] mb-[8px]"
          >
            <div class="border-1px rounded-md" :class="checkIsChecked(product) ? 'border-green-500' : 'border-white'">
              <div
                class="border-1px border-b-[2px] flex p-1 rounded-md hover:bg-gray-200 cursor-pointer bg-white relative"
                :class="checkIsChecked(product) ? 'border-green-500' : 'border-blue-300 border-b-cyan-600'"
                @click="addItem(product)"
              >
                <img
                  v-if="checkIsChecked(product)"
                  :src="CheckedIcon"
                  alt=""
                  class="absolute -top-1 -right-1 bg-white rounded-full"
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
    </div>
  </Popup>
</template>

<script>
import CheckedIcon from "../../assets/images/success-green-check-mark-icon.png";
import InputMoney from "../InputMoney.vue";
import Popup from "../Popup.vue";
import { products } from '../../assets/data'

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
    InputMoney,
  },
  watch: {
    modelValue(v) {
      this.isShow = v;
      clearInterval(this.timeInterval);
      if (v) {
        this.hasChange = false
        const { items = [], decreaseBill = 0, serviceFee = 0, vat = 0, createdAt } = JSON.parse(
          JSON.stringify(this.currentTable.bill || {})
        );
        this.formData = { items, decreaseBill, serviceFee, vat };
        if (createdAt) {
          this.billCreatedTime = createdAt
        } else {
          this.timeInterval = setInterval(() => {
            this.billCreatedTime = this.$formatDate(new Date(), "DD/MM/YYYY hh:mm:ss");
          }, 100);
        }
      }
    },
  },
  computed: {
    totalItems () {
      return this.formData.items.reduce((result, item) => {
        result += this.getItemTotal(item);
        return result;
      }, 0);
    },
    totalBill() {
      const { serviceFee = 0, vat = 0, decreaseBill = 0 } = this.formData;
      return this.totalItems + serviceFee + vat - decreaseBill;
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
    hasChange: false,
    billCreatedTime: null,
    CheckedIcon,
    keyword: null,
    formData: {
      items: [],
      decreaseBill: 0,
      serviceFee: 0,
      vat: 0,
    },
    products,
    isShow: false,
  }),
  methods: {
    hide () {
      this.$emit("update:modelValue", false);
    },
    onHidePopup() {
      if (this.hasChange) {
        this.$swal.fire({
          title: 'Đã có vài thay đổi tên form này, bạn có chắc muốn tắt không?',
          showCancelButton: true,
          cancelButtonText: 'Không',
          confirmButtonText: 'Có',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.hide()
          }
        })
        return
      }
      this.hide()
    },
    saveOrder() {
      if (!this.formData.items.length) {
        this.$swal('Chưa chọn món', 'Vui lòng chọn món.', 'warning');
        return
      }

      this.$emit("saved", {
        ...JSON.parse(JSON.stringify(this.formData)),
        createdAt: this.billCreatedTime,
        total: this.totalBill,
      });
      this.hide();
    },
    getItemTotal(item) {
      return (item.price || 0) * item.quantity - (item.decrease || 0);
    },
    addItem(item) {
      let focusIndex
      const index = this.formData.items.findIndex((e) => e.id === item.id);
      if (index === -1) {
        this.formData.items.push({
          ...JSON.parse(JSON.stringify(item)),
          quantity: 1,
          decrease: 0,
        });
        focusIndex = this.formData.items.length - 1
      } else {
        this.formData.items[index].quantity++;
        focusIndex = index
      }
      this.$nextTick(() => {
        const el = document.querySelector(`#input-quantity-${focusIndex}`)
        if (el && typeof el.focus === 'function') {
          el.focus()
        }
      })
      this.hasChange = true
    },
    removeItem(index) {
      this.formData.items.splice(index, 1);
      this.hasChange = true
    },
    checkIsChecked(product) {
      return this.formData.items.some((e) => e.id === product.id);
    },
  },
};
</script>

