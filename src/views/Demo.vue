<template>
  <div class="wrapper" style="">
    <span>DEMO 目前的節點id:{{ currentKey }}</span>
    <div class="wra-tree">
      <SideToolbar
        :style="{
          width: '200px',
          minHeight: '400px',
          position: 'absolute',
          left: '24px',
          zIndex: 10,
        }"
        :nodeType="nodeType"
        @select="handleSelectTool"
        v-if="nodeType"
      />
      <TreeChart
        class="mt-2"
        :data="emptyTree?.root"
        :nodeAttr="emptyTree?.root?.value?.attr"
        :currentKey="currentKey"
        :returnInterfaceNodeColor="returnInterfaceNodeColor"
        :ruleHasAddNode="['meat', 'template']"
        :ruleHasToolbar="['intention', 'starter']"
        :toolbarKey="[]"
        :activeLayer="activeLayer"
        :preview="isPreviewTree"
        v-bind="$slots"
        @clickNode="(id, block_type) => handleClickNode(id, block_type)"
        @addNode="(node) => handleAddNode(node)"
      >
        <template #node="{ key, nodeType, nodeData, nodeTitle }">
          <div v-if="nodeType === 'intention'">{{ nodeTitle }}</div>
          <div v-if="nodeType === 'starter'">
            <div class="flex flex-col">
              <h3 class="text-[18px] mb-1">{{ nodeTitle }}</h3>
              {{ nodeType }}
              <h5>凱薩沙拉</h5>
              <h5>vs</h5>
              <h5>海鮮拼盤</h5>
            </div>
          </div>
        </template>
        <template #toolbar="{ key, nodeType, nodeData }">
          <div class="tool-bar text-black">
            <div v-if="nodeType === 'intention'">
              <SvgTrash :color="`var(--color-toolbar-icon-trigger)`" />
            </div>
            <div v-if="nodeType === 'starter'">
              <SvgPen
                :color="`var(--color-toolbar-icon-trigger)`"
                @click="handleEditNode(key, nodeType, nodeData)"
              />
            </div>
          </div>
        </template>
      </TreeChart>
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
import { createTriggerEventDefaultTree } from "../composables/demo/nodeSchema.js";
import SideToolbar from "../components/Demo/SideToolbar.vue";

import SvgTrash from "../components/icon/SvgTrash.vue";
import SvgPen from "../components/icon/SvgPen.vue";

const emptyTree = ref({});
// 目前在編輯第幾層?
const activeLayer = ref(3);
//是否預覽樹狀圖
const isPreviewTree = ref(false);
//目前click的節點種類
const nodeType = ref("");
// 目前的節點id
const currentKey = ref(0);

const styleToolbar = ref({ right: 0, left: "-20px" });

function handleAddNode(data) {
  console.log("想要新增節點", data);
}

// 點選到主劇本方塊id、block type資料
function handleClickNode(id, block_type) {
  currentKey.value = Number(id);
  console.log("外層偵測到click 節點, 類型是:" + block_type);
  nodeType.value = block_type;
}

/**
 * 從工具列選擇種類，更新節點資料
 * @param {String} nodeTitle 節點要顯示的title文本
 * @param {Object} data 工具列選項設定的資料 (非必要)
 */
function handleSelectTool(nodeTitle, nodeData) {
  const targetNode = emptyTree.value.find(currentKey.value);
  targetNode.value.title = nodeTitle;

  if (nodeData) {
    //如果選擇工具列選項時有設定資料，則要放到節點的value.data
    targetNode.value.data = nodeData;
    console.log("節點資料：", targetNode);
  }
}

function handleEditNode(key, nodeType, nodeData) {
  console.log("編輯節點:", key, nodeType, nodeData);
}

onMounted(() => {
  emptyTree.value = createTriggerEventDefaultTree();
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
  width: 100%;
  // display: grid;
  // grid-template-columns: 200px 1fr;
  position: relative;
}
.tool-bar {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 100%;
  top: 0;
  left: -45px;
  z-index: 2;
  > * {
    all: unset;
    margin-bottom: 5px;
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
