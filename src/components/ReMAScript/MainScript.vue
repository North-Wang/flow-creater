<template>
  <VueFlow
    v-model="elements"
    class="basic-flow"
    :default-viewport="{ zoom: 1 }"
    :min-zoom="0.2"
    :max-zoom="4"
  >
    <Controls />
    <Background pattern-color="#aaa" :gap="20" :height="100" :width="100" />
    <div class="absolute right-10 top-0">劇本狀態：{{ scriptStatus }}</div>

    <MiniMap class="w-fit h-fit fixed left-0 top-[40px]" />
    <template #connection-line="connectionLineProps">
      <div>line</div>
    </template>

    <template #node-trigger-event="{ id, data, selected }">
      <TaskTriggerEvent />
    </template>
    <template #node-response-event="{ id, data, selected }">
      <TaskResponseEvent />
    </template>
  </VueFlow>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, inject } from "vue";
import { z } from "zod/v4";
import { VueFlow, useVueFlow, Panel, Position } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { ControlButton, Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { NodeToolbar } from "@vue-flow/node-toolbar";
const {
  onInit,
  onNodeDragStop,
  onConnect,
  addEdges,
  setViewport,
  toObject,
  onNodeClick,
  fitView,
  fitBounds,
  onPaneReady,
} = useVueFlow();

//schema
import type { TreeType } from "../../schemas/ReMaScript/scriptSchema";

//節點元件
import TaskTriggerEvent from "../../components/ReMAScript/TaskTriggerEvent.vue";
import TaskResponseEvent from "../../components/ReMAScript/TaskResponseEvent.vue";

interface Props {
  // script?: z.object();
}
interface Emits {}
const injectUpdateTreeType =
  inject<(type: TreeType) => void>("updateTreeType")!;
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<Emits>();

/**
 * 套件所需要的節點資料
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
    position: { x: -100, y: 200 },
    type: "response-event",
    data: { nodeType: "response", label: "Node 2" },
  },
  {
    id: "task_3",
    position: { x: 100, y: 200 },
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

const scriptStatus = ref("--");

/**
 * 根據點擊的節點種類，打開對應的子劇本
 */
onNodeClick(({ node }) => {
  const nodeType = node.type as TreeType;
  if (!injectUpdateTreeType) return;
  switch (nodeType) {
    case "trigger-event":
      injectUpdateTreeType("trigger-event");
      break;
    case "response-event":
      injectUpdateTreeType("response-event");
      break;
    default:
      console.warn("未定義節點種類要打開哪種子劇本", nodeType);
      break;
  }
});

onPaneReady((instance) => {});

onInit((vueFlowInstance) => {
  vueFlowInstance.fitView();
});

onNodeDragStop(({ event, nodes, node }) => {
  console.log("Node Drag Stop", { event, nodes, node });
});

onConnect((connection) => {
  console.log("驗證是否可以連接", connection);
  addEdges(connection);
});

/**
 * 顯示目前的劇本資料
 */
function showCurrentScript() {
  console.log("目前劇本的資料", elements.value);
}

onMounted(() => {});
watch(
  () => props.script,
  (data) => {
    console.log("aaa 劇本改變", data);
  }
);
</script>

<style lang="scss" scoped>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
</style>
