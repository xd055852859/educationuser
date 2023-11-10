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
const { user } = storeToRefs(appStore.authStore);
const { spaceKey, spaceRole } = storeToRefs(appStore.spaceStore);
const { lessonList } = storeToRefs(appStore.lessonStore);
const { setLessonInfo, setLessonKey, getLessonList, setLessonList } =
  appStore.lessonStore;
const creatorName = ref<string>("");
const lessonName = ref<string>("");
const lessonType = ref<number>(0);
const statusType = ref<number>(-1);
// const lessonArray = ["全部", "英语", "语文"];
const statusArray = ["全部", "待发布", "待审核", "已通过", "已拒绝"];
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
const updateLesson = async (lessonKey, key, value, index) => {
  const lessonRes = (await api.request.patch("resource", {
    resourceKey: lessonKey,
    [key]: value,
  })) as ResultProps;
  if (lessonRes.msg === "OK") {
    // ElMessage.success("编辑成功");
    if (value) {
      ElMessage.success("发布成功,等待审核");
    } else {
      ElMessage.success("取消发布成功");
    }
    let list = _.cloneDeep(lessonList.value);
    list[index] = { ...lessonRes.data };
    setLessonList(list);
  }
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
    <div class="lesson-header @include flex(flex-start, flex-start, null);">
      <div class="lesson-header-left">
        <template v-for="(item, index) in statusArray" :key="`status${index}`">
          <span
            :style="
              statusType === index - 1
                ? { color: '#4C56FF', borderBottom: '2px solid #4C56FF' }
                : {}
            "
            @click="statusType = index - 1"
          >
            {{ item }}
          </span>
          <el-divider
            direction="vertical"
            v-if="index !== statusArray.length - 1"
          />
        </template>
      </div>
      <div class="lesson-header-right">
        <el-input
          v-model="lessonName"
          placeholder="搜索课件"
          style="width: 200px; height: 30px; margin-right: 10px"
          :prefix-icon="Search"
        />
        <el-button
          type="primary"
          @click="toEdit()"
          style="width: 120px; height: 30px; margin-right: 10px"
          v-if="spaceRole < 4"
          >创作课件</el-button
        >
      </div>
    </div>
    <div class="lesson-list">
      <template v-if="lessonList.length > 0">
        <div
          class="lesson-list-item"
          v-for="(item, index) in lessonList"
          :key="`lesson${item._key}`"
          @click="toLesson(item._key)"
        >
          <div class="lesson-list-img">
            <img :src="item.cover" alt="" v-if="item.cover" />
            <img
              src="/logo.svg"
              alt=""
              style="width: 80px; height: 80px; object-fit: contain"
              v-else
            />
            <div
              class="lesson-list-status"
              :style="{
                backgroundImage: `url(${
                  item.grounding
                    ? item.status
                      ? item.status === 1
                        ? '/common/info.png'
                        : '/common/danger.png'
                      : '/common/default.png'
                    : '/common/default.png'
                })`,
              }"
            >
              {{
                item.grounding
                  ? item.status
                    ? item.status === 1
                      ? "已发布"
                      : "已拒绝"
                    : "待审核"
                  : "待发布"
              }}
            </div>
          </div>
          <div class="title">
            <div class="top">{{ item.name }}</div>
            <div class="bottom">
              {{ item.description }}
            </div>
          </div>

          <div
            className="lesson-list-button"
            @click="$event.stopPropagation()"
            v-if="
              spaceRole < 3 || (spaceRole === 4 && item.creator === user?._key)
            "
          >
            <el-dropdown
              trigger="click"
              :teleported="false"
              placement="bottom-start"
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
                  <el-dropdown-item
                    @click="
                      updateLesson(
                        item._key,
                        'grounding',
                        !item.grounding,
                        index
                      )
                    "
                  >
                    {{ item.grounding ? "取消发布" : "发布" }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="deleteLesson(item._key, index)">
                    删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>
      <div class="dp-center-center" v-else style="width: 100%; height: 100%">
        <el-empty description="暂无课程" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.lesson {
  padding: 0px 32px;
  box-sizing: border-box;
  .lesson-header {
    width: 100%;
    height: 46px;
    border-bottom: 1px solid #f0f0f0;
    padding: 0px 20px;
    box-sizing: border-box;
    @include flex(space-between, flex-start, null);
    .lesson-header-left {
      width: 100%;
      height: 46px;
      font-size: 20px;
      color: #262626;
      line-height: 25px;
      @include flex(flex-start, flex-start, null);
      span {
        padding: 0px 15px 17px 15px;
        cursor: pointer;
      }
    }
    .lesson-header-right {
      @include flex(flex-start, flex-start, null);
    }
  }
  .lesson-list {
    width: 100%;
    height: calc(100vh - 200px);
    padding: 0px 20px;
    box-sizing: border-box;
    align-content: flex-start;
    @include scroll();
    @include flex(space-between, flex-start, wrap);
    .lesson-list-item {
      width: 710px;
      height: 190px;
      background-color: #fff;
      position: relative;
      z-index: 1;
      padding: 32px 0px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      @include flex(space-between, center, wrap);
      .lesson-list-img {
        width: 318px;
        height: 189px;
        overflow: hidden;
        position: relative;
        z-index: 1;
        @include flex(center, center, null);
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .lesson-list-status {
          width: 68px;
          height: 32px;
          font-size: 14px;
          text-align: center;
          color: #ffffff;
          line-height: 32px;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          position: absolute;
          z-index: 2;
          top: 0px;
          right: 0px;
          // @include flex(center, center, null);
        }
      }

      .title {
        width: calc(100% - 350px);
        height: 100%;
        .top {
          width: 100%;
          height: 32px;
          margin-bottom: 10px;
          font-size: 26px;
          font-weight: 500;
          color: #262626;
          line-height: 32px;
        }
        .bottom {
          width: 100%;
          height: 155px;
          font-size: 18px;
          color: #a5a5a5;
          line-height: 30px;
          @include more-toLong(5);
        }
      }
      .lesson-list-button {
        display: none;
        position: absolute;
        z-index: 2;
        top: 10px;
        right: 20px;
      }
      &:hover {
        .lesson-list-button {
          display: flex;
        }
      }
    }
  }
}
</style>
<style lang="scss"></style>
