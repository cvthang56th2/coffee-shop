import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // <---

import VueSweetAlert from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import { formatDate, formatCurrency, numberWithCommas } from './utils/utils'
import  VueHtmlToPaper from './plugins/VueHtmlToPaper'

const app = createApp(App)
app.config.globalProperties.$formatDate = formatDate
app.config.globalProperties.$formatCurrency = formatCurrency
app.config.globalProperties.$numberWithCommas = numberWithCommas

app
.use(VueHtmlToPaper)
.use(VueSweetAlert)
.use(router)
.mount('#app')