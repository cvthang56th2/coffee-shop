<template>
  <Popup
    v-model="isShow"
    @hide="hide"
    width="500px"
    title="Chuyển bàn"
    :save="changeTable"
    :closeOnSave="false"
  >
    <div class="p-4 text-lg">
      <div class="flex mb-3 items-center">
        <div class="pr-4 w-1/3 text-right font-medium">Từ bàn:</div>
        <div class="w-2/3 font-bold px-2">khu {{ currentTable.group }} - {{ currentTable.name }}</div>
      </div>
      <div class="flex items-center">
        <div class="pr-4 w-1/3 text-right font-medium">Tới bàn:</div>
        <div class="w-2/3">
          <v-select class="font-bold" v-model="changeToTable" :options="computedEmptyTables" :reduce="country => country.id" label="formattedName" appendToBody placeholder="Chọn bàn..." :clearable="false"></v-select>
        </div>
      </div>
    </div>
  </Popup>
</template>

<script>
import Popup from "./Popup.vue";
import vSelect from "vue-select";
import OrderServices from '../firebase/order/order'

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
    emptyTables: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    Popup,
    vSelect
  },
  watch: {
    modelValue(v) {
      this.isShow = v
      this.changeToTable = null
    },
  },
  computed: {
    computedEmptyTables () {
      return this.emptyTables.map(e => ({
        ...e,
        formattedName: `khu ${ e.group } - bàn ${ e.name }`
      }))
    }
  },
  data: () => ({
    isShow: false,
    changeToTable: null
  }),
  methods: {
    hide () {
      this.$emit("update:modelValue", false);
    },
    changeTable () {
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
      if (!this.changeToTable) {
        Toast.fire({
          icon: 'warning',
          title: 'Chưa chọn bàn muốn chuyển tới'
        })
        return
      }
      OrderServices.updateOrder(this.currentTable.bill.id, {
        tableId: this.changeToTable
      })
      this.$emit('saved', this.changeToTable)

      Toast.fire({
        icon: 'success',
        title: 'Chuyển bàn thành công!'
      })
      this.hide();
    }
  },
};
</script>

