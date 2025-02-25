<script setup>
import { ref, onMounted, provide, watch } from "vue";
import TreeChart from "../components/TreeChart.vue";

import {
  createTriggerEventDefaultTree,
  createResponseEventDefaultTree,
  iconMap,
} from "../composables/HomePage/nodeSchema.js";
import interfaceNodeColor from "../utility/interfaceNodeColor.js";
import SideToolbar from "../components/SideToolbar.vue";

const emptyTree = ref({});
// 目前的節點id
const currentKey = ref(0);
//是否預覽樹狀圖
const isPreviewTree = ref(false);
const nodeType = ref("");
const interfaceIcon = ref(new iconMap());

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
  console.log("aaa val", val);
  const targetNode = emptyTree.value.find(currentKey.value);
  targetNode.value.title = val;
  console.log("aaa 選擇工具", targetNode?.value?.title);
}

onMounted(() => {
  emptyTree.value = createTriggerEventDefaultTree(1);
});
</script>

<template>
  <div class="wrapper" style="">
    <ul class="flex flex-col align-left justify-left">
      <li>目前的節點id：{{ currentKey }}</li>
    </ul>
    <div class="w-full flex mt-4 relative">
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
        :returnNodeIcon="interfaceIcon.getIconByNode"
        :returnInterfaceNodeColor="interfaceNodeColor"
        :preview="isPreviewTree"
        @clickNode="(id, block_type) => handleClickNode(id, block_type)"
        @addNode="handleAddNode"
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
}
</style>
