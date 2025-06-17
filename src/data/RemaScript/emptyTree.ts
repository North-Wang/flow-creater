/* 自動化劇本 各種子劇本的空白樹狀圖 */
import type { TreeType } from "../../schemas/ReMaScript/scriptSchema";
import {
  ScriptSchema,
  TaskSchema,
} from "../../schemas/ReMaScript/scriptSchema";

//假的劇本資料
export const sampleScript = ScriptSchema.parse({
  info: {
    name: "行銷劇本 A",
    time_range: {
      start: "2025-06-01T00:00:00Z",
      end: "2025-06-30T23:59:59Z",
    },
    source: {
      type: "data",
    },
  },
  senderInfo: {
    sender: "行銷小組",
    email: "marketing@example.com",
  },
  status: "draft",
  version: 1,
  task: [
    {
      id: "task-1",
      reaction: "trigger",
      sourceId: null,
      targetId: "task-3",
      eventOption: {
        type: "purchase",
        purchaseTypes: "商品",
        purchaseItems: "棉花糖",
      },
      schedule: {
        type: "recurrence",
        time: {
          once: "2025-06-12T10:00:00",
        },
      },
      template: {
        type: "email",
        id: "template-001",
        subject: "歡迎來到我們的網站",
      },
    },
    {
      id: "task-2",
      reaction: "trigger",
      sourceId: null,
      targetId: "task-3",
      eventOption: {
        type: "purchase",
        purchaseTypes: "商品",
        purchaseItems: "棉花糖",
      },
      schedule: {
        type: "recurrence",
        time: {
          once: "2025-06-12T10:00:00",
        },
      },
      template: {
        type: "sms",
        id: "template-001",
        subject: "簡訊行銷",
      },
    },
    {
      id: "task-3",
      reaction: "response",
      sourceId: "task-2",
      targetId: "task-4",
      eventOption: {
        type: "open",
      },
      schedule: {
        type: "once",
        time: {
          cron: "0 9 * * *", // 每天早上 9 點
        },
      },
      template: {
        type: "sms",
        id: "template-003",
        subject: "我們的促銷活動開始了！",
      },
    },
    {
      id: "task-4",
      reaction: "response",
      sourceId: "task-3",
      targetId: "task-5",
      eventOption: {
        type: "open",
      },
      schedule: {
        type: "once",
        time: {
          once: "2025-06-15T12:00:00",
        },
      },
      template: {
        type: "popup",
        id: "template-004",
        subject: "快來看看新上架的商品！",
      },
    },
    {
      id: "task-5",
      reaction: "response",
      sourceId: "task-4",
      targetId: null,
      eventOption: {
        type: "open",
      },
      schedule: {
        type: "once",
        time: {
          once: "2025-06-15T12:00:00",
        },
      },
      template: {
        type: "popup",
        id: "template-004",
        subject: "快來看看新上架的商品！",
      },
    },
  ],
});

/**
 * props到觸發事件子劇本的兩個task資料
 */
export const sampleTaskList = [];

/**
 * 子劇本：觸發事件，空白的樹狀圖
 */
export const emptyResponseTree = [
  {
    id: "task-1",
    reaction: "trigger",
    sourceId: null,
    targetId: "task-2",
    eventOption: {
      type: "page_view",
    },
    schedule: {
      type: "recurrence",
      time: {
        once: "2025-06-12T10:00:00",
      },
    },
    template: {
      type: "email",
      id: "template-001",
      subject: "歡迎來到我們的網站",
    },
  },
  {
    id: "task-2",
    reaction: "response",
    sourceId: null,
    targetId: "task-3",
    eventOption: {
      type: "page_view",
    },
    schedule: {
      type: "recurrence",
      time: {
        once: "2025-06-12T10:00:00",
      },
    },
    template: {
      type: "SMS",
      id: "template-002",
      subject: "這是你可能感興趣的產品",
    },
  },
  {
    id: "node_1",
    type: "trigger-event",
    position: { x: 500, y: 0 },
    data: { nodeType: "trigger" },
  },
  {
    id: "node_2",
    type: "action",
    position: { x: 400, y: 200 },
    data: { nodeType: "action" },
  },
  {
    id: "node_3",
    type: "action",
    position: { x: 600, y: 200 },
    data: { nodeType: "action" },
  },
  {
    id: "node_4",
    type: "template",
    position: { x: 370, y: 350 },
    data: { nodeType: "template" },
  },
  {
    id: "node_5",
    type: "template",
    position: { x: 570, y: 350 },
    data: { nodeType: "template" },
  },
  {
    id: "e1-2",
    type: "step",
    source: "node_1",
    target: "node_2",
    class: "dark",
    animated: false,
  },
  {
    id: "e1-3",
    type: "step",
    source: "node_1",
    target: "node_3",
    class: "dark",
    animated: false,
  },
  {
    id: "e2-4",
    type: "step",
    source: "node_2",
    target: "node_4",
    class: "dark",
    animated: false,
  },
  {
    id: "e3-5",
    type: "step",
    source: "node_3",
    target: "node_5",
    class: "dark",
    animated: false,
  },
];

/**
 * 觸發事件設定的彈窗 預設值
 */
export const defaultTriggerEventSetting = {
  event: "註冊",
  frequency: "recurrence",
};

/**
 * 新建的空白劇本
 */
export const emptyScriptBySchema = ScriptSchema.parse({
  info: {
    name: "空白劇本",
    time_range: {
      start: "",
      end: "",
    },
    source: {
      type: "data",
    },
  },
  senderInfo: {
    sender: "系統管理員",
    email: "admin@example.com",
  },
  status: "draft",
  version: 1,
  task: [
    {
      id: "task-1",
      reaction: "trigger",
      sourceId: null,
      targetId: "task-2",
      eventOption: {
        type: "sign",
      },
      schedule: {
        type: "once",
        time: {
          once: "2025-01-01T09:00:00Z",
        },
      },
      template: {
        type: "email",
        id: "template-trigger-001",
        subject: "觸發事件",
      },
    },
    {
      id: "task-2",
      reaction: "response",
      sourceId: "task-1",
      targetId: null,
      eventOption: {
        type: "open",
      },
      schedule: {
        type: "once",
        time: {
          once: "2025-01-01T10:00:00Z",
        },
      },
      template: {
        type: "email",
        id: "template-response-001",
        subject: "響應事件 1",
      },
    },
    {
      id: "task-3",
      reaction: "response",
      sourceId: "task-1",
      targetId: "task-4",
      eventOption: {
        type: "open",
      },
      schedule: {
        type: "once",
        time: {
          once: "2025-01-01T11:00:00Z",
        },
      },
      template: {
        type: "email",
        id: "template-response-002",
        subject: "響應事件 2",
      },
    },
    {
      id: "task-4",
      reaction: "response",
      sourceId: "task-3",
      targetId: null,
      eventOption: {
        type: "open",
      },
      schedule: {
        type: "once",
        time: {
          once: "2025-01-01T11:00:00Z",
        },
      },
      template: {
        type: "email",
        id: "template-response-002",
        subject: "響應事件 2",
      },
    },
  ],
});

/**
 * 最小化的空白劇本（只有一個觸發事件）
 */
export const minimalEmptyScript = ScriptSchema.parse({
  info: {
    name: "最小化空白劇本",
    time_range: {
      start: "2025-01-01T00:00:00Z",
      end: "2025-12-31T23:59:59Z",
    },
    source: {
      type: "data",
    },
  },
  senderInfo: {
    sender: "系統管理員",
    email: "admin@example.com",
  },
  status: "draft",
  version: 1,
  task: [
    {
      id: "task-1",
      reaction: "trigger",
      sourceId: null,
      targetId: null,
      eventOption: {
        type: "sign",
      },
      schedule: {
        type: "once",
        time: {
          once: "2025-01-01T09:00:00Z",
        },
      },
      template: {
        type: "email",
        id: "template-minimal-001",
        subject: "預設模板",
      },
    },
  ],
});

/**
 * 完整的空白劇本（包含所有類型的示例）
 */
export const completeEmptyScript = ScriptSchema.parse({
  info: {
    name: "完整空白劇本",
    time_range: {
      start: "2025-01-01T00:00:00Z",
      end: "2025-12-31T23:59:59Z",
    },
    source: {
      type: "data",
    },
  },
  senderInfo: {
    sender: "行銷團隊",
    email: "marketing@example.com",
  },
  status: "draft",
  version: 1,
  task: [
    {
      id: "task-1",
      reaction: "trigger",
      sourceId: null,
      targetId: "task-2",
      eventOption: {
        type: "sign",
      },
      schedule: {
        type: "once",
        time: {
          once: "2025-01-01T09:00:00Z",
        },
      },
      template: {
        type: "email",
        id: "template-sign-001",
        subject: "註冊歡迎信",
      },
    },
    {
      id: "task-2",
      reaction: "trigger",
      sourceId: null,
      targetId: "task-3",
      eventOption: {
        type: "cart_abandonment",
      },
      schedule: {
        type: "recurrence",
        time: {
          cron: "0 14 * * *",
        },
      },
      template: {
        type: "sms",
        id: "template-cart-001",
        subject: "購物車提醒",
      },
    },
    {
      id: "task-3",
      reaction: "trigger",
      sourceId: null,
      targetId: "task-4",
      eventOption: {
        type: "purchase",
        purchaseTypes: "商品",
        purchaseItems: "示例商品",
      },
      schedule: {
        type: "once",
        time: {
          once: "2025-01-01T15:00:00Z",
        },
      },
      template: {
        type: "email",
        id: "template-purchase-001",
        subject: "購買確認",
      },
    },
    {
      id: "task-4",
      reaction: "trigger",
      sourceId: null,
      targetId: "task-5",
      eventOption: {
        type: "scheduled",
      },
      schedule: {
        type: "recurrence",
        time: {
          cron: "0 10 * * 1",
        },
      },
      template: {
        type: "email",
        id: "template-scheduled-001",
        subject: "週一促銷",
      },
    },
    {
      id: "task-5",
      reaction: "response",
      sourceId: "task-4",
      targetId: null,
      eventOption: {
        type: "open",
      },
      schedule: {
        type: "once",
        time: {
          once: "2025-01-01T16:00:00Z",
        },
      },
      template: {
        type: "popup",
        id: "template-response-001",
        subject: "互動回應",
      },
    },
  ],
});
