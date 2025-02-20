<script setup>
import { ref, onMounted, provide } from "vue";
import TreeChart from "../components/TreeChart.vue";
import { Tree } from "../utility/Tree.js";
import interfaceNodeColor from "../utility/interfaceNodeColor.js";
import SideToolbar from "../components/SideToolbar.vue";

const emptyTree = ref({});
// 目前主劇本進度資料
const mainTreeActiveStep = ref(0);
// 目前在編輯第幾層?
const activeLayer = ref(2);
//是否預覽樹狀圖
const isPreviewTree = ref(false);

/**
 * 回傳一個基礎的樹狀資料
 * @description 可以根據專案不同，自訂基礎的樹狀圖結構
 */
function returnEmptyTree() {
  const emptyTree = new Tree(0, {
    attr: "response",
    isActive: true,
    title: "點擊設定事件1",
    data: {}, //自訂的節點的資料
    depth: 1, //節點深度(必要)
  });
  emptyTree.insert(0, 1, {
    attr: "trigger",
    title: "點擊設定事件2",
    data: {},
    depth: 2,
  });
  emptyTree.insert(0, 2, {
    attr: "response",
    title: "點擊設定事件3",
    data: {},
    depth: 2,
  });
  emptyTree.insert(1, 3, {
    attr: "action",
    title: "action",
    data: {},
    depth: 3,
  });
  // emptyTree.insert(1, 4, {
  //   attr: "response",
  //   title: "點擊設定事件5",
  //   data: {},
  //   depth: 3,
  // });
  return emptyTree;
}

// 點選到主劇本方塊id、block type資料
function handleClickNode(id, block_type) {
  mainTreeActiveStep.value = Number(id);
  console.log("外層偵測到click 節點, 類型是:" + block_type);
}
function handleAddNode(data) {
  console.log("想要新增節點", data);
}

onMounted(() => {
  emptyTree.value = returnEmptyTree();
});

provide("mainTreeStep", mainTreeActiveStep);
</script>

<template>
  <div class="wrapper" style="">
    <ul class="flex flex-col align-left justify-left">
      <li>目前的key{{ mainTreeActiveStep }}</li>
      <li class="text-nowrap">目前在編輯第{{ activeLayer }}層</li>
    </ul>
    <div class="w-full flex mt-4 relative">
      <SideToolbar
        :style="{ width: '200px', minHeight: '400px', position: 'absolute' }"
      ></SideToolbar>
      <TreeChart
        class=""
        :data="emptyTree?.root"
        :currentKey="mainTreeActiveStep"
        :returnInterfaceNodeColor="interfaceNodeColor"
        :activeLayer="activeLayer"
        :preview="isPreviewTree"
        @clickNode="(id, block_type) => handleClickNode(id, block_type)"
        @addNode="(node) => handleAddNode(node)"
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
