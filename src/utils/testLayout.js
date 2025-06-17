/**
 * 測試自動布局功能
 */
import { createCompleteLayout, getLayoutStats } from "./nodeLayout.js";

// 測試數據
const testTasks = [
  {
    id: "task-1",
    reaction: "trigger",
    sourceId: null,
    targetId: "task-2",
    eventOption: { type: "sign" },
    schedule: { type: "once", time: { once: "2025-01-01T09:00:00Z" } },
    template: { type: "email", id: "template-1", subject: "觸發事件" },
  },
  {
    id: "task-2",
    reaction: "response",
    sourceId: "task-1",
    targetId: "task-3",
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
    template: { type: "email", id: "template-2", subject: "響應事件 1" },
  },
  {
    id: "task-3",
    reaction: "response",
    sourceId: "task-1",
    targetId: "task-4",
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
    template: { type: "email", id: "template-3", subject: "響應事件 2" },
  },
  {
    id: "task-4",
    reaction: "response",
    sourceId: "task-3",
    targetId: null,
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T12:00:00Z" } },
    template: { type: "email", id: "template-4", subject: "最終響應" },
  },
];

// 測試布局
export function testLayout() {
  console.log("開始測試自動布局功能...");

  try {
    // 測試完整布局
    const layoutResult = createCompleteLayout(testTasks, {
      startX: 400,
      startY: 100,
      horizontalSpacing: 350,
      verticalSpacing: 250,
    });

    console.log("布局結果:", layoutResult);

    // 測試統計信息
    const stats = getLayoutStats(testTasks);
    console.log("布局統計:", stats);

    // 驗證節點位置
    console.log("節點位置:");
    layoutResult.positions.forEach((position, nodeId) => {
      console.log(`${nodeId}: x=${position.x}, y=${position.y}`);
    });

    // 驗證連接
    console.log("連接關係:", layoutResult.edges);

    return {
      success: true,
      layout: layoutResult,
      stats: stats,
    };
  } catch (error) {
    console.error("布局測試失敗:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// 測試不同複雜度的布局
export function testComplexLayouts() {
  console.log("測試複雜布局...");

  // 簡單線性布局
  const linearTasks = [
    {
      id: "a",
      reaction: "trigger",
      sourceId: null,
      targetId: "b",
      eventOption: { type: "sign" },
      schedule: { type: "once", time: { once: "2025-01-01T09:00:00Z" } },
      template: { type: "email", id: "t1", subject: "A" },
    },
    {
      id: "b",
      reaction: "response",
      sourceId: "a",
      targetId: "c",
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
      template: { type: "email", id: "t2", subject: "B" },
    },
    {
      id: "c",
      reaction: "response",
      sourceId: "b",
      targetId: null,
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
      template: { type: "email", id: "t3", subject: "C" },
    },
  ];

  // 分支布局
  const branchTasks = [
    {
      id: "root",
      reaction: "trigger",
      sourceId: null,
      targetId: null,
      eventOption: { type: "sign" },
      schedule: { type: "once", time: { once: "2025-01-01T09:00:00Z" } },
      template: { type: "email", id: "t1", subject: "Root" },
    },
    {
      id: "left1",
      reaction: "response",
      sourceId: "root",
      targetId: "left2",
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
      template: { type: "email", id: "t2", subject: "Left1" },
    },
    {
      id: "left2",
      reaction: "response",
      sourceId: "left1",
      targetId: null,
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
      template: { type: "email", id: "t3", subject: "Left2" },
    },
    {
      id: "right1",
      reaction: "response",
      sourceId: "root",
      targetId: "right2",
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
      template: { type: "email", id: "t4", subject: "Right1" },
    },
    {
      id: "right2",
      reaction: "response",
      sourceId: "right1",
      targetId: null,
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
      template: { type: "email", id: "t5", subject: "Right2" },
    },
  ];

  console.log("線性布局測試:");
  const linearResult = createCompleteLayout(linearTasks);
  console.log(linearResult);

  console.log("分支布局測試:");
  const branchResult = createCompleteLayout(branchTasks);
  console.log(branchResult);

  return {
    linear: linearResult,
    branch: branchResult,
  };
}
