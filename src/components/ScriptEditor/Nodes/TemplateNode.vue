<template>
  <div
    class="template-node"
    :class="{ selected: selected }"
    @click="handleClick"
  >
    <div class="node-header">
      <div class="node-icon">
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div class="node-title">模板節點</div>
      <div class="node-actions">
        <button class="action-btn" @click.stop="handleEdit">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button class="action-btn" @click.stop="handleDelete">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="node-content">
      <div class="node-info">
        <div class="info-item">
          <span class="info-label">模板:</span>
          <span class="info-value">{{ task?.template?.id || "未設定" }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">類型:</span>
          <span class="info-value">{{ task?.template?.type || "未設定" }}</span>
        </div>
      </div>
    </div>

    <div class="node-ports">
      <Handle
        type="target"
        :position="Position.Top"
        :id="`${id}-target`"
        class="port port-target"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Handle, Position } from "@vue-flow/core";

interface Props {
  id: string;
  data: any;
  selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
});

const emit = defineEmits<{
  "node-click": [nodeId: string];
  "node-edit": [nodeId: string];
  "node-delete": [nodeId: string];
}>();

const task = computed(() => props.data?.task);

const handleClick = () => {
  emit("node-click", props.id);
};

const handleEdit = () => {
  emit("node-edit", props.id);
};

const handleDelete = () => {
  emit("node-delete", props.id);
};
</script>

<style scoped lang="scss">
.template-node {
  @apply bg-white border-2 border-gray-500 rounded-lg shadow-lg min-w-48;

  &.selected {
    @apply ring-2 ring-gray-300;
  }

  .node-header {
    @apply flex items-center justify-between p-3 bg-gray-50 rounded-t-lg border-b border-gray-200;

    .node-icon {
      @apply flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded-full;
    }

    .node-title {
      @apply flex-1 ml-2 text-sm font-medium text-gray-800;
    }

    .node-actions {
      @apply flex items-center space-x-1;

      .action-btn {
        @apply p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors;
      }
    }
  }

  .node-content {
    @apply p-3;

    .node-info {
      @apply space-y-2;

      .info-item {
        @apply flex items-center justify-between text-xs;

        .info-label {
          @apply text-gray-500;
        }

        .info-value {
          @apply font-medium text-gray-800;
        }
      }
    }
  }

  .node-ports {
    @apply relative;

    .port {
      @apply w-3 h-3 border-2 border-white rounded-full;

      &.port-target {
        @apply absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-500;
      }
    }
  }
}
</style>
