<template>
  <div class="script-canvas">
    <VueFlow
      v-model="elements"
      :default-viewport="{ zoom: 1 }"
      :min-zoom="0.2"
      :max-zoom="4"
      :node-types="nodeTypes"
      :edge-types="edgeTypes"
      :connection-line-style="{ stroke: '#b1b1b7', strokeWidth: 2 }"
      :connection-mode="ConnectionMode.Loose"
      :snap-to-grid="true"
      :snap-grid="[15, 15]"
      @node-click="handleNodeClick"
      @node-drag-stop="handleNodeDragStop"
      @connect="handleConnect"
      @edge-click="handleEdgeClick"
      @pane-click="handlePaneClick"
    >
      <template #node-trigger-event="nodeProps">
        <TriggerEventNode v-bind="nodeProps" />
      </template>

      <template #node-response-event="nodeProps">
        <ResponseEventNode v-bind="nodeProps" />
      </template>

      <template #node-action="nodeProps">
        <ActionNode v-bind="nodeProps" />
      </template>

      <template #node-condition="nodeProps">
        <ConditionNode v-bind="nodeProps" />
      </template>

      <template #node-template="nodeProps">
        <TemplateNode v-bind="nodeProps" />
      </template>

      <template #edge-step="edgeProps">
        <StepEdge v-bind="edgeProps" />
      </template>

      <Background :gap="8" />
      <MiniMap />
      <Controls />
      <Panel position="top-left" class="canvas-panel">
        <div class="panel-content">
          <button class="panel-btn" @click="handleAddTrigger">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            添加觸發
          </button>
          <button class="panel-btn" @click="handleAddResponse">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            添加響應
          </button>
        </div>
      </Panel>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { VueFlow, useVueFlow, Panel, Position } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { ControlButton, Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { NodeToolbar } from "@vue-flow/node-toolbar";

const {
  onInit,
  onNodeDragStop,
  onConnect,
  addEdges,
  setViewport,
  toObject,
  onNodeClick,
  fitView,
  fitBounds,
  onPaneReady,
  addNodes,
  removeNodes,
  removeEdges,
  getNodes,
  getEdges,
} = useVueFlow();
// 节点组件
import TriggerEventNode from "./Nodes/TriggerEventNode.vue";
import ResponseEventNode from "./Nodes/ResponseEventNode.vue";
import ActionNode from "./Nodes/ActionNode.vue";
import ConditionNode from "./Nodes/ConditionNode.vue";
import TemplateNode from "./Nodes/TemplateNode.vue";
import StepEdge from "./Edges/StepEdge.vue";

// Props
interface Props {
  elements: (Node | Edge)[];
  script?: any;
  selectedNodes?: string[];
  zoom?: number;
}

const props = withDefaults(defineProps<Props>(), {
  elements: () => [],
  selectedNodes: () => [],
  zoom: 1,
});

// Emits
const emit = defineEmits<{
  "update:elements": [elements: (Node | Edge)[]];
  "node-click": [nodeId: string];
  "node-select": [nodeIds: string[]];
  "node-drag": [nodeId: string, position: { x: number; y: number }];
  "connection-create": [sourceId: string, targetId: string];
  "connection-delete": [connectionId: string];
}>();

// 本地状态
const elements = ref<(Node | Edge)[]>(props.elements);

// 节点类型
const nodeTypes = {
  "trigger-event": TriggerEventNode,
  "response-event": ResponseEventNode,
  action: ActionNode,
  condition: ConditionNode,
  template: TemplateNode,
};

// 边类型
const edgeTypes = {
  step: StepEdge,
};

// 计算属性
const selectedNodeIds = computed(() => {
  return getNodes()
    .value.filter((node) => node.selected)
    .map((node) => node.id);
});

// 监听外部元素变化
watch(
  () => props.elements,
  (newElements) => {
    elements.value = newElements;
  },
  { deep: true }
);

// 监听选中节点变化
watch(selectedNodeIds, (newSelectedIds) => {
  emit("node-select", newSelectedIds);
});

// 方法
const handleNodeClick = (event: any, node: Node) => {
  emit("node-click", node.id);
};

const handleNodeDragStop = (event: any, node: Node) => {
  emit("node-drag", node.id, node.position);
};

const handleConnect = (connection: Connection) => {
  if (connection.source && connection.target) {
    emit("connection-create", connection.source, connection.target);
  }
};

const handleEdgeClick = (event: any, edge: Edge) => {
  emit("connection-delete", edge.id);
};

const handlePaneClick = () => {
  // 点击空白区域取消选择
  emit("node-select", []);
};

const handleAddTrigger = () => {
  const newNode: Node = {
    id: `trigger-${Date.now()}`,
    type: "trigger-event",
    position: { x: 100, y: 100 },
    data: {
      nodeType: "trigger",
      task: {
        id: `trigger-${Date.now()}`,
        reaction: "trigger",
        sourceId: null,
        targetId: null,
        eventOption: {
          type: "sign",
          fields: {},
          extensions: {},
        },
        schedule: {
          type: "once",
          config: {},
          extensions: {},
        },
        template: {
          type: "email",
          id: `template-${Date.now()}`,
          fields: {},
          extensions: {},
        },
        extensions: {},
      },
    },
  };

  addNodes([newNode]);
  updateElements();
};

const handleAddResponse = () => {
  const newNode: Node = {
    id: `response-${Date.now()}`,
    type: "response-event",
    position: { x: 300, y: 100 },
    data: {
      nodeType: "response",
      task: {
        id: `response-${Date.now()}`,
        reaction: "response",
        sourceId: null,
        targetId: null,
        eventOption: {
          type: "open",
          fields: {},
          extensions: {},
        },
        schedule: {
          type: "once",
          config: {},
          extensions: {},
        },
        template: {
          type: "email",
          id: `template-${Date.now()}`,
          fields: {},
          extensions: {},
        },
        extensions: {},
      },
    },
  };

  addNodes([newNode]);
  updateElements();
};

const updateElements = () => {
  const nodes = getNodes().value;
  const edges = getEdges().value;
  elements.value = [...nodes, ...edges];
  emit("update:elements", elements.value);
};

// 监听元素变化
watch(
  elements,
  (newElements) => {
    emit("update:elements", newElements);
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
.script-canvas {
  @apply w-full h-full;

  :deep(.vue-flow) {
    @apply bg-gray-50;
  }

  :deep(.vue-flow__node) {
    @apply cursor-pointer;

    &.selected {
      @apply ring-2 ring-blue-500;
    }
  }

  :deep(.vue-flow__edge) {
    @apply cursor-pointer;

    &.selected {
      @apply stroke-blue-500 stroke-2;
    }
  }

  :deep(.vue-flow__controls) {
    @apply bg-white border border-gray-200 rounded-lg shadow-lg;
  }

  :deep(.vue-flow__minimap) {
    @apply bg-white border border-gray-200 rounded-lg;
  }
}

.canvas-panel {
  @apply bg-white border border-gray-200 rounded-lg shadow-lg;

  .panel-content {
    @apply p-2 space-y-2;

    .panel-btn {
      @apply flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors;
    }
  }
}
</style>
