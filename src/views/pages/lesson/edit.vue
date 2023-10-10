<script setup lang="ts">
import Header from "@/components/header.vue";
import appStore from "@/store";
import {
  ElMessage,
  messageConfig,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import { checkMobile, checkEmail, uploadFile } from "@/services/util";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import router from "@/router";
const { spaceKey } = storeToRefs(appStore.spaceStore);
const { lessonInfo, lessonKey } = storeToRefs(appStore.lessonStore);
const tagList = ref<any>([]);
interface RuleForm {
  name: string;
  cover: string;
  description: string;
  tagArr: any;
  mediaType: string;
}
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
  cover: "",
  description: "",
  tagArr: [],
  mediaType: "video",
});
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "请输入课程名称", trigger: "blur" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
});
onMounted(() => {
  getTag();
});
const getTag = async () => {
  const dataRes = (await api.request.get("tag/tree")) as ResultProps;
  if (dataRes.msg === "OK") {
    tagList.value = Object.values(dataRes.data).filter((item: any) => {
      return item._key !== dataRes.rooter._key;
    });
  }
};
const uploadImage = (file, type) => {
  let mimeType = ["image/*"];
  if (file) {
    uploadFile(file, mimeType, async (url, name) => {
      switch (type) {
        case "cover":
          ruleForm.cover = url;
          break;
      }
    });
  }
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!ruleForm.cover) {
    ElMessage.error("请上传封面");
    return;
  }
  if (ruleForm.tagArr.length === 0) {
    ElMessage.error("请选择标签");
    return;
  }
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let obj = {
        name: ruleForm.name,
        cover: ruleForm.cover,
        description: ruleForm.description,
        tagArr: ruleForm.tagArr,
        mediaType: ruleForm.mediaType,
      };
      if (lessonKey.value) {
        const lessonRes = (await api.request.patch("resource", {
          resourceKey: lessonKey.value,
          ...obj,
        })) as ResultProps;
        if (lessonRes.msg === "OK") {
          ElMessage.success("编辑成功");
        }
      } else {
        const lessonRes = (await api.request.post("resource", {
          developerKey: spaceKey.value,
          ...obj,
        })) as ResultProps;
        if (lessonRes.msg === "OK") {
          ElMessage.success("新建课程成功,请等待审核");
          router.replace("/home/lesson");
        }
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
watch(
  lessonInfo,
  (newInfo) => {
    if (newInfo) {
      ruleForm.name = newInfo.name;
      ruleForm.cover = newInfo.cover;
      ruleForm.description = newInfo.description;
      ruleForm.tagArr = newInfo.tagArr;
      ruleForm.mediaType = newInfo.mediaType;
    }
  },
  { immediate: true }
);
</script>
<template>
  <Header :title="`${lessonKey ? '编辑' : '新建'}课件`" backPath="/home/lesson">
    <template #button>
      <el-button type="primary" style="margin-right: 15px" v-if="lessonKey"
        >预览</el-button
      >
      <el-button type="primary" @click="submitForm(ruleFormRef)">{{
        lessonInfo ? "编辑" : "发布"
      }}</el-button>
    </template>
  </Header>
  <div class="edit box">
    <div class="info edit-container">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        status-icon
        label-position="left"
        require-asterisk-position="right"
        style="width: 100%"
      >
        <el-form-item
          label="名称"
          prop="name"
          required
          style="margin-bottom: 35px"
        >
          <el-input
            v-model="ruleForm.name"
            size="large"
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item
          label="概述"
          prop="description"
          style="margin-bottom: 35px"
        >
          <el-input
            v-model="ruleForm.description"
            :rows="8"
            type="textarea"
            placeholder="请输入概述"
          />
        </el-form-item>
        <el-form-item
          label="封面"
          prop="cover"
          style="margin-top: 35px; margin-bottom: 35px"
          required
        >
          <div class="upload-button upload-img-button logo-box">
            <img
              :src="ruleForm.cover"
              alt=""
              :style="{ width: '100%', height: '100%' }"
              class="upload-cover"
              v-if="ruleForm.cover"
            />
            <el-icon :size="50" color="#ebebeb" v-else>
              <Plus />
            </el-icon>
            <input
              type="file"
              accept="image/*"
              @change="
                //@ts-ignore
                uploadImage($event.target.files[0], 'cover')
              "
              class="upload-img"
            />
          </div>
          <div class="right-subtitle" style="margin-left: 20px">
            展示在课件列表，建议尺寸123px*123px
          </div>
        </el-form-item>
        <el-form-item
          label="标签"
          prop="tagArr"
          required
          style="margin-bottom: 35px"
        >
          <el-checkbox-group v-model="ruleForm.tagArr">
            <el-checkbox
              v-for="(item, index) in tagList"
              :label="item._key"
              :key="`tag${item._key}`"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="类型" prop="mediaType" style="margin-bottom: 45px">
          <el-radio-group v-model="ruleForm.mediaType">
            <el-radio label="video">视频</el-radio>
            <el-radio label="audio">音频</el-radio>
            <el-radio label="pdf">课文原本</el-radio>
            <el-radio label="note">生词本</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style scoped lang="scss">
.edit {
  @include flex(center, center, null);

  .edit-container {
    width: 100%;
    height: 100%;
    min-width: 600px;
    @include p-number(25px, 15%);

    .logo-box {
      width: 150px;
      height: 150px;
      border-radius: 12px;
      overflow: hidden;
      .logo-item {
        font-size: 50px;
        color: #ebebeb;
      }
    }
    .right-subtitle {
      height: 100%;
      font-size: 14px;
      color: #b9b9b9;
      @include flex(flex-start, flex-end, null);
    }
  }
}
</style>
<style></style>
