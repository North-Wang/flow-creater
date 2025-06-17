/**
 * dagre 布局演示
 * 展示使用 dagre 相比自定義布局的優勢
 */
import { calculateLayoutWithDagre, createVueFlowLayout } from "./nodeLayout.js";

// 演示數據：複雜的分支流程 - 使用數組格式
const demoTasks = [
  // 觸發層
  {
    id: "trigger",
    reaction: "trigger",
    sourceId: [],
    targetId: ["condition1"],
    eventOption: { type: "sign" },
    schedule: { type: "once", time: { once: "2025-01-01T09:00:00Z" } },
    template: { type: "email", id: "t1", subject: "觸發事件" },
  },

  // 條件層
  {
    id: "condition1",
    reaction: "response",
    sourceId: ["trigger"],
    targetId: ["action1", "action2"],
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
    template: { type: "email", id: "t2", subject: "條件判斷" },
  },

  // 動作層 - 分支1
  {
    id: "action1",
    reaction: "response",
    sourceId: ["condition1"],
    targetId: ["action3"],
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
    template: { type: "email", id: "t3", subject: "動作1" },
  },
  {
    id: "action2",
    reaction: "response",
    sourceId: ["condition1"],
    targetId: ["action4"],
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
    template: { type: "email", id: "t4", subject: "動作2" },
  },

  // 動作層 - 分支2
  {
    id: "action3",
    reaction: "response",
    sourceId: ["action1"],
    targetId: ["end1"],
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T12:00:00Z" } },
    template: { type: "email", id: "t5", subject: "動作3" },
  },
  {
    id: "action4",
    reaction: "response",
    sourceId: ["action2"],
    targetId: ["end2"],
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T12:00:00Z" } },
    template: { type: "email", id: "t6", subject: "動作4" },
  },

  // 結束層
  {
    id: "end1",
    reaction: "response",
    sourceId: ["action3"],
    targetId: [],
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T13:00:00Z" } },
    template: { type: "email", id: "t7", subject: "結束1" },
  },
  {
    id: "end2",
    reaction: "response",
    sourceId: ["action4"],
    targetId: [],
    eventOption: { type: "open" },
    schedule: { type: "once", time: { once: "2025-01-01T13:00:00Z" } },
    template: { type: "email", id: "t8", subject: "結束2" },
  },
];

/**
 * 演示 dagre 布局的優勢
 */
export function demonstrateDagreAdvantages() {
  console.log("=== dagre 布局優勢演示 ===");

  // 1. 自動處理複雜的節點關係
  console.log("1. 自動處理複雜的節點關係:");
  const layoutResult = calculateLayoutWithDagre(demoTasks, {
    nodeWidth: 150,
    nodeHeight: 150,
    rankdir: "TB",
    ranksep: 120,
    nodesep: 60,
  });

  console.log("節點位置:");
  layoutResult.positions.forEach((position, nodeId) => {
    console.log(`  ${nodeId}: (${position.x}, ${position.y})`);
  });

  // 2. 支持多種布局方向
  console.log("\n2. 支持多種布局方向:");
  const directions = ["TB", "BT", "LR", "RL"];
  directions.forEach((direction) => {
    const result = calculateLayoutWithDagre(demoTasks, { rankdir: direction });
    console.log(
      `  ${direction} 方向: 圖寬度=${result.graph.graph().width}, 圖高度=${
        result.graph.graph().height
      }`
    );
  });

  // 3. 自動避免節點重疊
  console.log("\n3. 自動避免節點重疊:");
  const positions = Array.from(layoutResult.positions.values());
  let hasOverlap = false;

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];
      const distance = Math.sqrt(
        Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
      );
      if (distance < 150) {
        // 節點寬度
        hasOverlap = true;
        console.log(`  檢測到重疊: 節點間距=${distance.toFixed(2)}`);
      }
    }
  }

  if (!hasOverlap) {
    console.log("  沒有檢測到節點重疊");
  }

  // 4. 性能優勢
  console.log("\n4. 性能優勢:");
  const startTime = performance.now();
  for (let i = 0; i < 100; i++) {
    calculateLayoutWithDagre(demoTasks);
  }
  const endTime = performance.now();
  console.log(`  100次布局計算耗時: ${(endTime - startTime).toFixed(2)}ms`);
  console.log(`  平均每次計算: ${((endTime - startTime) / 100).toFixed(2)}ms`);

  return layoutResult;
}

/**
 * 比較自定義布局和 dagre 布局
 */
export function compareLayouts() {
  console.log("=== 布局方法比較 ===");

  // 自定義布局的複雜度
  console.log("自定義布局需要:");
  console.log("- 手動構建節點關係圖");
  console.log("- 手動計算層級");
  console.log("- 手動排列節點位置");
  console.log("- 手動檢測和處理重疊");
  console.log("- 手動優化布局");

  console.log("\ndagre 布局只需要:");
  console.log("- 定義節點和邊");
  console.log("- 設置布局參數");
  console.log("- 調用 dagre.layout()");

  console.log("\n優勢總結:");
  console.log("✅ 代碼更簡潔");
  console.log("✅ 性能更優");
  console.log("✅ 功能更強大");
  console.log("✅ 維護更容易");
  console.log("✅ 支持更多布局選項");
}

/**
 * 獲取演示數據
 */
export function getDemoData() {
  return demoTasks;
}

/**
 * 創建不同複雜度的演示數據
 */
export function createDemoScenarios() {
  return {
    // 簡單線性流程
    linear: [
      {
        id: "start",
        reaction: "trigger",
        sourceId: [],
        targetId: ["step1"],
        eventOption: { type: "sign" },
        schedule: { type: "once", time: { once: "2025-01-01T09:00:00Z" } },
        template: { type: "email", id: "t1", subject: "開始" },
      },
      {
        id: "step1",
        reaction: "response",
        sourceId: ["start"],
        targetId: ["step2"],
        eventOption: { type: "open" },
        schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
        template: { type: "email", id: "t2", subject: "步驟1" },
      },
      {
        id: "step2",
        reaction: "response",
        sourceId: ["step1"],
        targetId: ["end"],
        eventOption: { type: "open" },
        schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
        template: { type: "email", id: "t3", subject: "步驟2" },
      },
      {
        id: "end",
        reaction: "response",
        sourceId: ["step2"],
        targetId: [],
        eventOption: { type: "open" },
        schedule: { type: "once", time: { once: "2025-01-01T12:00:00Z" } },
        template: { type: "email", id: "t4", subject: "結束" },
      },
    ],

    // 分支流程
    branch: demoTasks,

    // 複雜網絡
    network: [
      {
        id: "a",
        reaction: "trigger",
        sourceId: [],
        targetId: ["b", "f"],
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
        targetId: ["d"],
        eventOption: { type: "open" },
        schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
        template: { type: "email", id: "t3", subject: "C" },
      },
      {
        id: "d",
        reaction: "response",
        sourceId: ["c"],
        targetId: ["e"],
        eventOption: { type: "open" },
        schedule: { type: "once", time: { once: "2025-01-01T12:00:00Z" } },
        template: { type: "email", id: "t4", subject: "D" },
      },
      {
        id: "e",
        reaction: "response",
        sourceId: ["d", "h"],
        targetId: [],
        eventOption: { type: "open" },
        schedule: { type: "once", time: { once: "2025-01-01T13:00:00Z" } },
        template: { type: "email", id: "t5", subject: "E" },
      },
      {
        id: "f",
        reaction: "response",
        sourceId: ["a"],
        targetId: ["g"],
        eventOption: { type: "open" },
        schedule: { type: "once", time: { once: "2025-01-01T10:00:00Z" } },
        template: { type: "email", id: "t6", subject: "F" },
      },
      {
        id: "g",
        reaction: "response",
        sourceId: ["f"],
        targetId: ["h"],
        eventOption: { type: "open" },
        schedule: { type: "once", time: { once: "2025-01-01T11:00:00Z" } },
        template: { type: "email", id: "t7", subject: "G" },
      },
      {
        id: "h",
        reaction: "response",
        sourceId: ["g"],
        targetId: ["e"],
        eventOption: { type: "open" },
        schedule: { type: "once", time: { once: "2025-01-01T12:00:00Z" } },
        template: { type: "email", id: "t8", subject: "H" },
      },
    ],
  };
}
