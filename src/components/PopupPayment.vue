<template>
  <Popup v-model="isShow" @hide="hide" width="700px" title="Thanh toán" :hideXbutton="isRetail" >
    <div class="p-4">
      <div class="flex flex-wrap mb-4 pb-2 flex-0 border-b-2">
        <div class="w-full lg:w-1/2 flex px-2 mb-2">
          <div class="flex-[0_0_100px] text-right pr-2 font-semibold">
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
          <div class="flex-[0_0_100px] text-right pr-2 font-semibold">
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
          <div class="flex-[0_0_100px] text-right pr-2 font-semibold">
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
        <div class="w-full lg:w-1/2 flex px-2 mb-2">
          <div class="flex-[0_0_100px] text-right pr-2 font-semibold">
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
        <div class="w-full lg:w-1/2 flex px-2">
          <div class="flex-[0_0_100px] text-right pr-2 font-semibold">
            Khách đưa
          </div>
          <div>
            <InputMoney
              id="clientMoney"
              v-model="formData.clientMoney"
              @input="hasChange = true"
              class="bg-white rounded-sm border-1px w-full outline-none px-1"
            />
          </div>
        </div>
        <div class="w-full lg:w-1/2 flex px-2">
          <div class="flex-[0_0_100px] text-right pr-2 font-semibold">
            Trả lại
          </div>
          <div>
            <input
              :value="$numberWithCommas(refundMoney)"
              class="bg-gray-300 rounded-sm border-1px w-full outline-none px-1"
              disabled
            />
          </div>
        </div>
      </div>
      <div id="bill-html">
        <div class="text-center font-bold text-2xl mb-2">Ngâu Coffee</div>
        <div class="text-center italic">Address</div>
        <div class="text-center italic">Điện thoại: 0123456789</div>
        <div class="text-center font-bold text-xl mt-2">PHIẾU THANH TOÁN</div>
        <div class="flex mt-4">
          <div class="w-1-2 mr-2">N.viên: admin</div>
          <div class="w-1-2 ml-2 uppercase">HĐ: {{ currentTable.bill.id }}</div>
        </div>
        <div class="flex">
          <div class="w-1-2 mr-2">Giờ vào: {{ $formatDate(currentTable.bill.createdAt) }}</div>
          <div class="w-1-2 ml-2">Giờ ra: {{ $formatDate(new Date()) }}</div>
        </div>
        <div class="flex font-bold">
          <div class="w-1-2 mr-2">Khu vực: {{ currentTable.group }}</div>
          <div class="w-1-2 ml-2">Bàn: {{ isRetail ? 'Bán lẻ' : currentTable.name }}</div>
        </div>
        <div class="flex mt-2">
          <div class="w-4-12 px-2 py-1 text-center font-bold border-1px border-black">Món</div>
          <div class="w-2-12 px-2 py-1 text-center font-bold border-1px border-black">S.L</div>
          <div class="w-2-12 px-2 py-1 text-center font-bold border-1px border-black">
            Đ.Giá
          </div>
          <div class="w-2-12 px-2 py-1 text-center font-bold border-1px border-black">CK</div>
          <div class="w-2-12 px-2 py-1 text-center font-bold border-1px border-black">
            T.Tiền
          </div>
        </div>
        <div
          v-for="(item, iIndex) in currentTable.bill.items"
          class="flex"
          :key="`bill-order-item-${iIndex}`"
        >
          <div class="w-4-12 px-2 py-1 border-1px border-black">{{ item.name }}</div>
          <div class="w-2-12 px-2 py-1 text-right border-1px border-black">
            {{ item.quantity }}
          </div>
          <div class="w-2-12 px-2 py-1 text-right border-1px border-black">
            {{ $numberWithCommas(item.price) }}
          </div>
          <div class="w-2-12 px-2 py-1 text-right border-1px border-black">
            {{ item.decrease }}
          </div>
          <div class="w-2-12 px-2 py-1 text-right border-1px border-black">
            {{ $numberWithCommas(getItemTotal(item)) }}
          </div>
        </div>
        <div>
          <div class="flex mt-4">
            <div class="w-1-2 mr-2">Phí dịch vụ: {{ $numberWithCommas(formData.serviceFee) }}</div>
            <div class="w-1-2 ml-2">
              VAT: {{ $numberWithCommas(formData.vat) }}
            </div>
          </div>
          <div class="flex mt-2">
            <div class="w-1-2 mr-2">Giảm giá:
              <template v-if="formData.decreaseBill">
                - {{ $numberWithCommas(decreaseBillValue) }} <template v-if="formData.decreaseBillUnit !== 'VND'">({{ formData.decreaseBill }} {{ formData.decreaseBillUnit }})</template>
              </template>
              <span v-else>0</span>
            </div>
          </div>
          <div class="flex mt-2">
            <div class="font-bold">
              Thành tiền: {{ $numberWithCommas(totalBill) }} <span class="italic">VNĐ</span>
            </div>
          </div>
          <div class="flex mt-2">
            <div class="w-1-2 mr-2">Khách đưa: {{ $numberWithCommas(formData.clientMoney) }} <span class="italic">VNĐ</span></div>
            <div class="w-1-2 ml-2">
              Trả lại: {{ $numberWithCommas(refundMoney) }} <span class="italic">VNĐ</span>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-4">
          <div class="w-5-6 border-1px border-black"></div>
        </div>
        <div class="pt-1 text-center italic">Cảm ơn quý khách, hẹn gặp lại!</div>
      </div>
    </div>
    <template v-slot:buttons>
      <div class="flex justify-end p-3">
        <button
          v-if="isRetail"
          class="bg-red-500 w-1/3 text-white hover:bg-red-700 background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 rounded-sm mr-2"
          type="button"
          @click="cancelOrder"
        >
          Hủy
        </button>
        <button
          class="bg-blue-500 text-white hover:bg-blue-700 background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 rounded-sm mr-2"
          type="button"
          :class="isRetail ? 'ml-2 w-1/3' : 'w-1/2'"
          @click="printBill"
        >
          In hoá đơn
        </button>
        <button
          class="bg-green-500 w-1/2 text-white hover:bg-green-700 background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 rounded-sm ml-2"
          type="button"
          :class="isRetail ? 'w-1/3' : 'w-1/2'"
          @click="savePayment"
        >
          Xác nhận
        </button>
      </div>
    </template>
  </Popup>
</template>

<script>
import Popup from "./Popup.vue";
import OrderServices from '../firebase/order/order'
import { ORDER_STATUS } from '../constants/constants'
import InputMoney from "./InputMoney.vue";
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
      if (v) {
        this.hasChange = false
        const { serviceFee = 0, vat = 0, decreaseBill = 0, decreaseBillUnit = 'VND', clientMoney = 0 } = this.currentTable.bill || {};
        this.formData = { serviceFee, vat, decreaseBill, decreaseBillUnit, clientMoney }
        this.$nextTick(() => {
          const clientInputEl = document.querySelector('#clientMoney')
          if (clientInputEl && typeof clientInputEl.focus === 'function') {
            clientInputEl.focus()
          }
        })
      }
    },
  },
  computed: {
    totalItems () {
      return this.currentTable.bill.items.reduce((result, item) => {
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
    refundMoney () {
      if (this.formData.clientMoney >= this.totalBill) {
        return this.formData.clientMoney - this.totalBill
      }
      return 0
    }
  },
  data: () => ({
    hasChange: false,
    isShow: false,
    formData: {}
  }),
  methods: {
    onChangeDescreaseBillUnit () {
      this.hasChange = true
      this.formData.decreaseBill = 0
    },
    hide() {
      this.$emit("update:modelValue", false);
    },
    printBill() {
      this.$htmlToPaper("bill-html");
    },
    getItemTotal(item) {
      return (item.price || 0) * item.quantity - (item.decrease || 0);
    },
    savePayment () {
      const Toast = this.$swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', this.$swal.stopTimer)
          toast.addEventListener('mouseleave', this.$swal.resumeTimer)
        }
      })
      let updateData = {
        status: ORDER_STATUS.success
      }
      if (this.hasChange) {
        updateData = {
          ...updateData,
          ...this.formData
        }
      }
      OrderServices.updateOrder(this.currentTable.bill.id, updateData)
      Toast.fire({
        icon: 'success',
        title: 'Thanh toán thành công!'
      })
      // call api
      this.$emit('saved')
      this.hide()
    },
    cancelOrder() {
      if (this.currentTable.bill?.id) {
        this.$swal.fire({
          title: 'Bạn có chắc muốn hủy bill này không?',
          showCancelButton: true,
          cancelButtonText: 'Không',
          confirmButtonText: 'Có',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
          const Toast = this.$swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            }
          })
            OrderServices.updateOrder(this.currentTable.bill.id, {
              status: ORDER_STATUS.cancel
            })
            Toast.fire({
              icon: 'success',
              title: 'Hủy bill thành công!'
            })
            this.hide()
          }
        })
      }
    }
  },
};
</script>
<style scoped>
@import url('../assets/print.css');
</style>
