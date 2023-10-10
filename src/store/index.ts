import { authStore } from "@/store/auth";
import { commonStore } from "@/store/common";
import { lessonStore } from "@/store/lesson";
import { spaceStore } from "@/store/space";
import { createPinia } from "pinia";
export interface IAppStore {
  authStore: ReturnType<typeof authStore>;
  commonStore: ReturnType<typeof commonStore>;
  lessonStore: ReturnType<typeof lessonStore>;
  spaceStore: ReturnType<typeof spaceStore>;
}

const appStore: IAppStore = {} as IAppStore;
/**
 * 注册app状态库
 */

export const registerStore = () => {
  appStore.authStore = authStore();
  appStore.commonStore = commonStore();
  appStore.lessonStore = lessonStore();
  appStore.spaceStore = spaceStore();
};

export default appStore;
