/**
 * 測試連接線功能
 */
import { calculateLayoutWithDagre, getConnections } from "./nodeLayout.js";

// 測試數據：task-1 連接 task-2 和 task-3，task-3 連接 task-4
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

/**
 * 測試連接線功能
 */
export function testConnections() {
  console.log("=== 測試連接線功能 ===");

  // 1. 測試 getConnections 函數
  console.log("1. 測試 getConnections 函數:");
  const connections = getConnections(testTasks);
  console.log("連接關係:", connections);

  // 驗證連接數量
  const expectedConnections = [
    { source: "task-1", target: "task-2" },
    { source: "task-1", target: "task-3" },
    { source: "task-3", target: "task-4" },
  ];

  console.log("預期連接:", expectedConnections);
  console.log("實際連接數量:", connections.length);
  console.log("預期連接數量:", expectedConnections.length);

  // 驗證每個連接
  expectedConnections.forEach((expected) => {
    const found = connections.find(
      (conn) =>
        conn.source === expected.source && conn.target === expected.target
    );
    if (found) {
      console.log(`✅ 找到連接: ${expected.source} -> ${expected.target}`);
    } else {
      console.log(`❌ 缺少連接: ${expected.source} -> ${expected.target}`);
    }
  });

  // 2. 測試 dagre 布局
  console.log("\n2. 測試 dagre 布局:");
  const layoutResult = calculateLayoutWithDagre(testTasks);
  console.log("布局結果邊數:", layoutResult.edges.length);
  console.log("布局結果邊:", layoutResult.edges);

  // 3. 驗證節點層級
  console.log("\n3. 驗證節點層級:");
  const positions = layoutResult.positions;
  testTasks.forEach((task) => {
    const pos = positions.get(task.id);
    console.log(`${task.id}: 位置 (${pos?.x}, ${pos?.y})`);
  });

  // 4. 檢查是否有循環依賴
  console.log("\n4. 檢查循環依賴:");
  const hasCycle = checkForCycles(testTasks);
  if (hasCycle) {
    console.log("❌ 檢測到循環依賴");
  } else {
    console.log("✅ 沒有循環依賴");
  }

  return {
    connections,
    layoutResult,
    hasCycle,
  };
}

/**
 * 檢查是否有循環依賴
 */
function checkForCycles(tasks) {
  const visited = new Set();
  const recursionStack = new Set();

  function hasCycleUtil(nodeId) {
    if (recursionStack.has(nodeId)) {
      return true; // 發現循環
    }

    if (visited.has(nodeId)) {
      return false; // 已經訪問過，沒有循環
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const task = tasks.find((t) => t.id === nodeId);
    if (task && Array.isArray(task.targetId)) {
      for (const targetId of task.targetId) {
        if (hasCycleUtil(targetId)) {
          return true;
        }
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const task of tasks) {
    if (!visited.has(task.id)) {
      if (hasCycleUtil(task.id)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 測試不同數據格式的兼容性
 */
export function testDataFormatCompatibility() {
  console.log("=== 測試數據格式兼容性 ===");

  // 測試字符串格式
  const stringFormatTasks = [
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
      targetId: null,
      eventOption: { type: "open" },
      schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
      template: { type: "email", id: "template-2", subject: "響應事件" },
    },
  ];

  console.log("1. 測試字符串格式:");
  const stringConnections = getConnections(stringFormatTasks);
  console.log("字符串格式連接:", stringConnections);

  // 測試數組格式
  const arrayFormatTasks = [
    {
      id: "task-1",
      reaction: "trigger",
      sourceId: [],
      targetId: ["task-2"],
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
      template: { type: "email", id: "template-2", subject: "響應事件" },
    },
  ];

  console.log("\n2. 測試數組格式:");
  const arrayConnections = getConnections(arrayFormatTasks);
  console.log("數組格式連接:", arrayConnections);

  return {
    stringFormat: stringConnections,
    arrayFormat: arrayConnections,
  };
}

// 導出測試數據供其他文件使用
export { testTasks };
