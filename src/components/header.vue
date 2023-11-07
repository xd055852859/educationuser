<script setup lang="ts">
import api from "@/services/api";
import appStore from "@/store";
import { Bell, ArrowLeft, Plus } from "@element-plus/icons-vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { storeToRefs } from "pinia";
import { ResultProps } from "@/interface/Common";
import { uploadFile } from "@/services/util";
import Avatar from "@/components/avatar.vue";
import router from "@/router";
const { messageNum } = storeToRefs(appStore.commonStore);
const { spaceKey } = storeToRefs(appStore.spaceStore);
const { setMessageNum } = appStore.commonStore;
const props = defineProps<{
  title?: string;
  backState?: boolean;
}>();
const emits = defineEmits<{
  (e: "backFunc"): void;
}>();
interface RuleForm {
  userAvatar: string;
  userName: string;
}
const { user } = storeToRefs(appStore.authStore);
const { setUserInfo } = appStore.authStore;
const userVisible = ref<boolean>(false);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  userAvatar: "",
  userName: "",
});
const rules = reactive<FormRules<RuleForm>>({
  userName: [
    { required: true, message: "请输入用户名称", trigger: "blur" },
    // { min: 1, max: 12, message: "请输入不超过", trigger: "blur" },
  ],
});

const uploadImage = (file, type) => {
  let mimeType = ["image/*"];
  if (file) {
    uploadFile(file, mimeType, async (url, name) => {
      switch (type) {
        case "userAvatar":
          ruleForm.userAvatar = url;
          break;
      }
    });
  }
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let userRes = (await api.request.patch("user", {
        userName: ruleForm.userName,
        userAvatar: ruleForm.userAvatar,
      })) as ResultProps;
      if (userRes.msg === "OK") {
        //@ts-ignore
        let newUser: User = {
          ...user,
          userName: ruleForm.userName,
          userAvatar: ruleForm.userAvatar,
        };
        ElMessage.success("编辑用户成功");
        userVisible.value = false;
        setUserInfo(newUser);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
const getMessageNum = async () => {
  const numRes = (await api.request.get("/message/unreadNum", {
    developerKey: spaceKey.value,
  })) as ResultProps;
  if (numRes.msg === "OK") {
    setMessageNum(numRes.data);
  }
};
const logout = () => {
  router.push("/");
  localStorage.clear();
  sessionStorage.clear();
  ElMessage.success("退出登录成功");
};
watch(
  user,
  (newUser) => {
    if (newUser) {
      if (newUser?.userAvatar) {
        ruleForm.userAvatar = newUser.userAvatar;
      }
      if (newUser?.userName) {
        ruleForm.userName = newUser.userName;
      }
      if (newUser && !newUser.userAvatar && !newUser.userName) {
        userVisible.value = true;
      }
    }
  },
  { immediate: true }
);
watchEffect(() => {
  if (spaceKey.value) {
    getMessageNum();
  }
});
</script>
<template>
  <div className="header">
    <div className="header-title">
      <div v-if="backState" @click="emits('backFunc')" class="header-back">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      {{ title }}
    </div>

    <div className="header-button">
      <slot name="button"></slot>
      <div
        style="margin: 0px 20px 0px 10px"
        @click="$router.push('/home/message')"
      >
        <el-badge :value="messageNum" class="item" :hidden="messageNum === 0">
          <el-icon><Bell /></el-icon>
        </el-badge>
      </div>
      <el-dropdown>
        <Avatar :src="user?.userAvatar" :alt="user?.userName" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog v-model="userVisible" title="用户设置" width="450px">
      <div class="user-set dp-center-center">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="70px"
          status-icon
          label-position="left"
          require-asterisk-position="right"
          style="width: calc(100% - 40px)"
        >
          <el-form-item
            label="头像"
            prop="logo"
            style="margin-top: 45px; margin-bottom: 45px"
          >
            <div class="upload-button upload-img-button logo-box">
              <img
                :src="ruleForm.userAvatar"
                alt=""
                :style="{ width: '100%', height: '100%' }"
                class="upload-cover"
                v-if="ruleForm.userAvatar"
              />
              <el-icon :size="50" color="#ebebeb" v-else>
                <Plus />
              </el-icon>
              <input
                type="file"
                accept="image/*"
                @change="
                  //@ts-ignore
                  uploadImage($event.target.files[0], 'userAvatar')
                "
                class="upload-img"
              />
            </div>
          </el-form-item>
          <el-form-item
            label="名称"
            prop="userName"
            required
            style="margin-bottom: 45px"
          >
            <el-input
              v-model="ruleForm.userName"
              placeholder="请输入用户名称"
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.header {
  width: 100%;
  height: 130px;
  padding: 0px 57px;
  box-sizing: border-box;

  @include flex(space-between, center, null);
  .header-title {
    height: 42px;
    font-size: 30px;
    font-weight: 500;
    color: #484848;
    line-height: 42px;
    @include flex(flex-start, center, null);
    .header-back {
      margin-right: 10px;
      cursor: pointer;
      @include flex(flex-start, center, null);
    }
  }
  .header-button {
    height: 100%;
    cursor: pointer;
    @include flex(flex-end, center, null);
    .button-img {
      width: 40px;
      height: 100%;
      font-size: 25px;
      @include flex(center, center, null);
    }
  }
}
.user-set {
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
}
</style>
<style></style>
