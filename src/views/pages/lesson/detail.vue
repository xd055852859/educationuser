<script setup lang="ts">
import Header from "@/components/header.vue";
</script>
<template>
  <Header title="课件详情" />
  <div class="detail box">
    <div class="detail-header">
      <div class="detail-header-left">
        <img src="https://cdn-org.qingtime.cn/1696560600618_org.jpg" alt="" />
      </div>
      <div class="detail-header-right">
        <div class="detail-right-top">课件名称课件名称</div>
        <div class="detail-right-bottom">
          <el-button
            type="primary"
            size="small"
            @click="$router.push('/lesson/edit')"
            >编辑</el-button
          >
          <el-button type="primary" size="small">更多</el-button>
        </div>
      </div>
    </div>
    <div class="info" style="height: calc(100% - 130px)">
      <div class="detail-item">
        <div class="left">标签</div>
        <div class="right">英语</div>
      </div>
      <div class="detail-item">
        <div class="left">概述</div>
        <div class="right">
          Vestibulum pharetra dui ut erat venenatis, in vulputate mi varius.
          Integer sed sollicitudin felis. Morbi mauris sem, pellentesque sit
          amet eleifend sed, egestas ac est. Phasellus non dolor vitae nisi
          facilisis efficitur. Nam id feugiat lectus, vitae convallis dui. Sed
          volutpat tortor leo, aliquet ornare sapien dignissim quis. Sed id
          tincidunt eros. Aenean blandit id
        </div>
      </div>
      <div class="detail-item">
        <div class="left">链接</div>
        <div class="right">www.qingtime.com</div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.detail {
  //   @include p-number(10px, 25px);
  width: 100%;
  height: 100%;
  min-width: 600px;
  @include p-number(10px, 15%);
  .detail-header {
    width: 100%;
    height: 120px;
    margin-bottom: 10px;
    @include flex(flex-start, center, null);
    .detail-header-left {
      width: 180px;
      height: 100%;
      margin-right: 25px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .detail-header-right {
      flex: 1;
      .detail-right-top {
        width: 100%;
        height: 88px;
      }
      .detail-right-bottom {
      }
    }
  }
  .detail-item {
    min-height: 80px;
  }
}
</style>
<style></style>
