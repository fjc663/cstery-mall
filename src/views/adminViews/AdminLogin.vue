<script setup lang="ts">
import useAdmin from '@/composables/useAdmin';
import { ref } from 'vue';
import type { iadmin } from '@/composables/interfaceType/adminInterface';
import { useRouter } from 'vue-router';

// 登录表单
const loginForm = ref<iadmin>({
    username: '',
    password: '',
});

// 清空登录注册表单
const cleanForm = () => {
    loginForm.value = {
        username: '',
        password: '',
    };
}

const { adminLogin } = useAdmin()

const router = useRouter();
const query = router.currentRoute.value.query;

// 点击登录按钮触发
const login = async () => {
    // 发送登录请求
    const code: number = await adminLogin(loginForm.value);

    if (code === 1) {
        const redirect: any = query.redirect || '/admin';
        router.push(redirect);

        cleanForm
    }
};


</script>

<template>
    <div class="body">
        <form class="box">
            <h1>登录</h1>
            <input type="text" v-model="loginForm.username" placeholder="请输入用户名">
            <input type="password" v-model="loginForm.password" placeholder="请输入密码">
            <input type="button" value="登录" @click="login">
        </form>
    </div>
</template>

<style scoped>
.body {
    width: 100%;
    height: 100vh;

    justify-content: center;
    align-items: center;
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    background-image: url("@/assets/images/background.jpg");
    color: #a0a5a8;

}

/* Now we will prepare our box. */
.box {
    border-radius: 50px;
    width: 350px;
    padding: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #34495E;
    text-align: center;
}

/* With the box finished we can continue with the "Login" text. */
.box h1 {
    color: white;
    text-transform: uppercase;
    font-weight: 500;
}

/* Now we need to configure our inputs. */
.box input[type="text"],
.box input[type="password"] {
    background: none;
    display: block;
    margin: 20px auto;
    text-align: center;
    border: 2px solid #3498db;
    padding: 14px 10px;
    width: 200px;
    outline: none;
    color: white;
    border-radius: 24px;
    transition: 0.25s;
}

.box input[type="text"]:focus,
.box input[type="password"]:focus {
    width: 280px;
    border-color: #2ecc71;
}

.box input[type="button"] {

    background: none;
    display: block;
    margin: 20px auto;
    text-align: center;
    border: 2px solid #2ECC71;
    padding: 14px 40px;
    outline: none;
    color: white;
    border-radius: 24px;
    transition: 1s;
    cursor: pointer;
}

.box input[type="button"]:hover {
    background: #2ECC71;
}
</style>