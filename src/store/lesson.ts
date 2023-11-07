import { ref } from "vue";
import { defineStore } from "pinia";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";

export const lessonStore = defineStore(
  "lessonStore",
  () => {
    const lessonList = ref<any>([]);
    const lessonKey = ref<string>("");
    const lessonInfo = ref<any>(null);
    const setLessonKey = (newKey) => {
      lessonKey.value = newKey;
    };
    const getLessonList = async (key, filterType, name) => {
      let lessonRes = (await api.request.get("resource/developer", {
        developerKey: key,
        filterType: filterType,
        name: name,
      })) as ResultProps;
      if (lessonRes.msg === "OK") {
        lessonList.value = [...lessonRes.data];
      }
    };
    const setLessonList = async (newList) => {
      lessonList.value = newList;
    };
    const setLessonInfo = (newInfo: any) => {
      lessonInfo.value = newInfo;
    };

    const getLessonInfo = async (key) => {
      const lessonInfoRes = (await api.request.get("resource/detail", {
        resourceKey: key,
      })) as ResultProps;
      if (lessonInfoRes.msg === "OK") {
        lessonInfo.value = { ...lessonInfoRes.data };
      }
    };
    watch(lessonKey, (newKey) => {
      if (newKey) {
        getLessonInfo(newKey);
      }
    });
    return {
      lessonKey,
      setLessonKey,
      lessonList,
      setLessonList,
      getLessonList,
      lessonInfo,
      setLessonInfo,
      getLessonInfo,
    };
  },
  {
    persist: {
      storage: window.sessionStorage,
    },
  }
);
