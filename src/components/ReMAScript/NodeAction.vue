<template>
  <section class="card bg-[var(--color-toolbar-icon-action)]">
    <img :src="IconEmail" alt="email" v-if="templateType === 'Email'" />
    <img :src="IconSMS" alt="sms" v-if="templateType === 'SMS'" />
    <div class="empty" v-if="!templateType"></div>
    <div>{{ deliveryChannel }}</div>
    {{ templateType }}
  </section>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { z } from "zod/v4";
import { ActionType } from "../../schemas/ReMaScript/scriptSchema";

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
</script>

<style scoped></style>
