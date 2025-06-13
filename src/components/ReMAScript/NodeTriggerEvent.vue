<template>
  <section class="card bg-[#BAABE7]">
    <div class="empty"></div>
    <div>{{ triggerType }}</div>
    <div>{{ startTime }}{{ startTimeUnit }}</div>
  </section>
  <ModalTriggerEvent v-if="showModal" />
</template>

<script setup lang="ts">
import { ref, watch, computed, defineExpose } from "vue";
import { z } from "zod/v4";
import { TriggerType } from "../../schemas/ReMaScript/scriptSchema";
import ModalTriggerEvent from "./Modal/ModalTriggerEvent.vue";

interface Props {
  id?: string;
  triggerType?: TriggerType;
}

const props = withDefaults(defineProps<Props>(), {});

const triggerType = computed(() => {
  if (!props.triggerType) return "點擊設定事件";
  return props.triggerType || "點擊設定事件";
});
const startTime = ref("");
const startTimeUnit = ref("");
const showModal = ref(false);

//讓外部元件可以打開【設定觸發事件】的彈窗
function openModalTriggerEventSetting() {
  showModal.value = true;
}

defineExpose({ openModalTriggerEventSetting });
</script>

<style scoped></style>
