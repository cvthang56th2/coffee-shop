<script setup>
import { nextTick, ref, watch, onMounted } from 'vue';
import { numberWithCommas, parseToNumber } from '../utils/utils'

const props = defineProps({
  modelValue: {
    type: [Number, String, null]
  }
})
const emit = defineEmits(['update:modelValue'])
const inputData = ref(null)
watch(() => props.modelValue, (v) => {
  inputData.value = numberWithCommas(v)
})
watch(inputData, (v) => {
  nextTick(() => {
    inputData.value = numberWithCommas(v)
    emit('update:modelValue', parseToNumber(inputData.value))
  })
})
onMounted(() => {
  inputData.value = numberWithCommas(props.modelValue)
})
</script>
<template>
  <input
    v-model="inputData"
    type="text"
  />
</template>