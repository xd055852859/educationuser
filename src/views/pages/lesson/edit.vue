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
import _ from "lodash";
import {
  checkMobile,
  checkEmail,
  uploadFile,
  formatData,
} from "@/services/util";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import router from "@/router";
import Media from "./media.vue";
const { spaceKey } = storeToRefs(appStore.spaceStore);
const { lessonInfo, lessonKey } = storeToRefs(appStore.lessonStore);
const { setLessonInfo } = appStore.lessonStore;
const tagList = ref<any>(null);
const tagTypeList = ref<any>(null);
interface RuleForm {
  name: string;
  cover: string;
  description: string;
  tagType: string;
  tagArr: any;
  mediaType: string;
}
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
  cover: "",
  description: "",
  tagType: "inner",
  tagArr: [],
  mediaType: "pdf",
});
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "请输入课程名称", trigger: "blur" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  tagArr: [
    { required: true, message: "请选择标签", trigger: "blur" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
});
onMounted(() => {
  getTagList();
});
const getTagList = async () => {
  const dataRes = (await api.request.get("tag/list")) as ResultProps;
  if (dataRes.msg === "OK") {
    tagList.value = dataRes.data;
    console.log(tagList.value);
  }
};
const getTag = async (key) => {
  const dataRes = (await api.request.get("tag/tree", {
    tagKey: key,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    tagTypeList.value = [formatData(dataRes.data, key)];
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
const updateGrounding = async () => {
  const lessonRes = (await api.request.patch("resource", {
    resourceKey: lessonKey,
    grounding: true,
  })) as ResultProps;
  if (lessonRes.msg === "OK") {
    ElMessage.success("已提交审核,请耐心等待");
    router.replace("/home/lesson");
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
        tagType: ruleForm.tagType,
        mediaType: ruleForm.mediaType,
      };
      if (lessonKey.value) {
        const lessonRes = (await api.request.patch("resource", {
          resourceKey: lessonKey.value,
          ...obj,
        })) as ResultProps;
        if (lessonRes.msg === "OK") {
          ElMessage.success("编辑成功");
          setLessonInfo(lessonRes.data);
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
const changeCheck = (checkedNodes, checkedKeys) => {
  ruleForm.tagArr = [];
  checkedKeys.checkedNodes.forEach((item) => {
    if (item.children.length === 0) {
      ruleForm.tagArr.push(item._key);
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
      ruleForm.tagType = newInfo.tagType ? newInfo.tagType : "inner";
      if (ruleForm.tagType !== lessonInfo.value.tagType) {
        ruleForm.tagArr = [];
      } else {
        ruleForm.tagArr = newInfo.tagArr;
      }
      ruleForm.mediaType = newInfo.mediaType;
    }
  },
  { immediate: true }
);
watch(
  [() => ruleForm.tagType, tagList],
  ([newType, newList]) => {
    if (newList && newList.length > 0) {
      let type = newType === "inner" ? "课本" : "课外泛读";
      let index = _.findIndex(newList, { name: type });
      // console.log(newType);
      if (index !== -1) {
        getTag(newList[index]._key);
      }
    }
  },
  { immediate: true }
);
watch(
  () => ruleForm.tagType,
  (newType) => {
    console.log(newType);
    // console.log(lessonInfo.value.tagType);
    if (lessonInfo.value && newType !== lessonInfo.value.tagType) {
      ruleForm.tagArr = [];
    }
  }
);
</script>
<template>
  <Header
    :title="`${lessonKey ? '编辑' : '新建'}课件`"
    backState
    @backFunc="$router.back()"
  >
    <template #button>
      <el-button
        type="primary"
        @click="submitForm(ruleFormRef)"
        plain
        class="common-button"
        >保存</el-button
      >
      <!-- <el-button
        type="primary"
        style="margin-right: 15px"
        class="common-button"
        v-if="lessonInfo && lessonInfo.status === 0 && !lessonInfo.grounding"
        @click="updateGrounding()"
        >审核</el-button
      > -->
    </template>
  </Header>
  <div class="edit-container">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="150px"
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
          style="width: 70%"
        />
      </el-form-item>
      <el-form-item label="概述" prop="description" style="margin-bottom: 35px">
        <el-input
          v-model="ruleForm.description"
          :rows="8"
          type="textarea"
          placeholder="请输入概述"
          style="width: 70%"
          size="large"
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
          <el-icon :size="30" color="#ebebeb" v-else>
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
        label="标签类型"
        prop="cover"
        style="margin-top: 35px; margin-bottom: 35px"
      >
        <el-radio-group v-model="ruleForm.tagType" size="large">
          <el-radio label="inner">课本</el-radio>
          <el-radio label="outer">课外泛读</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="标签"
        prop="tagArr"
        required
        style="margin-bottom: 35px"
      >
        <div class="menu-tree" v-if="tagTypeList" style="width: 70%">
          <el-tree-select
            v-model="ruleForm.tagArr"
            :data="tagTypeList"
            :accordion="true"
            :indent="15"
            node-key="_key"
            :default-expand-all="true"
            :expand-on-click-node="false"
            ref="treeRef"
            multiple
            show-checkbox
            check-strictly
            style="width: 100%"
            size="large"
          >
            <template #default="{ node, data }">
              <!-- :style="chooseKey === data._key ? { background: '#ebebeb' } : {}" -->
              <!--  @mouseenter="setOver(data._key, type)" -->
              <div class="menu-tree-item">
                <div class="tree-item-left dp--center">
                  <div
                    class="single-to-long"
                    style="max-width: calc(100% - 30px)"
                  >
                    {{ data.name }}
                  </div>
                </div>
                <div class="tree-item-right"></div>
              </div>
            </template>
          </el-tree-select>
        </div>
      </el-form-item>
      <el-form-item label="类型" prop="mediaType" style="margin-bottom: 45px">
        <el-radio-group
          v-model="ruleForm.mediaType"
          :disabled="lessonKey !== ''"
          size="large"
        >
          <el-radio label="pdf" v-if="ruleForm.tagType === 'inner'"
            >文章</el-radio
          >
          <el-radio label="video" v-if="ruleForm.tagType === 'outer'"
            >视频</el-radio
          >
          <el-radio label="audio">音频</el-radio>
          <!-- <el-radio label="note">生词本</el-radio> -->
        </el-radio-group>
      </el-form-item>
    </el-form>
    <Media v-if="lessonKey" />
  </div>
</template>
<style scoped lang="scss">
.edit-container {
  width: 100%;
  height: calc(100vh - 130px);
  @include p-number(25px, 53px);
  @include scroll();

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
    font-size: 18px;
    color: #b9b9b9;
    @include flex(flex-start, flex-end, null);
  }
  .menu-tree {
    width: 100%;
    .menu-tree-item {
      width: calc(100% - 25px);
      height: 100%;
      @include flex(space-between, center, null);
      .tree-item-left {
        width: calc(100% - 35px);
        @include flex(flex-start, center, null);
      }
      .tree-item-button {
        display: none;
      }

      &:hover {
        .tree-item-button {
          @include flex(flex-end, center, null);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.edit-container {
  .el-tree-node__content {
    height: 35px;
  }
}
</style>
