<script setup lang="ts">
import Header from "@/components/header.vue";
import { Close } from "@element-plus/icons-vue";
import appStore from "@/store";
import IframeView from "@/components/iframeView.vue";
import { storeToRefs } from "pinia";
const { spaceKey, spaceRole } = storeToRefs(appStore.spaceStore);
const { user,token } = storeToRefs(appStore.authStore);
const { lessonInfo, lessonKey } = storeToRefs(appStore.lessonStore);
const previewVisible = ref<boolean>(false);
const previewUrl = ref<string>("");
const toUrl = () => {
  previewVisible.value = true;
  previewUrl.value = `https://yujing.qingtime.cn/#/preview/${lessonInfo.value?._key}?token=${token.value}&type=back`;
};
</script>
<template>
  <Header title="课件详情" backState @backFunc="$router.push('/home/lesson')" />
  <div class="detail box">
    <div class="detail-header">
      <div class="detail-header-left">
        <img :src="lessonInfo?.cover" alt="" />
      </div>
      <div class="detail-header-right">
        <div class="detail-right-top">{{ lessonInfo?.name }}</div>
        <div class="detail-right-bottom">
          <!--  v-if="
              spaceRole < 3 || (spaceRole === 4 && lessonInfo?.creator === user?._key)
            " -->
          <el-button
            type="primary"
            @click="$router.push('/home/lessonEdit')"
            class="common-button"
           
            >编辑</el-button
          >
          <!-- <el-button
            type="primary"
            size="small"
            @click="$router.push('/home/lessonEdit')"
            class="common-button"
            >编辑</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="$router.push('/home/lessonEdit')"
            class="common-button"
            >编辑</el-button
          > -->
        </div>
      </div>
    </div>
    <div class="detail-info" style="height: calc(100% - 130px)">
      <div class="detail-item">
        <div class="detail-item-left">标签</div>
        <div class="detail-item-right">英语</div>
      </div>
      <div class="detail-item">
        <div class="detail-item-left">概述</div>
        <div class="detail-item-right">
          {{ lessonInfo?.description }}
        </div>
      </div>
      <div class="detail-item">
        <div class="detail-item-left">链接</div>
        <div class="detail-item-right" @click="toUrl">
          {{ `https://yujing.qingtime.cn/#/preview/${lessonInfo?._key}` }}
        </div>
      </div>
    </div>
    <div class="preview-url-box" v-if="previewVisible">
      <div class="preview-url-icon" @click="previewVisible = false">
        <el-icon color="#fff" size="40"><Close /></el-icon>
      </div>
      <div class="preview-url" v-if="previewUrl">
        <IframeView :url="previewUrl" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.detail {
  //   @include p-number(10px, 25px);
  width: 100%;
  height: 100%;
  @include p-number(10px, 52px);
  .detail-header {
    width: 100%;
    height: 189px;
    margin-bottom: 48px;
    @include flex(flex-start, center, null);
    .detail-header-left {
      width: 318px;
      height: 189px;
      margin-right: 32px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .detail-header-right {
      width: calc(100% - 350px);
      height: 100%;
      .detail-right-top {
        width: 100%;
        height: 32px;
        font-size: 30px;
        font-weight: 500;
        color: #262626;
        line-height: 32px;
        margin-bottom: 20px;
      }
      .detail-right-bottom {
      }
    }
  }
  .detail-info {
    .detail-item {
      min-height: 80px;
      @include flex(flex-start, center, null);
      .detail-item-left {
        width: 44px;
        height: 30px;
        font-size: 22px;
        color: #757575;
        line-height: 30px;
        margin-right: 46px;
      }
      .detail-item-right {
        width: calc(100% - 90px);
        min-height: 28px;
        font-size: 26px;
        color: #4b4c4b;
        line-height: 48px;
        cursor: pointer;
      }
    }
  }
  .preview-url-box {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 10;
    top: 0px;
    left: 0px;
    .preview-url-icon {
      width: 50px;
      height: 50px;
      position: fixed;
      z-index: 15;
      top: 30px;
      right: 30px;
      cursor: pointer;
    }
    .preview-url {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style></style>
