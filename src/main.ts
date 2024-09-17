import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //引入持久化插件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Lazyload from "vue3-lazyload";  //引入图片懒加载插件

import App from './App.vue'
import router from './router'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

//注册插件
app.use(Lazyload, {
    loading: "http://localhost:8080/loading.gif",  //指定加载中的图像
    error: "http://localhost:8080/err.png",  //指定加载失败的图像
 });

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
    locale: zhCn
})

app.mount('#app')
