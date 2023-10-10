<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import Header from "@/components/header.vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { checkMobile, checkEmail, uploadFile } from "@/services/util";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { storeToRefs } from "pinia";
import _ from "lodash";
import appStore from "@/store";
const { spaceInfo, spaceList, spaceKey } = storeToRefs(appStore.spaceStore);
const { setSpaceInfo, setSpaceList } = appStore.spaceStore;

interface RuleForm {
  name: string;
  logo: string;
  contact: string;
  email: string;
}
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
  logo: "",
  contact: "",
  email: "",
});
const readState = ref<boolean>(false);
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "请输入创作者名称", trigger: "blur" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  contact: [
    {
      validator: checkMobile,
      trigger: "blur",
    },
  ],
  email: [{ validator: checkEmail, trigger: "blur" }],
});

const uploadImage = (file, type) => {
  let mimeType = ["image/*"];
  if (file) {
    uploadFile(file, mimeType, async (url, name) => {
      switch (type) {
        case "logo":
          ruleForm.logo = url;
          break;
      }
    });
  }
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let applyRes = (await api.request.patch("developer", {
        developerKey: spaceKey.value,
        name: ruleForm.name,
        logo: ruleForm.logo,
        contact: ruleForm.contact,
        email: ruleForm.email,
      })) as ResultProps;
      if (applyRes.msg === "OK") {
        ElMessage.success("保存成功");
        let list = _.cloneDeep(spaceList.value);
        let info: any = _.cloneDeep(spaceInfo.value);
        let index = _.findIndex(list, { _key: spaceKey.value });
        if (index !== -1) {
          list[index] = {
            ...list[index],
            name: ruleForm.name,
            logo: ruleForm.logo,
          };
          setSpaceList(list);
        }
        info = {
          ...info,
          name: ruleForm.name,
          logo: ruleForm.logo,
          contact: ruleForm.contact,
          email: ruleForm.email,
        };
        setSpaceInfo(info);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
watch(
  spaceInfo,
  (newInfo) => {
    if (newInfo) {
      ruleForm.name = newInfo.name;
      ruleForm.logo = newInfo.logo;
      ruleForm.contact = newInfo.contact;
      ruleForm.email = newInfo.email;
    }
  },
  { immediate: true }
);
</script>
<template>
  <Header title="账号中心">
    <template #button>
      <el-button type="primary" @click="submitForm(ruleFormRef)"
        >保存</el-button
      >
    </template>
  </Header>
  <div class="account box">
    <div class="account-container">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="200px"
        status-icon
        label-position="left"
        require-asterisk-position="right"
        style="width: 100%"
      >
        <el-form-item
          label="头像"
          prop="logo"
          style="margin-top: 45px; margin-bottom: 45px"
        >
          <div class="upload-button upload-img-button logo-box">
            <img
              :src="ruleForm.logo"
              alt=""
              :style="{ width: '100%', height: '100%' }"
              class="upload-cover"
              v-if="ruleForm.logo"
            />
            <el-icon :size="50" color="#ebebeb" v-else>
              <Plus />
            </el-icon>
            <input
              type="file"
              accept="image/*"
              @change="
                //@ts-ignore
                uploadImage($event.target.files[0], 'logo')
              "
              class="upload-img"
            />
          </div>
        </el-form-item>
        <el-form-item
          label="创作者 (机构)"
          prop="name"
          required
          style="margin-bottom: 45px"
        >
          <el-input v-model="ruleForm.name" size="large" />
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="contact"
          required
          style="margin-bottom: 45px"
        >
          <el-input v-model="ruleForm.contact" size="large" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email" style="margin-bottom: 45px">
          <el-input v-model="ruleForm.email" size="large" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style scoped lang="scss">
.account {
  width: 100%;
  height: 100%;
  font-size: 16px;
  @include flex(center, center, wrap);
  .account-container {
    width: 100%;
    height: 100%;
    min-width: 600px;
    @include scroll();
    @include p-number(10px, 15%);
    @include flex(center, flex-start, null);
    .logo-box {
      width: 200px;
      height: 200px;
      border-radius: 12px;
      overflow: hidden;
      .logo-item {
        font-size: 50px;
        color: #ebebeb;
      }
    }

    .edit-input {
      width: 100%;
      height: 60px;
      margin-bottom: 15px;
      @include flex(flex-start, center, null);
      > div:nth-child(1) {
        width: 120px;
      }
      > div:nth-child(2) {
        width: calc(100% - 90px);
      }
    }
  }
}
</style>
<style></style>
