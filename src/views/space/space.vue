<script setup lang="ts">
import Header from "@/components/header.vue";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import { ROLE_OPTIONS, ResultProps } from "@/interface/Common";
import router from "@/router";
const { spaceList, createState } = storeToRefs(appStore.spaceStore);
const { getSpaceList, setSpaceKey } = appStore.spaceStore;
onMounted(() => {
  getSpaceList();
});
const toSpace = (spaceItem) => {
  router.push("/home");
  setSpaceKey(spaceItem._key);
};
</script>
<template>
  <Header />
  <div class="space">
    <div class="space-box">
      <div class="space-logo">
        <img src="/login/logoTitle.svg" alt="" />
      </div>
      <div
        class="space-container"
        :class="{
          'space-container-large': createState,
          'space-container-small': !createState,
        }"
      >
        <el-card
          v-for="(item, index) in spaceList"
          :key="`space${index}`"
          style="margin-bottom: 10px"
          :shadow="item.status === 1 ? 'hover' : 'never'"
        >
          <!--             -->
          <div class="space-list-item" @click="toSpace(item)">
            <div class="space-list-img">
              <img :src="item.logo" alt="" v-if="item.logo" />
              <img
                src="/logo.svg"
                alt=""
                style="width: 60px; height: 60px; object-fit: contain"
                v-else
              />
            </div>
            <div class="title">
              <div class="top">{{ item.name }}</div>
              <div class="bottom">
                <div>
                  {{
                    item.role === 0
                      ? "超管"
                      : ROLE_OPTIONS[item.role - 1]?.label
                  }}
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <!-- -->
      <div class="space-bottom" v-if="createState">
        <el-button
          type="primary"
          @click="$router.push('/space/edit')"
          class="space-bottom-button"
          >创建者申请</el-button
        >
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.space {
  width: 100vw;
  height: calc(100vh - 55px);
  background: #ffffff;
  @include flex(center, flex-start, null);
  .space-box {
    width: 700px;
    height: 750px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.11);
    padding-top: 44px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    .space-logo {
      width: 100%;
      height: 60px;
      margin-bottom: 25px;
      @include flex(center, center, null);
      img {
        width: 180px;
        height: 30px;
      }
    }
    .space-container-large {
      height: calc(100% - 160px);
    }
    .space-container-small {
      height: calc(100% - 105px);
    }
    .space-container {
      width: 100%;
      padding: 0px 34px;
      box-sizing: border-box;
      @include scroll();
      .space-list-item {
        width: 100%;
        height: 90px;
        // margin-bottom: 20px;
        background-color: #fff;
        position: relative;
        z-index: 1;
        cursor: pointer;
        @include flex(space-between, center, wrap);
        .space-list-img {
          width: 140px;
          height: 90px;
          overflow: hidden;
          @include flex(center, center, null);
          img {
            width: 100%;
            height: 100%;
          }
        }

        .title {
          width: calc(100% - 160px);
          height: 100%;
          .top {
            width: 100%;
            height: calc(100% - 30px);
            padding-top: 10px;
            box-sizing: border-box;
            font-size: 17px;
            @include flex(null, flex-start, null);
          }
          .bottom {
            width: 100%;
            height: 30px;
            font-size: 14px;
            color: #9e9e9e;
            padding-right: 10px;
            box-sizing: border-box;
            @include flex(space-between, center, null);
            .right {
              min-width: 200px;
              height: 100%;
              @include flex(flex-end, center, null);
              .view {
                height: 100%;
                @include flex(center, center, null);
              }
            }
          }
        }
      }
    }
    .space-bottom {
      width: 100%;
      height: 50px;
      position: absolute;
      z-index: 2;
      left: 0px;
      bottom: 20px;
      @include flex(center, center, null);
      .space-bottom-button {
        width: 180px;
        height: 50px;
        background: #505aff;
        border-radius: 2px;
        font-size: 20px;
        font-family: PingFang SC, PingFang SC-Semibold;
        font-weight: 600;
        text-align: center;
        color: #ffffff;
        line-height: 33px;
        letter-spacing: 1.41px;
      }
    }
  }
}
</style>
<style></style>
