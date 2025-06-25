<template>
  <div class="mb-4 absolute right-10 top-10 z-10">
    <button class="bg-blue-200 py-2 px-4 rounded-lg" @click="goFrontPage">
      回到前一頁
    </button>
  </div>
  暫存的觸發事件設定： {{ triggerEventSetting }}
  <VueFlow v-model="elements" :min-zoom="0.2" :max-zoom="4">
    <Background :gap="20" :height="100" :width="100" />
    <template #node-trigger-event="{ id, data, selected }">
      <NodeTriggerEvent
        ref="refTriggerNode"
        :triggerEventSetting="triggerEventSetting"
      />
    </template>
    <template #node-action="{ id, data, selected }">
      <NodeAction />
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

import { TaskSchema } from "../../schemas/ReMaScript/scriptSchema";
import { TriggerEventSchema } from "../../schemas/ReMaScript/schema.triggerEvent";
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

type TriggerEvent = z.infer<typeof TriggerEventSchema>;

interface Props {
  task?: z.infer<typeof TaskSchema>; //要顯示的兩個task
}
interface Emits {
  (e: "save"): void;
  (e: "cancel"): void;
}
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<Emits>();
const elements = ref(emptyResponseTree);
const editingTaskId = ref<string>("");

/**
 * 暫存底下各節點
 */
const tempTask = ref();

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
 * 取出觸發事件設定的資料
 * @param task
 */
function getTriggerEventSettingFromTask(data) {
  console.log("要取出觸發事件設定的資料", data);
  //如果是購買後促銷，則會有purchaseTypes、purchaseItems這兩個參數
  if (data?.eventOption?.event === "purchase") {
    triggerEventSetting.value = {
      event: data?.eventOption?.event,
      frequency: data?.schedule?.type,
      purchaseTypes: data?.eventOption?.purchaseTypes,
      purchaseItems: data?.eventOption?.purchaseItems,
    };
    return;
  }
  triggerEventSetting.value = {
    event: data?.eventOption?.event,
    frequency: data?.schedule?.type,
  };
}

/**
 * 更新【子劇本】的【觸發事件設定】
 * @description 不會修改到主劇本對應的task資料，避免子劇本資料不完整下修改到劇本資料
 */
function updateSubscriptTriggerEventSetting(newSetting) {
  if (!newSetting) return;
  const { frequency, ...setting } = newSetting;

  if (setting.event === "purchase") {
    tempTask.value.data.eventOption = {
      event: setting?.event,
      purchaseItems: setting?.purchase_item,
      purchaseTypes: setting?.purchase_type,
    };
  } else {
    tempTask.value.data.eventOption = {
      event: setting?.event,
    };
  }
  console.log("更新完【觸發事件設定】的子劇本", tempTask.value);
}

function goFrontPage() {
  emit("cancel");
}

watch(
  () => props.task,
  (task) => {
    console.warn("子劇本監聽到來自script的一個task資料改變", task);
    if (task) {
      tempTask.value = task;
    } else {
      console.warn("沒有先前的觸發事件task資料");
      editingTaskId.value = "";
    }
  },
  { immediate: true }
);

/**
 * 當子劇本更新時，更新其各節點的資料
 */
watch(
  tempTask,
  (task) => {
    console.warn("監聽到子劇本的資料更新(沒更新script)", task);
    if (!task) {
      return;
    }

    editingTaskId.value = task?.id;
    getTriggerEventSettingFromTask(task?.data);
  },
  { deep: true }
);

provide("triggerEventSetting", triggerEventSetting);
provide("editingTaskId", editingTaskId);
provide(
  "updateSubscriptTriggerEventSetting",
  updateSubscriptTriggerEventSetting
);
</script>

<style lang="sass"></style>
