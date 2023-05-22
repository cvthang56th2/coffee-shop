<script setup>
import NoCustomerImg from '../assets/images/icons8-restaurant-noCustomer.png'
import HaveCustomerImg from '../assets/images/icons8-restaurant-table.png'
import { ref } from 'vue'

const listTables = ref(([...Array(24).keys()]))
const openDialogOrder = () => {
  console.log(123)
}
</script>
<template>
  <div class="flex flex-col h-full">
    <div class="flex pb-2 border-b-2 flex-0">
      <input type="text" placeholder="Nhập mã hoặc tên bàn..." class="w-full xl:w-1/2 border-[1px] border-blue-400 rounded-sm p-2">
    </div>
    <div class="flex-1 overflow-y-auto p-1">
      <div v-for="area in [1, 2, 3]" class="p-2 border-2 mb-4 rounded-md shadow-md" :key="`area-${area}`">
        <div class="text-2xl font-bold mb-2 text-blue-500 bg-white px-2 py-1 text-center underline">
          Khu {{ area }}
        </div>
        <div class="flex flex-wrap -mx-1">
          <div v-for="(item, index) in listTables" class="w-1/2 md:w-1/4 xl:w-1/12 px-1 mb-1" :key="`table-${index}`">
            <div class="border-[1px] rounded-md border-purple-300 bg-white cursor-pointer hover:shadow-md hover:bg-cyan-50" @click="openDialogOrder">
              <div :class="index % 2 ? 'bg-blue-400' : 'bg-gray-300'" class="min-h-[30px] text-white text-sm flex items-center justify-end px-1">
                {{ index % 2 ? new Date().toISOString().slice(0, 10) : '' }}
              </div>
              <div class="px-2 py-1">
                <div class="text-xl font-semibold text-blue-500">
                  B.{{ item }}
                </div>
                <div class="flex items-end justify-between">
                  <div class="text-red-500 font-semibold">
                    {{ index % 2 ? '100.000' : '' }}
                  </div>
                  <img :src="index % 2 ? HaveCustomerImg : NoCustomerImg" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-0 border-t-2 py-2 px-2">
      Công cụ
    </div>
  </div>
</template>