/**
 * 節點自動布局工具
 * 根據sourceId和targetId關係自動排列節點位置
 * 布局特點
 * 由上而下排列：根據節點的層級關係自動排列
 * 同層水平排列：同一層級的節點水平分布
 * 避免重疊：自動檢測並調整重疊的節點
 * 可配置間距：支持自定義水平和垂直間距
 */

/**
 * 計算節點的自動布局位置
 * @param {Array} tasks - 任務數組
 * @param {Object} options - 布局選項
 * @returns {Object} 節點ID到位置的映射
 */
export function calculateNodeLayout(tasks, options = {}) {
  const {
    startX = 100,
    startY = 100,
    nodeWidth = 200,
    nodeHeight = 120,
    horizontalSpacing = 300,
    verticalSpacing = 200,
    maxNodesPerLevel = 5,
  } = options;

  // 構建節點關係圖
  const nodeMap = new Map();
  const childrenMap = new Map();
  const parentMap = new Map();
  const rootNodes = [];

  // 初始化節點映射
  tasks.forEach((task) => {
    nodeMap.set(task.id, task);
    childrenMap.set(task.id, []);
  });

  // 建立父子關係
  tasks.forEach((task) => {
    if (task.sourceId) {
      parentMap.set(task.id, task.sourceId);
      const children = childrenMap.get(task.sourceId) || [];
      children.push(task.id);
      childrenMap.set(task.sourceId, children);
    } else {
      rootNodes.push(task.id);
    }
  });

  // 計算每個節點的層級
  const levelMap = new Map();
  const visited = new Set();

  function calculateLevel(nodeId, level = 0) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    levelMap.set(nodeId, Math.max(levelMap.get(nodeId) || 0, level));

    const children = childrenMap.get(nodeId) || [];
    children.forEach((childId) => {
      calculateLevel(childId, level + 1);
    });
  }

  // 從根節點開始計算層級
  rootNodes.forEach((rootId) => {
    calculateLevel(rootId, 0);
  });

  // 按層級分組節點
  const levelGroups = new Map();
  tasks.forEach((task) => {
    const level = levelMap.get(task.id) || 0;
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level).push(task.id);
  });

  // 計算節點位置
  const positions = new Map();

  levelGroups.forEach((nodeIds, level) => {
    const y = startY + level * verticalSpacing;
    const totalWidth = (nodeIds.length - 1) * horizontalSpacing;
    const startXForLevel = startX - totalWidth / 2;

    nodeIds.forEach((nodeId, index) => {
      const x = startXForLevel + index * horizontalSpacing;
      positions.set(nodeId, { x, y });
    });
  });

  return positions;
}

/**
 * 優化布局，避免節點重疊
 * @param {Object} positions - 初始位置映射
 * @param {Array} tasks - 任務數組
 * @param {Object} options - 布局選項
 * @returns {Object} 優化後的位置映射
 */
export function optimizeLayout(positions, tasks, options = {}) {
  const { nodeWidth = 200, nodeHeight = 120, minSpacing = 50 } = options;

  const optimizedPositions = new Map(positions);
  const nodeIds = Array.from(positions.keys());

  // 檢查並調整重疊的節點
  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 1; j < nodeIds.length; j++) {
      const node1 = nodeIds[i];
      const node2 = nodeIds[j];
      const pos1 = optimizedPositions.get(node1);
      const pos2 = optimizedPositions.get(node2);

      const distanceX = Math.abs(pos1.x - pos2.x);
      const distanceY = Math.abs(pos1.y - pos2.y);

      // 如果節點重疊或太近
      if (
        distanceX < nodeWidth + minSpacing &&
        distanceY < nodeHeight + minSpacing
      ) {
        // 水平分離
        if (distanceX < nodeWidth + minSpacing) {
          const separation = (nodeWidth + minSpacing - distanceX) / 2;
          if (pos1.x < pos2.x) {
            pos1.x -= separation;
            pos2.x += separation;
          } else {
            pos1.x += separation;
            pos2.x -= separation;
          }
        }

        // 垂直分離
        if (distanceY < nodeHeight + minSpacing) {
          const separation = (nodeHeight + minSpacing - distanceY) / 2;
          if (pos1.y < pos2.y) {
            pos1.y -= separation;
            pos2.y += separation;
          } else {
            pos1.y += separation;
            pos2.y -= separation;
          }
        }

        optimizedPositions.set(node1, pos1);
        optimizedPositions.set(node2, pos2);
      }
    }
  }

  return optimizedPositions;
}

/**
 * 應用布局到Vue Flow元素
 * @param {Array} elements - Vue Flow元素數組
 * @param {Array} tasks - 任務數組
 * @param {Object} options - 布局選項
 * @returns {Array} 更新後的元素數組
 */
export function applyLayoutToElements(elements, tasks, options = {}) {
  const positions = calculateNodeLayout(tasks, options);
  const optimizedPositions = optimizeLayout(positions, tasks, options);

  return elements.map((element) => {
    if (element.type && optimizedPositions.has(element.id)) {
      return {
        ...element,
        position: optimizedPositions.get(element.id),
      };
    }
    return element;
  });
}

/**
 * 獲取節點的連接關係
 * @param {Array} tasks - 任務數組
 * @returns {Array} 連接關係數組
 */
export function getConnections(tasks) {
  const connections = [];

  tasks.forEach((task) => {
    if (task.sourceId && task.targetId) {
      connections.push({
        id: `edge-${task.sourceId}-${task.targetId}`,
        source: task.sourceId,
        target: task.targetId,
        type: "step",
        class: "dark",
        animated: false,
      });
    }
  });

  return connections;
}

/**
 * 完整的布局函數，包含節點和連接
 * @param {Array} tasks - 任務數組
 * @param {Object} options - 布局選項
 * @returns {Object} 包含節點和連接的布局結果
 */
export function createCompleteLayout(tasks, options = {}) {
  const positions = calculateNodeLayout(tasks, options);
  const optimizedPositions = optimizeLayout(positions, tasks, options);

  const nodes = tasks.map((task) => ({
    id: task.id,
    type: getNodeType(task),
    position: optimizedPositions.get(task.id) || { x: 0, y: 0 },
    data: {
      task,
      nodeType: task.reaction,
    },
  }));

  const edges = getConnections(tasks);

  return {
    nodes,
    edges,
    positions: optimizedPositions,
  };
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
 * 獲取布局統計信息
 * @param {Array} tasks - 任務數組
 * @returns {Object} 統計信息
 */
export function getLayoutStats(tasks) {
  const positions = calculateNodeLayout(tasks);
  const levels = new Set();
  const nodesPerLevel = new Map();

  tasks.forEach((task) => {
    const level = getNodeLevel(task, tasks);
    levels.add(level);

    if (!nodesPerLevel.has(level)) {
      nodesPerLevel.set(level, 0);
    }
    nodesPerLevel.set(level, nodesPerLevel.get(level) + 1);
  });

  return {
    totalNodes: tasks.length,
    totalLevels: levels.size,
    maxNodesInLevel: Math.max(...Array.from(nodesPerLevel.values())),
    nodesPerLevel: Object.fromEntries(nodesPerLevel),
    hasConnections: tasks.some((task) => task.sourceId && task.targetId),
  };
}

/**
 * 獲取節點所在的層級
 * @param {Object} task - 任務對象
 * @param {Array} allTasks - 所有任務數組
 * @returns {Number} 層級
 */
function getNodeLevel(task, allTasks) {
  if (!task.sourceId) return 0;

  const parent = allTasks.find((t) => t.id === task.sourceId);
  if (!parent) return 0;

  return getNodeLevel(parent, allTasks) + 1;
}
