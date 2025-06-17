import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { z } from "zod";
import {
  ScriptSchema,
  TaskSchema,
  TreeType,
} from "../schemas/ReMaScript/scriptSchema";

export const useScriptStore = defineStore("script", () => {
  // 状态
  const currentScript = ref<z.infer<typeof ScriptSchema> | null>(null);
  const currentTreeType = ref<TreeType>("main");
  const selectedNodeId = ref<string | null>(null);
  const scriptHistory = ref<z.infer<typeof ScriptSchema>[]>([]);
  const currentHistoryIndex = ref(-1);

  // 计算属性
  const triggerTasks = computed(() => {
    if (!currentScript.value) return [];
    return currentScript.value.task.filter(
      (item) => item.reaction === "trigger"
    );
  });

  const responseTasks = computed(() => {
    if (!currentScript.value) return [];
    return currentScript.value.task.filter(
      (item) => item.reaction === "response"
    );
  });

  const selectedNode = computed(() => {
    if (!selectedNodeId.value || !currentScript.value) return null;
    return currentScript.value.task.find(
      (task) => task.id === selectedNodeId.value
    );
  });

  // 动作
  const updateScript = (script: z.infer<typeof ScriptSchema>) => {
    // 保存到历史记录
    if (currentScript.value) {
      scriptHistory.value.push(currentScript.value);
      currentHistoryIndex.value++;
    }

    currentScript.value = script;
  };

  const updateTreeType = (type: TreeType) => {
    currentTreeType.value = type;
  };

  const selectNode = (nodeId: string | null) => {
    selectedNodeId.value = nodeId;
  };

  const addTask = (task: z.infer<typeof TaskSchema>) => {
    if (!currentScript.value) return;

    const newScript = {
      ...currentScript.value,
      task: [...currentScript.value.task, task],
    };
    updateScript(newScript);
  };

  const updateTask = (
    taskId: string,
    updates: Partial<z.infer<typeof TaskSchema>>
  ) => {
    if (!currentScript.value) return;

    const newScript = {
      ...currentScript.value,
      task: currentScript.value.task.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    };
    updateScript(newScript);
  };

  const deleteTask = (taskId: string) => {
    if (!currentScript.value) return;

    const newScript = {
      ...currentScript.value,
      task: currentScript.value.task.filter((task) => task.id !== taskId),
    };
    updateScript(newScript);
  };

  const undo = () => {
    if (currentHistoryIndex.value > 0) {
      currentHistoryIndex.value--;
      currentScript.value = scriptHistory.value[currentHistoryIndex.value];
    }
  };

  const redo = () => {
    if (currentHistoryIndex.value < scriptHistory.value.length - 1) {
      currentHistoryIndex.value++;
      currentScript.value = scriptHistory.value[currentHistoryIndex.value];
    }
  };

  const canUndo = computed(() => currentHistoryIndex.value > 0);
  const canRedo = computed(
    () => currentHistoryIndex.value < scriptHistory.value.length - 1
  );

  return {
    // 状态
    currentScript,
    currentTreeType,
    selectedNodeId,

    // 计算属性
    triggerTasks,
    responseTasks,
    selectedNode,
    canUndo,
    canRedo,

    // 动作
    updateScript,
    updateTreeType,
    selectNode,
    addTask,
    updateTask,
    deleteTask,
    undo,
    redo,
  };
});
