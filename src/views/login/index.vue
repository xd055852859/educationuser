<script setup lang="ts">
import router from "@/router";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import Login from "./login.vue";
import Reset from "./reset.vue";
const { loginState } = storeToRefs(appStore.authStore);
const showLogin = ref<boolean>(false);
onMounted(() => {
  if (localStorage.getItem("auth_token")) {
    router.replace("/space");
  }
});
</script>
<template>
  <div class="login" :class="{ 'dp-center-center': showLogin }">
    <div class="login-box" v-if="showLogin">
      <div class="login-logo">
        <img src="/login/logoTitle.svg" alt="" />
      </div>
      <div class="login-container">
        <Login v-if="loginState === 'login'" /> <Reset v-else />
      </div>
      <div class="login-bottom">登录或注册代表你同意 用户条款</div>
    </div>
    <div class="title-box" v-else>
      <div class="title-box-logo">
        <img src="/login/logoTitle.svg" alt="" />
      </div>
      <div class="title-box-title">场景英语创作中心</div>
      <div class="title-box-subtitle">发现文字的力量 让语言发光</div>
      <el-button
        type="primary"
        @click="showLogin = true"
        class="title-box-button"
        >立即体验</el-button
      >
    </div>
  </div>
</template>
<style lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  background-image: url("/login/logoBg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .login-box {
    width: 450px;
    height: 580px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.11);
    padding-top: 44px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    .login-logo {
      width: 100%;
      height: 58px;
      margin-bottom: 45px;
      @include flex(center, center, null);
      img {
        width: 163px;
        height: 58px;
      }
    }
    .login-container {
      width: 100%;
      height: calc(100% - 127px);
      padding: 0px 34px;
      box-sizing: border-box;
      position: relative;
      z-index: 1;
      .login-input {
        width: 100%;
        height: 45px;
        margin-bottom: 35px;
        border-radius: 4px;
        color: #999999;
        @include flex(space-between, center, null);
        .el-input__wrapper {
          height: 100%;
          background-color: $loginInput;
        }
      }

      .login-bottom-button {
        width: 100%;
        padding: 0px 34px;
        box-sizing: border-box;
        position: absolute;
        z-index: 2;
        left: 0px;
        bottom: 60px;
        .login-button {
          width: 100%;
          height: 48px;
          border-radius: 4px;
        }
        .login-prompt {
          width: 100%;
          height: 20px;
          font-size: 16px;
          text-align: center;
          cursor: pointer;
          line-height: 20px;
          margin-top: 15px;
          > span {
            color: $commonColor;
          }
        }
      }
    }
    .login-bottom {
      width: 100%;
      height: 47px;
      background: $loginInput;
      border-radius: 0px 0px 12px 12px;
      line-height: 47px;
      font-size: 14px;
      color: #999999;
      text-align: center;
      position: absolute;
      z-index: 2;
      left: 0px;
      bottom: 0px;
    }
  }
  .title-box {
    height: 100vh;
    margin-left: 272px;
    padding-top: 55px;
    box-sizing: border-box;
    .title-box-logo {
      width: 180px;
      height: 30px;

      margin-bottom: 190px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title-box-title {
      width: 620px;
      height: 90px;
      font-size: 64px;
      font-family: PingFang SC, PingFang SC-Semibold;
      font-weight: 600;
      color: #333333;
      line-height: 90px;
      margin-bottom: 22px;
    }
    .title-box-subtitle {
      width: 568px;
      height: 33px;
      font-size: 24px;
      color: #949494;
      line-height: 33px;
      letter-spacing: 0.9px;
      margin-bottom: 134px;
    }
    .title-box-button {
      width: 206px;
      height: 67px;
      background: #505aff;
      border-radius: 2px;
      font-size: 24px;
      font-family: PingFang SC, PingFang SC-Semibold;
      font-weight: 600;
      text-align: center;
      color: #ffffff;
      line-height: 33px;
      letter-spacing: 1.41px;
    }
  }
}
</style>
<style></style>
