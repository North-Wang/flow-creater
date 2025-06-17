<template>
  <div class="script-editor">
    <!-- 顶部工具栏 -->
    <ScriptToolbar
      :script="currentScript"
      :can-undo="canUndo"
      :can-redo="canRedo"
      @save="handleSave"
      @undo="handleUndo"
      @redo="handleRedo"
      @export="handleExport"
      @import="handleImport"
    />

    <!-- 主要内容区域 -->
    <div class="editor-main">
      <!-- 左侧面板 -->
      <ScriptSidebar
        :node-types="availableNodeTypes"
        @add-node="handleAddNode"
        @select-template="handleSelectTemplate"
      />

      <!-- 中央画布区域 -->
      <div class="canvas-container">
        <!-- 画布工具栏 -->
        <CanvasToolbar
          :zoom="currentZoom"
          :selected-nodes="selectedNodes"
          @zoom-in="handleZoomIn"
          @zoom-out="handleZoomOut"
          @fit-view="handleFitView"
          @delete-selected="handleDeleteSelected"
        />

        <!-- 流程图画布 -->
        <ScriptCanvas
          v-model:elements="canvasElements"
          :script="currentScript"
          :selected-nodes="selectedNodes"
          @node-click="handleNodeClick"
          @node-select="handleNodeSelect"
          @node-drag="handleNodeDrag"
          @connection-create="handleConnectionCreate"
          @connection-delete="handleConnectionDelete"
        />
      </div>

      <!-- 右侧属性面板 -->
      <ScriptProperties
        v-if="selectedNode"
        :node="selectedNode"
        :script="currentScript"
        @update-node="handleUpdateNode"
        @delete-node="handleDeleteNode"
      />
    </div>

    <!-- 底部状态栏 -->
    <ScriptStatusBar
      :script-status="scriptStatus"
      :total-nodes="totalNodes"
      :total-connections="totalConnections"
      :validation-errors="validationErrors"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useScriptStore } from "@/stores/scriptStore";
import { useNodeRegistry } from "@/composables/useNodeRegistry";
import { ScriptValidator } from "@/utils/scriptValidator";
import type {
  ExtensibleScript,
  ExtensibleTask,
} from "@/schemas/ReMaScript/extensibleSchema";

// 组件导入
import ScriptToolbar from "./ScriptToolbar.vue";
import ScriptSidebar from "./ScriptSidebar.vue";
import ScriptCanvas from "./ScriptCanvas.vue";
import ScriptProperties from "./ScriptProperties.vue";
import ScriptStatusBar from "./ScriptStatusBar.vue";
import CanvasToolbar from "./CanvasToolbar.vue";

// 状态管理
const scriptStore = useScriptStore();
const { getAllNodeTypes, createNode } = useNodeRegistry();

// 本地状态
const currentZoom = ref(1);
const selectedNodes = ref<string[]>([]);
const canvasElements = ref<any[]>([]);
const validationErrors = ref<string[]>([]);

// 计算属性
const currentScript = computed(() => scriptStore.currentScript);
const canUndo = computed(() => scriptStore.canUndo);
const canRedo = computed(() => scriptStore.canRedo);
const availableNodeTypes = computed(() => getAllNodeTypes());

const selectedNode = computed(() => {
  if (selectedNodes.value.length === 0) return null;
  const nodeId = selectedNodes.value[0];
  return currentScript.value?.task.find((task) => task.id === nodeId) || null;
});

const scriptStatus = computed(() => {
  if (!currentScript.value) return "no-script";
  if (validationErrors.value.length > 0) return "error";
  return "valid";
});

const totalNodes = computed(() => currentScript.value?.task.length || 0);
const totalConnections = computed(() => {
  if (!currentScript.value) return 0;
  return currentScript.value.task.filter(
    (task) => task.sourceId && task.targetId
  ).length;
});

// 事件处理
const handleSave = async () => {
  try {
    // 验证脚本
    if (currentScript.value) {
      const validator = new ScriptValidator();
      const errors = validator.validate(currentScript.value);
      validationErrors.value = errors;

      if (errors.length === 0) {
        await scriptStore.saveScript(currentScript.value);
        console.log("脚本保存成功");
      } else {
        console.error("脚本验证失败:", errors);
      }
    }
  } catch (error) {
    console.error("保存失败:", error);
  }
};

const handleUndo = () => {
  scriptStore.undo();
  updateCanvasElements();
};

const handleRedo = () => {
  scriptStore.redo();
  updateCanvasElements();
};

const handleExport = () => {
  if (currentScript.value) {
    const dataStr = JSON.stringify(currentScript.value, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentScript.value.info.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

const handleImport = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const scriptData = JSON.parse(e.target?.result as string);
      scriptStore.updateScript(scriptData);
      updateCanvasElements();
    } catch (error) {
      console.error("导入失败:", error);
    }
  };
  reader.readAsText(file);
};

const handleAddNode = (
  nodeTypeId: string,
  position: { x: number; y: number }
) => {
  try {
    const node = createNode(nodeTypeId, position);
    const task: ExtensibleTask = {
      id: node.id,
      reaction: nodeTypeId.includes("trigger") ? "trigger" : "response",
      sourceId: null,
      targetId: null,
      eventOption: {
        type: nodeTypeId,
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
    };

    scriptStore.addTask(task);
    updateCanvasElements();
  } catch (error) {
    console.error("添加节点失败:", error);
  }
};

const handleNodeClick = (nodeId: string) => {
  // 处理节点点击，可能打开编辑面板或切换视图
  console.log("节点点击:", nodeId);
};

const handleNodeSelect = (nodeIds: string[]) => {
  selectedNodes.value = nodeIds;
};

const handleNodeDrag = (nodeId: string, position: { x: number; y: number }) => {
  // 更新节点位置
  console.log("节点拖拽:", nodeId, position);
};

const handleConnectionCreate = (sourceId: string, targetId: string) => {
  // 创建连接
  scriptStore.createConnection(sourceId, targetId);
  updateCanvasElements();
};

const handleConnectionDelete = (connectionId: string) => {
  // 删除连接
  scriptStore.deleteConnection(connectionId);
  updateCanvasElements();
};

const handleUpdateNode = (nodeId: string, updates: Partial<ExtensibleTask>) => {
  scriptStore.updateTask(nodeId, updates);
  updateCanvasElements();
};

const handleDeleteNode = (nodeId: string) => {
  scriptStore.deleteTask(nodeId);
  selectedNodes.value = selectedNodes.value.filter((id) => id !== nodeId);
  updateCanvasElements();
};

const handleZoomIn = () => {
  currentZoom.value = Math.min(currentZoom.value * 1.2, 4);
};

const handleZoomOut = () => {
  currentZoom.value = Math.max(currentZoom.value / 1.2, 0.2);
};

const handleFitView = () => {
  currentZoom.value = 1;
  // 触发画布适应视图
};

const handleDeleteSelected = () => {
  selectedNodes.value.forEach((nodeId) => {
    scriptStore.deleteTask(nodeId);
  });
  selectedNodes.value = [];
  updateCanvasElements();
};

const handleSelectTemplate = (templateId: string) => {
  // 处理模板选择
  console.log("选择模板:", templateId);
};

// 更新画布元素
const updateCanvasElements = () => {
  if (!currentScript.value) {
    canvasElements.value = [];
    return;
  }

  // 将脚本数据转换为画布元素
  const nodes = currentScript.value.task.map((task) => ({
    id: task.id,
    type: task.eventOption.type,
    position: { x: 0, y: 0 }, // 需要从存储中获取位置
    data: {
      task,
      nodeType: task.reaction,
    },
  }));

  const edges = currentScript.value.task
    .filter((task) => task.sourceId && task.targetId)
    .map((task) => ({
      id: `edge-${task.sourceId}-${task.targetId}`,
      source: task.sourceId,
      target: task.targetId,
      type: "step",
      class: "dark",
      animated: false,
    }));

  canvasElements.value = [...nodes, ...edges];
};

// 监听脚本变化
watch(() => currentScript.value, updateCanvasElements, { deep: true });

onMounted(() => {
  updateCanvasElements();
});
</script>

<style scoped lang="scss">
.script-editor {
  @apply h-screen flex flex-col bg-gray-50;

  .editor-main {
    @apply flex-1 flex overflow-hidden;

    .canvas-container {
      @apply flex-1 flex flex-col relative;
    }
  }
}
</style>
