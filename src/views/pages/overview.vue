<script setup lang="ts">
import Header from "@/components/header.vue";
import FontIcon from "@/components/fontIcon.vue";
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
const chartData = ref<{ time: number; count: number }[] | null>([]);
onMounted(() => { });
const getData = async () => {
  let dataRes = (await api.request.get("developer/statis", {
    developerKey: spaceKey.value,
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
      item.count = item.agentNum;
      return item
    });
    console.log(chartData.value)
  }
};
watchEffect(() => {
  if (spaceKey.value) {
    getData();
    getChartData();
  }
});
</script>
<template>
  <Header title="数据概览" />
  <div class="overview box">
    <div class="overview-header">
      <div class="header-card">
        <div class="header-card-left">
          <div class="header-title">课程数量</div>
          <div class="header-content">{{ overViewData.totalLesson }}</div>
        </div>
        <div class="header-card-right">
          <div class="header-card-icon">
            <FontIcon iconName="kejianshuliang" :iconStyle="{ color: '#505AFF' }" />
          </div>
        </div>
      </div>
      <div class="header-card">
        <div class="header-card-left">
          <div class="header-title">订阅角色数量</div>
          <div class="header-content">{{ overViewData.userNum }}</div>
        </div>
        <div class="header-card-right">
          <div class="header-card-icon">
            <FontIcon iconName="a-dingyueyonghu2" :iconStyle="{ color: '#505AFF' }" />
          </div>
        </div>
      </div>
    </div>
    <div class="overview-box">
      <div class="overview-title">
        <div class="overview-title-left">订阅角色</div>
        <div class="overview-title-right">
          <span @click="unit = 'today'" :style="unit === 'today' ? { color: '#4c56ff' } : {}">日</span>
          <el-divider direction="vertical" />
          <span @click="unit = 'week'" :style="unit === 'week' ? { color: '#4c56ff' } : {}">周</span>
          <el-divider direction="vertical" />
          <span @click="unit = 'month'" :style="unit === 'month' ? { color: '#4c56ff' } : {}">月</span>
          <el-divider direction="vertical" />
          <span @click="unit = 'year'" :style="unit === 'year' ? { color: '#4c56ff' } : {}">年</span>
        </div>
      </div>
      <div class="overview-content" v-if="chartData">
        <line-chart line-id="board-chart" :chart-data="chartData" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.overview {
  padding: 40px 57px 34px 57px;
  box-sizing: border-box;

  .overview-header {
    width: 100%;
    height: 170px;
    margin-bottom: 20px;
    @include flex(space-between, center, null);

    .header-card {
      width: 774px;
      height: 189px;
      background: rgba(244, 245, 255, 0.46);
      border: 1px solid #e6e6fe;
      border-radius: 8px;
      padding: 42px 71px 38px 45px;
      box-sizing: border-box;
      margin-bottom: 40px;
      @include flex(space-between, center, null);

      .header-card-left {
        .header-title {
          width: 120px;
          height: 26px;
          font-size: 20px;
          color: #4b4c4b;
          line-height: 26px;
          margin-bottom: 10px;
        }

        .header-content {
          width: 79px;
          height: 69px;
          font-size: 49px;
          font-weight: 600;
          color: #505aff;
          line-height: 69px;
        }
      }

      .header-card-right {
        width: 112px;
        height: 112px;
        background: rgba(207, 209, 252, 0.53);
        border-radius: 50%;
        @include flex(center, center, null);

        .header-card-icon {
          width: 44px;
          height: 44px;
        }
      }
    }
  }

  .overview-box {
    width: 1560px;
    height: 620px;
    border: 1px solid #e3e3e3;
    padding: 20px 25px;
    box-sizing: border-box;

    .overview-title {
      width: 100%;
      height: 40px;

      @include flex(space-between, center, null);

      .overview-title-left {
        font-size: 24px;
      }

      .overview-title-right {
        font-size: 20px;

        >span {
          cursor: pointer;
          color: var(--el-color-info-light-3);
        }
      }
    }

    .overview-content {
      width: 100%;
      height: calc(100% - 40px);
    }
  }
}
</style>
<style lang="scss">
.header-card-right {
  .header-card-icon {
    .font-icon {
      font-size: 40px;
      color: #505aff;
    }
  }
}
</style>
