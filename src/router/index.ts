import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    children: [],
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/home.vue"),
    redirect: "/home/overview",
    children: [
      {
        path: "overview",
        name: "overview",
        component: () => import("@/views/pages/overview.vue"),
        children: [],
      },
      {
        path: "lesson",
        name: "lesson",
        component: () => import("@/views/pages/lesson/lesson.vue"),
        children: [],
      },

      {
        path: "lessonDetail",
        name: "lessonDetail",
        component: () => import("@/views/pages/lesson/detail.vue"),
        children: [],
      },
      {
        path: "lessonEdit",
        name: "lessonEdit",
        component: () => import("@/views/pages/lesson/edit.vue"),
        children: [],
      },
      {
        path: "lessonCaptions/:id",
        name: "lessonCaptions",
        component: () => import("@/views/pages/lesson/captions.vue"),
        children: [],
      },
      {
        path: "user",
        name: "user",
        component: () => import("@/views/pages/user.vue"),
        children: [],
      },

      {
        path: "account",
        name: "account",
        component: () => import("@/views/pages/account.vue"),
        children: [],
      },
    ],
  },
  {
    path: "/space",
    name: "space",
    component: () => import("@/views/space/index.vue"),
    redirect: "/space/list",
    children: [
      {
        path: "list",
        name: "list",
        component: () => import("@/views/space/space.vue"),
        children: [],
      },
      {
        path: "edit/:spaceKey?",
        name: "edit",
        component: () => import("@/views/space/edit.vue"),
        children: [],
        props: true,
      },
    ],
  },
];
const routerHistory = createWebHashHistory();
const router = createRouter({
  history: routerHistory,
  routes,
});
//全局后置守卫
router.afterEach((to, from, failure) => {
  if (window.parent != window.self && from.fullPath !== "/") {
    window.parent.postMessage({ url: location.href }, "*");
    localStorage.setItem("url", to.fullPath);
  }
});
export default router;
