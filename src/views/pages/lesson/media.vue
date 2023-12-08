<script setup lang="ts">
import appStore from "@/store";
import { storeToRefs } from "pinia";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { uploadFile, bytesToSize, getUrlDuration } from "@/services/util";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
const dayjs: any = inject("dayjs");

const { lessonKey, lessonInfo } = storeToRefs(appStore.lessonStore);
interface RuleForm {
  url: string;
  name: string;
  uploadType: string;
}
const checkBox = ref<boolean>(false);
const videoList = ref<any>([]);
const fileVisible = ref<boolean>(false);
const fileSize = ref<number>(0);
const mediaTime = ref<number>(0);
const loading = ref<boolean>(false);
const editLoading = ref<boolean>(false);
const mediaKey = ref<string>("");
const mediaName = ref<string>("");
const mediaUrl = ref<string>("");
const mediaType = ref<string>("");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
  url: "",
  uploadType: "inner",
});
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "请输入资源名称", trigger: "blur" },
    // { min: 1, max: 12, message: "请输入不超过", trigger: "blur" },
  ],
  url: [
    { required: true, message: "请输入资源链接", trigger: "blur" },
    // { min: 1, max: 12, message: "请输入不超过", trigger: "blur" },
  ],
});
onMounted(() => {
  getData();
});
const getData = async () => {
  let dataRes = (await api.request.get("media", {
    resourceKey: lessonKey.value,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    videoList.value = dataRes.data;
  }
};
const uploadImage = (file, type, index) => {
  let mimeType: any = [];
  switch (lessonInfo.value.mediaType) {
    case "video":
      mimeType = ["video/*"];
      break;
    case "audio":
      mimeType = ["audio/*"];
      break;
    case "pdf":
      mimeType = ["application/pdf"];
      break;
    // case "note":
    // break;
  }
  switch (type) {
    case "url":
      loading.value = true;
      break;
    case "mediaUrl":
      editLoading.value = true;
      break;
  }

  if (file) {
    uploadFile(file, [], async (url, name) => {
      switch (type) {
        case "url":
          loading.value = false;
          console.log(file);
          fileSize.value = file.size;
          ruleForm.url = url;
          break;
        case "mediaUrl":
          editLoading.value = false;
          updateMedia(["url", "size"], [url, file.size], index);
          break;
      }
    });
  }
};
const submitForm = (formEl: FormInstance | undefined) => {
  if (!ruleForm.name || !ruleForm.name.trim()) {
    ElMessage.error("请输入名称");
    return;
  }
  if (!ruleForm.url) {
    ElMessage.error("请上传资源");
    return;
  }
  if (!formEl) {
    ElMessage.error("请输入内容");
    return;
  } else {
    if (
      (lessonInfo.value.mediaType === "video" ||
        lessonInfo.value.mediaType === "audio") &&
      ruleForm.uploadType === "inner"
    ) {
      console.log(ruleForm.url);
      getUrlDuration(ruleForm.url, (time) => {
        console.log(time);
        mediaTime.value = time;
        saveForm(formEl);
      });
    } else {
      saveForm(formEl);
    }
  }
};
const saveForm = async (formEl: FormInstance) => {
  await formEl.validate(async (valid, fields) => {
    console.log(valid);
    if (valid) {
      let fileRes = (await api.request.post("media", {
        resourceKey: lessonKey.value,
        name: ruleForm.name,
        url: ruleForm.url,
        fileSize: fileSize.value,
        mediaTime: mediaTime.value,
      })) as ResultProps;
      if (fileRes.msg === "OK") {
        ElMessage.success("新增资源成功");
        fileVisible.value = false;
        videoList.value.push(fileRes.data);
        clearForm();
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
const clearForm = () => {
  ruleForm.name = "";
  ruleForm.url = "";
  ruleForm.uploadType = "inner";
  fileSize.value = 0;
  mediaTime.value = 0;
};
const deleteMedia = async (key, index) => {
  ElMessageBox.confirm("是否删除该资源", "删除资源", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const delRes = (await api.request.delete("media", {
      mediaKey: key,
    })) as ResultProps;
    if (delRes.msg === "OK") {
      ElMessage.success("删除资源成功");
      videoList.value.splice(index, 1);
    }
  });
};
const updateMedia = async (keyArray, valueArray, index) => {
  let obj: any = {};
  keyArray.forEach((item, index) => {
    obj[item] = valueArray[index];
  });
  let updateRes = (await api.request.patch("media", {
    mediaKey: mediaKey.value,
    ...obj,
  })) as ResultProps;
  if (updateRes.msg === "OK") {
    videoList.value[index] = {
      ...videoList.value[index],
      ...obj,
    };
    mediaKey.value = "";
    mediaType.value = "";
    mediaName.value = "";
  }
};
</script>
<template>
  <div class="media" v-if="lessonInfo">
    <div class="media-title">
      <div class="edit-title-left" style="font-size: 16px">
        {{
          lessonInfo.mediaType === "video"
            ? "视频"
            : lessonInfo.mediaType === "audio"
            ? "音频"
            : "文章"
        }}
      </div>
      <div class="edit-title-right">
        <el-button
          type="primary"
          style="margin-right: 15px"
          size="small"
          @click="fileVisible = true"
          >添加</el-button
        >
        <!-- <el-button type="primary" size="small">批量导入</el-button> -->
      </div>
    </div>
    <div class="media-table">
      <el-table :data="videoList" style="width: 100%" stripe fit>
        <el-table-column label="序号" type="index" width="70" align="center" />
        <el-table-column label="名称" align="center">
          <template #default="scope">
            <el-input
              :rows="3"
              type="textarea"
              v-model="mediaName"
              placeholder="请输入资源名"
              v-if="mediaKey === scope.row._key && mediaType === 'name'"
              @blur="updateMedia(['name'], [mediaName], scope.$index)"
              size="large"
              autofocus
            />
            <div
              v-else
              @click="
                mediaType = 'name';
                mediaKey = scope.row._key;
                mediaName = scope.row.name;
              "
            >
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="资源地址"
          header-align="center"
          v-if="lessonInfo.mediaType !== 'pdf'"
        >
          <template #default="scope">
            <div v-if="mediaKey === scope.row._key && mediaType === 'url'">
              <el-input
                :rows="3"
                type="textarea"
                v-model="mediaName"
                placeholder="请输入资源地址"
                @blur="updateMedia(['url'], [mediaName], scope.$index)"
                size="large"
              />
              <div class="user-set-upload">
                <el-button type="primary" @click="" :loading="editLoading"
                  >上传资源</el-button
                >
                <input
                  type="file"
                  :accept="
                    lessonInfo.mediaType === 'video'
                      ? 'video/*'
                      : lessonInfo.mediaType === 'audio'
                      ? 'audio/*'
                      : 'application/pdf'
                  "
                  @change="
                    uploadImage(
                      //@ts-ignore
                      $event.target.files[0],
                      'mediaUrl',
                      scope.$index
                    )
                  "
                  class="upload-button"
                />
              </div>
            </div>
            <div
              v-else
              @click="
                mediaType = 'url';
                mediaKey = scope.row._key;
                mediaName = scope.row.url;
              "
            >
              {{ scope.row.url }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="时长"
          align="center"
          width="140"
          v-if="lessonInfo.mediaType !== 'pdf'"
        >
          <template #default="scope">
            {{
              dayjs.duration(scope.row.mediaTime, "seconds").format("HH:mm:ss")
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="大小"
          align="center"
          width="140"
          v-if="lessonInfo.mediaType !== 'pdf'"
        >
          <template #default="scope">
            {{ scope.row.fileSize ? bytesToSize(scope.row.fileSize) : 0 }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              v-if="lessonInfo.mediaType !== 'pdf'"
              @click="
                $router.push(
                  `/home/lessonCaptions/${scope.row._key}/${scope.$index}`
                )
              "
              >编辑</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="
                $router.push(
                  `/home/lessonArticle/${scope.row._key}/${scope.$index}`
                )
              "
              >文章</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="deleteMedia(scope.row._key, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-model="fileVisible"
      title="资源设置"
      width="550px"
      destroy-on-close
    >
      <div class="user-set dp-center-center">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          status-icon
          label-position="left"
          require-asterisk-position="right"
          style="width: calc(100% - 40px)"
          v-loading="loading"
          element-loading-text="上传资源中..."
        >
          <el-form-item
            label="名称"
            prop="name"
            required
            style="margin-bottom: 25px"
          >
            <el-input
              v-model="ruleForm.name"
              placeholder="请输入资源名称"
              size="large"
            />
          </el-form-item>
          <template v-if="lessonInfo.mediaType !== 'pdf'">
            <!-- <el-form-item
              label="上传方式"
              prop="uploadType"
              style="margin-top: 25px; margin-bottom: 25px"
            >
              <el-radio-group v-model="ruleForm.uploadType">
                <el-radio label="inner">本地上传</el-radio>
                <el-radio label="outer">外部链接</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item
              label="链接"
              prop="uploadType"
              style="margin-top: 25px; margin-bottom: 25px"
            >
              <div v-if="ruleForm.uploadType === 'inner'">
                <div class="user-set-upload">
                  <el-button type="primary" @click="">上传资源</el-button>
                  <input
                    type="file"
                    :accept="
                      lessonInfo.mediaType === 'video'
                        ? 'video/*'
                        : lessonInfo.mediaType === 'audio'
                        ? 'audio/*'
                        : 'application/pdf'
                    "
                    @change="
                      //@ts-ignore
                      uploadImage($event.target.files[0], 'url', -1)
                    "
                    class="upload-button"
                  />
                </div>
                {{ ruleForm.url }}
              </div>
              <el-input
                v-model="ruleForm.url"
                placeholder="输入外部链接地址"
                v-else
              />
            </el-form-item>
          </template>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="fileVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.media {
  flex-wrap: wrap;

  .media-title {
    width: 100%;
    height: 50px;
    color: var(--el-text-color-regular);
    margin-bottom: 20px;
    @include flex(space-between, center, null);
  }

  .media-table {
    width: 100%;
    min-height: 250px;
  }
}

.user-set {
  height: 320px;
}

.user-set-upload {
  position: relative;
  z-index: 1;

  .upload-button {
    position: absolute;
    z-index: 2;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
<style></style>
