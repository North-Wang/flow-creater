<template>
  <VueFlow
    v-model="elements"
    class="basic-flow"
    :default-viewport="{ zoom: 1 }"
    :min-zoom="0.2"
    :max-zoom="4"
  >
    <Controls />
    <Background :gap="20" :height="100" :width="100" />

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
import { VueFlow, useVueFlow, Panel, Position } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { ControlButton, Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { NodeToolbar } from "@vue-flow/node-toolbar";
const { onInit, onNodeClick } = useVueFlow();

import type { TreeType } from "../../schemas/ReMaScript/scriptSchema";

//節點元件
import TaskTriggerEvent from "../../components/ReMAScript/TaskTriggerEvent.vue";
import TaskResponseEvent from "../../components/ReMAScript/TaskResponseEvent.vue";

const injectUpdateTreeType = inject<(type: TreeType) => void>("updateTreeType");
interface Props {
  vueFlowData?: object[] | null;
}
const props = withDefaults(defineProps<Props>(), {
  vueFlowData: null,
});

const elements = ref(null);

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

onInit((vueFlowInstance) => {
  vueFlowInstance.fitView();
});

watch(
  () => props.vueFlowData,
  (data) => {
    elements.value = data;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
</style>
