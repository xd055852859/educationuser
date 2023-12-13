<script setup lang="ts">
import Header from "@/components/header.vue";
import { Close } from "@element-plus/icons-vue";
import "vue3-video-play/dist/style.css";
import { videoPlay } from "vue3-video-play";
import IframeView from "@/components/iframeView.vue";
import api from "@/services/api";
import _ from "lodash";
import { base64ToFile, uploadFile } from "@/services/util";
import { ResultProps } from "@/interface/Common";
import { ElMessage, ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import axios from "axios";
const dayjs: any = inject("dayjs");
const { token } = storeToRefs(appStore.authStore);
const { lessonInfo } = storeToRefs(appStore.lessonStore);
const props = defineProps<{
  mediaKey: string;
  mediaIndex: string;
}>();

const captionsList = ref<any>([]);
const captionsKey = ref<string>("");
const videoSrc = ref<string>("");
const snap = ref<string>("");
const original = ref<string>("");
const translation = ref<string>("");
const videoRef = ref<any>(null);
const hours = ref<number>(0);
const minutes = ref<number>(0);
const seconds = ref<number>(0);
const startHours = ref<number>(0);
const startMinutes = ref<number>(0);
const startSeconds = ref<number>(0);
const endHours = ref<number>(0);
const endMinutes = ref<number>(0);
const endSeconds = ref<number>(0);
const currentTime = ref<number>(0);
const statusState = ref<boolean>(false);
const loading = ref<boolean>(false);
const isUTF8 = ref<boolean>(false);
const mediaName = ref<string>("");
const previewVisible = ref<boolean>(false);
const previewUrl = ref<string>("");
const uploadInput = ref<string>("");
onMounted(() => {
  if (videoRef.value) {
    videoRef.value.pause();
  }
  getData();
  getDetail();
});
const getData = async () => {
  let dataRes = (await api.request.get("caption", {
    mediaKey: props.mediaKey,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    captionsList.value = dataRes.data;
  }
};
const getDetail = async () => {
  let dataRes = (await api.request.get("media/detail", {
    mediaKey: props.mediaKey,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    mediaName.value = dataRes.data.name;
    videoSrc.value = dataRes.data.url;
    [hours.value, minutes.value, seconds.value] = dayjs
      .duration(dataRes.data.mediaTime, "milliseconds")
      .format("HH:mm:ss")
      .split(":")
      .map((item) => +item);
    statusState.value = true;
  }
};

const onPlay = (ev) => {
  console.log("播放");
};
const onPause = (ev) => {
  console.log(ev, "暂停");
};

const onTimeupdate = (ev) => {
  // console.log(ev.target.currentTime, "时间更新");
};
const onCanplay = (ev) => {
  console.log(ev, "可以播放");
};
const addCaptions = async () => {
  // if (!/[a-zA-Z]+/.test(original.value)) {
  //   ElMessage.error("请输入英文原文");
  //   return;
  // }
  let startTime = dayjs
    .duration({
      seconds: startSeconds.value,
      minutes: startMinutes.value,
      hours: startHours.value,
    })
    .valueOf();
  let endTime = dayjs
    .duration({
      seconds: endSeconds.value,
      minutes: endMinutes.value,
      hours: endHours.value,
    })
    .valueOf();
  let obj = {
    mediaKey: props.mediaKey,
    startTime: startTime > endTime ? endTime : startTime,
    endTime: startTime > endTime ? startTime : endTime,
    original: original.value,
    translation: translation.value,
    snap: snap.value,
  };
  if (captionsKey.value) {
    let dataRes = (await api.request.patch("caption", {
      captionKey: captionsKey.value,
      ...obj,
    })) as ResultProps;
    if (dataRes.msg === "OK") {
      ElMessage.success("编辑字幕成功");
      let index = _.findIndex(captionsList.value, { _key: captionsKey.value });
      if (index !== -1) {
        captionsList.value[index] = {
          ...captionsList.value[index],
          startTime: startTime > endTime ? endTime : startTime,
          endTime: startTime > endTime ? startTime : endTime,
          original: original.value,
          translation: translation.value,
          snap: snap.value,
        };
      }

      clearCaptions();
    }
  } else {
    let dataRes = (await api.request.post("caption", {
      ...obj,
    })) as ResultProps;
    if (dataRes.msg === "OK") {
      ElMessage.success("新增字幕成功");
      captionsList.value.push(dataRes.data);
      clearCaptions();
    }
  }
};
const deleteCaptions = async (key, index) => {
  ElMessageBox.confirm("是否删除该字幕", "删除字幕", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const delRes = (await api.request.delete("caption", {
      captionKey: key,
    })) as ResultProps;
    if (delRes.msg === "OK") {
      ElMessage.success("删除字幕成功");
      captionsList.value.splice(index, 1);
      clearCaptions();
    }
  });
};
const clearCaptions = () => {
  captionsKey.value = "";
  original.value = "";
  translation.value = "";
  snap.value = "";
  hours.value = 0;
  minutes.value = 0;
  seconds.value = 0;
  startSeconds.value = 0;
  startMinutes.value = 0;
  startHours.value = 0;
  endHours.value = 0;
  endMinutes.value = 0;
  endSeconds.value = 0;
};
const chooseCaptions = (row) => {
  console.log(row);
  captionsKey.value = row._key;
  let video: any = document.getElementById("captionsVideo");
  [startHours.value, startMinutes.value, startSeconds.value] = dayjs
    .duration(row.startTime, "milliseconds")
    .format("HH:mm:ss")
    .split(":")
    .map((item) => +item);
  [endHours.value, endMinutes.value, endSeconds.value] = dayjs
    .duration(row.endTime, "milliseconds")
    .format("HH:mm:ss")
    .split(":")
    .map((item) => +item);
  original.value = row.original;
  translation.value = row.translation;
  snap.value = row.snap;
  video.currentTime = row.startTime / 1000;
  videoRef.value.pause();
};
const screenshot = (id, imgType) => {
  let video: any = document.getElementById(id);
  const width = video.videoWidth;
  const height = video.videoHeight;
  // 创建画布准备截图
  const canvas: any = document.createElement("canvas");
  // 设置video属性
  video.setAttribute("crossOrigin", "anonymous");
  // 设置画布的宽高
  canvas.width = width;
  canvas.height = height;
  // 图片绘制
  canvas.getContext("2d").drawImage(video, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    try {
      let dataURL = canvas.toDataURL(imgType);
      resolve(dataURL);
    } catch (error) {
      reject(error);
    }
  });
};

const getImg = () => {
  screenshot("captionsVideo", "image/png").then((dataURL) => {
    const form = new FormData();
    const mimeType = ["image/*"];
    let file = base64ToFile(dataURL);
    if (file) {
      uploadFile(file, mimeType, async (url, name) => {
        snap.value = url;
      });
    }
    // form.append("file", base64ToFile(dataURL));
    // const aElement = document.createElement("a");
    // aElement.setAttribute("download", "测试");
    // //@ts-ignore
    // const href = URL.createObjectURL(base64ToFile(dataURL));
    // aElement.href = href;
    // aElement.setAttribute("target", "_blank");
    // aElement.click();
  });
};
const updateCaptions = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const createRes = (await axios.post(
    "https://nodeserver.qingtime.cn/upload",
    formData,
    {
      // 因为我们上传了图片,因此需要单独执行请求头的Content-Type
      headers: {
        // 表示上传的是文件,而不是普通的表单数据
        "Content-Type": "multipart/form-data",
        token: token.value,
      },
    }
  )) as ResultProps;
  if (createRes.data.msg === "OK") {
    ElMessage.success("上传文件成功,导入中...");
    importCaptions(createRes.data.filePath);
    // isUTF8.value = fileContent.indexOf("�") === -1;
    // console.log(isUTF8.value);
  }
};
const importCaptions = async (filePath) => {
  loading.value = true;
  const importRes = (await api.request.post("caption/import", {
    filePath: filePath,
    mediaKey: props.mediaKey,
  })) as ResultProps;
  if (importRes.msg === "OK") {
    loading.value = false;
    ElMessage.success("导入成功");
    getData();
    uploadInput.value = "";
  }
};
const removeCaptions = async () => {
  ElMessageBox.confirm("是否清空字幕", "清空字幕", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const delRes = (await api.request.delete("caption", {
      mediaKey: props.mediaKey,
    })) as ResultProps;
    if (delRes.msg === "OK") {
      ElMessage.success("清空字幕成功");
      clearCaptions();
      captionsList.value = [];
    }
  });
};
const toUrl = () => {
  previewVisible.value = true;
  previewUrl.value = `https://cjyy.qingtime.cn/#/preview/${lessonInfo.value?._key}?token=${token.value}&type=back&index=${props.mediaIndex}`;
};
</script>
<template>
  <Header :title="mediaName" backState @backFunc="$router.back">
    <template #button>
      <el-button
        type="primary"
        style="margin-right: 5px"
        plain
        class="common-button"
        @click="toUrl()"
        >预览</el-button
      >
      <el-button
        type="primary"
        style="margin-right: 5px"
        plain
        class="common-button"
        @click="removeCaptions()"
        >清空字幕</el-button
      >
      <el-button
        type="primary"
        style="margin-right: 5px"
        @click="addCaptions"
        plain
        class="common-button"
        >保存</el-button
      >
      <div class="upload-button" style="margin-left: 10px">
        <el-button type="primary" class="common-button">导入字幕</el-button>
        <input
          type="file"
          :value="uploadInput"
          @change="
            //@ts-ignore
            updateCaptions($event.target.files[0])
          "
          class="upload-img"
        />
      </div>
    </template>
  </Header>
  <div class="captions box" v-if="lessonInfo">
    <!--         :poster="options.poster" -->
    <div
      class="captions-video"
      :style="{
        height: lessonInfo?.mediaType === 'video' ? 'calc(55% - 10px)' : '80px',
      }"
    >
      <videoPlay
        id="captionsVideo"
        ref="videoRef"
        width="100%"
        height="100%"
        :src="videoSrc"
        @play="onPlay"
        @pause="onPause"
        @timeupdate="onTimeupdate"
        @canplay="onCanplay"
        crossOrigin="Anonymous"
      />
    </div>
    <div
      class="captions-form"
      :style="{
        height: lessonInfo?.mediaType === 'video' ? '45%' : 'calc(100% - 80px)',
      }"
    >
      <div class="captions-table">
        <el-table
          :data="captionsList"
          fit
          style="width: 100%; height: 100%"
          @row-click="chooseCaptions"
          stripe
          v-loading="loading"
        >
          <el-table-column prop="name" label="时间" align="center">
            <template #default="scope">
              {{
                dayjs
                  .duration(scope.row.startTime, "milliseconds")
                  .format("HH:mm:ss")
              }}
              ~
              {{
                dayjs
                  .duration(scope.row.endTime, "milliseconds")
                  .format("HH:mm:ss")
              }}
            </template>
          </el-table-column>
          <el-table-column label="原文" header-align="center">
            <template #default="scope">
              <div class="captions-table-text">
                {{ scope.row.original }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="译文" header-align="center">
            <template #default="scope">
              <div class="captions-table-text">
                {{ scope.row.translation }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
            align="center"
          >
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="deleteCaptions(scope.row._key, scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="captions-input info">
        <div class="input-item">
          <div class="left">起始时间</div>
          <div class="right">
            <el-input
              v-model="startHours"
              placeholder="时"
              style="width: 80px; margin-right: 10px"
              :max="hours"
              :min="0"
              type="number"
            />
            时
            <el-input
              v-model="startMinutes"
              placeholder="分"
              style="width: 80px; margin-left: 10px; margin-right: 10px"
              :max="minutes"
              :min="0"
              type="number"
            />
            分
            <el-input
              v-model="startSeconds"
              placeholder="秒"
              style="width: 80px; margin-left: 10px; margin-right: 10px"
              :max="seconds"
              :min="0"
              type="number"
            />
          </div>
        </div>
        <div class="input-item">
          <div class="left">结束时间</div>
          <div class="right">
            <el-input
              v-model="endHours"
              placeholder="时"
              style="width: 80px; margin-right: 10px"
              :max="hours"
              :min="0"
              type="number"
            />
            时
            <el-input
              v-model="endMinutes"
              placeholder="分"
              style="width: 80px; margin-left: 10px; margin-right: 10px"
              :max="hours && endHours < hours ? 60 : minutes"
              :min="0"
              type="number"
            />
            分
            <el-input
              v-model="endSeconds"
              placeholder="秒"
              style="width: 80px; margin-left: 10px; margin-right: 10px"
              :max="minutes && endMinutes < minutes ? 60 : seconds"
              :min="0"
              type="number"
            />
          </div>
        </div>
        <div class="input-item info-area">
          <div class="left">截屏</div>
          <div class="right">
            <el-button
              type="primary"
              style="margin-right: 5px"
              @click="getImg()"
              >截屏</el-button
            >
            <el-image
              style="width: 140px; height: 100px; margin-left: 15px"
              :src="snap"
              :zoom-rate="1.2"
              :preview-src-list="[snap]"
              :initial-index="0"
              fit="cover"
              v-if="snap"
            />
          </div>
        </div>
        <div class="input-item info-area">
          <div class="left">原文</div>
          <div class="right">
            <el-input
              v-model="original"
              :rows="8"
              type="textarea"
              placeholder="请输入原文"
              size="large"
            />
          </div>
        </div>
        <div class="input-item info-area">
          <div class="left">译文</div>
          <div class="right">
            <el-input
              v-model="translation"
              :rows="8"
              type="textarea"
              placeholder="请输入译文"
              size="large"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="preview-url-box" v-if="previewVisible">
      <div class="preview-url-icon" @click="previewVisible = false">
        <el-icon color="#fff" size="40">
          <Close />
        </el-icon>
      </div>
      <div class="preview-url" v-if="previewUrl">
        <IframeView :url="previewUrl" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.captions {
  @include p-number(10px, 25px);

  .captions-video {
    width: 100%;
    height: calc(55% - 10px);
    margin-bottom: 10px;
  }

  .captions-form {
    width: 100%;
    @include flex(space-between, center, null);

    .captions-table {
      width: calc(100% - 475px);
      margin-right: 15px;
      height: 100%;

      .captions-table-text {
        word-wrap: break-word;
        word-break: normal;
      }
    }

    .captions-input {
      width: 450px;
      height: 100%;

      .input-item {
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
