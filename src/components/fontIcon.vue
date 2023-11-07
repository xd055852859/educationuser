<script setup lang="ts">
const props = defineProps<{
  iconName: string;
  iconStyle?: any;
  boxStyle?: any;
  customClassName?: string;
}>();
const emits = defineEmits<{
  (e: "iconClick"): void;
}>();
</script>
<template>
  <div
    :class="customClassName"
    @click="emits('iconClick')"
    :style="{ ...boxStyle }"
    class="font-icon-box dp-center-center"
  >
    <i
      :class="`iconfont icon-${iconName}`"
      class="font-icon"
      :style="{ ...iconStyle }"
    />
  </div>
</template>
<style lang="scss">
.font-icon-box {
  width: 100%;
  height: 100%;
}
</style>
<style></style>
