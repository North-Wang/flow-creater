<template>
  <div class="wrapper" style="">
    <span>DEMO</span>
    <div class="wra-tree">
      <SideToolbar
        :style="{
          width: 'auto',
          minHeight: '800px',
        }"
      />
      <div>
        <TreeChart
          class="mt-2"
          :data="emptyTree?.root"
          :nodeAttr="emptyTree?.root?.value?.attr"
          :currentKey="mainTreeActiveStep"
          :returnInterfaceNodeColor="returnInterfaceNodeColor"
          :ruleHasAddNode="[]"
          :activeLayer="activeLayer"
          :preview="isPreviewTree"
          @clickNode="(id, block_type) => handleClickNode(id, block_type)"
          @addNode="(node) => handleAddNode(node)"
        >
          <!-- <template #root-node>
        <div class="wra-root-node">
          選擇起點 <br />
          <div class="default-icon"></div>
        </div>
      </template> -->
        </TreeChart>
      </div>
    </div>
    <!-- <Teleport to="#app">
      <div class="right-0 bottom-0 bg-white">
        {{ emptyTree?.root }}
      </div>
    </Teleport> -->
  </div>
</template>

<script setup>
import { ref, onMounted, provide, Teleport } from "vue";
import TreeChart from "../components/TreeChart.vue";
import { Tree } from "../utility/Tree.js";
import returnInterfaceNodeColor from "../utility/demoInterfaceNodeColor.js";
import SideToolbar from "../components/SideToolbar.vue";

const emptyTree = ref({});
// 目前主劇本進度資料
const mainTreeActiveStep = ref(0);
// 目前在編輯第幾層?
const activeLayer = ref(3);
//是否預覽樹狀圖
const isPreviewTree = ref(false);

function handleAddNode(data) {
  console.log("想要新增節點", data);
}

/**
 * 回傳一個基礎的樹狀資料
 * @description 可以根據專案不同，自訂基礎的樹狀圖結構
 */
function returnEmptyTree() {
  const emptyTree = new Tree(0, {
    attr: "start",
    title: "選擇時段",
    data: {
      date: new Date(),
      value: "",
    }, //自訂的節點的資料
    depth: 1, //節點深度(必要)
  });
  emptyTree.insert(0, 1, {
    attr: "starter",
    title: "選擇前菜",
    data: {},
    depth: 2,
  });
  emptyTree.insert(0, 2, {
    attr: "starter",
    title: "選擇前菜",
    data: {},
    depth: 2,
  });
  emptyTree.insert(1, 3, {
    attr: "template",
    title: "填入模板",
    data: {},
    depth: 3,
  });
  emptyTree.insert(1, 4, {
    attr: "template",
    title: "填入模板",
    data: {},
    depth: 3,
  });
  emptyTree.insert(2, 5, {
    attr: "wether_yes",
    title: "是",
    data: {},
    depth: 3,
  });
  emptyTree.insert(2, 6, {
    attr: "wether_no",
    title: "否",
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
function handleClickNode(id, nodeType) {
  mainTreeActiveStep.value = Number(id);
  console.log("外層偵測到click 節點, 類型是:" + nodeType);
}
function openModalWithType(params) {}

onMounted(() => {
  emptyTree.value = returnEmptyTree();
});
</script>

<style scoped lang="scss">
.wra-root-node {
  width: 200px;
  aspect-ratio: 1;
  // background-color: #da7c89;
  // color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 8px;
  .default-icon {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    aspect-ratio: 1;
    border: dashed 2px white;
  }
}
.wra-tree {
  display: grid;
  grid-template-columns: 200px 1fr;
}
</style>
