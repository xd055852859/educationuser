<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import Header from "@/components/header.vue";
const userList = ref<any>([]);
const searchName = ref<string>("");
const page = ref<number>(1);
const pageNum = ref<number>(0);
</script>
<template>
  <Header title="用户数据" />
  <div class="box">
    <div class="box-header">
      <el-input
        v-model="searchName"
        placeholder="请输入用户名称"
        style="width: 300px"
        :prefix-icon="Search"
      />
    </div>
    <div class="box-table">
      <el-table :data="userList" style="height: 100%">
        <el-table-column prop="name" label="头像" align="center" />
        <el-table-column prop="name" label="用户名" align="center" />
        <el-table-column prop="name" label="手机号" align="center" />
        <el-table-column prop="name" label="权限" align="center">
          <template #default="scope"> </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click=""
              >查看</el-button
            >
            <el-button link type="primary" size="small" @click=""
              >禁用</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="box-footer">
      <el-pagination
        background
        :page-size="30"
        layout="prev, pager, next"
        :page-count="pageNum"
        @current-change="
          (newPage) => {
            page = newPage;
          }
        "
      />
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
<style></style>
