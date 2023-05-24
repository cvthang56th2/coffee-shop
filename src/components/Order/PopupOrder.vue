<template>
  <Popup
    v-model="isShow"
    @hide="onHidePopup"
    :closeOnSave="false"
    persistent
    width="1360px"
  >
    <template v-slot:buttons>
      <div class="flex py-2">
        <div class="w-1/2 px-4" :class="isRetail ? 'w-full' : 'w-1/2'">
          <button
            class="bg-pink-500 text-white hover:bg-pink-700 background-transparent font-bold uppercase py-3 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 w-full rounded-b"
            type="button"
            @click="saveOrderAndOpenPayment()"
          >
            Thanh toán
          </button>
        </div>
        <div v-if="!isRetail" class="w-1/2 px-4">
          <button
            class="bg-green-500 text-white hover:bg-green-700 background-transparent font-bold uppercase py-3 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 w-full rounded-b"
            type="button"
            @click="saveOrder()"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </template>
    <template v-slot:title>
      <div class="lg:flex items-center justify-between">
        <h4 class="text-2xl font-semibold">
          {{
            isRetail
              ? "Bán lẻ"
              : `Order cho bàn ${currentTable.name} khu ${currentTable.group}`
          }}
        </h4>
        <div class="lg:ml-4 font-semibold text-blue-500 flex-[0_0_200px]">
          Giờ: {{ billTime }}
        </div>
      </div>
    </template>
    <div
      class="h-[calc(100vh_-_270px)] lg:h-[calc(100vh_-_150px)] overflow-y-auto flex flex-col"
    >
      <div class="lg:hidden flex w-full flex-0">
        <button
          @click="currentTab = 'list'"
          class="w-1/2 py-1 uppercase text-center font-bold bg-yellow-500 text-white border-r-[1px] text-sm border-white"
          :class="currentTab === 'list' ? 'underline' : ''"
        >
          Danh sách món
        </button>
        <button
          @click="currentTab = 'menu'"
          class="w-1/2 py-1 uppercase text-center font-bold bg-blue-500 text-white border-l-[1px] text-sm border-white"
          :class="currentTab === 'menu' ? 'underline' : ''"
        >
          Thực đơn
        </button>
      </div>
      <div class="flex flex-wrap overflow-y-auto flex-1">
        <div
          class="flex-col h-full overflow-y-auto w-full lg:w-4/12 bg-blue-400 p-2 lg:flex"
          :class="currentTab === 'list' ? '' : 'hidden'"
        >
          <div class="mb-2 flex-0 text-white flex items-center justify-between">
            <div class="font-bold text-xl">Danh sách món</div>
            <div>
              <span class="text-md font-semibold">Tổng: </span>
              <span class="text-xl font-bold">{{ $numberWithCommas(totalItems) }}</span>
            </div>
          </div>
          <div class="flex flex-col overflow-y-auto flex-1 rounded-md">
            <div
              class="flex border-b-[1px] bg-yellow-500 font-semibold flex-0 text-white"
            >
              <div class="w-3/12 p-[2px] lg:p-1 border-r-[1px] text-center">Tên</div>
              <div class="w-2/12 p-[2px] lg:p-1 border-r-[1px] text-center">S.L</div>
              <div class="w-2/12 p-[2px] lg:p-1 border-r-[1px] text-center">Giá</div>
              <div class="w-2/12 p-[2px] lg:p-1 border-r-[1px] text-center">Giảm</div>
              <div class="w-2/12 p-[2px] lg:p-1 border-r-[1px] text-center">T.Tiền</div>
              <div class="w-1/12 p-[2px] lg:p-1 text-center"></div>
            </div>
            <div v-if="formData.items.length" class="flex-1 overflow-y-auto">
              <div
                v-for="(item, index) in formData.items"
                class="bg-white text-black text-sm"
                :key="`order-item-${index}`"
              >
                <div class="flex items-center border-b-[1px]">
                  <div class="w-3/12 p-[2px] lg:p-1 border-r-[1px]">{{ item.name }}</div>
                  <div class="w-2/12 p-[2px] lg:p-1 border-r-[1px]">
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
                    class="w-2/12 p-[2px] lg:p-1 border-r-[1px] text-right truncate"
                    :title="$numberWithCommas(item.price)"
                  >
                    {{ $numberWithCommas(item.price) }}
                  </div>
                  <div class="w-2/12 p-[2px] lg:p-1 border-r-[1px]">
                    <InputMoney
                      v-model="item.decrease"
                      @input="hasChange = true"
                      class="outline-none max-w-full border-1px rounded-sm"
                    />
                  </div>
                  <div
                    class="w-2/12 p-[2px] lg:p-1 border-r-[1px] text-right truncate"
                    :title="$numberWithCommas(getItemTotal(item))"
                  >
                    {{ $numberWithCommas(getItemTotal(item)) }}
                  </div>
                  <div class="w-1/12 p-[2px] lg:p-1 text-center">
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
            <div class="w-full lg:w-1/2 flex px-2 mb-2">
              <div class="flex-[0_0_80px] text-right pr-2 text-white font-semibold">
                Phí D.Vụ
              </div>
              <div>
                <InputMoney
                  v-model="formData.serviceFee"
                  @input="hasChange = true"
                  class="bg-white rounded-sm border-1px w-full outline-none px-1"
                />
              </div>
            </div>
            <div class="w-full lg:w-1/2 flex px-2 mb-2">
              <div class="flex-[0_0_80px] text-right pr-2 text-white font-semibold">
                Giảm bill
              </div>
              <div class="flex items-center">
                <InputMoney
                  v-model="formData.decreaseBill"
                  @input="hasChange = true"
                  :max="formData.decreaseBillUnit === '%' ? 100 : summaryBill"
                  class="bg-white rounded-sm border-1px w-full outline-none px-1"
                />
                <v-select
                  v-model="formData.decreaseBillUnit"
                  @update:modelValue="onChangeDescreaseBillUnit"
                  :options="['VND', '%']"
                  :clearable="false"
                  appendToBody
                  class="custom-select bg-white rounded-sm w-full outline-none ml-1"
                />
              </div>
            </div>
            <div class="w-full lg:w-1/2 flex px-2 mb-2">
              <div class="flex-[0_0_80px] text-right pr-2 text-white font-semibold">
                Thuế
              </div>
              <div>
                <InputMoney
                  v-model="formData.vat"
                  @input="hasChange = true"
                  class="bg-white rounded-sm border-1px w-full outline-none px-1"
                />
              </div>
            </div>
            <div class="w-full lg:w-1/2 flex px-2">
              <div class="flex-[0_0_80px] text-right pr-2 text-white font-semibold">
                Tổng tiền
              </div>
              <div>
                <input
                  :value="$numberWithCommas(totalBill)"
                  class="bg-gray-300 rounded-sm border-1px w-full outline-none px-1"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-full lg:w-8/12 p-2 h-full overflow-y-auto flex flex-col"
          :class="currentTab === 'menu' ? '' : 'hidden'"
        >
          <div class="p-2 rounded mb-2 border-b-2 bg-white flex-0">
            <input
              id="search-product-keyword"
              v-model="keyword"
              @input="hasChange = true"
              type="text"
              placeholder="Nhập mã hoặc tên..."
              class="outline-none rounded-md border-1px px-2 py-1 w-full"
            />
          </div>
          <div class="flex-1 overflow-x-hidden overflow-y-auto">
            <div class="flex flex-wrap -mx-[4px]">
              <div
                v-for="(product, pIndex) in computedProducts"
                :key="`product-item-${pIndex}`"
                class="w-1/2 md:w-1/4 xl:w-1/6 px-[4px] mb-[8px]"
              >
                <div
                  class="border-1px rounded-md h-full"
                  :class="product.isChecked ? 'border-green-500' : 'border-white'"
                >
                  <div
                    class="border-1px border-b-[2px] flex p-1 rounded-md hover:bg-gray-200 cursor-pointer bg-white relative select-none h-full items-center"
                    :class="
                      product.isChecked
                        ? 'border-green-500'
                        : 'border-blue-300 border-b-cyan-600'
                    "
                    @click="addItem(product)"
                  >
                    <div
                      class="absolute -bottom-1 left-0 w-[25px] h-[25px] font-bold"
                    >
                      #{{ pIndex + 1 }}
                    </div>
                    <div
                      v-if="product.isChecked"
                      class="absolute -top-1 -left-1 w-[25px] h-[25px] font-bold bg-green-500 text-white rounded-full flex justify-center items-center"
                    >
                      {{ product.countChecked }}
                    </div>
                    <button
                      v-if="product.isChecked"
                      class="absolute -top-1 -right-1 px-[6px] font-bold bg-red-500 text-white rounded-full hover:bg-purple-500"
                      @click.stop="removeItem(product.checkedIndex)"
                    >
                      ×
                    </button>
                    <div
                      class="flex-[0_0_50px] h-[100px] bg-cover bg-center bg-no-repeat"
                      :style="`background-image: url(${product.image})`"
                    ></div>
                    <div class="flex-1 flex flex-col p-1">
                      <div class="flex-1 font-semibold mb-2">{{ product.name }}</div>
                      <div>
                        <div class="text-blue-400 text-sm font-semibold">
                          {{ product.unit }}
                        </div>
                        <div class="text-sm text-red-500 font-semibold">
                          {{ $numberWithCommas(product.price) }}
                        </div>
                      </div>
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
import { products } from "../../assets/data";
import OrderServices from "../../firebase/order/order";
import { uid } from "uid";
import { ORDER_STATUS } from "../../constants/constants";
import vSelect from "vue-select";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    isRetail: {
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
    vSelect
  },
  watch: {
    modelValue(v) {
      this.isShow = v;
      clearInterval(this.timeInterval);
      if (v) {
        this.hasChange = false;
        const {
          id,
          items = [],
          decreaseBill = 0,
          decreaseBillUnit = 'VND',
          serviceFee = 0,
          vat = 0,
          createdAt,
        } = JSON.parse(JSON.stringify(this.isRetail ? {} : this.currentTable.bill || {}));
        this.formData = { id, items, decreaseBill, decreaseBillUnit, serviceFee, vat };
        if (createdAt) {
          this.billTime = this.$formatDate(createdAt, "DD/MM/YYYY hh:mm:ss");
        } else {
          this.timeInterval = setInterval(() => {
            this.billTime = this.$formatDate(new Date(), "DD/MM/YYYY hh:mm:ss");
          }, 100);
        }
        
        this.$nextTick(() => {
          const focusEl = document.querySelector('#search-product-keyword')
          if (focusEl && typeof focusEl.focus === 'function') {
            focusEl.focus()
          }
        })
      }
    },
  },
  computed: {
    totalItems() {
      return this.formData.items.reduce((result, item) => {
        result += this.getItemTotal(item);
        return result;
      }, 0);
    },
    summaryBill () {
      const { serviceFee = 0, vat = 0 } = this.formData;
      return this.totalItems + serviceFee + vat
    },
    decreaseBillValue () {
      const { decreaseBill = 0, decreaseBillUnit = 'VND' } = this.formData;
      return decreaseBillUnit === '%' ? (this.summaryBill * decreaseBill / 100) : decreaseBill
    },
    totalBill() {
      return this.summaryBill - this.decreaseBillValue;
    },
    computedProducts() {
      let result = JSON.parse(JSON.stringify(this.products)).map((product) => {
        const index = this.formData.items.findIndex((e) => e.id === product.id);
        const item = this.formData.items[index];
        const countChecked = item && item.quantity;
        return {
          ...product,
          countChecked,
          isChecked: !!countChecked,
          checkedIndex: index,
        };
      });
      if (this.keyword) {
        const regex = new RegExp(this.toLowerCaseNonAccentVietnamese(this.keyword), "gi");
        result = result.filter(
          (e) =>
            (e.id && String(e.id).match(regex)) || (e.name && String(this.toLowerCaseNonAccentVietnamese(e.name)).match(regex))
        );
      }
      return result;
    },
  },
  data: () => ({
    currentTab: "menu",
    timeInterval: null,
    hasChange: false,
    billTime: null,
    CheckedIcon,
    keyword: null,
    formData: {
      items: [],
      decreaseBill: 0,
      decreaseBillUnit: 'VND',
      serviceFee: 0,
      vat: 0,
    },
    products,
    isShow: false,
  }),
  methods: {
  // This function converts the string to lowercase, then perform the conversion
toLowerCaseNonAccentVietnamese(str) {
    str = str.toLowerCase();
//     We can also use this instead of from line 11 to line 17
//     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
//     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
//     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
//     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
//     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
//     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
//     str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
},
    onChangeDescreaseBillUnit () {
      this.hasChange = true
      this.formData.decreaseBill = 0
    },
    hide() {
      this.$emit("update:modelValue", false);
      this.$emit("closed");
    },
    onHidePopup() {
      if (this.hasChange) {
        this.$swal
          .fire({
            title: "Đã có vài thay đổi trên form này, bạn có chắc muốn tắt không?",
            showCancelButton: true,
            cancelButtonText: "Không",
            confirmButtonText: "Có",
          })
          .then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.hide();
            }
          });
        return;
      }
      this.hide();
    },
    saveOrderAndOpenPayment() {
      if (this.saveOrder()) {
        this.$emit("openPayment");
      }
    },
    saveOrder() {
      const Toast = this.$swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", this.$swal.stopTimer);
          toast.addEventListener("mouseleave", this.$swal.resumeTimer);
        },
      });
      if (!this.formData.items.length) {
        Toast.fire({
          icon: "warning",
          title: "Vui lòng chọn món.",
        });
        return false;
      }

      const billData = {
        ...JSON.parse(JSON.stringify(this.formData)),
        total: this.totalBill,
        tableId: this.isRetail ? "retail" : this.currentTable.id,
        id: this.formData.id || uid(8),
        status: ORDER_STATUS.pending,
      };
      if (this.formData.id) {
        if (this.hasChange) {
          OrderServices.updateOrder(this.formData.id, billData);
        }
      } else {
        OrderServices.createOrder(billData);
      }
      this.$emit("saved", billData);
      if (!this.isRetail) {
        Toast.fire({
          icon: "success",
          title: "Order thành công!",
        });
      }
      this.hide();
      return true;
    },
    getItemTotal(item) {
      return (item.price || 0) * item.quantity - (item.decrease || 0);
    },
    addItem(item) {
      let focusIndex;
      const index = this.formData.items.findIndex((e) => e.id === item.id);
      if (index === -1) {
        this.formData.items.push({
          ...JSON.parse(JSON.stringify(item)),
          quantity: 1,
          decrease: 0,
        });
        focusIndex = this.formData.items.length - 1;
      } else {
        this.formData.items[index].quantity++;
        focusIndex = index;
      }
      this.$nextTick(() => {
        if (window.innerWidth > 1024) {
          const el = document.querySelector(`#input-quantity-${focusIndex}`);
          if (el && typeof el.focus === "function") {
            el.focus();
          }
        }
      });
      this.hasChange = true;
    },
    removeItem(index) {
      this.formData.items.splice(index, 1);
      this.hasChange = true;
    },
  },
};
</script>
