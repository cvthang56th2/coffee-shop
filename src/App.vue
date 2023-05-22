<script setup>
</script>

<template>
  <div class="h-screen flex flex-col">
    <header class="border-b-2 mb-2 flex-0">
      <div>
        <ul class="flex">
          <li class="p-2 mr-1">Trang chủ</li>
          <li class="p-2">Quản lý</li>
        </ul>
      </div>
    </header>
    <main class="p-1 flex-1 overflow-y-auto">
      <router-view></router-view>
    </main>
  </div>
</template>
