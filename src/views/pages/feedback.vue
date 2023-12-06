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
const dayjs: any = inject("dayjs");
const { user } = storeToRefs(appStore.authStore);
const { spaceKey, spaceRole } = storeToRefs(appStore.spaceStore);
const { setLessonInfo, setLessonKey, getLessonList, setLessonList } =
  appStore.lessonStore;
const feedbackList = ref<any>([]);
const translation = ref<string>("");
const original = ref<string>("");
const errorType = ref<string>("");
const errorKey = ref<string>("");

const statusType = ref<number>(0);
const page = ref<number>(1);
const changeState = ref<boolean>(false);
const statusArray = ["全部", "字幕", "正文"];
const typeArray = ["", "caption", "section"];
const getData = async () => {
  let dataRes = (await api.request.get("caption/error", {
    developerKey: spaceKey.value,
    type: typeArray[statusType.value],
    page: page.value,
    limit: 30,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    feedbackList.value = dataRes.data;
    changeState.value = !changeState.value;
  }
};
const changeError = async (status, index) => {
  let dataRes = (await api.request.patch("caption/error", {
    errorKey: feedbackList.value[index]._key,
    status: +status,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    ElMessage.success("已处理成功");
    getData();
  }
};
const updateError = async (key, value, index) => {
  let dataRes: any = null;
  if (feedbackList.value[index].type === "caption") {
    dataRes = (await api.request.patch("caption", {
      captionKey: feedbackList.value[index].captionKey,
      [key]: value,
    })) as ResultProps;
  } else {
    dataRes = (await api.request.patch("section", {
      sectionKey: feedbackList.value[index].sectionKey,
      [key]: value,
    })) as ResultProps;
  }
  if (dataRes.msg === "OK") {
    feedbackList.value[index][key] = value;
    errorType.value = "";
    errorKey.value = "";
    original.value = "";
    translation.value = "";
  }
};
watchEffect(() => {
  getData();
});
</script>
<template>
  <Header title="用户反馈" />
  <div class="lesson box">
    <div class="lesson-header">
      <div class="lesson-header-left">
        <template v-for="(item, index) in statusArray" :key="`status${index}`">
          <span
            :style="
              statusType === index
                ? { color: '#4C56FF', borderBottom: '2px solid #4C56FF' }
                : {}
            "
            @click="statusType = index"
          >
            {{ item }}
          </span>
          <el-divider
            direction="vertical"
            v-if="index !== statusArray.length - 1"
          />
        </template>
      </div>
      <div class="lesson-header-right"></div>
    </div>
    <div class="box-table">
      <el-table :data="feedbackList" style="height: 100%" stripe>
        <el-table-column
          prop="resourceName"
          label="课程"
          header-align="center"
          width="200"
        />
        <el-table-column
          prop="mediaName"
          label="章节"
          header-align="center"
          width="200"
        />
        <el-table-column prop="mobile" label="类型" align="center" width="80">
          <template #default="scope">
            {{ scope.row.type === "section" ? "正文" : "字幕" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="original"
          label="原文"
          header-align="center"
          width="300"
        >
          <template #default="scope">
            <el-input
              :rows="3"
              type="textarea"
              v-model="original"
              placeholder="请输入资源名"
              v-if="errorKey === scope.row._key && errorType === 'original'"
              @blur="updateError('original', original, scope.$index)"
              size="large"
              autofocus
            />
            <div
              v-else
              @click="
                errorType = 'original';
                errorKey = scope.row._key;
                original = scope.row.original;
              "
            >
              {{ scope.row.original }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="translation"
          label="译文"
          header-align="center"
          width="300"
        >
          <template #default="scope">
            <el-input
              :rows="3"
              type="textarea"
              v-model="translation"
              placeholder="请输入资源名"
              v-if="errorKey === scope.row._key && errorType === 'translation'"
              @blur="updateError('translation', translation, scope.$index)"
              size="large"
              autofocus
            />
            <div
              v-else
              @click="
                errorType = 'translation';
                errorKey = scope.row._key;
                translation = scope.row.translation;
              "
            >
              {{ scope.row.translation }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="memo"
          label="用户反馈"
          align="center"
          width="300"
        />
        <el-table-column label="提出时间" align="center" width="120">
          <template #default="scope"
            >{{ dayjs(scope.row.createTime).format("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="提出人"
          align="center"
          width="100"
        />
        <el-table-column
          label="已解决"
          align="center"
          fixed="right"
          width="150"
        >
          <template #default="scope">
            <img
              :src="
                scope.row.status ? '/common/choose.svg' : '/common/unchoose.svg'
              "
              alt=""
              @click="changeError(!scope.row.status, scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
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
