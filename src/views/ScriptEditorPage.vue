<template>
  <div class="script-editor-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">自動化劇本編輯器</h1>
        <div class="script-info">
          <span class="script-name">{{
            currentScript?.info?.name || "未命名劇本"
          }}</span>
          <span class="script-status" :class="scriptStatus">{{
            getStatusText(scriptStatus)
          }}</span>
        </div>
      </div>
      <div class="header-right">
        <button class="btn btn-secondary" @click="handlePreview">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          預覽
        </button>
        <button class="btn btn-primary" @click="handleSave">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          儲存
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="editor-container">
      <!-- 左侧工具栏 -->
      <div class="toolbar-panel">
        <div class="toolbar-section">
          <h3 class="section-title">操作</h3>
          <div class="toolbar-buttons">
            <button
              class="toolbar-btn"
              :class="{ active: canUndo }"
              :disabled="!canUndo"
              @click="handleUndo"
              title="復原"
            >
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
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </button>
            <button
              class="toolbar-btn"
              :class="{ active: canRedo }"
              :disabled="!canRedo"
              @click="handleRedo"
              title="重做"
            >
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
                  d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
                />
              </svg>
            </button>
            <button class="toolbar-btn" @click="handleZoomIn" title="放大">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
            <button class="toolbar-btn" @click="handleZoomOut" title="縮小">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            <button class="toolbar-btn" @click="handleFitView" title="適應視窗">
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
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="toolbar-section">
          <h3 class="section-title">節點類型</h3>
          <div class="node-types">
            <div
              v-for="category in nodeCategories"
              :key="category.name"
              class="node-category"
            >
              <div
                class="category-header"
                @click="toggleCategory(category.name)"
              >
                <span class="category-name">{{ category.label }}</span>
                <span class="category-count"
                  >({{ category.nodes.length }})</span
                >
                <svg
                  class="category-arrow"
                  :class="{
                    rotated: expandedCategories.includes(category.name),
                  }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div
                v-if="expandedCategories.includes(category.name)"
                class="category-nodes"
              >
                <div
                  v-for="nodeType in category.nodes"
                  :key="nodeType.id"
                  class="node-item"
                  draggable="true"
                  @dragstart="handleDragStart($event, nodeType)"
                  @click="handleAddNode(nodeType.id)"
                >
                  <div
                    class="node-item-icon"
                    :style="{ backgroundColor: nodeType.color }"
                  >
                    <component
                      :is="nodeType.icon"
                      v-if="nodeType.icon"
                      class="w-4 h-4 text-white"
                    />
                    <div v-else class="w-4 h-4 bg-white rounded"></div>
                  </div>
                  <div class="node-item-info">
                    <div class="node-item-name">{{ nodeType.name }}</div>
                    <div class="node-item-description">
                      {{ nodeType.description || "無描述" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="toolbar-section">
          <h3 class="section-title">模板庫</h3>
          <div class="template-list">
            <div
              v-for="template in availableTemplates"
              :key="template.id"
              class="template-item"
              @click="handleSelectTemplate(template)"
            >
              <div class="template-icon">
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
              <div class="template-info">
                <div class="template-name">{{ template.name }}</div>
                <div class="template-description">
                  {{ template.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中央画布区域 -->
      <div class="canvas-panel">
        <div class="canvas-header">
          <div class="canvas-info">
            <span class="zoom-level">{{ Math.round(currentZoom * 100) }}%</span>
            <span class="node-count">{{ totalNodes }} 個節點</span>
            <span class="connection-count">{{ totalConnections }} 個連接</span>
          </div>
          <div class="canvas-actions">
            <button class="btn btn-sm btn-outline" @click="handleClearCanvas">
              <svg
                class="w-4 h-4 mr-1"
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
              清空
            </button>
            <button class="btn btn-sm btn-outline" @click="handleAutoLayout">
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              自動排列
            </button>
            <button class="btn btn-sm btn-outline" @click="handleTestLayout">
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              測試布局
            </button>
          </div>
        </div>

        <div
          class="canvas-container"
          @drop="handleDrop"
          @dragover="handleDragOver"
        >
          <ScriptCanvas
            v-model:elements="canvasElements"
            :script="currentScript"
            :selected-nodes="selectedNodes"
            :zoom="currentZoom"
            @node-click="handleNodeClick"
            @node-select="handleNodeSelect"
            @node-drag="handleNodeDrag"
            @connection-create="handleConnectionCreate"
            @connection-delete="handleConnectionDelete"
          />
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="properties-panel">
        <div class="properties-header">
          <h3 class="section-title">屬性設定</h3>
          <button
            v-if="selectedNode"
            class="btn btn-sm btn-outline btn-danger"
            @click="handleDeleteNode"
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
        </div>

        <div class="properties-content">
          <div v-if="selectedNode" class="node-properties">
            <NodeProperties
              :node="selectedNode"
              :script="currentScript"
              @update-node="handleUpdateNode"
            />
          </div>
          <div v-else class="no-selection">
            <div class="no-selection-icon">
              <svg
                class="w-12 h-12 text-gray-400"
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
            <p class="no-selection-text">選擇一個節點來查看屬性</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="status-bar">
      <div class="status-left">
        <span class="status-item">
          <span class="status-label">狀態:</span>
          <span class="status-value" :class="scriptStatus">{{
            getStatusText(scriptStatus)
          }}</span>
        </span>
        <span class="status-item">
          <span class="status-label">版本:</span>
          <span class="status-value">{{ currentScript?.version || 1 }}</span>
        </span>
        <span class="status-item">
          <span class="status-label">最後儲存:</span>
          <span class="status-value">{{ lastSavedTime || "未儲存" }}</span>
        </span>
      </div>
      <div class="status-right">
        <span v-if="validationErrors.length > 0" class="validation-errors">
          <svg
            class="w-4 h-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ validationErrors.length }} 個錯誤
        </span>
        <span v-else class="validation-success">
          <svg
            class="w-4 h-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          驗證通過
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useScriptStore } from "../stores/scriptStore";
import { useNodeRegistry } from "../composables/useNodeRegistry";
import { ScriptValidator } from "../utils/scriptValidator";
import { createCompleteLayout, getLayoutStats } from "../utils/nodeLayout";
import { testLayout, testComplexLayouts } from "../utils/testLayout";
import { emptyScriptBySchema } from "../data/RemaScript/emptyTree";

// 组件导入
import ScriptCanvas from "../components/ScriptEditor/ScriptCanvas.vue";
import NodeProperties from "../components/ScriptEditor/NodeProperties.vue";

// 路由
const router = useRouter();

// 状态管理
const scriptStore = useScriptStore();
const { getAllNodeTypes, createNode } = useNodeRegistry();

// 本地状态
const currentZoom = ref(1);
const selectedNodes = ref<string[]>([]);
const canvasElements = ref<any[]>([]);
const validationErrors = ref<string[]>([]);
const lastSavedTime = ref<string>("");
const expandedCategories = ref(["trigger", "response", "action"]);

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

const nodeCategories = computed(() => {
  const categories = {
    trigger: { name: "trigger", label: "觸發事件", nodes: [] as any[] },
    response: { name: "response", label: "響應事件", nodes: [] as any[] },
    action: { name: "action", label: "動作節點", nodes: [] as any[] },
    condition: { name: "condition", label: "條件節點", nodes: [] as any[] },
  };

  availableNodeTypes.value.forEach((nodeType) => {
    const category = categories[nodeType.category as keyof typeof categories];
    if (category) {
      category.nodes.push(nodeType);
    }
  });

  return Object.values(categories).filter(
    (category) => category.nodes.length > 0
  );
});

const availableTemplates = computed(() => [
  {
    id: "template-1",
    name: "歡迎郵件模板",
    description: "新用戶註冊後的歡迎郵件",
  },
  {
    id: "template-2",
    name: "購物車提醒模板",
    description: "購物車未結帳的提醒郵件",
  },
  {
    id: "template-3",
    name: "促銷活動模板",
    description: "定期促銷活動的郵件模板",
  },
]);

// 更新画布元素
const updateCanvasElements = () => {
  if (!currentScript.value) {
    canvasElements.value = [];
    return;
  }

  // 使用自動布局計算節點位置
  const layoutResult = createCompleteLayout(currentScript.value.task, {
    startX: 400,
    startY: 100,
    horizontalSpacing: 350,
    verticalSpacing: 250,
  });

  // 合併節點和連接
  canvasElements.value = [...layoutResult.nodes, ...layoutResult.edges];
};

// 方法
const getStatusText = (status: string) => {
  const statusMap = {
    "no-script": "無劇本",
    valid: "有效",
    error: "有錯誤",
    draft: "草稿",
    published: "已發布",
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

const handleSave = async () => {
  try {
    if (currentScript.value) {
      const validator = new ScriptValidator();
      const errors = validator.validate(currentScript.value);
      validationErrors.value = errors;

      if (errors.length === 0) {
        scriptStore.updateScript(currentScript.value);
        lastSavedTime.value = new Date().toLocaleString();
        console.log("劇本儲存成功");
      } else {
        console.error("劇本驗證失敗:", errors);
      }
    }
  } catch (error) {
    console.error("儲存失敗:", error);
  }
};

const handlePreview = () => {
  console.log("預覽劇本");
};

const handleUndo = () => {
  scriptStore.undo();
  updateCanvasElements();
};

const handleRedo = () => {
  scriptStore.redo();
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
};

const handleClearCanvas = () => {
  if (confirm("確定要清空畫布嗎？此操作無法復原。")) {
    scriptStore.updateScript(emptyScriptBySchema);
    updateCanvasElements();
  }
};

const handleAutoLayout = () => {
  if (!currentScript.value || !currentScript.value.task.length) {
    console.log("沒有節點可以排列");
    return;
  }

  try {
    // 使用自動布局功能
    const layoutResult = createCompleteLayout(currentScript.value.task, {
      startX: 400,
      startY: 100,
      horizontalSpacing: 350,
      verticalSpacing: 250,
      nodeWidth: 200,
      nodeHeight: 120,
    });

    // 更新節點位置
    const updatedTasks = currentScript.value.task.map((task) => {
      const position = layoutResult.positions.get(task.id);
      if (position) {
        return {
          ...task,
          position: position,
        };
      }
      return task;
    });

    // 更新腳本
    const updatedScript = {
      ...currentScript.value,
      task: updatedTasks,
    };

    scriptStore.updateScript(updatedScript);
    updateCanvasElements();

    // 顯示布局統計信息
    const stats = getLayoutStats(currentScript.value.task);
    console.log("自動布局完成:", stats);

    alert(
      `自動布局完成！\n總節點數: ${stats.totalNodes}\n總層級數: ${stats.totalLevels}\n最大層級節點數: ${stats.maxNodesInLevel}`
    );
  } catch (error) {
    console.error("自動布局失敗:", error);
    alert("自動布局失敗，請檢查節點連接關係");
  }
};

const handleTestLayout = () => {
  console.log("開始測試布局功能...");

  // 測試基本布局
  const basicResult = testLayout();
  console.log("基本布局測試結果:", basicResult);

  // 測試複雜布局
  const complexResult = testComplexLayouts();
  console.log("複雜布局測試結果:", complexResult);

  alert("布局測試完成！請查看控制台輸出。");
};

const toggleCategory = (categoryName: string) => {
  const index = expandedCategories.value.indexOf(categoryName);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(categoryName);
  }
};

const handleDragStart = (event: DragEvent, nodeType: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "node",
        nodeTypeId: nodeType.id,
      })
    );
    event.dataTransfer.effectAllowed = "copy";
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const data = event.dataTransfer?.getData("application/json");
  if (data) {
    const { type, nodeTypeId } = JSON.parse(data);
    if (type === "node") {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      handleAddNode(nodeTypeId, position);
    }
  }
};

const handleAddNode = (
  nodeTypeId: string,
  position: { x: number; y: number } = { x: 300, y: 200 }
) => {
  try {
    const node = createNode(nodeTypeId, position);
    const task = {
      id: node.id,
      reaction: (nodeTypeId.includes("trigger") ? "trigger" : "response") as
        | "trigger"
        | "response",
      sourceId: null,
      targetId: null,
      eventOption: {
        type: "sign" as const,
      },
      schedule: {
        type: "once" as const,
        time: {
          once: new Date().toISOString(),
        },
      },
      template: {
        type: "email" as const,
        id: `template-${Date.now()}`,
        subject: "新節點模板",
      },
    };

    scriptStore.addTask(task);
    updateCanvasElements();
  } catch (error) {
    console.error("添加節點失敗:", error);
  }
};

const handleNodeClick = (nodeId: string) => {
  console.log("節點點擊:", nodeId);
};

const handleNodeSelect = (nodeIds: string[]) => {
  selectedNodes.value = nodeIds;
};

const handleNodeDrag = (nodeId: string, position: { x: number; y: number }) => {
  console.log("節點拖拽:", nodeId, position);
};

const handleConnectionCreate = (sourceId: string, targetId: string) => {
  if (currentScript.value) {
    const updatedTasks = currentScript.value.task.map((task) => {
      if (task.id === sourceId) {
        return { ...task, targetId };
      }
      return task;
    });

    const updatedScript = {
      ...currentScript.value,
      task: updatedTasks,
    };

    scriptStore.updateScript(updatedScript);
    updateCanvasElements();
  }
};

const handleConnectionDelete = (connectionId: string) => {
  if (currentScript.value) {
    const [sourceId, targetId] = connectionId.replace("edge-", "").split("-");
    const updatedTasks = currentScript.value.task.map((task) => {
      if (task.id === sourceId && task.targetId === targetId) {
        return { ...task, targetId: null };
      }
      return task;
    });

    const updatedScript = {
      ...currentScript.value,
      task: updatedTasks,
    };

    scriptStore.updateScript(updatedScript);
    updateCanvasElements();
  }
};

const handleUpdateNode = (nodeId: string, updates: any) => {
  scriptStore.updateTask(nodeId, updates);
  updateCanvasElements();
};

const handleDeleteNode = () => {
  if (selectedNode.value) {
    scriptStore.deleteTask(selectedNode.value.id);
    selectedNodes.value = selectedNodes.value.filter(
      (id) => id !== selectedNode.value?.id
    );
    updateCanvasElements();
  }
};

const handleSelectTemplate = (template: any) => {
  console.log("選擇模板:", template);
};

// 监听脚本变化
watch(() => currentScript.value, updateCanvasElements, { deep: true });

onMounted(() => {
  // 如果没有当前脚本，创建一个空白脚本
  if (!currentScript.value) {
    scriptStore.updateScript(emptyScriptBySchema);
  }
  updateCanvasElements();
});
</script>

<style scoped lang="scss">
.script-editor-page {
  @apply h-screen flex flex-col bg-gray-50;
}

.page-header {
  @apply flex items-center justify-between p-4 bg-white border-b border-gray-200;

  .header-left {
    @apply flex items-center space-x-4;

    .page-title {
      @apply text-xl font-semibold text-gray-800;
    }

    .script-info {
      @apply flex items-center space-x-2;

      .script-name {
        @apply text-sm font-medium text-gray-600;
      }

      .script-status {
        @apply px-2 py-1 text-xs rounded-full;

        &.valid {
          @apply bg-green-100 text-green-800;
        }

        &.error {
          @apply bg-red-100 text-red-800;
        }

        &.draft {
          @apply bg-yellow-100 text-yellow-800;
        }
      }
    }
  }

  .header-right {
    @apply flex items-center space-x-2;
  }
}

.editor-container {
  @apply flex-1 flex overflow-hidden;
}

.toolbar-panel {
  @apply w-80 bg-white border-r border-gray-200 flex flex-col;

  .toolbar-section {
    @apply p-4 border-b border-gray-100;

    &:last-child {
      @apply border-b-0;
    }

    .section-title {
      @apply text-sm font-medium text-gray-700 mb-3;
    }
  }
}

.toolbar-buttons {
  @apply grid grid-cols-5 gap-2;

  .toolbar-btn {
    @apply p-2 rounded hover:bg-gray-100 transition-colors;

    &.active {
      @apply bg-blue-100 text-blue-600;
    }

    &:disabled {
      @apply opacity-50 cursor-not-allowed;
    }
  }
}

.node-categories {
  @apply space-y-2;

  .node-category {
    @apply border border-gray-200 rounded-lg overflow-hidden;

    .category-header {
      @apply flex items-center justify-between p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors;

      .category-name {
        @apply text-sm font-medium text-gray-700;
      }

      .category-count {
        @apply text-xs text-gray-500;
      }

      .category-arrow {
        @apply w-4 h-4 text-gray-500 transition-transform;

        &.rotated {
          @apply rotate-180;
        }
      }
    }

    .category-nodes {
      @apply p-2 space-y-1;

      .node-item {
        @apply flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors;

        .node-item-icon {
          @apply flex items-center justify-center w-8 h-8 rounded-full mr-3;
        }

        .node-item-info {
          @apply flex-1 min-w-0;

          .node-item-name {
            @apply text-sm font-medium text-gray-800 truncate;
          }

          .node-item-description {
            @apply text-xs text-gray-500 truncate;
          }
        }
      }
    }
  }
}

.template-list {
  @apply space-y-2;

  .template-item {
    @apply flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors;

    .template-icon {
      @apply flex items-center justify-center w-8 h-8 rounded bg-blue-100 text-blue-600 mr-3;
    }

    .template-info {
      @apply flex-1 min-w-0;

      .template-name {
        @apply text-sm font-medium text-gray-800 truncate;
      }

      .template-description {
        @apply text-xs text-gray-500 truncate;
      }
    }
  }
}

.canvas-panel {
  @apply flex-1 flex flex-col;

  .canvas-header {
    @apply flex items-center justify-between p-3 bg-white border-b border-gray-200;

    .canvas-info {
      @apply flex items-center space-x-4 text-sm text-gray-600;
    }

    .canvas-actions {
      @apply flex items-center space-x-2;
    }
  }

  .canvas-container {
    @apply flex-1 relative;
  }
}

.properties-panel {
  @apply w-80 bg-white border-l border-gray-200 flex flex-col;

  .properties-header {
    @apply flex items-center justify-between p-4 border-b border-gray-200;

    .section-title {
      @apply text-sm font-medium text-gray-700;
    }
  }

  .properties-content {
    @apply flex-1 overflow-y-auto;

    .no-selection {
      @apply flex flex-col items-center justify-center h-full text-center p-8;

      .no-selection-icon {
        @apply mb-4;
      }

      .no-selection-text {
        @apply text-sm text-gray-500;
      }
    }
  }
}

.status-bar {
  @apply flex items-center justify-between p-2 bg-white border-t border-gray-200 text-sm;

  .status-left {
    @apply flex items-center space-x-4;

    .status-item {
      @apply flex items-center space-x-1;

      .status-label {
        @apply text-gray-500;
      }

      .status-value {
        @apply font-medium;

        &.valid {
          @apply text-green-600;
        }

        &.error {
          @apply text-red-600;
        }
      }
    }
  }

  .status-right {
    @apply flex items-center space-x-2;

    .validation-errors {
      @apply flex items-center space-x-1 text-red-600;
    }

    .validation-success {
      @apply flex items-center space-x-1 text-green-600;
    }
  }
}

// 按钮样式
.btn {
  @apply inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md transition-colors;

  &.btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }

  &.btn-secondary {
    @apply bg-gray-600 text-white hover:bg-gray-700;
  }

  &.btn-outline {
    @apply border-gray-300 text-gray-700 bg-white hover:bg-gray-50;

    &.btn-danger {
      @apply border-red-300 text-red-700 hover:bg-red-50;
    }
  }

  &.btn-sm {
    @apply px-2 py-1 text-xs;
  }
}
</style>
