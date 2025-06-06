<template>
  <div>
    <section class="card">
      <h4>傳送渠道事件</h4>
    </section>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod/v4";
interface Props {
  data: {
    label: string;
  };
  id: string;
  isSelected?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
});
</script>

<style scoped></style>
