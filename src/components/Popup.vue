<template>
  <div>
    <div v-if="modelValue" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
      <div class="`relative my-6 mx-auto" :style="`width: ${width}`">
        <!--content-->
        <div class="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <!--header-->
          <div class="p-4 pr-8 border-b border-solid border-slate-200 rounded-t relative">
            <slot name="title">
              <h4 class="text-2xl font-semibold">
                {{ title }}
              </h4>
            </slot>
            <button class="text-5xl font-bold text-red-500 hover:text-red-300 absolute top-[-16px] right-0" @click="hide()">
              ×
            </button>
          </div>
          <!--body-->
          <div class="relative flex-auto max-h-[95vh] overflow-y-auto">
            <slot />
          </div>
          <!--footer-->
          <div class="border-t-2 text-center rounded-b">
            <button class="text-green-500 hover:bg-green-500 hover:text-white background-transparent font-bold uppercase py-3 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 w-full rounded-b" type="button" @click="onClickSave()">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="modelValue" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script>
export default {
  name: "large-modal",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '80%'
    },
    title: {
      type: String,
      default: 'Modal Title'
    },
    save: {
      type: Function,
      default: () => (() => {})
    },
    closeOnSave: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    hide() {
      this.$emit('hide')
    },
    onClickSave () {
      if (typeof this.save === 'function') {
        this.save()
      }
      if (this.closeOnSave) {
        this.hide()
      }
    }
  }
}
</script>