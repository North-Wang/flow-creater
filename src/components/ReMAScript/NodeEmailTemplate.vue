<template>
  <section class="rectangle bg-[#EAF3F4] text-[#71AFB6]">
    <div>填入模板</div>
  </section>
</template>

<script setup lang="ts">
import { z } from "zod/v4";
interface Props {
  data?: {
    label: string;
  };
  id?: string;
  isSelected?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
});
</script>

<style scoped></style>
