<template>
  <section class="card bg-[#BAABE7]">
    <div class="empty"></div>
    <div>{{ triggerType }}</div>
    <div>{{ startTime }}{{ startTimeUnit }}</div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { z } from "zod/v4";
import { TriggerType } from "../../schemas/ReMaScript/scriptSchema";

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
</script>

<style scoped></style>
