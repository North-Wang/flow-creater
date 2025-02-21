<script setup>
import { ref, onMounted, provide } from "vue";
import TreeChart from "../components/TreeChart.vue";
import { Tree } from "../utility/Tree.js";
import { responseNodeSchema } from "../composables/HomePage/nodeSchema.js";
import interfaceNodeColor from "../utility/interfaceNodeColor.js";
import SideToolbar from "../components/SideToolbar.vue";

const emptyTree = ref({});
// 目前主劇本進度資料
const currentKey = ref(0);

//是否預覽樹狀圖
const isPreviewTree = ref(false);

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
    disabledConnect: false,
  });
  emptyTree.insert(0, 1, {
    attr: "wether_yes",
    title: "是",
    data: {},
    depth: 2,
    disabledConnect: false,
  });
  emptyTree.insert(0, 2, {
    attr: "wether_no",
    title: "否",
    data: {},
    depth: 2,
    disabledConnect: false,
  });
  emptyTree.insert(1, 3, {
    attr: "action",
    title: "點擊設定動作",
    data: {},
    depth: 3,
    disabledConnect: false,
  });
  emptyTree.insert(2, 4, {
    attr: "action",
    title: "點擊設定動作",
    data: {},
    depth: 3,
    disabledConnect: false,
  });
  emptyTree.insert(3, 5, {
    attr: "template",
    title: "插入模板",
    data: {},
    depth: 4,
    disabledConnect: false,
  });
  emptyTree.insert(4, 6, {
    attr: "template",
    title: "插入模板",
    data: {},
    depth: 4,
    disabledConnect: false,
  });
  // emptyTree.insert(5, 7, {
  //   attr: "response",
  //   title: "點擊設定事件",
  //   data: {},
  //   depth: 5,
  //   disabledConnect: true,
  // });
  // emptyTree.insert(6, 8, {
  //   attr: "response",
  //   title: "點擊設定事件",
  //   data: {},
  //   depth: 5,
  //   disabledConnect: true,
  // });
  // emptyTree.insert(6, 9, {
  //   attr: "response",
  //   title: "點擊設定事件",
  //   data: {},
  //   depth: 5,
  //   disabledConnect: true,
  // });
  return emptyTree;
}

// 點選到主劇本方塊id、block type資料
function handleClickNode(id, block_type) {
  currentKey.value = Number(id);
  console.log("外層偵測到click 節點, 類型是:" + block_type);
}
/**
 * 根據節點種類，插入對應的下一層節點
 * @param nodeType
 */
function handleAddNode(id, nodeType) {
  console.log("想要新增id:" + id + "節點, 類型：" + nodeType);
  switch (nodeType) {
    case "template":
      emptyTree.value.insert(id, 9, {
        attr: "response",
        title: "點擊設定事件",
        data: {},
        depth: 5,
        disabledConnect: true,
      });
      break;

    default:
      console.warn("未定義的節點種類", nodeType);
      break;
  }
}

onMounted(() => {
  emptyTree.value = returnEmptyTree();
});
</script>

<template>
  <div class="wrapper" style="">
    <ul class="flex flex-col align-left justify-left">
      <li>目前的key{{ currentKey }}</li>
    </ul>
    <div class="w-full flex mt-4 relative">
      <SideToolbar
        :style="{ width: '200px', minHeight: '400px', position: 'absolute' }"
      ></SideToolbar>
      <TreeChart
        class=""
        :data="emptyTree?.root"
        :currentKey="currentKey"
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
