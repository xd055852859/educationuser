<script setup lang="ts">
import { getSearchParamValue } from "@/services/util";
import request from "@/services/api";
import { storeToRefs } from "pinia";
import router from "@/router";
import appStore from "@/store";
import api from "@/services/api";

const dayjs: any = inject("dayjs");
const { token } = storeToRefs(appStore.authStore);
const { setToken, getUserInfo } = appStore.authStore;
const { setDeviceWidth } = appStore.commonStore;

onMounted(() => {
  if (localStorage.getItem("auth_token")) {
    let token = localStorage.getItem("auth_token") as string;
    setToken(token);
    api.setToken(token);
    setDeviceWidth(
      document.documentElement.offsetWidth,
      document.documentElement.offsetHeight
    );
    // navigate("/home");
  } else {
    setToken("");
    api.setToken("");
    router.push("/");
  }
});
//初始化
watch(
  token,
  (newVal) => {
    if (newVal) {
      getUserInfo();
    }
  },
  { immediate: true }
);
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
#app {
  background: var(--diary-bg-color);
  -webkit-tap-highlight-color: transparent;
}
*::-webkit-scrollbar {
  width: 4px;
  height: 2px;
}

*::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background-color: var(--el-text-color-secondary);
}
</style>
