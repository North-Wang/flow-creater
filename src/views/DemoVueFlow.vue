<script setup lang="ts">
import { ref, onMounted, watch, computed, provide } from "vue";
import { z } from "zod/v4";

//節點元件
import MainScript from "../components/ReMAScript/MainScript.vue";
import ViceScript from "../components/ReMAScript/ViceScript.vue";

//假資料
import { scriptDefault, scriptSchema } from "../public/script";

/**
 * 定義目前顯示哪種樹狀圖
 * @description
 * - main: 主劇本
 * - trigger-event: 子劇本：觸發事件
 * - response-event: 子劇本：回應事件劇本
 */
type treeType = "main" | "trigger-event" | "response-event";

/**
 * 節點資料
 */
const elements = ref([
  {
    id: "task_1",
    position: { x: 0, y: 0 },
    type: "trigger-event",
    data: { nodeType: "trigger", label: "Node 1" },
  },
  {
    id: "task_2",
    position: { x: -200, y: 200 },
    type: "response-event",
    data: { nodeType: "response", label: "Node 2" },
  },
  {
    id: "task_3",
    position: { x: -200, y: 400 },
    type: "response-event",
    data: { nodeType: "response", label: "Node 2" },
  },
  {
    id: "e1-2",
    type: "step",
    source: "task_1",
    target: "task_2",
    class: "dark",
    animated: false,
  },
  {
    id: "e1-3",
    type: "step",
    source: "task_1",
    target: "task_3",
    class: "dark",
    animated: false,
  },
]);

const currentTreeType = ref<treeType>("main");
/**
 * 更新目前的樹狀圖類型
 */
function updateTreeType(type: treeType) {
  console.log("aaa 更新樹狀圖類型", type);
  currentTreeType.value = type;
}

/**
 * 顯示目前的劇本資料
 */
function showCurrentScript() {
  console.log("目前劇本的資料", elements.value);
}

onMounted(() => {});

provide("updateTreeType", updateTreeType);
</script>

<template>
  <div class="grid grid-rows-[auto_1fr]">
    <button class="mb-2" @click="showCurrentScript">顯示目前的劇本</button>
    <div class="w-full h-[calc(100dvh-50px)] relative">
      <ViceScript
        v-if="currentTreeType === 'trigger-event'"
        @cancel="currentTreeType = 'main'"
      />
      <MainScript v-if="currentTreeType === 'main'" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
.vue-flow__node-custom {
  background: purple;
  color: white;
  border: 1px solid purple;
  border-radius: 4px;
  box-shadow: 0 0 0 1px purple;
  padding: 8px;
}
</style>
