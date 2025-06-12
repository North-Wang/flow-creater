<template>
  <section class="card bg-[var(--color-toolbar-icon-response)]">
    <div>{{ nodeTitle }}</div>
    <div class="empty"></div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod/v4";
interface Props {
  data?: {
    label: string;
  };
  id?: string;
  isSelected?: boolean;
  nodeTitle?: string;
}
const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  nodeTitle: "點擊設定事件",
});
</script>

<style scoped></style>
