<script setup>
import Favicon from './assets/images/favicon.png'
</script>

<template>
  <div class="h-screen flex flex-col">
    <header class="border-b-2 mb-2 flex-0">
      <div>
        <ul class="flex items-center py-2">
          <li class="px-2 font-semibold cursor-pointer text-amber-600 hover:text-orange-500 border-r-2 mr-2">
            <a href="#">
              <div class="flex items-center">
                <img :src="Favicon" alt="icon" width="40" class="mr-2">
                Trang chủ
              </div>
            </a>
          </li>
          <li class="px-2 font-semibold cursor-pointer text-amber-600 hover:text-orange-500">
            <a href="#">Quản lý</a>
          </li>
        </ul>
      </div>
    </header>
    <main class="p-1 flex-1 overflow-y-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
.border-1px {
  border-width: 1px;
}
</style>