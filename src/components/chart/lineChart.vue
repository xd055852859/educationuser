<script setup lang="ts">
import * as echarts from "echarts";

const props = defineProps<{
  lineId: string;
  chartData: {
    time: number;
    length: number;
  }[];
}>();
let chart: any | null = null;
let option: echarts.EChartsOption | null = null;
const xAxisData = computed(() =>
  props.chartData.map((item) => {
    return item.time;
  })
);
const seriesData = computed(() =>
  props.chartData.map((item) => {
    return item.length;
  })
);
onMounted(() => {
  let chartDom: any = document.getElementById(props.lineId);
  chart = echarts.init(chartDom);

  option = {
    xAxis: {
      type: "category",
      data: xAxisData.value,
    },
    yAxis: {
      type: "value",
    },
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
    console.log(newVal);
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
