<script setup lang="ts">
import { Search, ArrowDown } from "@element-plus/icons-vue";
import Header from "@/components/header.vue";
import api from "@/services/api";
import { ResultProps, ROLE_OPTIONS } from "@/interface/Common";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import Avatar from "@/components/avatar.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import router from "@/router";
const { user } = storeToRefs(appStore.authStore);
const { spaceKey, spaceRole } = storeToRefs(appStore.spaceStore);
const memberList = ref<any>([]);
const searchList = ref<any>([]);
const searchName = ref<string>("");
const addVisible = ref<boolean>(false);
const memberInput = ref<string>("");
onMounted(() => {
  getData();
});
const getData = async () => {
  let dataRes = (await api.request.get("developMember", {
    developerKey: spaceKey.value,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    memberList.value = dataRes.data;
  }
};
const changeRole = async (val, index) => {
  const roleRes = (await api.request.patch("developMember/role", {
    developerKey: spaceKey.value,
    memberKey: memberList.value[index].userKey,
    newRole: val,
  })) as ResultProps;
  if (roleRes.msg === "OK") {
    memberList.value[index].role = val;
  }
};
const deleteMember = (index) => {
  ElMessageBox.confirm("是否删除该用户", "删除用户", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const memberRes = (await api.request.delete("developMember", {
      developerKey: spaceKey.value,
      memberKeyArr: [memberList.value[index].userKey],
    })) as ResultProps;
    if (memberRes.msg === "OK") {
      ElMessage.success("删除用户成功");
      memberList.value.splice(index, 1);
    }
  });
};
const searchMember = async () => {
  if (memberInput.value) {
    const searchRes = (await api.request.get("user/search", {
      keyWord: memberInput.value,
    })) as ResultProps;
    if (searchRes.msg === "OK") {
      searchList.value = searchRes.data;
    }
  } else {
    searchList.value = [];
  }
};

const addMember = async (index: number, userKey: string) => {
  const memberRes = (await api.request.post("/developMember", {
    developerKey: spaceKey.value,
    role: 3,
    memberKey: userKey,
  })) as ResultProps;
  if (memberRes.msg === "OK") {
    ElMessage.success("添加成员成功");
    searchList.value.splice(index, 1);
    memberList.value.push(memberRes.data);
    addVisible.value = false;
  }
};
const outMember = () => {
  ElMessageBox.confirm("是否退出该创作者", "退出创作者", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const memberRes = (await api.request.delete("developMember/exit", {
      developerKey: spaceKey.value,
    })) as ResultProps;
    if (memberRes.msg === "OK") {
      ElMessage.success("退出创作者成功");
      router.replace("/space");
    }
  });
};
</script>
<template>
  <Header title="用户数据" />
  <div class="box">
    <div class="box-header">
      <!-- <el-input
        v-model="searchName"
        placeholder="请输入用户名称"
        style="width: 300px"
        :prefix-icon="Search"
      /> -->
      <div></div>
      <div>
        <el-button type="primary" @click="addVisible = true"
          >邀请成员</el-button
        >
      </div>
    </div>
    <div class="box-table">
      <el-table :data="memberList" style="height: 100%" stripe>
        <el-table-column label="头像" align="center">
          <template #default="scope"
            ><div class="dp-center-center">
              <Avatar
                :src="scope.row.userAvatar"
                :alt="scope.row.userName"
                :size="40"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名" align="center" />
        <el-table-column prop="mobile" label="手机号" align="center" />
        <el-table-column prop="name" label="权限" align="center">
          <template #default="scope">
            <div
              class="icon-point dp-center-center"
              v-if="spaceRole < scope.row.role"
            >
              <el-dropdown>
                <div
                  class="dp-center-center"
                  style="
                     {
                      height: 100%;
                    }
                  "
                >
                  {{
                    scope.row.role === 0
                      ? "超管"
                      : ROLE_OPTIONS[scope.row.role - 1]?.label
                  }}
                  <el-icon style="margin-left: 10px"><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="(item, index) in ROLE_OPTIONS"
                      :key="item.value"
                      @click="changeRole(item.value, scope.$index)"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <div v-else class="dp-center-center">
              {{
                scope.row.role === 0
                  ? "超管"
                  : ROLE_OPTIONS[scope.row.role - 1]?.label
              }}
            </div>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="scope">
            <!-- <el-button link type="primary" size="small" @click=""
              >查看</el-button
            > -->
            <el-button
              link
              type="primary"
              size="small"
              @click="deleteMember(scope.$index)"
              v-if="scope.row.role > spaceRole"
              >删除</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              v-if="scope.row.userKey === user?._key && scope.row.role !== 0"
              @click="outMember()"
              >退出</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-model="addVisible"
      title="搜索用户"
      width="40%"
      @close="
        addVisible = false;
        memberInput = '';
        searchList = [];
      "
      destroy-on-close
    >
      <div class="member-search">
        <div class="member-search-title dp-space-center">
          <el-input
            v-model="memberInput"
            placeholder="请输入用户名"
            :prefix-icon="Search"
            @change="searchMember()"
            size="large"
          />
        </div>
        <div class="member-search-container">
          <template v-if="searchList.length > 0">
            <div
              class="member-search-item"
              v-for="(item, index) in searchList"
              :key="`search${index}`"
            >
              <div class="member-search-left">
                <div class="member-search-avatar">
                  <Avatar :src="item.userAvatar" :alt="item.userName" />
                </div>
                <div>{{ item.userName }}</div>
              </div>
              <div class="member-search-right">
                <el-button type="primary" @click="addMember(index, item._key)">
                  邀请
                </el-button>
              </div>
            </div>
          </template>
          <div class="dp-center-center" :style="{ height: '100%' }" v-else>
            <el-empty description="未搜索到用户" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.member-search {
  width: 100%;
  @include p-number(10px, 25px);
  .member-search-title {
    width: 100%;
    height: 50px;
    margin-bottom: 10px;
  }
  .member-search-container {
    width: 100%;
    height: 50vh;
    @include scroll();
    .member-search-item {
      width: 100%;
      height: 70px;
      @include flex(space-between, center, null);
      .member-search-left {
        @include flex(space-between, center, null);
        .member-search-avatar {
          width: 50px;
          height: 50px;
          margin-right: 10px;
          @include flex(center, center, null);
        }
      }
      .member-search-right {
        height: 100%;
        @include flex(center, center, null);
      }
    }
  }
}
</style>
<style></style>
