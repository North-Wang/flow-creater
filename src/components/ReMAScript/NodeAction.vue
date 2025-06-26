<template>
  <section class="card bg-[var(--color-toolbar-icon-action)]">
    <img :src="IconEmail" alt="email" v-if="templateType === 'Email'" />
    <img :src="IconSMS" alt="sms" v-if="templateType === 'SMS'" />
    <div class="empty" v-if="!templateType"></div>
    <div>{{ deliveryChannel }}</div>
    {{ templateType }}
  </section>
  <ModalAction v-if="showModal" />
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { z } from "zod/v4";
import { ActionType } from "../../schemas/ReMaScript/scriptSchema";
import ModalAction from "./Modal/ModalAction/index.vue";

import IconEmail from "../../assets/icons/iconEmail.svg";
import IconSMS from "../../assets/icons/iconSMS.svg";

interface Props {
  data?: {
    label: string;
  };
  id?: string;
  templateType?: ActionType;
}
const props = withDefaults(defineProps<Props>(), {});
const deliveryChannel = computed(() => {
  if (!props.templateType) return "點擊設定動作";
  const map = {
    Email: "傳送Email",
    SMS: "傳送SMS",
  };
  return map[props.templateType] || "點擊設定動作";
});

const showModal = ref<boolean>(false);
//讓外部元件可以打開【彈窗
function openModalActionSetting() {
  showModal.value = true;
}
defineExpose({ openModalActionSetting });
</script>

<style scoped></style>
