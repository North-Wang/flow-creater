<script setup lang="ts">
import { ref, onMounted, watch, computed, provide } from "vue";
import { z } from "zod";
import { TreeType, ScriptSchema } from "../schemas/ReMaScript/scriptSchema";
import { createVueFlowLayout } from "../utils/nodeLayout";

//節點元件
import MainScript from "../components/ReMAScript/MainScript.vue";
import ViceScript from "../components/ReMAScript/ViceScript.vue";

//假資料
import { emptyScriptBySchema } from "../data/RemaScript/emptyTree";

const script = ref(emptyScriptBySchema); //從後端取得的script資料
const vueFlowData = ref(null); //前端調整過，符合套件需求的資料

const currentTreeType = ref<TreeType>("main");
const scriptStatus = computed(() => {
  return script.value?.status || "--";
});

const triggerScript = ref([]);

/**
 * 更新目前檢視的樹狀圖類型
 */
function updateTreeType(type: TreeType) {
  console.log("更新目前檢視的樹狀圖類型", type);
  currentTreeType.value = type;
}

/**
 * 更新【觸發事件設定】
 */
function updateTriggerEventSetting(taskId: string, newSetting) {
  const target = script.value?.task?.find((task) => task?.id === taskId);
  if (!target || !newSetting) return;
  const { frequency, ...setting } = newSetting;

  if (setting.event === "post_purchase_marketing") {
    target.eventOption = {
      event: setting?.event,
      purchaseItems: setting?.purchase_item,
      purchaseTypes: setting?.purchase_type,
    };
  } else {
    target.eventOption = {
      event: setting?.event,
    };
  }

  target.schedule.type = frequency;
  console.log("更新完【觸發事件設定】的劇本", script.value);
}

/**
 * 將script資料轉成VueFlow的格式
 * @param script
 */
function transformScriptToVueFlow(script: typeof ScriptSchema) {
  const result = createVueFlowLayout(script?.task);
  vueFlowData.value = result;
  console.log("調整好VueFlow的資料架構", vueFlowData.value);
}

/**
 * 取出屬於觸發事件的tasks
 * @param taskList
 */
function getTriggerTasks(taskList) {
  triggerScript.value =
    taskList?.find((task) => task.data?.reaction === "trigger") || null;
}

watch(
  script,
  async (script) => {
    console.warn("偵測到劇本變更");
    await transformScriptToVueFlow(script);
    if (!vueFlowData.value) return;
    getTriggerTasks(vueFlowData.value);
  },
  { immediate: true, deep: true }
);

provide("updateTreeType", updateTreeType);
provide("updateTriggerEventSetting", updateTriggerEventSetting);
</script>

<template>
  <div class="grid grid-rows-[auto_1fr]">
    <div class="w-full h-[calc(100dvh-50px)] relative">
      <div>劇本狀態{{ scriptStatus }}</div>
      <ViceScript
        :task="triggerScript"
        v-if="currentTreeType === 'trigger-event'"
        @cancel="currentTreeType = 'main'"
      />
      <MainScript
        :vueFlowData="vueFlowData"
        v-if="currentTreeType === 'main'"
      />
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
