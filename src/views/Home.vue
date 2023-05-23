<script setup>
import PopupOrder from "../components/Order/PopupOrder.vue";
import PopupChangeTable from "../components/PopupChangeTable.vue";
import PopupPayment from "../components/PopupPayment.vue";
import NoCustomerImg from "../assets/images/icons8-restaurant-noCustomer.png";
import HaveCustomerImg from "../assets/images/icons8-restaurant-table.png";
import CheckedIcon from "../assets/images/success-green-check-mark-icon.png";
import { ref, computed } from "vue";
import { listTables as list } from '../assets/data'

const keyword = ref(null)
let i = 0
const listTables = ref(JSON.parse(JSON.stringify(list)))
const listTablesEmpty = computed(() => listTables.value.filter(e => !e.bill))
const computedListTables = computed(() => {
  let result = JSON.parse(JSON.stringify(listTables.value))
  if (keyword.value) {
    const regex = new RegExp(keyword.value, "gi");
    result = result.filter(
      (e) =>
        (e.id && String(e.id).match(regex)) || (e.name && String(e.name).match(regex))
    );
  }
  return result
})
const groupedTables = computed(() => {
  const groupedTablesObject = computedListTables.value.reduce((resultObj, table) => {
    resultObj[table.group] = resultObj[table.group] || [];
    resultObj[table.group].push(table);
    return resultObj;
  }, {});
  return Object.keys(groupedTablesObject).map((groupId) => ({
    groupId,
    tables: groupedTablesObject[groupId],
  }));
});
const statisticCurrent = computed(() => {
  const totalEmpty = listTablesEmpty.value.length
  const totalHaveCustomer = listTables.value.length - totalEmpty
  return {
    totalHaveCustomer,
    totalEmpty,
  }
})
const isShowPopupOrder = ref(false);
const isShowPopupChangeTable = ref(false);
const isShowPopupPayment = ref(false);
const selectedTable = ref(null);

const openPopupOrder = (table) => {
  selectedTable.value = table;
  isShowPopupOrder.value = true;
};

const onOrderSaved = (bill) => {
  selectedTable.value.bill = bill
}

const onChangeTable = (toTableId) => {
  const tableIndex = listTables.value.findIndex(e => e.id === toTableId)
  if (tableIndex !== -1) {
    listTables.value[tableIndex].bill = selectedTable.value.bill
    delete selectedTable.value.bill
    selectedTable.value = listTables.value[tableIndex]
  }
}

const onSavePayment = () => {
}
</script>
<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-wrap items-center justify-between pb-2 border-b-2 flex-0 px-4">
      <div class="w-full xl:w-2/3 mb-2 xl:mb-0 flex justify-center xl:justify-start items-center">
        <div class="mr-10 text-3xl">
          Bàn đang chọn:
          <span class="font-bold">{{
            (selectedTable && selectedTable.name) || "-"
          }}</span>
        </div>
        <button
          :disabled="!selectedTable"
          :class="!selectedTable ? 'opacity-30' : ''"
          class="w-[70px] h-[70px] flex items-center justify-center text-white bg-green-500 font-bold rounded-md mr-4"
          @click="openPopupOrder(selectedTable)"
        >
          Chọn món
        </button>
        <button
          :disabled="!selectedTable || (selectedTable && !selectedTable.bill)"
          :class="!selectedTable || (selectedTable && !selectedTable.bill) ? 'opacity-30' : ''"
          class="w-[70px] h-[70px] flex items-center justify-center text-white bg-purple-500 font-bold rounded-md mr-4"
          @click="isShowPopupChangeTable = true"
        >
          Chuyển bàn
        </button>
        <button
          :disabled="!selectedTable || (selectedTable && !selectedTable.bill)"
          :class="!selectedTable || (selectedTable && !selectedTable.bill) ? 'opacity-30' : ''"
          class="w-[70px] h-[70px] flex items-center justify-center text-white bg-pink-500 font-bold rounded-md mr-4"
          @click="isShowPopupPayment = true"
        >
          Thanh toán
        </button>
      </div>
      <input
        v-model="keyword"
        type="text"
        placeholder="Nhập mã hoặc tên bàn..."
        class="w-full xl:w-1/3 border-1px border-blue-400 rounded-sm p-2"
      />
    </div>
    <div class="flex-1 overflow-y-auto p-1">
      <div
        v-for="(group, gIndex) in groupedTables"
        class="p-2 border-2 mb-4 rounded-md shadow-md"
        :key="`group-${gIndex}`"
      >
        <div
          class="text-2xl font-bold mb-2 text-blue-500 bg-white px-2 py-1 text-center underline"
        >
          Khu {{ gIndex + 1 }}
        </div>
        <div class="flex flex-wrap -mx-1">
          <div
            v-for="(table, tIndex) in group.tables"
            class="w-1/2 md:w-1/4 lg:w-[calc(100%/8)] px-1 mb-1"
            :key="`table-${tIndex}`"
          >
            <div
              class="border-[3px] rounded-md"
              :class="
                selectedTable && selectedTable.id === table.id
                  ? 'border-green-400'
                  : 'border-white'
              "
            >
              <div
                class="border-1px rounded-md bg-white cursor-pointer hover:shadow-md hover:bg-cyan-50 relative select-none"
                @click="selectedTable = table"
                @dblclick="openPopupOrder(table)"
                :class="
                  selectedTable && selectedTable.id === table.id
                    ? 'border-green-400'
                    : 'border-purple-300'
                "
              >
                <img
                  v-if="selectedTable && selectedTable.id === table.id"
                  :src="CheckedIcon"
                  alt=""
                  class="absolute -top-1 -left-1 bg-white rounded-full"
                  width="20"
                />
                <div
                  :class="table.bill ? 'bg-blue-400' : 'bg-gray-300'"
                  class="min-h-[30px] text-white text-sm flex items-center justify-end px-1"
                >
                  {{ table.bill ? $formatDate(new Date()) : "" }}
                </div>
                <div class="px-2 py-1">
                  <div class="text-xl font-semibold text-blue-500">{{ table.name }}</div>
                  <div class="flex items-end justify-between">
                    <div class="text-red-500 font-semibold">
                      {{ table.bill ? $numberWithCommas(table.bill.total || 0) : '' }}
                    </div>
                    <img :src="table.bill ? HaveCustomerImg : NoCustomerImg" alt="" width="36" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between py-2 border-t-2 flex-0 px-4 border-yellow-500">
      <div class="flex mr-2">
        <div class="flex items-center mr-4">
          <div class="h-full w-[40px] bg-blue-400 mr-2"></div>
          Bàn có khách:<span class="font-bold">{{ statisticCurrent.totalHaveCustomer }}</span>
        </div>
        <div class="flex items-center">
          <div class="h-full w-[40px] bg-gray-300 mr-2"></div>
          Bàn trống: <span class="font-bold">{{ statisticCurrent.totalEmpty }}</span>
        </div>
      </div>
      <div class="text-right italic">
        *Nhấp đôi chuột để chọn món
      </div>
    </div>
    <PopupOrder v-model="isShowPopupOrder" :currentTable="selectedTable || {}" @saved="onOrderSaved" />
    <PopupChangeTable v-model="isShowPopupChangeTable" :currentTable="selectedTable || {}" :emptyTables="listTablesEmpty" @saved="onChangeTable" />
    <PopupPayment v-model="isShowPopupPayment" :currentTable="selectedTable || {}" @saved="onSavePayment" />
  </div>
</template>
