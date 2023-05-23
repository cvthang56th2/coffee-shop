<script setup>
import Favicon from './assets/images/favicon.png'
import { ref, inject, onMounted } from 'vue'
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const swal = inject('$swal')
const isLogin = ref(false)
const formData = ref({
  userName: 'admin'
})
const login = () => {
  const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', swal.stopTimer)
      toast.addEventListener('mouseleave', swal.resumeTimer)
    }
  })
  const { userName, password } = formData.value
  if (userName === 'admin' && password === '180599') {
    isLogin.value = true
    cookies.set('__IS_LOGIN__', 'YESSSSSSSSSSSSSSSSSS_PLEASEEEEEEE')
    Toast.fire({
      icon: 'success',
      title: 'Đăng nhập thành công!'
    })
  } else {
    Toast.fire({
      icon: 'error',
      title: 'Sai mật khẩu'
    })
  }
}
const logout = () => {
  swal.fire({
    title: 'Bạn có chắc muốn khóa máy?',
    showCancelButton: true,
    cancelButtonText: 'Không',
    confirmButtonText: 'Có',
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      isLogin.value = false
      cookies.set('__IS_LOGIN__', null)
    }
  })
}
onMounted(() => {
  if (cookies.get('__IS_LOGIN__') === 'YESSSSSSSSSSSSSSSSSS_PLEASEEEEEEE') {
    isLogin.value = true
  }
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <template v-if="isLogin">
      <header class="border-b-2 mb-2 flex-0 relative">
        <div class="flex justify-center text-3xl py-2 font-bold text-amber-600">
          <img :src="Favicon" alt="icon" width="40" class="mr-2">
          Coffee Shop
        </div>
        <button class="absolute top-2 right-4 bg-amber-400 hover:bg-amber-600 ease-linear transition-all duration-150 text-white font-semibold px-4 py-2" @click="logout">
          Khóa máy
        </button>
        <!-- <div>
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
        </div> -->
      </header>
      <main class="p-1 flex-1 overflow-y-auto">
        <router-view></router-view>
      </main>
    </template>
    
    <div v-else class="px-6 h-full text-gray-800">
      <div
        class="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6"
      >
        <div
          class="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0 relative"
        >
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            class="w-full"
            alt="Sample image"
          />
        </div>
        <div class="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
          <h1 class="text-3xl mb-5 text-center">Đăng nhập vào trang Quản lý</h1>
          <form @submit.stop="login">
            <!-- Username input -->
            <div class="mb-6">
              <input
                v-model="formData.userName"
                disabled
                type="text"
                class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-gray-100 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Tài khoản"
              />
            </div>

            <!-- Password input -->
            <div class="mb-6">
              <input
                v-model="formData.password"
                type="password"
                class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Nhập mật khẩu..."
              />
            </div>

            <div class="text-center">
              <button
                type="submit"
                class="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                @click.prevent="login"
              >
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.border-1px {
  border-width: 1px;
}
</style>