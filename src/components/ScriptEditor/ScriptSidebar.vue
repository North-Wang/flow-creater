<template>
  <div class="script-sidebar">
    <!-- 侧边栏头部 -->
    <div class="sidebar-header">
      <h3 class="sidebar-title">节点库</h3>
      <button
        class="sidebar-toggle"
        @click="isCollapsed = !isCollapsed"
        :title="isCollapsed ? '展开' : '收起'"
      >
        <svg
          class="w-4 h-4 transition-transform"
          :class="{ 'rotate-180': !isCollapsed }"
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
      </button>
    </div>

    <!-- 侧边栏内容 -->
    <div class="sidebar-content" :class="{ collapsed: isCollapsed }">
      <!-- 搜索框 -->
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索节点类型..."
          class="search-input"
        />
        <svg
          class="search-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- 节点类型分类 -->
      <div class="node-categories">
        <div
          v-for="category in filteredCategories"
          :key="category.name"
          class="node-category"
        >
          <div class="category-header" @click="toggleCategory(category.name)">
            <span class="category-name">{{ category.label }}</span>
            <span class="category-count">({{ category.nodes.length }})</span>
            <svg
              class="category-arrow"
              :class="{ rotated: expandedCategories.includes(category.name) }"
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
              @click="handleNodeClick(nodeType)"
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
                  {{ nodeType.description || "无描述" }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 模板库 -->
      <div class="template-section">
        <div class="section-header">
          <h4 class="section-title">模板库</h4>
          <button class="add-template-btn" @click="handleAddTemplate">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <div class="template-list">
          <div
            v-for="template in availableTemplates"
            :key="template.id"
            class="template-item"
            @click="handleTemplateClick(template)"
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
              <div class="template-description">{{ template.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { NodeType } from "@/composables/useNodeRegistry";

// Props 定义
interface Props {
  nodeTypes: NodeType[];
  templates?: Array<{
    id: string;
    name: string;
    description: string;
    data: any;
  }>;
}

const props = withDefaults(defineProps<Props>(), {
  templates: () => [],
});

// Emits 定义
interface Emits {
  (e: "add-node", nodeTypeId: string, position: { x: number; y: number }): void;
  (e: "select-template", templateId: string): void;
}

const emit = defineEmits<Emits>();

// 本地状态
const isCollapsed = ref(false);
const searchQuery = ref("");
const expandedCategories = ref(["trigger", "response", "action"]);

// 计算属性
const filteredNodeTypes = computed(() => {
  if (!searchQuery.value) return props.nodeTypes;

  return props.nodeTypes.filter(
    (nodeType) =>
      nodeType.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      nodeType.description
        ?.toLowerCase()
        .includes(searchQuery.value.toLowerCase())
  );
});

const nodeCategories = computed(() => {
  const categories = {
    trigger: { name: "trigger", label: "触发事件", nodes: [] as NodeType[] },
    response: { name: "response", label: "响应事件", nodes: [] as NodeType[] },
    action: { name: "action", label: "动作节点", nodes: [] as NodeType[] },
    condition: {
      name: "condition",
      label: "条件节点",
      nodes: [] as NodeType[],
    },
  };

  filteredNodeTypes.value.forEach((nodeType) => {
    const category = categories[nodeType.category as keyof typeof categories];
    if (category) {
      category.nodes.push(nodeType);
    }
  });

  return Object.values(categories).filter(
    (category) => category.nodes.length > 0
  );
});

const filteredCategories = computed(() => {
  return nodeCategories.value.filter((category) => category.nodes.length > 0);
});

const availableTemplates = computed(() => {
  return props.templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      template.description
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
  );
});

// 事件处理
const toggleCategory = (categoryName: string) => {
  const index = expandedCategories.value.indexOf(categoryName);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(categoryName);
  }
};

const handleDragStart = (event: DragEvent, nodeType: NodeType) => {
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

const handleNodeClick = (nodeType: NodeType) => {
  // 在画布中心添加节点
  const position = { x: 300, y: 200 }; // 默认位置
  emit("add-node", nodeType.id, position);
};

const handleTemplateClick = (template: any) => {
  emit("select-template", template.id);
};

const handleAddTemplate = () => {
  // 打开添加模板的对话框
  console.log("添加新模板");
};
</script>

<style scoped lang="scss">
.script-sidebar {
  @apply w-80 bg-white border-r border-gray-200 flex flex-col;

  .sidebar-header {
    @apply flex items-center justify-between p-4 border-b border-gray-200;

    .sidebar-title {
      @apply text-lg font-semibold text-gray-800;
    }

    .sidebar-toggle {
      @apply p-1 rounded hover:bg-gray-100 transition-colors;
    }
  }

  .sidebar-content {
    @apply flex-1 overflow-y-auto;

    &.collapsed {
      @apply hidden;
    }
  }
}

.search-container {
  @apply relative p-4 border-b border-gray-200;

  .search-input {
    @apply w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }

  .search-icon {
    @apply absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400;
  }
}

.node-categories {
  @apply p-4 space-y-2;

  .node-category {
    @apply border border-gray-200 rounded-lg overflow-hidden;

    .category-header {
      @apply flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors;

      .category-name {
        @apply font-medium text-gray-700;
      }

      .category-count {
        @apply text-sm text-gray-500;
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

.template-section {
  @apply p-4 border-t border-gray-200;

  .section-header {
    @apply flex items-center justify-between mb-3;

    .section-title {
      @apply text-sm font-medium text-gray-700;
    }

    .add-template-btn {
      @apply p-1 rounded hover:bg-gray-100 transition-colors text-gray-600;
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
}
</style>
