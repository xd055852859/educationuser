<script setup lang="ts">
import Header from "@/components/header.vue";
import lineChart from "@/components/chart/lineChart.vue";
import api from "@/services/api";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import { ResultProps } from "@/interface/Common";

const { spaceList, spaceKey, createState } = storeToRefs(appStore.spaceStore);
const dayjs: any = inject("dayjs");
const overViewData = ref<any>({
  totalLesson: 0,
  userNum: 0,
});
const unit = ref<string>("week");
const chartData = ref<{ time: number; length: number }[] | null>([]);
onMounted(() => {});
const getData = async (key) => {
  let dataRes = (await api.request.get("developer/statis", {
    developerKey: key,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    overViewData.value = dataRes.data;
  }
};
const getChartData = async () => {
  let dataRes = (await api.request.get("developer/statis/detail", {
    developerKey: spaceKey.value,
    unit: unit.value,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    chartData.value = dataRes.data.agentNum.map((item) => {
      switch (unit.value) {
        case "today":
          item.time = dayjs(item.ctime).format("HH:mm");
          break;
        case "week":
        case "month":
        case "3month":
          item.time = dayjs(item.ctime).format("MM-DD");
          break;
        case "year":
          item.time = dayjs(item.ctime).format("YYYY-MM");
          break;
      }
      item.length = item.agentNum;
    });
  }
};
watchEffect(() => {
  if (spaceKey.value) {
    getChartData();
  }
});
watch(spaceKey, (newKey) => {
  if (newKey) {
    getData(newKey);
  }
});
</script>
<template>
  <Header title="数据概览" />
  <div class="overview box">
    <div class="overview-header">
      <el-row :gutter="25">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="header-title">课程数</div>
            <div class="header-content">{{ overViewData.totalLesson }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="header-title">订阅用户</div>
            <div class="header-content">{{ overViewData.userNum }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="overview-title">
      <div class="overview-title-left">订阅用户</div>
      <div class="overview-title-right">
        <span @click="unit = 'today'">日</span>
        <el-divider direction="vertical" />
        <span @click="unit = 'week'">周</span>
        <el-divider direction="vertical" />
        <span @click="unit = 'month'">月</span>
        <el-divider direction="vertical" />
        <span @click="unit = 'year'">年</span>
      </div>
    </div>
    <div class="overview-content">
      <line-chart
        line-id="board-chart"
        :chart-data="chartData"
        v-if="chartData"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
.overview {
  @include p-number(10px, 25px);
  .overview-header {
    width: 100%;
    height: 170px;
    margin-bottom: 20px;
    .header-title {
      width: 100%;
      height: 30px;
      line-height: 30px;
    }
    .header-content {
      width: 100%;
      height: 110px;
      text-align: center;
      line-height: 110px;
      font-size: 35px;
      font-weight: 600;
    }
  }
  .overview-title {
    width: 100%;
    height: 40px;
    @include flex(space-between, center, null);
    .overview-title-left {
    }
    .overview-title-right {
      > span {
        cursor: pointer;
        color: var(--el-color-info-light-3);
      }
    }
  }
  .overview-content {
    height: calc(100% - 240px);
  }
}
</style>
<style></style>
