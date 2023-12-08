<script setup lang="ts">
import appStore from "@/store";
import * as echarts from "echarts";
import { storeToRefs } from "pinia";
const { deviceHeight, deviceWidth } = storeToRefs(appStore.commonStore);
const props = defineProps<{
  lineId: string;
  chartData: {
    time: number;
    count: number;
  }[];
}>();

let chart: any | null = null;
let option: echarts.EChartsOption | null = null;
const xAxisData = ref<any>(null);
const seriesData = ref<any>(null);

onMounted(() => {
  xAxisData.value = props.chartData.map((item) => {
    return item.time;
  });
  seriesData.value = props.chartData.map((item) => {
    return item.count;
  });
  let chartDom: any = document.getElementById(props.lineId);
  chart = echarts.init(chartDom, {
    width: chartDom.parentElement.offsetWidth * 0.8,
    height: chartDom.parentElement.offsetHeight * 0.7,
  });

  option = {
    xAxis: {
      name: "日期",
      type: "category",
      data: xAxisData.value,
    },
    yAxis: [
      {
        name: "用户数",
        type: "value",
      },
    ],
    tooltip: {
      trigger: "axis",
    },
    series: [
      {
        data: seriesData.value,
        type: "line",
      },
    ],
  };

  option && chart.setOption(option);
});
watch(
  () => props.chartData,
  (newVal) => {
    xAxisData.value = newVal.map((item) => {
      return item.time;
    });
    seriesData.value = newVal.map((item) => {
      return item.count;
    });
    //@ts-ignore
    chart.setOption<echarts.EChartsOption>({
      xAxis: {
        data: xAxisData.value,
      },
      series: [
        {
          data: seriesData.value,
        },
      ],
    });
    //@ts-ignore
    chart.resize();
  },
  { deep: true }
);
</script>
<template>
  <div :id="lineId" class="line-chart"></div>
</template>
<style scoped lang="scss">
.line-chart {
  width: 100%;
  height: 100%;
}
</style>
<style></style>
