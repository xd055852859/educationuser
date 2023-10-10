<script setup lang="ts">
import { ElMessage } from "element-plus";
import {
  DataLine,
  Notebook,
  SwitchButton,
  Picture,
  SetUp,
  ArrowDown,
} from "@element-plus/icons-vue";
import router from "@/router";
import { storeToRefs } from "pinia";
import appStore from "@/store";
const { spaceList, spaceKey, createState, spaceInfo } = storeToRefs(
  appStore.spaceStore
);
const { getSpaceList, setSpaceKey, getSpaceInfo } = appStore.spaceStore;
onMounted(() => {
  getSpaceList();
});
const logout = () => {
  router.push("/");
  localStorage.clear();
  sessionStorage.clear();
  ElMessage({
    message: "退出登录成功",
    type: "success",
    duration: 1000,
  });
};
</script>
<template>
  <div class="home">
    <div class="home-left">
      <div class="home-title">
        <!-- <img :src="logoSvg" alt="" class="home-logo" /> -->
        <div style="text-align: center">飞梭创作后台</div>
      </div>
      <div class="home-space">
        <el-dropdown>
          <div class="icon-point" style="color: #fff; margin-right: 8px">
            {{ spaceInfo?.name }} <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                @click="setSpaceKey(item._key)"
                v-for="(item, index) in spaceList"
                :key="`space${item._key}`"
                >{{ item.name }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="home-menu"
        :default-active="$route.fullPath"
        text-color="#fff"
        router
      >
        <el-menu-item index="/home/overview">
          <el-icon :size="35"><data-line /></el-icon>
          <div class="menu-title">数据概览</div>
        </el-menu-item>

        <el-menu-item index="/home/lesson">
          <el-icon :size="35"><Picture /></el-icon>
          <div class="menu-title">课件管理</div>
        </el-menu-item>
        <el-menu-item index="/home/account">
          <el-icon :size="35"><Notebook /></el-icon>
          <div class="menu-title">账号中心</div>
        </el-menu-item>
        <el-menu-item index="/home/user">
          <el-icon :size="35"><SetUp /></el-icon>
          <div class="menu-title">成员管理</div>
        </el-menu-item>
      </el-menu>
      <div @click="logout" class="logout-button">
        <el-icon :size="35" :color="'#fff'"><switch-button /></el-icon>
      </div>
    </div>
    <div class="home-right">
      <router-view></router-view>
    </div>
  </div>
</template>
<style scoped lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  @include flex(space-between, null, null);

  .home-left {
    width: 200px;
    height: 100vh;
    background-color: #545c64;
    align-content: flex-start;
    position: relative;
    z-index: 1;
    @include flex(center, null, wrap);
    .home-title {
      width: 100%;
      height: 60px;
      color: #fff;
      font-size: 16px;
      @include flex(center, center, wrap);
      .home-logo {
        width: 100px;
        height: 100px;
        margin-bottom: 10px;
        margin-top: 10px;
      }
    }
    .home-space {
      width: 100%;
      height: 30px;
      color: #fff;
      font-size: 16px;
      margin-bottom: 20px;
      @include flex(center, center, wrap);
    }
    .home-menu {
      width: 100%;
      height: calc(100% - 110px);
      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }
      .menu-title {
        width: calc(100% - 40px);
        margin-left: 8px;
        font-size: 16px;
      }
    }
    .logout-button {
      width: 100%;
      height: 80px;
      cursor: pointer;
      position: absolute;
      left: 0px;
      bottom: 0px;
      z-index: 2;
      @include flex(center, center, null);
    }
  }
  .home-right {
    width: calc(100vw - 200px);
    height: 100vh;
  }
}
</style>
<style></style>
