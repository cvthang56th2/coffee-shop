<template>
  <Popup
    v-model="isShow"
    @hide="hide"
    width="500px"
    title="Thanh toán"
  >
    <div class="p-4">
      Bàn {{ currentTable.name }}
    </div>
    <template v-slot:buttons>
      <div class="flex justify-end p-3">
        <button class="bg-blue-500 w-1/2 text-white hover:bg-blue-700 background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 rounded-sm mr-2" type="button">
          In hoá đơn
        </button>
        <button class="bg-green-500 w-1/2 text-white hover:bg-green-700 background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 rounded-sm ml-2" type="button">
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
      this.isShow = v
    },
  },
  computed: {
  },
  data: () => ({
    isShow: false
  }),
  methods: {
    hide () {
      this.$emit("update:modelValue", false);
    },
  },
};
</script>

