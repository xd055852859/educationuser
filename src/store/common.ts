import { ref } from "vue";
import { defineStore } from "pinia";
import { detectZoom } from "@/services/util";

// 使用setup模式定义
export const commonStore = defineStore("commonStore", () => {
  const deviceType = ref<string>("computer");
  const deviceWidth = ref<number>(0);
  const deviceHeight = ref<number>(0);
  const deviceSize = ref<string>("md");
  const deviceZoom = ref<number>(0);
  const site = ref<string>("sg");
  const chooseKey = ref<string>("");
  const chooseType = ref<string>("");
  const overKey = ref<string>("");
  const overType = ref<string>("");
  const messageNum = ref<number>(0);

  const fullState = ref<boolean>(false);
  const setDeviceType = (newDeviceType: string) => {
    deviceType.value = newDeviceType;
  };
  const setSite = (newSite: string) => {
    site.value = newSite;
    localStorage.setItem("site", newSite);
  };
  const setDeviceWidth = (width: number, height: number) => {
    deviceZoom.value = detectZoom();
    deviceWidth.value = width * deviceZoom.value;
    deviceHeight.value = height * deviceZoom.value;
    if (width < 550) {
      deviceSize.value = "xs";
    } else if (550 <= width) {
      deviceSize.value = "sm";
    } else if (768 <= width) {
      deviceSize.value = "md";
    } else if (992 <= width) {
      deviceSize.value = "lg";
    } else if (1200 <= width) {
      deviceSize.value = "xl";
    }
  };
  const setChoose = (newKey, newType) => {
    chooseKey.value = newKey;
    chooseType.value = newType;
  };
  const setOver = (newKey, newType) => {
    overKey.value = newKey;
    overType.value = newType;
  };

  const setMessageNum = (newNum) => {
    messageNum.value = newNum;
  };
  const setFullState = (newFullState) => {
    fullState.value = newFullState;
  };
  return {
    deviceType,
    setDeviceType,
    deviceWidth,
    deviceHeight,
    setDeviceWidth,
    deviceSize,
    site,
    setSite,
    chooseKey,
    chooseType,
    setChoose,
    overKey,
    overType,
    setOver,
    messageNum,
    setMessageNum,
    fullState,
    setFullState,
  };
});
