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
import { ref, watch, computed, provide, inject } from "vue";
import { z } from "zod";
import ModalAction from "./Modal/ModalAction/index.vue";

import IconEmail from "../../assets/icons/iconEmail.svg";
import IconSMS from "../../assets/icons/iconSMS.svg";

interface Props {
  setting?: z.object;
  templateType?: z.string;
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

function closeActionModal() {
  showModal.value = false;
}

/**
 * 清空
 */
function remove(params: type) {}

defineExpose({ openModalActionSetting });
provide("closeActionModal", closeActionModal);
</script>

<style scoped></style>
