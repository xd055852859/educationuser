<script setup lang="ts">
import { ElMessage } from "element-plus";
import FontIcon from "@/components/fontIcon.vue";
import router from "@/router";
import { storeToRefs } from "pinia";
import appStore from "@/store";
const route = useRoute();
const { spaceList, spaceRole, createState, spaceInfo } = storeToRefs(
  appStore.spaceStore
);
const { getSpaceList, setSpaceKey, getSpaceInfo } = appStore.spaceStore;
const { setLessonKey } = appStore.lessonStore;

const homeIndex = ref<number>(0);
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
// watch(
//   route,
//   (newRoute) => {
//     console.log(newRoute);
//     switch (newRoute.name) {
//       case "overview":
//         homeIndex.value = 0;
//         break;
//       case "lesson":
//         homeIndex.value = 1;
//         break;
//       case "account":
//         homeIndex.value = 2;
//         break;
//       case "member":
//         homeIndex.value = 3;
//         break;
//     }
//   },
//   { immediate: true }
// );
</script>
<template>
  <div class="home">
    <div class="home-left">
      <div class="home-title">
        <img src="/common/logo.svg" alt="" class="home-logo" />
        <div style="text-align: center">场景英语创作中心</div>
      </div>
      <div class="home-space">
        <el-dropdown>
          <div class="home-space-title">
            <div class="home-space-text">{{ spaceInfo?.name }}</div>
            <div class="home-space-icon">
              <FontIcon iconName="a-xialaqiehuan2" />
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                @click="
                  setSpaceKey(item._key);
                  setLessonKey('');
                  $router.push('/home/overview');
                "
                v-for="(item, index) in spaceList"
                :key="`space${item._key}`"
                >{{ item.name }}</el-dropdown-item
              >
              <el-dropdown-item v-if="createState"
                ><el-button
                  type="primary"
                  @click="$router.push('/space/edit')"
                  class="space-bottom-button"
                  >创建者申请</el-button
                ></el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="home-menu">
        <div
          class="home-menu-item"
          @click="$router.push('/home/overview')"
          :style="$route.name === 'overview' ? { background: '#dedffb' } : {}"
        >
          <div class="menu-logo">
            <FontIcon iconName="shujugailan" />
          </div>
          <div class="menu-title">数据概览</div>
        </div>
        <div
          class="home-menu-item"
          @click="$router.push('/home/lesson')"
          :style="$route.name === 'lesson' ? { background: '#dedffb' } : {}"
        >
          <div class="menu-logo">
            <FontIcon iconName="kejianguanli" />
          </div>

          <div class="menu-title">课件管理</div>
        </div>
        <div
          class="home-menu-item"
          @click="$router.push('/home/account')"
          :style="$route.name === 'account' ? { background: '#dedffb' } : {}"
          v-if="spaceRole === 0"
        >
          <div class="menu-logo">
            <FontIcon iconName="zhanghaozhongxin" />
          </div>
          <div class="menu-title">账号中心</div>
        </div>
        <div
          class="home-menu-item"
          @click="$router.push('/home/member')"
          :style="$route.name === 'member' ? { background: '#dedffb' } : {}"
        >
          <div class="menu-logo">
            <FontIcon iconName="chengyuanguanli" />
          </div>
          <div class="menu-title">成员管理</div>
        </div>
        <div
          class="home-menu-item"
          @click="$router.push('/home/feedback')"
          :style="$route.name === 'feedback' ? { background: '#dedffb' } : {}"
        >
          <div class="menu-logo dp--center">
            <img src="/homelogo.svg" alt="" />
          </div>
          <div class="menu-title">用户反馈</div>
        </div>
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
    width: 246px;
    height: 100vh;
    background-color: #f3f3fb;
    align-content: flex-start;
    position: relative;
    z-index: 1;
    padding-top: 37px;
    box-sizing: border-box;
    @include flex(center, null, wrap);
    .home-title {
      width: 100%;
      height: 24px;
      font-size: 20px;
      font-weight: 500;
      color: #484848;
      line-height: 24px;
      margin-bottom: 56px;
      @include flex(center, center, null);
      .home-logo {
        width: 23px;
        height: 23px;
        margin-right: 10px;
      }
    }
    .home-space {
      width: 100%;
      height: 30px;
      margin-bottom: 25px;
      .home-space-title {
        width: 240px;
        height: 30px;
        font-weight: 500;
        font-size: 22px;
        color: #4b4c4b;
        line-height: 30px;
        @include flex(center, center, null);
        .home-space-text {
          margin-right: 44px;
        }
      }
    }
    .home-menu {
      width: 100%;
      height: calc(100% - 110px);
      .home-menu-item {
        width: 100%;
        height: 80px;
        cursor: pointer;
        @include flex(center, center, null);
        .menu-logo {
          width: 24px;
          height: 100%;
          img{
            width:24px;
            height:24px;
          }
        }
        .menu-title {
          width: 90px;
          height: 25px;
          font-size: 20px;
          color: #4b4c4b;
          line-height: 25px;
          margin-left: 20px;
        }
        &:hover {
          background: #dedffb;
        }
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
<style lang="scss">
.home-space-icon {
  .font-icon {
    font-size: 12px;
  }
}
.home-menu {
  .home-menu-item {
    .font-icon {
      font-size: 26px;
    }
  }
}
</style>
