<template>
  <div class="wrapper" style="">
    <span>DEMO</span>

    <TreeChart
      class="mt-2"
      :data="emptyTree?.root"
      :currentKey="mainTreeActiveStep"
      :interfaceNodeColor="interfaceNodeColor"
      :activeLayer="activeLayer"
      :preview="isPreviewTree"
      @clickNode="(id, block_type) => handleClickNode(id, block_type)"
    >
      <template #root-node>
        <div class="wra-root-node">
          美食街龍 <br />
          食字路口
        </div>
      </template>
    </TreeChart>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import TreeChart from "../components/TreeChart.vue";
import { Tree } from "../utility/Tree.js";
import interfaceNodeColor from "../utility/interfaceNodeColor.js";

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
    attr: "response",
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
    title: "第二層3",
    data: {},
    depth: 3,
  });
  emptyTree.insert(1, 4, {
    attr: "action",
    title: "第二層4",
    data: {},
    depth: 3,
  });
  emptyTree.insert(2, 5, {
    attr: "action",
    title: "第二層5",
    data: {},
    depth: 3,
  });
  emptyTree.insert(2, 6, {
    attr: "action",
    title: "第二層6",
    data: {},
    depth: 3,
  });
  emptyTree.insert(3, 7, {
    attr: "action",
    title: "第二層7",
    data: {},
    depth: 3,
  });
  emptyTree.insert(3, 8, {
    attr: "action",
    title: "第二層8",
    data: {},
    depth: 3,
  });
  return emptyTree;
}

// 點選到主劇本方塊id、block type資料
function handleClickNode(id, block_type) {
  mainTreeActiveStep.value = Number(id);
  console.log("外層偵測到click 節點, 類型是:" + block_type);
}

onMounted(() => {
  emptyTree.value = returnEmptyTree();
});

provide("mainTreeStep", mainTreeActiveStep);
</script>

<style scoped lang="scss">
.wra-root-node {
  width: 200px;
  aspect-ratio: 1;
  // background-color: #da7c89;
  // color: white;
  border-radius: 10px;
  place-content: center center;
}
</style>
