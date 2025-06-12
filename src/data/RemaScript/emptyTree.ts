/* 自動化劇本 各種子劇本的空白樹狀圖 */
import type { TreeType } from '../../schemas/ReMaScript/scriptSchema';
import {  ScriptSchema, TaskSchema  } from '../../schemas/ReMaScript/scriptSchema';

export const sampleScript = ScriptSchema.parse({
  info: {
    name: '行銷劇本 A',
    time_range: {
      start: '2025-06-01T00:00:00Z',
      end: '2025-06-30T23:59:59Z'
    },
    source: {
      type: 'data'
    }
  },
  senderInfo: {
    sender: '行銷小組',
    email: 'marketing@example.com'
  },
  status: 'draft',
  version: 1,
  task: [
    {
      id: 'task-1',
      reaction: 'trigger',
      sourceId: null,
      targetId: 'task-2',
      eventOption: {
        type: 'page_view'
      },
      schedule: {
        type: 'once',
        time: {
          once: '2025-06-12T10:00:00'
        }
      },
      template: {
        type: 'email',
        id: 'template-001',
        subject: '歡迎來到我們的網站'
      }
    },
    {
      id: 'task-2',
      reaction: 'response',
      sourceId: 'task-1',
      targetId: 'task-3',
      eventOption: {
        type: 'send_email'
      },
      schedule: {
        type: 'once',
        time: {
          once: '2025-06-13T10:00:00'
        }
      },
      template: {
        type: 'email',
        id: 'template-002',
        subject: '這是你可能感興趣的產品'
      }
    },
    {
      id: 'task-3',
      reaction: 'response',
      sourceId: 'task-2',
      targetId: 'task-4',
      eventOption: {
        type: 'send_sms'
      },
      schedule: {
        type: 'cycle',
        time: {
          cron: '0 9 * * *' // 每天早上 9 點
        }
      },
      template: {
        type: 'sms',
        id: 'template-003',
        subject: '我們的促銷活動開始了！'
      }
    },
    {
      id: 'task-4',
      reaction: 'response',
      sourceId: 'task-3',
      targetId: 'task-5',
      eventOption: {
        type: 'popup'
      },
      schedule: {
        type: 'once',
        time: {
          once: '2025-06-15T12:00:00'
        }
      },
      template: {
        type: 'popup',
        id: 'template-004',
        subject: '快來看看新上架的商品！'
      }
    }
  ]
})

/**
 * props到觸發事件子劇本的兩個task資料
 */
export const sampleTaskList = [

]

/**
 * 子劇本：觸發事件，空白的樹狀圖
 */
export const emptyResponseTree =  [
     {
      id: 'task-1',
      reaction: 'trigger',
      sourceId: null,
      targetId: 'task-2',
      eventOption: {
        type: 'page_view'
      },
      schedule: {
        type: 'once',
        time: {
          once: '2025-06-12T10:00:00'
        }
      },
      template: {
        type: 'email',
        id: 'template-001',
        subject: '歡迎來到我們的網站'
      }
    },
    {
      id: 'task-2',
      reaction: 'response',
      sourceId: null,
      targetId: 'task-3',
      eventOption: {
        type: 'page_view'
      },
      schedule: {
        type: 'once',
        time: {
          once: '2025-06-12T10:00:00'
        }
      },
      template: {
        type: 'SMS',
        id: 'template-002',
        subject: '這是你可能感興趣的產品'
      }
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
]