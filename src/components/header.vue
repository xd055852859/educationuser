<script setup lang="ts">
import { Bell, ArrowLeft } from "@element-plus/icons-vue";
const props = defineProps<{
  title: string;
  backPath?: string;
}>();
</script>
<template>
  <div className="header">
    <div className="header-title">
      <div v-if="backPath" @click="$router.push(backPath)" class="header-back">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      {{ title }}
    </div>

    <div className="header-button">
      <slot name="button"></slot>
      <div style="margin: 0px 10px">
        <el-icon><Bell /></el-icon>
      </div>
      <div>
        <el-avatar
          :src="'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
          :alt="'测试'"
        >
          测试
        </el-avatar>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.header {
  width: 100%;
  height: 55px;
  padding: 0px 15px 0px 25px;
  box-sizing: border-box;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  @include flex(space-between, center, null);
  .header-title {
    font-size: 20px;
    font-weight: 600;
    color: #000000;
    @include flex(flex-start, center, null);
    .header-back {
      margin-right: 10px;
      cursor: pointer;
      @include flex(flex-start, center, null);
    }
  }
  .header-button {
    height: 100%;
    cursor: pointer;
    @include flex(flex-end, center, null);
    .button-img {
      width: 40px;
      height: 100%;
      font-size: 25px;
      @include flex(center, center, null);
    }
  }
}
</style>
<style></style>
