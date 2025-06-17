import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import Homepage from "../views/Homepage.vue";
import Demo from "../views/Demo.vue";
import ScriptEditor from "../views/ScriptEditor.vue";
import ScriptEditorPage from "../views/ScriptEditorPage.vue";

const router = createRouter({
  history: createWebHashHistory("/"),
  scrollBehavior(to, from, savedPosition) {
    //進到頁面都會回到頂端
    return { top: 0, behavior: "smooth" };
  },
  routes: [
    {
      //找不到網頁時，導回首頁
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      redirect: "/",
    },
    {
      path: "/",
      name: "Homepage",
      component: Homepage,
    },
    {
      path: "/demo",
      name: "Demo",
      component: Demo,
    },
    {
      path: "/vueFlow",
      name: "ScriptEditor",
      component: ScriptEditor,
    },
    {
      path: "/script-editor",
      name: "ScriptEditorPage",
      component: ScriptEditorPage,
    },
  ],
});

/**
 * 前置守衛
 * @description 如果沒有有效的token，會引導回登入頁
 * */
router.beforeEach(async (to, from) => {
  return true;
});

export default router;
