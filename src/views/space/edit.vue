<script setup lang="ts">
import Header from "@/components/header.vue";
import FontIcon from "@/components/fontIcon.vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { checkMobile, checkEmail, uploadFile } from "@/services/util";
import api from "@/services/api";
import _ from "lodash";
import { ResultProps } from "@/interface/Common";
import router from "@/router";

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
      let applyRes = (await api.request.post("developer/apply", {
        name: ruleForm.name,
        logo: ruleForm.logo,
        contact: ruleForm.contact,
        email: ruleForm.email,
      })) as ResultProps;
      if (applyRes.msg === "OK") {
        ElMessage.success("申请成功");
        router.replace("/space");
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

// const resetForm = (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   formEl.resetFields()
// }
</script>
<template>
  <div class="space-edit">
    <Header title="创作者详情" backState @backFunc="$router.push('/space')">
      <template #button>
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
          :disabled="!readState"
          >申请</el-button
        >
      </template>
    </Header>
    <div class="space-edit-box box">
      <div class="edit-container">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="150px"
          status-icon
          label-position="left"
          require-asterisk-position="right"
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
              <FontIcon iconName="touxiang" v-else />
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
          <el-form-item label="电子邮箱" prop="email">
            <el-input
              v-model="ruleForm.email"
              size="large"
              style="margin-bottom: 45px"
            />
          </el-form-item>
        </el-form>
        <div class="edit-subtitle">
          <el-checkbox
            v-model="readState"
            label="我已阅读并同意创作者协议"
            size="large"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.space-edit {
  width: 100vw;
  height: 100vh;
  .space-edit-box {
    width: 100%;
    font-size: 16px;
    @include flex(center, center, wrap);
    .edit-container {
      width: 100%;
      height: 100%;
      min-width: 600px;
      @include scroll();
      @include p-number(10px, 15%);

      .logo-box {
        width: 82px;
        height: 82px;
        background: #b9c4fc;
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
      .edit-subtitle {
        font-size: 14px;
        color: #a9a9a9;
      }
    }
  }
}
</style>
<style lang="scss">
.space-edit {
  .space-edit-box {
    .logo-box {
      .font-icon {
        font-size: 40px;
        color: #fff;
      }
    }
  }
}
</style>
