<template>
  <div class="mb-4 absolute right-10 top-10 z-10">
    <button class="bg-blue-200 py-2 px-4 rounded-lg" @click="goFrontPage">
      回到前一頁
    </button>
  </div>
  {{ triggerEventSetting }}
  <VueFlow v-model="elements" :min-zoom="0.2" :max-zoom="4">
    <Background :gap="20" :height="100" :width="100" />
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
import { ref, onMounted, watch, computed, provide } from "vue";
import { VueFlow, useVueFlow, Panel, Position } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { ControlButton, Controls } from "@vue-flow/controls";
import { z } from "zod";

//節點
import NodeTriggerEvent from "./NodeTriggerEvent.vue";
import NodeAction from "./NodeAction.vue";
import NodeEmailTemplate from "./NodeEmailTemplate.vue";

//假資料
import {
  TaskSchema,
  TriggerEventBasicSchema,
  TriggerEventPurchaseAfterPromotionSchema,
  TriggerEventSchema,
} from "../../schemas/ReMaScript/scriptSchema";
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

type typeTask = z.infer<typeof TaskSchema>;
type TriggerEvent = z.infer<typeof TriggerEventSchema>;

interface Props {
  taskList?: z.infer<typeof TaskSchema>; //要顯示的兩個task
}
interface Emits {
  (e: "save"): void;
  (e: "cancel"): void;
}
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<Emits>();
const elements = ref(emptyResponseTree);

// 提供給子元件：先前儲存的或預設的觸發事件設定
const triggerEventSetting = ref<TriggerEvent>({
  event: "sign",
  frequency: "once",
});

/**
 * 根據點擊的節點種類，打開對應的彈窗
 */
onNodeClick(({ node }) => {
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

/**
 * 從taskList中取出觸發事件設定的資料
 * @param taskList
 */
function getTriggerEventSettingFromTask(task: typeTask) {
  //如果是購買後促銷，則會有purchaseTypes、purchaseItems這兩個參數
  if (task?.eventOption?.type === "purchase") {
    triggerEventSetting.value = {
      event: task?.eventOption?.type,
      frequency: task?.schedule?.type,
      purchaseTypes: task?.eventOption?.purchaseTypes,
      purchaseItems: task?.eventOption?.purchaseItems,
    };
    return;
  }
  triggerEventSetting.value = {
    event: task?.eventOption?.type,
    frequency: task?.schedule?.type,
  };
}

function goFrontPage() {
  emit("cancel");
}

/**
 * 取出各節點的資料
 */
watch(
  () => props.taskList,
  (newTaskList) => {
    console.log("subScript收到主劇本傳來的兩個task資料", newTaskList);
    if (!newTaskList) {
      console.warn("沒有先前的觸發事件task資料");
      return;
    }

    //取出有【觸發事件設定】的task
    const taskTrigger = newTaskList.find((task) => task.reaction === "trigger");
    getTriggerEventSettingFromTask(taskTrigger);
  },
  { immediate: true }
);

provide("triggerEventSetting", triggerEventSetting);
// provide("triggerEventTaskList", props.taskList);
</script>

<style lang="sass"></style>
