<template>
  <div class="mb-4 absolute right-10 top-10 z-10">
    <button class="bg-blue-200 py-2 px-4 rounded-lg" @click="goFrontPage">
      回到前一頁
    </button>
  </div>
  <VueFlow v-model="elements" :min-zoom="0.2" :max-zoom="4">
    <Background pattern-color="#aaa" :gap="20" :height="100" :width="100" />
    <template #node-trigger-event="{ id, data, selected }">
      <NodeTriggerEvent ref="refTriggerNode" />
    </template>
    <template #node-action="{ id, data, selected }">
      <NodeAction :templateType="'Email'" />
    </template>
    <template #node-template="{ id, data, selected }">
      <NodeEmailTemplate />
    </template>
  </VueFlow>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { VueFlow, useVueFlow, Panel, Position } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { ControlButton, Controls } from "@vue-flow/controls";
import { z } from "zod/v4";

//節點
import NodeTriggerEvent from "./NodeTriggerEvent.vue";
import NodeAction from "./NodeAction.vue";
import NodeEmailTemplate from "./NodeEmailTemplate.vue";

//假資料
import { TaskSchema } from "../../schemas/ReMaScript/scriptSchema";
import { emptyResponseTree } from "../../data/RemaScript/emptyTree";

const {
  onInit,
  addEdges,
  setViewport,
  toObject,
  onNodeClick,
  fitView,
  fitBounds,
  onPaneReady,
} = useVueFlow();

const refTriggerNode = ref(null);
interface Props {
  taskList?: z.infer<typeof TaskSchema>[]; //要顯示的兩個task
}
interface Emits {
  (e: "save"): void;
  (e: "cancel"): void;
}
const props = withDefaults(defineProps<Props>(), {
  taskList: () => [],
});
const emit = defineEmits<Emits>();
const elements = ref(emptyResponseTree);

/**
 * 驗證好資料無誤，準備讓外部儲存task資料之前，要調整task的資料架構
 */
function changeFormat() {}

/**
 * 根據點擊的節點種類，打開對應的彈窗
 */
onNodeClick(({ node }) => {
  console.log("aaa 點擊subScript的節點", node);
  const nodeType = node.type;
  console.log("打開" + nodeType + "的設定彈窗");
  switch (nodeType) {
    case "trigger-event":
      if (refTriggerNode.value) {
        refTriggerNode.value?.openModalTriggerEventSetting();
      }
      break;

    default:
      break;
  }
});
function goFrontPage() {
  emit("cancel");
}
</script>

<style lang="sass"></style>
