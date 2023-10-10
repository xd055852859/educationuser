<script setup lang="ts">
import appStore from "@/store";
import { storeToRefs } from "pinia";
const checkBox = ref<boolean>(false);
const videoList = ref<any>([]);
const { lessonInfo } = storeToRefs(appStore.lessonStore);
</script>
<template>
  <div class="media">
    <div class="edit-item-title">
      <div class="edit-title-left">视频</div>
      <div class="edit-title-right">
        <el-button type="primary" style="margin-right: 15px" size="small"
          >添加</el-button
        >
        <el-button type="primary" size="small">批量导入</el-button>
      </div>
    </div>
    <div class="edit-item-table">
      <el-table :data="videoList" fit style="width: 100%">
        <el-table-column label="序号" type="index" width="70" />
        <el-table-column prop="name" label="视频地址" align="center" />
        <el-table-column prop="tagName" label="名称" align="center" />
        <el-table-column label="名称" align="center">
          <template #default="scope">
            <div>
              <el-checkbox v-model="checkBox" label="字幕" size="large" />
              <el-button
                v-if="lessonInfo && checkBox"
                type="primary"
                size="small"
                @click=""
                >编辑字幕</el-button
              >
            </div>
          </template>
        </el-table-column>
        <!--  <el-table-column prop="imgList" label="图片" align="center" width="450">
        <template #default="scope">
          <div class="story-img">
            <div
              class="story-img-item"
              v-for="(item, index) in scope.row.imgList"
              :key="'image' + index"
            >
              <el-image
                style="width: 70px; height: 70px"
                :src="item + '?imageView2/1/w/200/h/200'"
                :preview-src-list="scope.row.imgList"
                :initial-index="index"
                fit="cover"
                preview-teleported
              />
            </div>
          </div>
        </template>
      </el-table-column> -->

        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click=""
              >编辑</el-button
            >
            <el-button link type="primary" size="small" @click=""
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
<style></style>
