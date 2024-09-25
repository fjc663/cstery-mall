<script setup lang="ts">
import { ref } from 'vue';
import type{ form } from '@/composables/interfaceType'
import { ElMessage } from 'element-plus';
import router from '@/router';
import { useUser } from '@/composables/useUser';

// 判断当前是登录还是注册
const isLogin = ref<boolean>(true);

// 跳转到该页面时,判断用户点击登录按钮还是注册按钮
const query = router.currentRoute.value.query;
const isLoginNum: any = query.isLogin;
if (isLoginNum == 0) {
    isLogin.value = false;
}

// 登录和注册表单
const loginRegisterForm = ref<form>({
    username: '',
    email: '',
    password: '',
    comfirmPwd: ''
});

// 清空登录注册表单
const cleanForm = () => {
    loginRegisterForm.value = {
        username: '',
        email: '',
        password: '',
        comfirmPwd: ''
    };
}

const { userLogin, userRegister } = useUser();

// 点击登录按钮触发
const login = async () => {
    // 发送登录请求
    const code: number = await userLogin(loginRegisterForm.value);

    if (code === 1) {
        const redirect: any = query.redirect || '/';
        router.push(redirect);

        cleanForm();
    }
};

// 点击注册按钮触发
const register = async () => {
    //删除用户名和密码左右两端的空格
    loginRegisterForm.value.username = loginRegisterForm.value.username.replace(/(^\s*)|(\s*$)/g, "");
    loginRegisterForm.value.password = loginRegisterForm.value.password.replace(/(^\s*)|(\s*$)/g, "");

    // 校验用户名
    if (loginRegisterForm.value.username.length < 2 || loginRegisterForm.value.username.length > 20) {
        ElMessage.error("请输入字符长度2到20的用户名");
        return;
    }

    // 校验邮箱
    var pattern = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    if (!pattern.test(loginRegisterForm.value.email)) {
        ElMessage.error("请输入正确的邮箱");
        return;
    }

    // 校验两次输入密码
    if (loginRegisterForm.value.password != loginRegisterForm.value.comfirmPwd) {
        ElMessage.error("请确保两次密码输入相同");
        return;
    }

    // 校验密码
    if (loginRegisterForm.value.password.length < 6 || loginRegisterForm.value.password.length > 18) {
        ElMessage.error("请输入字符长度6到18的密码");
        return;
    }

    // 发送注册请求和处理响应结果
    const code: number = await userRegister(loginRegisterForm.value);
    if (code === 1) {
        cleanForm();
        isLogin.value = true;
    }
};

</script>

<template>
    <div class="body">
        <div class="main-box">
            <div :class="['container', 'container-register', { 'is-txl': isLogin }]">
                <form>
                    <h2 class="title">注册</h2>
                    <div class="form__icons">
                        <img class="form__icon" src="@/assets/images/wechat.png" alt="微信登录">
                        <img class="form__icon" src="@/assets/images/alipay.png" alt="支付宝登录">
                        <img class="form__icon" src="@/assets/images/QQ.png" alt="QQ登录">
                    </div>
                    <span class="text">或使用邮箱进行注册</span>
                    <input class="form__input" type="text" placeholder="请输入用户名" v-model="loginRegisterForm.username" />
                    <input class="form__input" type="text" placeholder="请输入邮箱" v-model="loginRegisterForm.email" />
                    <input class="form__input" type="password" placeholder="请输入密码"
                        v-model="loginRegisterForm.password" />
                    <input class="form__input" type="password" placeholder="请确认密码"
                        v-model="loginRegisterForm.comfirmPwd" />
                    <div class="form__button" @click="register">立即注册</div>
                </form>
            </div>
            <div :class="['container', 'container-login', { 'is-txl is-z200': isLogin }]">
                <form>
                    <h2 class="title">登录</h2>
                    <div class="form__icons">
                        <img class="form__icon" src="@/assets/images/wechat.png" alt="微信登录">
                        <img class="form__icon" src="@/assets/images/alipay.png" alt="支付宝登录">
                        <img class="form__icon" src="@/assets/images/QQ.png" alt="QQ登录">
                    </div>
                    <span class="text">或使用用户名登录</span>
                    <input class="form__input" type="text" placeholder="请输入用户名" v-model="loginRegisterForm.username" />
                    <input class="form__input" type="password" placeholder="请输入密码"
                        v-model="loginRegisterForm.password" />
                    <div class="form__button" @click="login">立即登录</div>
                </form>
            </div>
            <div :class="['switch', { 'login': isLogin }]">
                <div class="switch__circle"></div>
                <div class="switch__circle switch__circle_top"></div>
                <div class="switch__container">
                    <h2>{{ isLogin ? '您好 !' : '欢迎回来 !' }}</h2>
                    <p>
                        {{
                            isLogin
                                ? '如果您还没有账号，请点击下方立即注册按钮进行账号注册'
                                : '如果您已经注册过账号，请点击下方立即登录按钮进行登录'
                        }}
                    </p>
                    <div class="form__button" @click="{ isLogin = !isLogin; cleanForm() }">
                        {{ isLogin ? '立即注册' : '立即登录' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.body {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    background-image: url("@/assets/images/background.jpg");
    color: #a0a5a8;
}

.main-box {
    position: relative;
    width: 1000px;
    min-width: 1000px;
    min-height: 600px;
    height: 600px;
    padding: 25px;
    background-color: #ecf0f3;
    box-shadow: 1px 1px 100px 10PX #ecf0f3;
    border-radius: 12px;
    overflow: hidden;

    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        width: 600px;
        height: 100%;
        padding: 25px;
        background-color: #ecf0f3;
        transition: all 1.25s;

        form {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 100%;
            height: 100%;
            color: #a0a5a8;

            .form__icon {
                object-fit: contain;
                width: 30px;
                margin: 0 5px;
                opacity: .5;
                transition: .15s;

                &:hover {
                    opacity: 1;
                    transition: .15s;
                    cursor: pointer;

                }
            }

            .title {
                font-size: 34px;
                font-weight: 700;
                line-height: 3;
                color: #181818;
            }

            .text {
                margin-top: 30px;
                margin-bottom: 12px;
            }

            .form__input {
                width: 350px;
                height: 40px;
                margin: 4px 0;
                padding-left: 25px;
                font-size: 13px;
                letter-spacing: 0.15px;
                border: none;
                outline: none;
                // font-family: 'Montserrat', sans-serif;
                background-color: #ecf0f3;
                transition: 0.25s ease;
                border-radius: 8px;
                box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;

                &::placeholder {
                    color: #a0a5a8;
                }
            }
        }
    }

    .container-register {
        z-index: 100;
        left: calc(100% - 600px);
    }

    .container-login {
        left: calc(100% - 600px);
        z-index: 0;
    }

    .is-txl {
        left: 0;
        transition: 1.25s;
        transform-origin: right;
    }

    .is-z200 {
        z-index: 200;
        transition: 1.25s;
    }

    .switch {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 400px;
        padding: 50px;
        z-index: 200;
        transition: 1.25s;
        background-color: #ecf0f3;
        overflow: hidden;
        box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #f9f9f9;
        color: #a0a5a8;

        .switch__circle {
            position: absolute;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            background-color: #ecf0f3;
            box-shadow: inset 8px 8px 12px #d1d9e6, inset -8px -8px 12px #f9f9f9;
            bottom: -60%;
            left: -60%;
            transition: 1.25s;
        }

        .switch__circle_top {
            top: -30%;
            left: 60%;
            width: 300px;
            height: 300px;
        }

        .switch__container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            position: absolute;
            width: 400px;
            padding: 50px 55px;
            transition: 1.25s;

            h2 {
                font-size: 34px;
                font-weight: 700;
                line-height: 3;
                color: #181818;
            }

            p {
                font-size: 14px;
                letter-spacing: 0.25px;
                text-align: center;
                line-height: 1.6;
            }
        }
    }

    .login {
        left: calc(100% - 400px);

        .switch__circle {
            left: 0;
        }
    }

    .form__button {
        width: 180px;
        height: 50px;
        border-radius: 25px;
        margin-top: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 14px;
        letter-spacing: 2px;
        background-color: #4b70e2;
        color: #f9f9f9;
        cursor: pointer;
        box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;

        &:hover {
            box-shadow: 2px 2px 3px 0 rgba(255, 255, 255, 50%),
                -2px -2px 3px 0 rgba(116, 125, 136, 50%),
                inset -2px -2px 3px 0 rgba(255, 255, 255, 20%),
                inset 2px 2px 3px 0 rgba(0, 0, 0, 30%);
        }
    }
}
</style>