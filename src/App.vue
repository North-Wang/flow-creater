<script setup>
import { ref, onMounted } from "vue";
import TreeChart from "./components/TreeChart.vue";
import { Tree } from "./utility/Tree.js";

const emptyTree = ref({});

/**
 * 回傳一個基礎的樹狀資料
 * @description 可以根據專案不同，自訂基礎的樹狀圖結構
 */
function returnEmptyTree() {
  const emptyTree = new Tree(0, {
    attr: "trigger",
    isActive: true,
    title: "點擊設定事件",
    data: {}, //自訂的節點的資料
    depth: 1, //節點深度(必要)
  });
  emptyTree.insert(0, 1, {
    attr: "response",
    title: "點擊設定事件",
    data: {},
    depth: 2,
  });
  emptyTree.insert(0, 2, {
    attr: "response",
    title: "點擊設定事件",
    data: {},
    depth: 2,
  });
  emptyTree.insert(1, 3, {
    attr: "response",
    title: "點擊設定事件",
    data: {},
    depth: 3,
  });
  emptyTree.insert(1, 4, {
    attr: "response",
    title: "點擊設定事件",
    data: {},
    depth: 3,
  });
  return emptyTree;
}
onMounted(() => {
  emptyTree.value = returnEmptyTree();
});
</script>

<template>
  <div class="wrapper" style="">
    <TreeChart :data="emptyTree?.root" />
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
