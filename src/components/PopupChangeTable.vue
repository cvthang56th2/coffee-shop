<template>
  <Popup
    v-model="isShow"
    @hide="hide"
    width="500px"
    title="Chuyển bàn"
    :save="changeTable"
    :closeOnSave="false"
  >
    <div class="p-4">
      <div class="flex mb-3">
        <div class="pr-4 w-1/3 font-semibold">Từ:</div>
        <div class="w-2/3 font-bold px-2">bàn {{ currentTable.name }} - khu {{ currentTable.group }}</div>
      </div>
      <div class="flex">
        <div class="pr-4 w-1/3 font-semibold">Tới:</div>
        <div class="w-2/3">
          <v-select class="font-bold" v-model="changeToTable" :options="computedEmptyTables" :reduce="country => country.id" label="formattedName" appendToBody placeholder="Chọn bàn..." :clearable="false"></v-select>
        </div>
      </div>
    </div>
  </Popup>
</template>

<style>
@import "vue-select/dist/vue-select.css";
</style>

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
        formattedName: `bàn ${ e.name } - khu ${ e.group }`
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

