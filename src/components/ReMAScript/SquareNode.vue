<template>
  <div>
    <section
      class="card"
      :style="{
        '--text-color': `${textColor}`,
        '--bg-color': `${BgColor}`,
        '--bg-color-disabled': `${BgColorDisabled}`,
      }"
    >
      <slot name="content">
        <h4>節點名稱</h4>
      </slot>
    </section>
  </div>
</template>

<script setup lang="ts">
import { styled } from "storybook/internal/theming";
import { z } from "zod/v4";

interface Props {
  isSelected?: boolean;
  textColor?: string;
  BgColor?: string;
  BgColorDisabled?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  textColor: "white",
  BgColor: "#BAABE7",
  BgColorDisabled: "#BAABE7", // ✅ 修正語法
});
</script>

<style scoped lang="scss">
.card {
  width: 120px;
  aspect-ratio: 1/1;
  border-radius: 10px;
  padding: 12.5px;
  color: var(--text-color);
  background: var(--bg-color);
  display: flex;
  flex-direction: column;
  place-items: center;
  place-content: center;
  &:disabled {
    background: var(--bg-color-disabled);
  }
}
</style>
