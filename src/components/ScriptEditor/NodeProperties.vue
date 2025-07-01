<template>
  <div class="node-properties">
    <div class="properties-section">
      <h4 class="section-title">基本資訊</h4>
      <div class="form-group">
        <label class="form-label">節點 ID</label>
        <input v-model="nodeId" type="text" class="form-input" readonly />
      </div>
      <div class="form-group">
        <label class="form-label">節點類型</label>
        <input v-model="nodeType" type="text" class="form-input" readonly />
      </div>
    </div>

    <div class="properties-section">
      <h4 class="section-title">事件設定</h4>
      <div class="form-group">
        <label class="form-label">事件類型</label>
        <select v-model="eventType" class="form-select">
          <option value="sign">註冊</option>
          <option value="post_purchase_marketing">購買</option>
          <option value="cart_abandonment">購物車放棄</option>
          <option value="page_view">頁面瀏覽</option>
          <option value="recurring_scheduled">定時</option>
          <option value="open">開啟</option>
        </select>
      </div>

      <div v-if="eventType === 'post_purchase_marketing'" class="form-group">
        <label class="form-label">購買類型</label>
        <input v-model="purchaseType" type="text" class="form-input" />
      </div>

      <div v-if="eventType === 'post_purchase_marketing'" class="form-group">
        <label class="form-label">購買項目</label>
        <input v-model="purchaseItem" type="text" class="form-input" />
      </div>
    </div>

    <div class="properties-section">
      <h4 class="section-title">排程設定</h4>
      <div class="form-group">
        <label class="form-label">排程類型</label>
        <select v-model="scheduleType" class="form-select">
          <option value="once">一次性</option>
          <option value="recurrence">重複</option>
        </select>
      </div>

      <div v-if="scheduleType === 'once'" class="form-group">
        <label class="form-label">執行時間</label>
        <input
          v-model="scheduleTime"
          type="datetime-local"
          class="form-input"
        />
      </div>

      <div v-if="scheduleType === 'recurrence'" class="form-group">
        <label class="form-label">Cron 表達式</label>
        <input
          v-model="cronExpression"
          type="text"
          class="form-input"
          placeholder="0 9 * * *"
        />
      </div>
    </div>

    <div class="properties-section">
      <h4 class="section-title">模板設定</h4>
      <div class="form-group">
        <label class="form-label">模板類型</label>
        <select v-model="templateType" class="form-select">
          <option value="email">郵件</option>
          <option value="sms">簡訊</option>
          <option value="popup">彈窗</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">模板 ID</label>
        <input v-model="templateId" type="text" class="form-input" />
      </div>

      <div class="form-group">
        <label class="form-label">主旨</label>
        <input v-model="templateSubject" type="text" class="form-input" />
      </div>
    </div>

    <div class="properties-section">
      <h4 class="section-title">連接設定</h4>
      <div class="form-group">
        <label class="form-label">來源節點</label>
        <input v-model="sourceId" type="text" class="form-input" readonly />
      </div>

      <div class="form-group">
        <label class="form-label">目標節點</label>
        <input v-model="targetId" type="text" class="form-input" readonly />
      </div>
    </div>

    <div class="properties-actions">
      <button class="btn btn-primary" @click="handleSave">儲存變更</button>
      <button class="btn btn-secondary" @click="handleReset">重置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  node: any;
  script: any;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update-node": [nodeId: string, updates: any];
}>();

// 表单数据
const nodeId = ref("");
const nodeType = ref("");
const eventType = ref("");
const purchaseType = ref("");
const purchaseItem = ref("");
const scheduleType = ref("");
const scheduleTime = ref("");
const cronExpression = ref("");
const templateType = ref("");
const templateId = ref("");
const templateSubject = ref("");
const sourceId = ref("");
const targetId = ref("");

// 计算属性
const task = computed(() => props.node);

// 监听节点变化
watch(
  () => props.node,
  (newNode) => {
    if (newNode) {
      loadNodeData(newNode);
    }
  },
  { immediate: true, deep: true }
);

// 加载节点数据
const loadNodeData = (node: any) => {
  nodeId.value = node.id || "";
  nodeType.value = node.reaction || "";
  eventType.value = node.eventOption?.type || "";
  purchaseType.value = node.eventOption?.purchaseTypes || "";
  purchaseItem.value = node.eventOption?.purchaseItems || "";
  scheduleType.value = node.schedule?.type || "";
  scheduleTime.value = node.schedule?.time?.once || "";
  cronExpression.value = node.schedule?.time?.cron || "";
  templateType.value = node.template?.type || "";
  templateId.value = node.template?.id || "";
  templateSubject.value = node.template?.subject || "";
  sourceId.value = node.sourceId || "";
  targetId.value = node.targetId || "";
};

// 保存变更
const handleSave = () => {
  const updates = {
    eventOption: {
      type: eventType.value,
      ...(eventType.value === "post_purchase_marketing" && {
        purchaseTypes: purchaseType.value,
        purchaseItems: purchaseItem.value,
      }),
    },
    schedule: {
      type: scheduleType.value,
      time:
        scheduleType.value === "once"
          ? { once: scheduleTime.value }
          : { cron: cronExpression.value },
    },
    template: {
      type: templateType.value,
      id: templateId.value,
      subject: templateSubject.value,
    },
  };

  emit("update-node", nodeId.value, updates);
};

// 重置表单
const handleReset = () => {
  if (props.node) {
    loadNodeData(props.node);
  }
};
</script>

<style scoped lang="scss">
.node-properties {
  @apply p-4 space-y-6;
}

.properties-section {
  @apply space-y-4;

  .section-title {
    @apply text-sm font-medium text-gray-700 border-b border-gray-200 pb-2;
  }
}

.form-group {
  @apply space-y-2;

  .form-label {
    @apply block text-sm font-medium text-gray-700;
  }

  .form-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500;

    &:read-only {
      @apply bg-gray-50 text-gray-500;
    }
  }

  .form-select {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500;
  }
}

.properties-actions {
  @apply flex space-x-3 pt-4 border-t border-gray-200;

  .btn {
    @apply flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors;

    &.btn-primary {
      @apply bg-blue-600 text-white hover:bg-blue-700;
    }

    &.btn-secondary {
      @apply bg-gray-600 text-white hover:bg-gray-700;
    }
  }
}
</style>
