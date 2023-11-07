<script setup lang="ts">
import Header from "@/components/header.vue";
import { ResultProps } from "@/interface/Common";
import { Close } from "@element-plus/icons-vue";
import api from "@/services/api";
import appStore from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import axios from "axios";
const { token } = storeToRefs(appStore.authStore);
const { lessonInfo } = storeToRefs(appStore.lessonStore);
const props = defineProps<{
  mediaKey: string;
  mediaIndex: string;
}>();
const article = ref<string>("");
const previewVisible = ref<boolean>(false);
const previewUrl = ref<string>("");
const mediaName = ref<string>("");
const loading = ref<boolean>(false);
onMounted(() => {
  getArticle();
});
const getArticle = async () => {
  let dataRes = (await api.request.get("media/detail", {
    mediaKey: props.mediaKey,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    article.value = dataRes.data.content;
    mediaName.value = dataRes.data.name;
  }
};
const saveArticle = async () => {
  if (!/[a-zA-Z]+/.test(article.value)) {
    ElMessage.error("请输入英文原文");
    return;
  }
  let fileRes = (await api.request.patch("media", {
    mediaKey: props.mediaKey,
    content: article.value,
  })) as ResultProps;
  if (fileRes.msg === "OK") {
    ElMessage.success("保存文章成功");
  }
};

const toUrl = () => {
  previewVisible.value = true;
  previewUrl.value = `https://yujing.qingtime.cn/#/preview/${lessonInfo.value?._key}?token=${token.value}&type=back&index=${props.mediaIndex}`;
};

const updatetArticle = async (file) => {
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
    importArticle(createRes.data.filePath);
    // isUTF8.value = fileContent.indexOf("�") === -1;
    // console.log(isUTF8.value);
  }
};
const importArticle = async (filePath) => {
  loading.value = true;
  const importRes = (await api.request.post("media/import/text", {
    filePath: filePath,
    mediaKey: props.mediaKey,
  })) as ResultProps;
  if (importRes.msg === "OK") {
    loading.value = false;
    ElMessage.success("导入成功");
    getArticle();
  }
};
</script>
<template>
  <Header :title="mediaName" backState @backFunc="$router.back()">
    <template #button>
      <el-button type="primary" style="margin-right: 5px" @click="toUrl()" plain
        >预览</el-button
      >
      <el-button
        type="primary"
        style="margin-right: 5px"
        @click="saveArticle"
        plain
        >保存</el-button
      >
      <div class="upload-button" style="margin-left: 10px">
        <el-button type="primary" class="common-button">导入文章</el-button>
        <input
          type="file"
          @change="
            //@ts-ignore
            updatetArticle($event.target.files[0])
          "
          class="upload-img"
        />
      </div>
    </template>
  </Header>
  <div class="article">
    <el-input
      v-model="article"
      class="article-box"
      :autosize="{ minRows: 20 }"
      type="textarea"
      placeholder="请输入文章内容"
    />
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
.article {
  @include scroll();
  @include p-number(10px, 25px);
  .article-box {
    width: 100%;
    height: calc(100vh - 130px);
    margin-top: 40px;
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
