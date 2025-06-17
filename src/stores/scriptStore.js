import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { emptyScriptBySchema } from "@/data/RemaScript/emptyTree";

export const useScriptStore = defineStore("script", () => {
  // 状态
  const currentScript = ref(null);
  const scriptHistory = ref([]);
  const historyIndex = ref(-1);
  const maxHistorySize = 50;

  // 计算属性
  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(
    () => historyIndex.value < scriptHistory.value.length - 1
  );

  // 方法
  const updateScript = (script) => {
    // 保存到历史记录
    if (currentScript.value) {
      // 如果当前不在历史记录末尾，删除后面的记录
      if (historyIndex.value < scriptHistory.value.length - 1) {
        scriptHistory.value = scriptHistory.value.slice(
          0,
          historyIndex.value + 1
        );
      }

      scriptHistory.value.push(JSON.parse(JSON.stringify(currentScript.value)));

      // 限制历史记录大小
      if (scriptHistory.value.length > maxHistorySize) {
        scriptHistory.value.shift();
      } else {
        historyIndex.value++;
      }
    }

    currentScript.value = script;
  };

  const addTask = (task) => {
    if (!currentScript.value) {
      currentScript.value = emptyScriptBySchema;
    }

    const newScript = {
      ...currentScript.value,
      task: [...currentScript.value.task, task],
    };

    updateScript(newScript);
  };

  const updateTask = (taskId, updates) => {
    if (!currentScript.value) return;

    const newScript = {
      ...currentScript.value,
      task: currentScript.value.task.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    };

    updateScript(newScript);
  };

  const deleteTask = (taskId) => {
    if (!currentScript.value) return;

    const newScript = {
      ...currentScript.value,
      task: currentScript.value.task.filter((task) => task.id !== taskId),
    };

    updateScript(newScript);
  };

  const createConnection = (sourceId, targetId) => {
    if (!currentScript.value) return;

    const newScript = {
      ...currentScript.value,
      task: currentScript.value.task.map((task) => {
        if (task.id === sourceId) {
          return { ...task, targetId };
        }
        if (task.id === targetId) {
          return { ...task, sourceId };
        }
        return task;
      }),
    };

    updateScript(newScript);
  };

  const deleteConnection = (connectionId) => {
    if (!currentScript.value) return;

    // 解析连接ID格式: edge-{sourceId}-{targetId}
    const parts = connectionId.split("-");
    if (parts.length >= 3) {
      const sourceId = parts[1];
      const targetId = parts[2];

      const newScript = {
        ...currentScript.value,
        task: currentScript.value.task.map((task) => {
          if (task.id === sourceId) {
            return { ...task, targetId: null };
          }
          if (task.id === targetId) {
            return { ...task, sourceId: null };
          }
          return task;
        }),
      };

      updateScript(newScript);
    }
  };

  const undo = () => {
    if (canUndo.value) {
      historyIndex.value--;
      currentScript.value = JSON.parse(
        JSON.stringify(scriptHistory.value[historyIndex.value])
      );
    }
  };

  const redo = () => {
    if (canRedo.value) {
      historyIndex.value++;
      currentScript.value = JSON.parse(
        JSON.stringify(scriptHistory.value[historyIndex.value])
      );
    }
  };

  const saveScript = async (script) => {
    // 这里应该调用API保存脚本
    console.log("保存脚本:", script);
    return Promise.resolve(true);
  };

  const loadScript = async (scriptId) => {
    // 这里应该调用API加载脚本
    console.log("加载脚本:", scriptId);
    return Promise.resolve(emptyScriptBySchema);
  };

  const clearHistory = () => {
    scriptHistory.value = [];
    historyIndex.value = -1;
  };

  return {
    // 状态
    currentScript,
    scriptHistory,
    historyIndex,

    // 计算属性
    canUndo,
    canRedo,

    // 方法
    updateScript,
    addTask,
    updateTask,
    deleteTask,
    createConnection,
    deleteConnection,
    undo,
    redo,
    saveScript,
    loadScript,
    clearHistory,
  };
});
