<template>
  <section class="card bg-[#BAABE7]">
    <div class="empty"></div>
    <div>{{ msgTriggerType }}</div>
    <div>{{ startTime }}{{ startTimeUnit }}</div>
  </section>
  <ModalTriggerEvent v-if="showModal" />
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
  if (!props.triggerEventSetting?.event) return "點擊設定事件";
  const triggerEventNameMap = {
    sign: "註冊",
    cart_abandonment: "購物車未結",
    purchase: "購買後促銷",
  };
  return (
    triggerEventNameMap[props.triggerEventSetting?.event] || "點擊設定事件"
  );
});
const startTime = ref("");
const startTimeUnit = ref("");
const showModal = ref(false);

//讓外部元件可以打開【設定觸發事件】的彈窗
function openModalTriggerEventSetting() {
  showModal.value = true;
}

function removeTriggerEvent() {
  console.warn("清空觸發事件");
  showModal.value = false;
}
function closeTriggerEventModal() {
  showModal.value = false;
}

provide("removeTriggerEvent", removeTriggerEvent);
provide("closeTriggerEventModal", closeTriggerEventModal);
defineExpose({ openModalTriggerEventSetting });
</script>

<style scoped></style>
