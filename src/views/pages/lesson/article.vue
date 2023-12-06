<script setup lang="ts">
import Header from "@/components/header.vue";
import IframeView from "@/components/iframeView.vue";
import Sortable from "sortablejs";
import { ResultProps } from "@/interface/Common";
import { Close } from "@element-plus/icons-vue";
import api from "@/services/api";
import appStore from "@/store";
import _ from "lodash";
import { ElMessage, ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";
import axios from "axios";
const { token } = storeToRefs(appStore.authStore);
const { lessonInfo } = storeToRefs(appStore.lessonStore);
const props = defineProps<{
  mediaKey: string;
  mediaIndex: string;
}>();
const article = ref<string>("");
const articleVisible = ref<boolean>(false);
const original = ref<string>("");
const translation = ref<string>("");
const articleList = ref<any>([]);
const articleInfo = ref<any>(null);
const previewVisible = ref<boolean>(false);
const previewUrl = ref<string>("");
const mediaName = ref<string>("");
const loading = ref<boolean>(false);
const tableRef = ref<any>(null);
onMounted(async () => {
  getArticle();
  getData();
  await nextTick();
  rowDrop();
});
const getData = async () => {
  let dataRes = (await api.request.get("section", {
    mediaKey: props.mediaKey,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    articleList.value = dataRes.data;
  }
};
const getArticle = async () => {
  let dataRes = (await api.request.get("media/detail", {
    mediaKey: props.mediaKey,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    article.value = dataRes.data.content;
    mediaName.value = dataRes.data.name;
  }
};
const addArticle = async () => {
  let obj: any = {
    original: original.value,
    translation: translation.value,
  };
  let dataRes: any = null;
  if (articleInfo.value) {
    dataRes = (await api.request.patch("section", {
      sectionKey: articleInfo.value._key,
      ...obj,
    })) as ResultProps;
  } else {
    dataRes = (await api.request.post("section", {
      mediaKey: props.mediaKey,
      ...obj,
    })) as ResultProps;
  }

  if (dataRes.msg === "OK") {
    ElMessage.success(`${articleInfo.value ? "编辑" : "新增"}段落成功`);
    if (articleInfo.value) {
      let index = _.findIndex(articleList.value, {
        _key: articleInfo.value._key,
      });
      if (index !== -1) {
        articleList.value[index].original = original.value;
        articleList.value[index].translation = translation.value;
      }
    } else {
      articleList.value.push(dataRes.data);
    }
    articleInfo.value = null;
    original.value = "";
    translation.value = "";
    articleVisible.value = false;
  }
};

const toUrl = () => {
  previewVisible.value = true;
  previewUrl.value = `https://cjyy.qingtime.cn/#/preview/${lessonInfo.value?._key}?token=${token.value}&type=back&index=${props.mediaIndex}`;
};

const updatetArticle = async (file) => {
  ElMessageBox.confirm(
    "上传文件为excel,且表头为original与translation",
    "提示信息",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: 'warning',
    }
  ).then(async () => {
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
      // ElMessage.success("上传文件成功,导入中...");
      importArticle(createRes.data.filePath);
      // isUTF8.value = fileContent.indexOf("�") === -1;
      // console.log(isUTF8.value);
    }
  });
};
const importArticle = async (filePath) => {
  loading.value = true;
  const importRes = (await api.request.post("section/import", {
    filePath: filePath,
    mediaKey: props.mediaKey,
  })) as ResultProps;
  if (importRes.msg === "OK") {
    loading.value = false;
    ElMessage.success("导入成功");
    getData();
  }
};
const deleteArticle = (key, index) => {
  ElMessageBox.confirm("是否删除段落", "删除段落", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const delRes = (await api.request.delete("section", {
      mediaKey: props.mediaKey,
      sectionKey: key,
    })) as ResultProps;
    if (delRes.msg === "OK") {
      ElMessage.success("删除段落成功");
      articleList.splice(index, 1);
    }
  });
};
const rowDrop = () => {
  // 要侦听拖拽响应的DOM对象
  const tbody = document.querySelector(".el-table__body-wrapper tbody");
  Sortable.create(tbody, {
    // 结束拖拽后的回调函数
    onEnd({ newIndex, oldIndex }) {
      console.log(oldIndex);
      console.log("拖动了行，当前序号：" + newIndex);
      const currentRow = articleList.value.splice(oldIndex, 1)[0];
      articleList.value.splice(newIndex, 0, currentRow);
      let keyList = articleList.value.map((item) => item._key);
      api.request.patch("section/order", {
        mediaKey: props.mediaKey,
        sectionArr: keyList,
      });
    },
  });
};
watch(
  articleList,
  (newList) => {
    console.log("???", newList);
  },
  { deep: true }
);
</script>
<template>
  <Header :title="`${mediaName}`" backState @backFunc="$router.back()">
    <template #button>
      <el-button
        type="primary"
        style="margin-right: 5px"
        @click="toUrl()"
        plain
        v-if="lessonInfo?.mediaType === 'pdf'"
        >预览</el-button
      >

      <el-button
        type="primary"
        style="margin-right: 5px"
        @click="articleVisible = true"
        plain
        >新增</el-button
      >
      <div class="upload-button" style="margin-left: 10px">
        <el-button type="primary">导入文章</el-button>
        <input
          type="file"
          @change="
            //@ts-ignore
            updatetArticle($event.target.files[0])
          "
          accept=".xls,.xslx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          class="upload-img"
        />
      </div>
    </template>
  </Header>
  <!-- <el-input
      v-model="article"
      class="article-box"
      :autosize="{ minRows: 20 }"
      type="textarea"
      placeholder="请输入文章内容"
    /> -->
  <div class="article box">
    <el-table
      :data="articleList"
      row-key="_key"
      fit
      style="width: 100%; height: 100%"
      stripe
      v-loading="loading"
      ref="tableRef"
    >
      <el-table-column prop="original" label="原文" header-align="center" />
      <el-table-column prop="translation" label="译文" header-align="center" />
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="
              articleInfo = scope.row;
              articleVisible = true;
              original = scope.row.original;
              translation = scope.row.translation;
            "
            >编辑</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="deleteArticle(scope.row._key, scope.$index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="preview-url-box" v-if="previewVisible">
      <div class="preview-url-icon" @click="previewVisible = false">
        <el-icon color="#fff" size="40"><Close /></el-icon>
      </div>
      <div class="preview-url" v-if="previewUrl">
        <IframeView :url="previewUrl" />
      </div>
    </div>
    <el-dialog
      v-model="articleVisible"
      :title="articleInfo ? '编辑段落' : '新增段落'"
      width="80%"
      destroy-on-close
    >
      <div class="article-box">
        <div class="article-left">
          <el-input
            v-model="original"
            :autosize="{ minRows: 15 }"
            type="textarea"
            placeholder="请输入英文原文"
          />
        </div>
        <div class="article-right">
          <el-input
            v-model="translation"
            :autosize="{ minRows: 15 }"
            type="textarea"
            placeholder="请输入中文译文"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="articleVisible = false">取消</el-button>
          <el-button type="primary" @click="addArticle()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.article {
  @include p-number(10px, 25px);
  .article-box {
    width: 100%;
    margin-bottom: 15px;
    @include p-number(10px, 35px);
    @include flex(space-between, center, null);
    .article-left {
      width: 48%;
      height: 50vh;
      @include scroll();
    }
    .article-right {
      width: 48%;
      height: 50vh;
      @include scroll();
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
