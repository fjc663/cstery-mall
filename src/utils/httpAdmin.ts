// 封装axiios
import axios from "axios"
import { useAdminInfoStore } from "@/stores/adminInfoStore";
import { ElMessage } from "element-plus";
import router from "@/router";

const httpAdminInstance = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

// 拦截器

// axios请求拦截器
httpAdminInstance.interceptors.request.use(config => {
    const adminInfoStore = useAdminInfoStore();
    config.headers.token = adminInfoStore.token; // 配置token

    return config
}, e => Promise.reject(e))

// axios响应拦截器
httpAdminInstance.interceptors.response.use(res => res.data, e => {
    if (e.response.status === 401) {
        ElMessage.warning("请先登录");

        const adminInfoStore = useAdminInfoStore();
        adminInfoStore.removeTokenAndUsername();  // 清除token

        router.push({path: '/adminLogin', query: {redirect: router.currentRoute.value.fullPath}})  // 登录完返回登录前页面
    }

    return Promise.reject(e)
})

export default httpAdminInstance