<template>
  <Popup
    v-model="isShow"
    @hide="hide"
    width="500px"
    title="Chuyển bàn"
    :save="changeTable"
  >
    <div class="p-4">
      <div class="flex mb-3">
        <div class="pr-4 w-1/3 font-semibold">Từ bàn:</div>
        <div class="w-2/3">{{ currentTable.name }}</div>
      </div>
      <div class="flex">
        <div class="pr-4 w-1/3 font-semibold">Tới bàn:</div>
        <div class="w-2/3">
          <v-select :options="[1,2,3]" label="title" appendToBody></v-select>
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
    vSelect
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
    changeTable () {
    }
  },
};
</script>

