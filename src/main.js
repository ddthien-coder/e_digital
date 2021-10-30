import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import 'element-plus/dist/index.css'

// library ui
import ElementPlus from 'element-plus';

// change en languages
import enLang from 'element-plus/lib/locale/lang/en'

createApp(App)
.use(store)
.use(router)
.use(ElementPlus, { locale: enLang})
.mount('#app')
