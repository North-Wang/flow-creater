<template>
  <section class="card bg-[#BAABE7]">
    <div class="empty"></div>
    <div>{{ msgTriggerType }}</div>
    <div>{{ startTime }}{{ startTimeUnit }}</div>
  </section>
  <ModalTriggerEvent
    v-if="showModal"
    @updateSetting="handleSaveTriggerEventSetting"
    @removeEvent="showModal = false"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed, defineExpose } from "vue";
import { z } from "zod/v4";
import {
  TriggerType,
  TriggerEventFrequencyType,
} from "../../schemas/ReMaScript/scriptSchema";
import ModalTriggerEvent from "./Modal/ModalTriggerEvent.vue";

interface OptionItem {
  name: string;
  value: string;
}
interface Props {
  triggerEventSetting?: {
    event: z.infer<typeof TriggerType>;
    frequency: z.infer<typeof TriggerEventFrequencyType>;
    purchaseTypes: OptionItem;
    purchaseItems: OptionItem;
  };
}

const props = withDefaults(defineProps<Props>(), {});

const msgTriggerType = computed(() => {
  if (!props.triggerEventSetting?.event) return "點擊設定事件";
  return props.triggerEventSetting?.event || "點擊設定事件";
});
const startTime = ref("");
const startTimeUnit = ref("");
const showModal = ref(false);

//讓外部元件可以打開【設定觸發事件】的彈窗
function openModalTriggerEventSetting() {
  showModal.value = true;
}

function handleSaveTriggerEventSetting(setting: object) {
  console.log("aaa Save Trigger Event Setting:", setting);
  showModal.value = false;
}

defineExpose({ openModalTriggerEventSetting });
</script>

<style scoped></style>
