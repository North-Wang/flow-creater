/**
 * 測試使用 dagre 的自動布局功能
 */
import {
  calculateLayoutWithDagre,
  createVueFlowLayout,
  getLayoutStats,
  createDirectionalLayout,
} from "./nodeLayout.js";

// 測試數據 - 使用數組格式的 sourceId 和 targetId
const testTasks = [
  {
    id: "task-1",
    reaction: "trigger",
    sourceId: [],
    targetId: ["task-2", "task-3"],
    eventOption: { type: "sign" },
    schedule: { type: "once", time: { once: "2025-01-01T09:00:00Z" } },
    template: { type: "email", id: "template-1", subject: "觸發事件" },
  },
  {
    id: "task-2",
    reaction: "response",
    sourceId: ["task-1"],
    targetId: [],
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
    template: { type: "email", id: "template-2", subject: "響應事件 1" },
  },
  {
    id: "task-3",
    reaction: "response",
    sourceId: ["task-1"],
    targetId: ["task-4"],
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
    template: { type: "email", id: "template-3", subject: "響應事件 2" },
  },
  {
    id: "task-4",
    reaction: "response",
    sourceId: ["task-3"],
    targetId: [],
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T12:00:00Z" } },
    template: { type: "email", id: "template-4", subject: "最終響應" },
  },
];

// 測試 dagre 布局
export function testDagreLayout() {
  console.log("開始測試 dagre 自動布局功能...");

  try {
    // 測試完整布局
    const layoutResult = calculateLayoutWithDagre(testTasks, {
      nodeWidth: 150,
      nodeHeight: 150,
      rankdir: "TB",
      ranksep: 100,
      nodesep: 50,
    });

    console.log("dagre 布局結果:", layoutResult);

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

    // 測試圖信息
    console.log("圖信息:", layoutResult.graph.graph());

    return {
      success: true,
      layout: layoutResult,
      stats: stats,
    };
  } catch (error) {
    console.error("dagre 布局測試失敗:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// 測試不同方向的布局
export function testDirectionalLayouts() {
  console.log("測試不同方向的布局...");

  const directions = ["TB", "BT", "LR", "RL"];
  const results = {};

  directions.forEach((direction) => {
    console.log(`測試 ${direction} 方向布局:`);
    const result = createDirectionalLayout(testTasks, direction, {
      nodeWidth: 150,
      nodeHeight: 150,
      ranksep: 100,
      nodesep: 50,
    });

    results[direction] = result;
    console.log(`${direction} 布局結果:`, result);
  });

  return results;
}

// 測試不同複雜度的布局
export function testComplexLayouts() {
  console.log("測試複雜布局...");

  // 簡單線性布局
  const linearTasks = [
    {
      id: "a",
      reaction: "trigger",
      sourceId: [],
      targetId: ["b"],
      eventOption: { type: "sign" },
      schedule: { type: "once", time: { once: "2025-01-01T09:00:00Z" } },
      template: { type: "email", id: "t1", subject: "A" },
    },
    {
      id: "b",
      reaction: "response",
      sourceId: ["a"],
      targetId: ["c"],
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
      template: { type: "email", id: "t2", subject: "B" },
    },
    {
      id: "c",
      reaction: "response",
      sourceId: ["b"],
      targetId: [],
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
      sourceId: [],
      targetId: ["left1", "right1"],
      eventOption: { type: "sign" },
      schedule: { type: "once", time: { once: "2025-01-01T09:00:00Z" } },
      template: { type: "email", id: "t1", subject: "Root" },
    },
    {
      id: "left1",
      reaction: "response",
      sourceId: ["root"],
      targetId: ["left2"],
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
      template: { type: "email", id: "t2", subject: "Left1" },
    },
    {
      id: "left2",
      reaction: "response",
      sourceId: ["left1"],
      targetId: [],
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
      template: { type: "email", id: "t3", subject: "Left2" },
    },
    {
      id: "right1",
      reaction: "response",
      sourceId: ["root"],
      targetId: ["right2"],
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
      template: { type: "email", id: "t4", subject: "Right1" },
    },
    {
      id: "right2",
      reaction: "response",
      sourceId: ["right1"],
      targetId: [],
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
      template: { type: "email", id: "t5", subject: "Right2" },
    },
  ];

  // 複雜網絡布局
  const networkTasks = [
    {
      id: "start",
      reaction: "trigger",
      sourceId: [],
      targetId: ["a", "b"],
      eventOption: { type: "sign" },
      schedule: { type: "once", time: { once: "2025-01-01T09:00:00Z" } },
      template: { type: "email", id: "t1", subject: "Start" },
    },
    {
      id: "a",
      reaction: "response",
      sourceId: ["start"],
      targetId: ["c"],
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
      template: { type: "email", id: "t2", subject: "A" },
    },
    {
      id: "b",
      reaction: "response",
      sourceId: ["start"],
      targetId: ["c"],
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
      template: { type: "email", id: "t3", subject: "B" },
    },
    {
      id: "c",
      reaction: "response",
      sourceId: ["a", "b"],
      targetId: ["end"],
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
      template: { type: "email", id: "t4", subject: "C" },
    },
    {
      id: "end",
      reaction: "response",
      sourceId: ["c"],
      targetId: [],
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T12:00:00Z" } },
      template: { type: "email", id: "t5", subject: "End" },
    },
  ];

  console.log("線性布局測試:");
  const linearResult = createVueFlowLayout(linearTasks);
  console.log(linearResult);

  console.log("分支布局測試:");
  const branchResult = createVueFlowLayout(branchTasks);
  console.log(branchResult);

  console.log("複雜網絡布局測試:");
  const networkResult = createVueFlowLayout(networkTasks);
  console.log(networkResult);

  return {
    linear: linearResult,
    branch: branchResult,
    network: networkResult,
  };
}

// 性能測試
export function testPerformance() {
  console.log("開始性能測試...");

  const startTime = performance.now();

  // 測試多次布局計算
  for (let i = 0; i < 100; i++) {
    calculateLayoutWithDagre(testTasks);
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`100次布局計算耗時: ${duration.toFixed(2)}ms`);
  console.log(`平均每次布局計算耗時: ${(duration / 100).toFixed(2)}ms`);

  return {
    totalTime: duration,
    averageTime: duration / 100,
    iterations: 100,
  };
}

// 為了向後兼容，保留舊的函數名稱
export const testLayout = testDagreLayout;
