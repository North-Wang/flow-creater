<script setup>
import { ref, onMounted, provide, watch, toRaw } from "vue";
import TreeChart from "../components/TreeChart.vue";

import {
  createTriggerEventDefaultTree,
  createResponseEventDefaultTree,
} from "../composables/HomePage/nodeSchema.js";
import {
  interfaceNodeColor,
  returnIconByNode,
} from "../utility/interfaceNode.js";
import SideToolbar from "../components/SideToolbar.vue";

const emptyTree = ref({});
// 目前的節點id
const currentKey = ref(0);
//是否預覽樹狀圖
const isPreviewTree = ref(false);
const nodeType = ref("");

// 點選到主劇本方塊id、block type資料
function handleClickNode(id, block_type) {
  currentKey.value = Number(id);
  console.log("外層偵測到click 節點, 類型是:" + block_type);
  nodeType.value = block_type;
}
/**
 * 根據節點種類，插入對應的下一層節點
 * @param {Object} nodeData 在哪個節點id底下新增
 * @param nodeType 節點種類
 */
function handleAddNode(nodeData, nodeType) {
  console.log("想要新增id:" + nodeData + "節點, 類型：" + nodeType);
  try {
    /**
     * @param {Number} id 在哪個節點id底下新增
     * @param {Number} depth 目前節點在第幾層
     */
    const id = nodeData.key;
    const depth = nodeData?.value?.depth;

    if (!id || !depth) throw Error("無法取得節點id或目前層數");
    switch (nodeType) {
      case "template":
        emptyTree.value = createResponseEventDefaultTree(
          emptyTree.value,
          depth + 1,
          id
        );
        break;
      default:
        console.warn("未定義的節點種類", nodeType);
        break;
    }
  } catch (error) {
    console.warn("新增節點 失敗", error);
  }
}
/**
 * 從工具列選擇種類，更新節點資料
 * @param {String} val 選擇的工具列選項
 */
function handleSelectTool(val) {
  const targetNode = emptyTree.value.find(currentKey.value);
  targetNode.value.title = val;
  console.log("選擇的選項：" + targetNode?.value?.title);
}

function saveScript() {
  const res = emptyTree.value.getNodeData();
  console.log("儲存劇本", res);
}

function previewNode(id) {
  console.log("外層開啟預覽圖, 節點id:", id);
}

onMounted(() => {
  emptyTree.value = createTriggerEventDefaultTree(1);
});
</script>

<template>
  <div class="wrapper" style="">
    <ul class="w-full flex align-left justify-between">
      <li>目前的節點id：{{ currentKey }}</li>
      <button class="px-4 py-2 rounded-[10px] bg-blue-200" @click="saveScript">
        儲存
      </button>
    </ul>
    <div class="w-full flex-col flex mt-4 relative">
      <SideToolbar
        :style="{
          width: '200px',
          minHeight: '400px',
          position: 'absolute',
          zIndex: 10,
        }"
        :nodeType="nodeType"
        @select="handleSelectTool"
        v-if="nodeType && nodeType !== ''"
      ></SideToolbar>
      <TreeChart
        class=""
        :data="emptyTree?.root"
        :currentKey="currentKey"
        :returnNodeIcon="returnIconByNode"
        :returnInterfaceNodeColor="interfaceNodeColor"
        :preview="isPreviewTree"
        @clickNode="(id, block_type) => handleClickNode(id, block_type)"
        @addNode="handleAddNode"
        @previewNode="previewNode"
      />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}
</style>
