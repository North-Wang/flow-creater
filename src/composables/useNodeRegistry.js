import { ref, computed } from "vue";

// 节点类型注册表
const nodeTypes = ref(new Map());

// 默认节点类型
const defaultNodeTypes = [
  {
    id: "trigger-sign",
    name: "註冊觸發",
    description: "用戶註冊時觸發",
    category: "trigger",
    color: "#3B82F6",
    icon: "sign",
    component: "trigger-event",
    canConnectTo: ["response", "action", "condition"],
    defaultData: {
      reaction: "trigger",
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
        id: "",
        fields: {},
        extensions: {},
      },
      extensions: {},
    },
  },
  {
    id: "trigger-post_purchase_marketing",
    name: "購買觸發",
    description: "用戶購買商品時觸發",
    category: "trigger",
    color: "#10B981",
    icon: "post_purchase_marketing",
    component: "trigger-event",
    canConnectTo: ["response", "action", "condition"],
    defaultData: {
      reaction: "trigger",
      eventOption: {
        type: "post_purchase_marketing",
        purchaseTypes: "",
        purchaseItems: "",
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
        id: "",
        fields: {},
        extensions: {},
      },
      extensions: {},
    },
  },
  {
    id: "trigger-cart-abandonment",
    name: "購物車放棄觸發",
    description: "用戶放棄購物車時觸發",
    category: "trigger",
    color: "#F59E0B",
    icon: "cart",
    component: "trigger-event",
    canConnectTo: ["response", "action", "condition"],
    defaultData: {
      reaction: "trigger",
      eventOption: {
        type: "cart_abandonment",
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
        id: "",
        fields: {},
        extensions: {},
      },
      extensions: {},
    },
  },
  {
    id: "response-email",
    name: "郵件響應",
    description: "發送郵件響應",
    category: "response",
    color: "#8B5CF6",
    icon: "email",
    component: "response-event",
    canConnectTo: ["response", "action", "condition"],
    defaultData: {
      reaction: "response",
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
        id: "",
        subject: "",
        fields: {},
        extensions: {},
      },
      extensions: {},
    },
  },
  {
    id: "response-sms",
    name: "簡訊響應",
    description: "發送簡訊響應",
    category: "response",
    color: "#EF4444",
    icon: "sms",
    component: "response-event",
    canConnectTo: ["response", "action", "condition"],
    defaultData: {
      reaction: "response",
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
        type: "sms",
        id: "",
        subject: "",
        fields: {},
        extensions: {},
      },
      extensions: {},
    },
  },
  {
    id: "action-delay",
    name: "延遲動作",
    description: "延遲執行下一個動作",
    category: "action",
    color: "#6B7280",
    icon: "clock",
    component: "action",
    canConnectTo: ["response", "action", "condition"],
    defaultData: {
      reaction: "response",
      eventOption: {
        type: "delay",
        duration: 3600, // 秒
        fields: {},
        extensions: {},
      },
      schedule: {
        type: "once",
        config: {},
        extensions: {},
      },
      template: {
        type: "none",
        id: "",
        fields: {},
        extensions: {},
      },
      extensions: {},
    },
  },
  {
    id: "condition-user-segment",
    name: "用戶分群條件",
    description: "根據用戶分群進行條件判斷",
    category: "condition",
    color: "#F97316",
    icon: "users",
    component: "condition",
    canConnectTo: ["response", "action"],
    defaultData: {
      reaction: "response",
      eventOption: {
        type: "user_segment",
        segmentId: "",
        fields: {},
        extensions: {},
      },
      schedule: {
        type: "once",
        config: {},
        extensions: {},
      },
      template: {
        type: "none",
        id: "",
        fields: {},
        extensions: {},
      },
      extensions: {},
    },
  },
];

// 初始化默认节点类型
defaultNodeTypes.forEach((nodeType) => {
  nodeTypes.value.set(nodeType.id, nodeType);
});

export function useNodeRegistry() {
  // 注册新的节点类型
  const registerNodeType = (nodeType) => {
    if (!nodeType.id) {
      throw new Error("节点类型必须包含id");
    }
    nodeTypes.value.set(nodeType.id, nodeType);
  };

  // 获取所有节点类型
  const getAllNodeTypes = () => {
    return Array.from(nodeTypes.value.values());
  };

  // 根据ID获取节点类型
  const getNodeType = (id) => {
    return nodeTypes.value.get(id);
  };

  // 根据分类获取节点类型
  const getNodeTypesByCategory = (category) => {
    return getAllNodeTypes().filter(
      (nodeType) => nodeType.category === category
    );
  };

  // 创建节点实例
  const createNode = (nodeTypeId, position = { x: 0, y: 0 }) => {
    const nodeType = getNodeType(nodeTypeId);
    if (!nodeType) {
      throw new Error(`未找到节点类型: ${nodeTypeId}`);
    }

    const nodeId = `${nodeTypeId}-${Date.now()}`;

    return {
      id: nodeId,
      type: nodeType.component,
      position,
      data: {
        nodeType: nodeType.category,
        task: {
          id: nodeId,
          ...nodeType.defaultData,
        },
      },
    };
  };

  // 检查两个节点类型是否可以连接
  const canConnect = (sourceTypeId, targetTypeId) => {
    const sourceType = getNodeType(sourceTypeId);
    const targetType = getNodeType(targetTypeId);

    if (!sourceType || !targetType) {
      return false;
    }

    return sourceType.canConnectTo.includes(targetType.category);
  };

  // 获取节点组件
  const getNodeComponent = (nodeTypeId) => {
    const nodeType = getNodeType(nodeTypeId);
    return nodeType?.component || "default";
  };

  // 删除节点类型
  const unregisterNodeType = (id) => {
    nodeTypes.value.delete(id);
  };

  // 清空所有节点类型
  const clearNodeTypes = () => {
    nodeTypes.value.clear();
  };

  return {
    registerNodeType,
    getAllNodeTypes,
    getNodeType,
    getNodeTypesByCategory,
    createNode,
    canConnect,
    getNodeComponent,
    unregisterNodeType,
    clearNodeTypes,
  };
}
