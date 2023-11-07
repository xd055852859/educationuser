<script setup lang="ts">
import Header from "@/components/header.vue";
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
const { messageNum } = storeToRefs(appStore.commonStore);
const { spaceKey } = storeToRefs(appStore.spaceStore);
const { setMessageNum } = appStore.commonStore;
const dayjs: any = inject("dayjs");
const messageList = ref<any>([]);
const page = ref<number>(1);
const total = ref<number>(0);
const getData = async () => {
  let dataRes = (await api.request.get("message", {
    developerKey: spaceKey.value,
    page: page.value,
    limit: 50,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    messageList.value.push(...dataRes.data);
    total.value = dataRes.total as number;
    console.log(messageList.value);
  }
};
const scrollMessage = (e) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (
    height + scrollTop >= scrollHeight &&
    messageList.value.length < total.value
  ) {
    page.value++;
  }
};
const readMessage = async (key, index) => {
  let readRes = (await api.request.patch("message", {
    developerKey: spaceKey.value,
    messageKey: key,
  })) as ResultProps;
  if (readRes.msg === "OK") {
    setMessageNum(messageNum.value - 1);
    messageList.value[index].hasRead = 1;
  }
};
const clearMessage = async () => {
  let readRes = (await api.request.patch("message", {
    developerKey: spaceKey.value,
    page: page.value,
    limit: 50,
  })) as ResultProps;
  if (readRes.msg === "OK") {
    setMessageNum(0);
    messageList.value.forEach((item) => {
      item.hasRead = 1;
    });
  }
};
watchEffect(() => {
  if (spaceKey.value) {
    getData();
  }
});
</script>
<template>
  <Header title="消息通知"
    ><template #button>
      <el-button
        type="primary"
        style="margin-right: 5px"
        plain
        @click="clearMessage"
        >一键已读</el-button
      >
    </template>
  </Header>
  <div class="message box" @scroll="scrollMessage">
    <div
      class="messageItem"
      v-for="(item, index) in messageList"
      :key="`message${item._key}`"
      :style="{ backgroundColor: index % 2 === 0 ? '#fff' : '#f8f8f9' }"
      @click="item.hasRead ? '' : readMessage(item._key, index)"
    >
      <div class="messageItem-left">
        <div
          class="messageItem-left-point"
          :style="{ backgroundColor: item.hasRead ? 'transparent' : '#4c56ff' }"
        ></div>
        <div class="messageItem-left-log">{{ item.log }}</div>
      </div>
      <div class="messageItem-right">
        {{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm") }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.message {
  padding: 40px 57px 34px 57px;
  box-sizing: border-box;
  @include scroll();
  .messageItem {
    width: 100%;
    height: 75px;
    border-top: 1px solid #e1e1e3;
    padding: 0px 28px;
    box-sizing: border-box;
    cursor: pointer;
    @include flex(space-between, center, null);
    &:last-child {
      border-bottom: 1px solid #e1e1e3;
    }
    .messageItem-left {
      height: 75px;
      @include flex(space-between, center, null);
      .messageItem-left-point {
        width: 12px;
        height: 12px;
        margin-right: 12px;
        border-radius: 50%;
      }
      .messageItem-left-log {
        height: 25px;
        font-size: 20px;
        color: #4b4c4b;
        line-height: 25px;
      }
    }

    .messageItem-right {
      height: 68px;
      font-size: 18px;
      color: #4b4c4b;
      line-height: 68px;
    }
  }
}
</style>
<style></style>
