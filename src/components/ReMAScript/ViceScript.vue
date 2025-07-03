<template>
  <div class="mb-4 absolute right-10 top-10 z-10">
    <button class="bg-blue-200 py-2 px-4 rounded-lg" @click="goFrontPage">
      回到前一頁
    </button>
  </div>
  <div class="grid grid-cols-1">
    <span>劇本</span>
    {{ errors }}
    {{ values }}
  </div>
  <VueFlow v-model="elements" :min-zoom="0.2" :max-zoom="4">
    <Background :gap="20" :height="100" :width="100" />
    <template #node-trigger-event="{ id, data, selected }">
      <NodeTriggerEvent ref="refTriggerNode" />
    </template>
    <template #node-action="{ id, data, selected }">
      <NodeAction ref="refActionNode" />
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
import { useForm, useField } from "vee-validate";

//節點
import NodeTriggerEvent from "./NodeTriggerEvent.vue";
import NodeAction from "./NodeAction.vue";
import NodeEmailTemplate from "./NodeEmailTemplate.vue";

import { TaskSchema } from "../../schemas/ReMaScript/scriptSchema";
import {
  schemaTriggerEvent,
  schemaSendStartTime,
  schemaPurchaseItemType,
} from "../../schemas/ReMaScript/schema.triggerEvent";
import {
  typeSendType,
  typeCycleUnit,
} from "../../schemas/ReMaScript/schema.sendTime";
import { emptyResponseTree } from "../../data/RemaScript/emptyTree";
import { toTypedSchema } from "@vee-validate/zod";
import { formSchema } from "../../schemas/ReMaScript/schema.task";

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

//定義Form表單欄位、綁定資料 aaa
const {
  values,
  handleSubmit,
  setValues,
  resetField,
  validate,
  validateField,
  isValidating,
  errors,
} = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    trigger_event: "sign",
    send_type: "once",
  },
});

const schemaPurchaseItem = z
  .string()
  .nonempty("請選擇商品")
  .refine((val) => val !== "-", { message: "請選擇有效的商品" });

//觸發事件設定
const {} = useField<typeof schemaTriggerEvent>("trigger_event");
const {} = useField<typeof schemaPurchaseItemType>("purchase_item_type");
const {} = useField<typeof schemaPurchaseItem>("purchase_item");
const {} = useField<typeof typeCycleUnit>("first_send_unit");
const {} = useField<number>("first_send_value");
const {} = useField<string>("first_send_date");

//發送時間設定
const {} = useField<typeof typeSendType>("send_type");
const {} = useField<typeof typeCycleUnit>("cycle_unit");
const {} = useField<number>(
  "cycle_frequency",
  toTypedSchema(
    z
      .number()
      .int({ message: "必須是整數" })
      .positive({ message: "必須是正整數" })
  )
);

//發送時間設定

const {} = useField("cycle_time");
const {} = useField<number | null>("max_run_times");

const refTriggerNode = ref(null);
const refActionNode = ref(null);

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

/**
 * 暫存底下各節點
 */
const tempTask = ref();

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
    case "action":
      if (refActionNode.value) {
        refActionNode.value?.openModalActionSetting();
      }
    default:
      break;
  }
});

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
  },
  { deep: true }
);

onMounted(() => {});

provide("values", values);
provide("setValues", setValues);
provide("resetField", resetField);
provide("validateField", validateField);
</script>

<style lang="sass"></style>
