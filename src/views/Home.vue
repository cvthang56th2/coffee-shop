<script setup>
import PopupOrder from '../components/Order/PopupOrder.vue';
import NoCustomerImg from '../assets/images/icons8-restaurant-noCustomer.png'
import HaveCustomerImg from '../assets/images/icons8-restaurant-table.png'
import CheckedIcon from "../assets/images/success-green-check-mark-icon.png";
import { ref, computed } from 'vue'

const listTables = ref([1,2,3].reduce((resultArr, group) => {
  return [
    ...resultArr,
    ...([...Array(24).keys()]).map(e => ({
      id: `group-${group}-table-${e}`,
      name: `B-${e}`,
      group
    }))
  ]
}, []))
const groupedTables = computed(() => {
  const groupedTablesObject = listTables.value.reduce((resultObj, table) => {
    resultObj[table.group] = resultObj[table.group] || []
    resultObj[table.group].push(table)
    return resultObj
  }, {})
  return Object.keys(groupedTablesObject).map(groupId => ({
    groupId,
    tables: groupedTablesObject[groupId]
  }))
})
const isShowPopupOrder = ref(false)
const selectedTable = ref(null)

const openPopupOrder = (table) => {
  selectedTable.value = table
  isShowPopupOrder.value = true
}
</script>
<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between pb-2 border-b-2 flex-0 px-4">
      <div class="flex items-center">
        <div class="mr-10 text-3xl">
          Bàn đang chọn: <span class="font-bold">{{ selectedTable && selectedTable.name || '-' }}</span>
        </div>
        <button :disabled="!selectedTable" :class="selectedTable ? '' : 'opacity-30'" class="w-[70px] h-[70px] flex items-center justify-center text-white bg-green-500 font-bold rounded-md mr-4" @click="openPopupOrder(selectedTable)">
          Chọn món
        </button>
        <button :disabled="!selectedTable" :class="selectedTable ? '' : 'opacity-30'" class="w-[70px] h-[70px] flex items-center justify-center text-white bg-purple-500 font-bold rounded-md mr-4">
          Chuyển bàn
        </button>
        <button :disabled="!selectedTable" :class="selectedTable ? '' : 'opacity-30'" class="w-[70px] h-[70px] flex items-center justify-center text-white bg-pink-500 font-bold rounded-md mr-4">
          Thanh toán
        </button>
      </div>
      <input type="text" placeholder="Nhập mã hoặc tên bàn..." class="w-full xl:w-1/3 border-[1px] border-blue-400 rounded-sm p-2">
    </div>
    <div class="flex-1 overflow-y-auto p-1">
      <div v-for="(group, gIndex) in groupedTables" class="p-2 border-2 mb-4 rounded-md shadow-md" :key="`group-${gIndex}`">
        <div class="text-2xl font-bold mb-2 text-blue-500 bg-white px-2 py-1 text-center underline">
          Khu {{ gIndex + 1 }}
        </div>
        <div class="flex flex-wrap -mx-1">
          <div v-for="(table, tIndex) in group.tables" class="w-1/2 md:w-1/4 xl:w-1/12 px-1 mb-1" :key="`table-${tIndex}`">
            <div class="border-[1px] rounded-md bg-white cursor-pointer hover:shadow-md hover:bg-cyan-50 relative select-none" @click="selectedTable = table" @dblclick="openPopupOrder(table)" :class="selectedTable && selectedTable.id === table.id ? 'border-green-400' : 'border-purple-300'">
              <img
                v-if="selectedTable && selectedTable.id === table.id"
                :src="CheckedIcon"
                alt=""
                class="absolute -top-1 -left-1 bg-white rounded-full"
                width="20"
              />
              <div :class="tIndex % 2 ? 'bg-blue-400' : 'bg-gray-300'" class="min-h-[30px] text-white text-sm flex items-center justify-end px-1">
                {{ tIndex % 2 ? new Date().toISOString().slice(0, 10) : '' }}
              </div>
              <div class="px-2 py-1">
                <div class="text-xl font-semibold text-blue-500">
                  B.{{ tIndex }}
                </div>
                <div class="flex items-end justify-between">
                  <div class="text-red-500 font-semibold">
                    {{ tIndex % 2 ? '100.000' : '' }}
                  </div>
                  <img :src="tIndex % 2 ? HaveCustomerImg : NoCustomerImg" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-right py-2 border-t-2 flex-0 px-4 italic border-yellow-500">
      *Nhấp đôi chuột để chọn món
    </div>
    <PopupOrder v-model="isShowPopupOrder" />
  </div>
</template>