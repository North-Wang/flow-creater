<template>
  <section class="card bg-[#BAABE7]">
    <div class="empty"></div>
    <div>{{ msgTriggerType }}</div>
    <div>{{ startTime }}{{ startTimeUnit }}</div>
  </section>

  <ModalTriggerEvent v-if="showTriggerEventModal" />
</template>

<script setup lang="ts">
import { ref, watch, computed, defineExpose, provide, inject } from "vue";
import { z } from "zod/v4";
import { schemaTriggerEvent } from "../../schemas/ReMaScript/schema.triggerEvent";
import ModalTriggerEvent from "./Modal/ModalTriggerEvent/index.vue";

interface Props {
  setting?: z.infer<typeof schemaTriggerEvent>;
}

const props = withDefaults(defineProps<Props>(), {});

//節點顯示的文字
const msgTriggerType = computed(() => {
  return "點擊設定事件";
});
const startTime = ref("");
const startTimeUnit = ref("");
const showTriggerEventModal = ref(false);

//讓外部元件可以打開【設定觸發事件】的彈窗
function openModalTriggerEventSetting() {
  showTriggerEventModal.value = true;
}

function removeTriggerEvent() {
  console.warn("清空觸發事件");
  showTriggerEventModal.value = false;
}
function closeTriggerEventModal() {
  showTriggerEventModal.value = false;
}

provide("removeTriggerEvent", removeTriggerEvent);
provide("closeTriggerEventModal", closeTriggerEventModal);
defineExpose({ openModalTriggerEventSetting });
</script>

<style scoped></style>
