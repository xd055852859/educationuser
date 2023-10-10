<script setup lang="ts">
import { Search, ArrowDown, MoreFilled } from "@element-plus/icons-vue";
import Header from "@/components/header.vue";
import router from "@/router";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import api from "@/services/api";
import _ from "lodash";
import { ResultProps } from "@/interface/Common";
const { spaceKey } = storeToRefs(appStore.spaceStore);
const { lessonList } = storeToRefs(appStore.lessonStore);
const { setLessonInfo, setLessonKey, getLessonList, setLessonList } =
  appStore.lessonStore;
const creatorName = ref<string>("");
const lessonName = ref<string>("");
const lessonType = ref<number>(0);
const statusType = ref<number>(0);
// const lessonArray = ["全部", "英语", "语文"];
const statusArray = ["全部", "待审核", "已发布", "已拒绝"];
const toEdit = (key?: string) => {
  if (key) {
    setLessonKey(key);
  } else {
    setLessonKey("");
    setLessonInfo(null);
  }

  router.push("/home/lessonEdit");
};
const toLesson = (key) => {
  setLessonKey(key);
  router.push("/home/lessonDetail");
};
const deleteLesson = async (key, index) => {
  ElMessageBox.confirm("是否删除该课件", "删除课件", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const resourceRes = (await api.request.delete("resource", {
      resourceKey: key,
    })) as ResultProps;
    if (resourceRes.msg === "OK") {
      ElMessage.success("删除课件成功");
      let list = _.cloneDeep(lessonList.value);
      list.splice(index, 1);
      setLessonList(list);
    }
  });
};
watchEffect(() => {
  if (spaceKey.value) {
    getLessonList(spaceKey.value, statusType.value, lessonName.value);
  }
});
</script>
<template>
  <Header title="课件管理" />
  <div class="lesson box">
    <div class="box-header">
      <div>
        <!-- <el-input
          v-model="creatorName"
          placeholder="请输入创建者名称"
          style="width: 200px; margin-right: 15px"
          :prefix-icon="Search"
        /> -->
        <el-input
          v-model="lessonName"
          placeholder="请输入课程名称"
          style="width: 200px"
          :prefix-icon="Search"
        />
      </div>
      <div>
        <!-- <el-dropdown>
          <div class="icon-point dp--center">
            {{ lessonArray[lessonType] }}
            <el-icon style="margin-left: 8px"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in lessonArray"
                @click="lessonType = index"
                :key="`lesson${index}`"
                >{{ item }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
        <el-dropdown style="margin: 0px 15px">
          <div class="icon-point dp--center">
            {{ statusArray[statusType] }}
            <el-icon style="margin-left: 8px; margin-right: 8px"
              ><ArrowDown
            /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in statusArray"
                @click="statusType = index"
                :key="`status${index}`"
                >{{ item }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button type="primary" @click="toEdit()">创作课件</el-button>
      </div>
    </div>
    <div class="box-table">
      <el-row :gutter="25">
        <el-col
          :span="12"
          v-for="(item, index) in lessonList"
          :key="`lesson${index}`"
          style="margin-bottom: 20px"
        >
          <el-card shadow="hover">
            <!--             -->
            <div class="lesson-list-item" @click="toLesson(item._key)">
              <div class="lesson-list-img">
                <img :src="item.cover" alt="" v-if="item.cover" />
                <img
                  src="/logo.svg"
                  alt=""
                  style="width: 80px; height: 80px; object-fit: contain"
                  v-else
                />
              </div>
              <div class="title">
                <div class="top">{{ item.name }}</div>
                <div class="bottom">
                  {{ item.description }}
                </div>
              </div>
              <div class="lesson-list-status">
                <el-tag
                  :type="
                    item.status ? (item.status === 1 ? '' : 'danger') : 'info'
                  "
                  round
                  >{{
                    item.status
                      ? item.status === 1
                        ? "已发布"
                        : "已拒绝"
                      : "待审核"
                  }}</el-tag
                >
              </div>
              <div
                className="lesson-list-button"
                @click="$event.stopPropagation()"
              >
                <el-dropdown
                  trigger="click"
                  :teleported="false"
                  placement="top-start"
                >
                  <!-- <FontIcon
                    iconName="gengduo"
                    :iconStyle="{ fontSize: '18px' }"
                  /> -->
                  <el-icon><MoreFilled /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="toEdit(item._key)">
                        编辑</el-dropdown-item
                      >
                      <el-dropdown-item @click="deleteLesson(item._key, index)">
                        删除</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style scoped lang="scss">
.lesson {
  .lesson-list-item {
    width: 100%;
    height: 140px;
    background-color: #fff;
    position: relative;
    z-index: 1;
    cursor: pointer;
    @include flex(space-between, center, wrap);
    .lesson-list-img {
      width: 30%;
      height: 140px;
      overflow: hidden;
      @include flex(center, center, null);
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .title {
      width: calc(70% - 10px);
      height: 100%;
      .top {
        width: 100%;
        height: 30px;
        margin-bottom: 10px;
        @include flex(null, center, null);
      }
      .bottom {
        width: 100%;
        height: calc(100% - 40px);
        font-size: 14px;
        color: #9e9e9e;
        padding-right: 10px;
        box-sizing: border-box;
        @include flex(space-between, center, null);
        @include more-toLong(5)
        // .right {
        //   min-width: 200px;
        //   height: 100%;
        //   @include flex(flex-end, center, null);
        //   .view {
        //     height: 100%;
        //     @include flex(center, center, null);
        //   }
        // }
      }
    }
    .lesson-list-status {
      position: absolute;
      z-index: 2;
      top: 0px;
      right: 0px;
      // @include flex(center, center, null);
    }
    .lesson-list-button {
      display: none;
      position: absolute;
      z-index: 2;
      bottom: 0px;
      right: 0px;
    }
    &:hover {
      .lesson-list-button {
        display: flex;
      }
    }
  }
}
</style>
<style></style>
