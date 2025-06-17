<template>
  <section class="card bg-[var(--color-toolbar-icon-condition)]">
    <div class="condition-header">
      <img :src="conditionIcon" alt="condition" class="w-6 h-6" />
      <span class="condition-title">{{ conditionTitle }}</span>
    </div>
    <div class="condition-content">
      <div v-if="conditionType" class="condition-type">
        {{ conditionType }}
      </div>
      <div v-else class="condition-placeholder">點擊設定條件</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { z } from "zod";

// 条件类型定义
const ConditionTypeSchema = z.enum(["if", "else", "switch"]);
type ConditionType = z.infer<typeof ConditionTypeSchema>;

interface Props {
  data?: {
    label: string;
    conditionType?: ConditionType;
    conditionValue?: string;
  };
  id?: string;
  isSelected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
});

// 计算属性
const conditionTitle = computed(() => {
  return props.data?.label || "條件判斷";
});

const conditionType = computed(() => {
  return props.data?.conditionType;
});

// 条件图标
const conditionIcon = computed(() => {
  const iconMap = {
    if: "/src/assets/icons/if-icon.svg",
    else: "/src/assets/icons/else-icon.svg",
    switch: "/src/assets/icons/switch-icon.svg",
  };
  return iconMap[conditionType.value] || "/src/assets/icons/if-icon.svg";
});

// 事件发射
const emit = defineEmits<{
  click: [nodeId: string];
  edit: [nodeId: string];
}>();

// 点击处理
const handleClick = () => {
  emit("click", props.id || "");
};

const handleEdit = () => {
  emit("edit", props.id || "");
};
</script>

<style scoped lang="scss">
.card {
  @apply p-4 rounded-lg border border-gray-200 cursor-pointer transition-all duration-200;

  &:hover {
    @apply shadow-md transform scale-105;
  }

  &.selected {
    @apply ring-2 ring-blue-500;
  }
}

.condition-header {
  @apply flex items-center gap-2 mb-2;

  .condition-title {
    @apply font-medium text-gray-800;
  }
}

.condition-content {
  @apply text-sm;

  .condition-type {
    @apply text-blue-600 font-medium;
  }

  .condition-placeholder {
    @apply text-gray-500 italic;
  }
}

// CSS 变量定义
:root {
  --color-toolbar-icon-condition: #ffb74d;
}
</style>
