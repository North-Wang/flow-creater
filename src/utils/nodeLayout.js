/**
 * 使用 dagre 的節點自動布局工具
 * 根據sourceId和targetId關係自動排列節點位置
 */
import dagre from "dagre";

/**
 * 使用 dagre 計算節點的自動布局位置
 * @param {Array} tasks - 任務數組
 * @param {Object} options - 布局選項
 * @returns {Object} 包含節點、連接和位置的布局結果
 */
export function calculateLayoutWithDagre(tasks, options = {}) {
  const {
    nodeWidth = 150,
    nodeHeight = 150,
    rankdir = "TB", // TB: top to bottom, LR: left to right
    ranksep = 50, // 層級間距
    nodesep = 50, // 同層節點間距
    marginx = 50, // 水平邊距
    marginy = 50, // 垂直邊距
  } = options;

  // 創建 dagre 圖
  const g = new dagre.graphlib.Graph();

  // 設置圖的默認屬性
  g.setGraph({
    rankdir,
    ranksep,
    nodesep,
    marginx,
    marginy,
  });

  // 設置默認節點屬性
  g.setDefaultEdgeLabel(() => ({}));

  // 添加節點到圖中
  tasks.forEach((task) => {
    g.setNode(task.id, {
      width: nodeWidth,
      height: nodeHeight,
      label: task.id,
    });
  });

  // 添加邊到圖中 - 支持數組和字符串格式的 sourceId/targetId
  tasks.forEach((task) => {
    // 處理 targetId - 可能是字符串或數組
    const targetIds = Array.isArray(task.targetId)
      ? task.targetId
      : task.targetId
      ? [task.targetId]
      : [];

    targetIds.forEach((targetId) => {
      if (targetId) {
        g.setEdge(task.id, targetId);
      }
    });
  });

  // 計算布局
  dagre.layout(g);

  // 提取節點位置
  const positions = new Map();
  const nodes = [];
  const edges = [];

  // 獲取節點位置
  g.nodes().forEach((nodeId) => {
    const node = g.node(nodeId);
    const position = {
      x: node.x - node.width / 2, // dagre 返回的是中心點，轉換為左上角
      y: node.y - node.height / 2,
    };
    positions.set(nodeId, position);

    // 找到對應的任務
    const task = tasks.find((t) => t.id === nodeId);

    //調整一個節點的資料架構
    if (task) {
      nodes.push({
        id: nodeId,
        type: getNodeType(task),
        position,
        data: {
          ...task,
        },
      });
    }
  });

  // 獲取邊
  g.edges().forEach((edge) => {
    edges.push({
      id: `edge-${edge.v}-${edge.w}`,
      source: edge.v,
      target: edge.w,
      type: "step",
      class: "dark",
      animated: false,
    });
  });

  return {
    nodes,
    edges,
    positions,
    graph: g,
  };
}

/**
 * 簡化的布局函數，直接返回 Vue Flow 格式的元素
 * @param {Array} tasks - 任務數組
 * @param {Object} options - 布局選項
 * @returns {Array} Vue Flow 元素數組
 */
export function createVueFlowLayout(tasks, options = {}) {
  const layoutResult = calculateLayoutWithDagre(tasks, options);
  return [...layoutResult.nodes, ...layoutResult.edges];
}

/**
 * 獲取布局統計信息
 * @param {Array} tasks - 任務數組
 * @returns {Object} 統計信息
 */
export function getLayoutStats(tasks) {
  const layoutResult = calculateLayoutWithDagre(tasks);
  const graph = layoutResult.graph;

  return {
    totalNodes: tasks.length,
    totalEdges: graph.edges().length,
    totalLevels: getMaxLevel(tasks),
    maxNodesInLevel: getMaxNodesInLevel(tasks),
    hasConnections: tasks.some((task) => {
      const targetIds = Array.isArray(task.targetId)
        ? task.targetId
        : task.targetId
        ? [task.targetId]
        : [];
      return targetIds.length > 0;
    }),
    graphInfo: {
      width: graph.graph().width,
      height: graph.graph().height,
    },
  };
}

/**
 * 獲取最大層級數
 * @param {Array} tasks - 任務數組
 * @returns {Number} 最大層級
 */
function getMaxLevel(tasks) {
  const levels = new Set();

  tasks.forEach((task) => {
    const level = getNodeLevel(task, tasks);
    levels.add(level);
  });

  return Math.max(...Array.from(levels)) + 1;
}

/**
 * 獲取單層最大節點數
 * @param {Array} tasks - 任務數組
 * @returns {Number} 最大節點數
 */
function getMaxNodesInLevel(tasks) {
  const levelCounts = new Map();

  tasks.forEach((task) => {
    const level = getNodeLevel(task, tasks);
    levelCounts.set(level, (levelCounts.get(level) || 0) + 1);
  });

  return Math.max(...Array.from(levelCounts.values()));
}

/**
 * 獲取節點所在的層級
 * @param {Object} task - 任務對象
 * @param {Array} allTasks - 所有任務數組
 * @returns {Number} 層級
 */
function getNodeLevel(task, allTasks) {
  // 處理數組格式的 sourceId
  const sourceIds = Array.isArray(task.sourceId)
    ? task.sourceId
    : task.sourceId
    ? [task.sourceId]
    : [];

  if (sourceIds.length === 0) return 0;

  // 找到所有父節點的最大層級
  let maxParentLevel = 0;
  sourceIds.forEach((sourceId) => {
    const parent = allTasks.find((t) => t.id === sourceId);
    if (parent) {
      const parentLevel = getNodeLevel(parent, allTasks);
      maxParentLevel = Math.max(maxParentLevel, parentLevel);
    }
  });

  return maxParentLevel + 1;
}

/**
 * 根據任務類型獲取對應的節點類型
 * @param {Object} task - 任務對象
 * @returns {String} 節點類型
 */
function getNodeType(task) {
  switch (task.reaction) {
    case "trigger":
      return "trigger-event";
    case "response":
      return "response-event";
    default:
      return "action";
  }
}

/**
 * 應用布局到現有元素
 * @param {Array} elements - 現有元素數組
 * @param {Array} tasks - 任務數組
 * @param {Object} options - 布局選項
 * @returns {Array} 更新後的元素數組
 */
export function applyDagreLayout(elements, tasks, options = {}) {
  const layoutResult = calculateLayoutWithDagre(tasks, options);

  return elements.map((element) => {
    if (element.type && layoutResult.positions.has(element.id)) {
      return {
        ...element,
        position: layoutResult.positions.get(element.id),
      };
    }
    return element;
  });
}

/**
 * 創建不同方向的布局
 * @param {Array} tasks - 任務數組
 * @param {String} direction - 方向 ('TB', 'BT', 'LR', 'RL')
 * @param {Object} options - 其他選項
 * @returns {Object} 布局結果
 */
export function createDirectionalLayout(tasks, direction = "TB", options = {}) {
  return calculateLayoutWithDagre(tasks, {
    ...options,
    rankdir: direction,
  });
}

/**
 * 獲取連接關係
 * @param {Array} tasks - 任務數組
 * @returns {Array} 連接關係數組
 */
export function getConnections(tasks) {
  const connections = [];

  tasks.forEach((task) => {
    // 處理數組格式的 targetId
    const targetIds = Array.isArray(task.targetId)
      ? task.targetId
      : task.targetId
      ? [task.targetId]
      : [];

    targetIds.forEach((targetId) => {
      if (targetId) {
        connections.push({
          id: `edge-${task.id}-${targetId}`,
          source: task.id,
          target: targetId,
          type: "step",
          class: "dark",
          animated: false,
        });
      }
    });
  });

  return connections;
}

// 為了向後兼容，保留舊的函數名稱
export const createCompleteLayout = calculateLayoutWithDagre;
export const applyLayoutToElements = applyDagreLayout;
