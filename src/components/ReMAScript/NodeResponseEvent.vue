<template>
  <SquareNode>
    <template #content>
      <div class="empty"></div>
      <div>點擊設定事件</div>
    </template>
  </SquareNode>
</template>

<script setup lang="ts">
import SquareNode from "./SquareNode.vue";
import { z } from "zod/v4";

interface Props {
  data?: {
    label: string;
  };
  id?: string;
  isSelected?: boolean;
  textColor?: string;
  nodeBgColor?: string;
  nodeBgColorDisabled?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  textColor: "white",
  nodeBgColor: "#BAABE7",
  nodeBgColorDisabled: "#BAABE7",
});
</script>

<style scoped>
.card {
  width: 120px;
  aspect-ratio: 1/1;
  border-radius: 10px;
  background: var(#b8bcfd);
}
.empty {
  width: 45px;
  aspect-ratio: 1;
  border: 2px solid #ffffff;
  border-radius: 4px;
  border-style: dashed;
}
</style>
