<template>
  <div
    class="base-node"
    :class="[
      `node-${nodeType}`,
      { selected: selected },
      { dragging: isDragging },
    ]"
    :style="nodeStyles"
    @click="handleClick"
    @dblclick="handleDoubleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 节点头部 -->
    <div class="node-header">
      <div class="node-icon">
        <component :is="iconComponent" v-if="iconComponent" />
        <div
          v-else
          class="default-icon"
          :style="{ backgroundColor: nodeColor }"
        ></div>
      </div>
      <div class="node-title">
        {{ nodeTitle }}
      </div>
      <div class="node-actions">
        <slot name="actions">
          <button
            v-if="showEditButton"
            class="action-btn edit-btn"
            @click.stop="handleEdit"
            title="编辑"
          >
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
          <button
            v-if="showDeleteButton"
            class="action-btn delete-btn"
            @click.stop="handleDelete"
            title="删除"
          >
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
        </slot>
      </div>
    </div>

    <!-- 节点内容 -->
    <div class="node-content">
      <slot name="content">
        <div class="default-content">
          {{ defaultContent }}
        </div>
      </slot>
    </div>

    <!-- 节点状态指示器 -->
    <div v-if="showStatus" class="node-status">
      <div
        class="status-indicator"
        :class="statusClass"
        :title="statusText"
      ></div>
    </div>

    <!-- 连接点 -->
    <div class="connection-points">
      <div
        v-if="showInputPoint"
        class="connection-point input-point"
        @mousedown="handleInputConnection"
      ></div>
      <div
        v-if="showOutputPoint"
        class="connection-point output-point"
        @mousedown="handleOutputConnection"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { ExtensibleTask } from "@/schemas/ReMaScript/extensibleSchema";

// Props 定义
interface Props {
  id: string;
  data: {
    task: ExtensibleTask;
    nodeType: string;
  };
  selected?: boolean;
  nodeType: string;
  nodeTitle?: string;
  nodeColor?: string;
  iconComponent?: any;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  showStatus?: boolean;
  showInputPoint?: boolean;
  showOutputPoint?: boolean;
  defaultContent?: string;
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  nodeTitle: "节点",
  nodeColor: "#6B7280",
  showEditButton: true,
  showDeleteButton: true,
  showStatus: false,
  showInputPoint: true,
  showOutputPoint: true,
  defaultContent: "点击配置",
});

// Emits 定义
interface Emits {
  (e: "click", nodeId: string): void;
  (e: "double-click", nodeId: string): void;
  (e: "edit", nodeId: string): void;
  (e: "delete", nodeId: string): void;
  (e: "mouse-enter", nodeId: string): void;
  (e: "mouse-leave", nodeId: string): void;
  (e: "input-connection", nodeId: string): void;
  (e: "output-connection", nodeId: string): void;
}

const emit = defineEmits<Emits>();

// 本地状态
const isDragging = ref(false);

// 计算属性
const nodeStyles = computed(() => ({
  "--node-color": props.nodeColor,
  "--node-bg-color": `${props.nodeColor}20`,
  "--node-border-color": props.nodeColor,
}));

const statusClass = computed(() => {
  const task = props.data.task;
  if (!task) return "status-unknown";

  // 根据任务状态返回对应的 CSS 类
  switch (task.reaction) {
    case "trigger":
      return "status-trigger";
    case "response":
      return "status-response";
    default:
      return "status-unknown";
  }
});

const statusText = computed(() => {
  const task = props.data.task;
  if (!task) return "未知状态";

  return `${task.reaction === "trigger" ? "触发" : "响应"}事件`;
});

// 事件处理
const handleClick = () => {
  emit("click", props.id);
};

const handleDoubleClick = () => {
  emit("double-click", props.id);
};

const handleEdit = () => {
  emit("edit", props.id);
};

const handleDelete = () => {
  emit("delete", props.id);
};

const handleMouseEnter = () => {
  emit("mouse-enter", props.id);
};

const handleMouseLeave = () => {
  emit("mouse-leave", props.id);
};

const handleInputConnection = () => {
  emit("input-connection", props.id);
};

const handleOutputConnection = () => {
  emit("output-connection", props.id);
};
</script>

<style scoped lang="scss">
.base-node {
  @apply relative bg-white rounded-lg border-2 border-gray-200 shadow-md cursor-pointer transition-all duration-200;
  min-width: 200px;
  min-height: 80px;

  &:hover {
    @apply shadow-lg transform scale-105;
    border-color: var(--node-border-color);
  }

  &.selected {
    @apply ring-2 ring-blue-500;
    border-color: var(--node-border-color);
  }

  &.dragging {
    @apply opacity-75;
  }
}

.node-header {
  @apply flex items-center justify-between p-3 border-b border-gray-100;

  .node-icon {
    @apply flex items-center justify-center w-8 h-8 rounded-full;
    background-color: var(--node-bg-color);

    .default-icon {
      @apply w-6 h-6 rounded-full;
    }
  }

  .node-title {
    @apply flex-1 ml-2 text-sm font-medium text-gray-800 truncate;
  }

  .node-actions {
    @apply flex items-center space-x-1;

    .action-btn {
      @apply p-1 rounded hover:bg-gray-100 transition-colors;

      &.edit-btn {
        @apply text-blue-600 hover:bg-blue-50;
      }

      &.delete-btn {
        @apply text-red-600 hover:bg-red-50;
      }
    }
  }
}

.node-content {
  @apply p-3;

  .default-content {
    @apply text-sm text-gray-600 text-center;
  }
}

.node-status {
  @apply absolute top-2 right-2;

  .status-indicator {
    @apply w-3 h-3 rounded-full;

    &.status-trigger {
      @apply bg-blue-500;
    }

    &.status-response {
      @apply bg-green-500;
    }

    &.status-unknown {
      @apply bg-gray-400;
    }
  }
}

.connection-points {
  @apply absolute inset-0 pointer-events-none;

  .connection-point {
    @apply absolute w-3 h-3 rounded-full border-2 border-white shadow-md pointer-events-auto;

    &.input-point {
      @apply left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2;
      background-color: var(--node-color);

      &:hover {
        @apply scale-125;
      }
    }

    &.output-point {
      @apply right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2;
      background-color: var(--node-color);

      &:hover {
        @apply scale-125;
      }
    }
  }
}

// 节点类型特定样式
.node-trigger {
  --node-color: #baabe7;
}

.node-response {
  --node-color: #a0da8b;
}

.node-action {
  --node-color: #f9c357;
}

.node-condition {
  --node-color: #ffb74d;
}

.node-template {
  --node-color: #81c784;
}
</style>
