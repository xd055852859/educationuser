<script setup lang="ts">
import Header from "@/components/header.vue";
import "vue3-video-play/dist/style.css";
import { videoPlay } from "vue3-video-play";
const dayjs: any = inject("dayjs");
const captionsList = ref<any>([]);
const addState = ref<boolean>(false);
const time = ref<string>("");
const cn = ref<string>("");
const en = ref<string>("");
const videoRef = ref<any>(null);

const options = reactive({
  src: "https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4", //视频源
  poster: "", //封面
});
const onPlay = (ev) => {
  console.log("播放");
};
const onPause = (ev) => {
  console.log(ev, "暂停");
  if (addState.value) {
    time.value = dayjs
      .duration(ev.target.currentTime, "seconds")
      .format("HH:mm:ss");
    addState.value = false;
  }
};

const onTimeupdate = (ev) => {
  console.log(ev.target.currentTime, "时间更新");
};
const onCanplay = (ev) => {
  console.log(ev, "可以播放");
};
const addCaptions = () => {
  console.log(videoRef.value);
  cn.value = "";
  en.value = "";
  addState.value = true;
  videoRef.value.pause();
};
</script>
<template>
  <Header title="课件详情">
    <template #button>
      <el-button type="primary" style="margin-right: 5px">预览</el-button>
      <el-button type="primary" style="margin-right: 5px" @click="addCaptions"
        >添加</el-button
      >
      <el-button type="primary">导入字幕</el-button>
    </template>
  </Header>
  <div class="captions box">
    <div class="captions-video">
      <videoPlay
        id="video"
        ref="videoRef"
        width="100%"
        height="100%"
        title="钢铁侠"
        :src="options.src"
        :poster="options.poster"
        @play="onPlay"
        @pause="onPause"
        @timeupdate="onTimeupdate"
        @canplay="onCanplay"
        crossOrigin="Anonymous"
      />
    </div>
    <div class="captions-form">
      <div class="captions-table">
        <el-table :data="captionsList" fit style="width: 100%">
          <el-table-column prop="name" label="时间" align="center">
            <template #default="scope">
              <div></div>
            </template>
          </el-table-column>
          <el-table-column prop="tagName" label="原文" align="center" />
          <el-table-column prop="tagName" label="译文" align="center" />
        </el-table>
      </div>
      <div class="captions-input info">
        <div class="input-item">
          <div class="left">时间</div>
          <div class="right">
            <el-input v-model="time" placeholder="请选择时间" />
          </div>
        </div>
        <div class="input-item info-area">
          <div class="left">原文</div>
          <div class="right">
            <el-input
              v-model="cn"
              :rows="4"
              type="textarea"
              placeholder="请输入原文"
            />
          </div>
        </div>
        <div class="input-item info-area">
          <div class="left">译文</div>
          <div class="right">
            <el-input
              v-model="en"
              :rows="4"
              type="textarea"
              placeholder="请输入译文"
            />
          </div>
        </div>
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
    height: 45%;
    @include flex(space-between, center, null);
    .captions-table {
      width: 30%;
      height: 100%;
    }
    .captions-input {
      width: 65%;
      height: 100%;
      .input-item {
      }
    }
  }
}
</style>
<style></style>
