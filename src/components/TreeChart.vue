<template>
  <table
    :class="[
      props.currentKey > 1 ? 'active_bg' : '',
      props.preview ? 'preview' : '',
    ]"
    v-if="data && Object.keys(data).length !== 0"
  >
    <tbody>
      <!--主要父元素-->
      <tr class="" :class="[isConnectLineTransForm ? '' : '']">
        <td
          colspan="8"
          class="parent-node"
          :class="[
            props.data?.value?.showConnectLine ? 'vertical-connect-line' : '',
            child_counts === 1 || !child_counts ? 'one-line' : 'two-line',
          ]"
        >
          <!--父節點的內容-->
          <div
            @click="(event) => getCurrentKey(event)"
            @mouseenter="handleShowToolBar(props.data?.value, toolbarKey)"
            @mouseleave="showToolBarHover = false"
            :data-id="props.data?.key"
            :data-attr="parentNodeType"
            :data-disable="props.data?.value?.disableFocus"
            :data-clickable="ruleNotClick.includes(parentNodeType)"
            :class="[
              props.currentKey === props.data?.key ? 'focus-animate' : '',
              activeLayer >= depth ? '' : 'block-disable',
              props.data?.value?.disActive ? 'block-disable' : '',
              isRectangleNode ? 'rectangle-node' : 'card',
            ]"
            :style="{
              backgroundColor: returnInterfaceNodeColor(parentNodeType),
              color:
                parentNodeType === 'template'
                  ? 'var(--color-template-node-text)'
                  : 'var(--color-node-text)',
            }"
          >
            <slot name="root-node">
              <!--方塊顯示圖片-->
              <div
                class="node-icon"
                v-if="ruleHasIcon.includes(parentNodeType)"
              ></div>
              <!--方塊顯示文字title-->
              <div>
                {{ props.data?.value?.title }}
              </div>
            </slot>

            <!-- 父節點側邊的tool工具列-->
            <div
              class="tool-bar"
              v-if="ruleHasToolbar.includes(parentNodeType) && showToolBarHover"
            >
              <slot name="parent-node-toolbar">
                <SvgEye
                  :color="`var(--color-toolbar-icon-${parentNodeType})`"
                  @click="seeBlockPreview(props.data?.key)"
                ></SvgEye>
                <SvgPen
                  :color="`var(--color-toolbar-icon-${parentNodeType})`"
                ></SvgPen>
                <SvgTrash
                  :color="`var(--color-toolbar-icon-${parentNodeType})`"
                  @click="deleteBlock(props.data?.key)"
                ></SvgTrash>
              </slot>
            </div>
          </div>
          <!--方塊顯示樣板名稱hover和新增plus按鈕-->

          <button
            class="add-more-block-btn"
            v-if="isShowPlusButton"
            @click="handleClickAddNode(props.data, parentNodeType)"
          >
            <img :src="iconAdd" class="w-[18px] h-[18px]" alt="icon-add" />
          </button>
        </td>
      </tr>

      <!--子節點-->
      <tr
        class="wrapper-child-node"
        v-if="props.data?.children"
        :class="[isConnectLineTransForm ? '' : '']"
      >
        <td
          class="card child-node"
          style="position: relative"
          v-for="item in props.data?.children"
          :key="item.key"
          :class="[
            props.data?.children?.length === 1 ? 'one-child' : 'two-child',
          ]"
        >
          <tree-chart
            :data="item"
            :currentKey="props.currentKey"
            :activeLayer="activeLayer"
            :returnInterfaceNodeColor="returnInterfaceNodeColor"
            v-if="item.value"
            @clickNode="(id, block_type) => emits('clickNode', id, block_type)"
            @addNode="(id, block_type) => emits('addNode', id, block_type)"
          />
        </td>
      </tr>
    </tbody>
  </table>
  <slot name="no-data" v-else>
    <span>no data</span>
  </slot>
</template>

<script setup>
import { ref, computed, watch } from "vue";
// import treeChart from "@/TreeChart.vue";
import SvgEye from "./icon/SvgEye.vue";
import SvgTrash from "./icon/SvgTrash.vue";
import SvgPen from "./icon/SvgPen.vue";
import { Tree } from "../utility/Tree.js";

import iconAdd from "../assets/icons/add-icon.svg";

const emits = defineEmits(["clickNode", "addNode"]);
const props = defineProps({
  /**
   * 樹狀圖資料.
   * @const {object} data 樹狀圖資料
   * */
  data: {
    type: Object,
    default: () => ({
      children: [],
      key: 0,
      parent: null,
      value: {
        attr: "response",
        isActive: true,
        title: "點擊設定事件",
        data: {},
        depth: 1,
      },
    }),
  },
  /**
   * 現在使用者點選的node key.
   * @const {number}
   * */
  currentKey: {
    type: Number,
    default: 1,
  },
  /**
   * 是否顯示預覽劇本預覽樹狀圖.
   * @const {Boolean}
   */
  preview: {
    type: Boolean,
    default: false,
  },
  /**
   * 根據節點種類，回傳對應的背景色
   */
  returnInterfaceNodeColor: {
    type: Function,
    default: (type) => {
      // switch (type) {
      //   case "trigger":
      //     return "#BAABE7";
      //   case "action":
      //     return "#A0DA8B";
      //   default:
      //     return "#F9c357";
      // }
    },
  },
  //規則：那些節點的attr是長方形節點
  ruleRectangleNode: {
    type: Array,
    default: () => ["template", "wether_yes", "wether_no"],
  },
  //規則：那些節點的attr可以再新增節點
  ruleHasAddNode: {
    type: Array,
    default: () => ["template"],
  },
  ruleHasDoubleAddNode: {
    type: Array,
    default: () => ["template", ""],
  },
  //規則：那些節點的attr要顯示icon
  ruleHasIcon: {
    type: Array,
    default: () => ["trigger", "response", "action"],
  },
  //規則：那些節點的attr，不需觸發click事件
  ruleNotClick: {
    type: Array,
    default: () => ["wether_yes", "wether_no"],
  },
  //規則：可以顯示側邊工具列的節點種類
  ruleHasToolbar: {
    type: Array,
    default: () => ["trigger"],
  },
  //當節點.data內有任一參數的時候，表示有設定過資料，才能顯示側邊工具列
  toolbarKey: {
    type: Array,
    default: () => ["action", "event"],
  },
});

const isRectangleNode = computed(() => {
  return props.ruleRectangleNode.includes(parentNodeType.value) || false;
});

// 可以顯示操作tree table的劇本層數
const activeLayer = ref(5);
// 目前被focus的節點
const focusNode = ref(null);

/**
 *  模板節點的「+」號側邊要顯示的樣板資料
 */
const templatePlusButtonList = computed(() => {
  if (props.data?.value?.data?.plusButtonList) {
    return props.data?.value?.data?.plusButtonList.map((item, index) => {
      const side = index === 0 ? "left" : "right";
      return {
        ...item,
        side: side,
      };
    });
  } else
    return [
      { template_name: "模板A", side: "left" },
      { template_name: "模板B", side: "right" },
    ]; //aaa 暫時給假資料
});
/**
 * emits給元件的外層，判斷要新增哪種節點
 * @description 如果已經有一個子節點，就不能新增
 * @param parentNodeType 目前節點的種類
 * @param {String} nodeData 目前節點的id
 */
function handleClickAddNode(nodeData, parentNodeType) {
  const isLimit = nodeData?.children.length >= 1;
  const id = nodeData?.key;
  if (!isLimit) {
    //準備新增節點，要讓垂直的連接線顯示 aaa
    nodeData.value.showConnectLine = true;
    emits("addNode", id, parentNodeType);
  } else {
    console.warn("已達到新增節點的上限");
  }
}

function openNextLayer() {
  activeLayer.value++;
}
/**
 * 點擊任何的節點
 * @description 根據節點種類，判斷是否觸發clickNode事件
 * @description 外層收到clickNode事件後，能打開彈窗，設定此節點的資料
 */
function getCurrentKey(e) {
  try {
    /**
     * @type {HTMLElement} 會被加上focus外框的元素
     */
    let target = null;
    if (e.target?.dataset?.clickable) {
      target = e.target;
    } else {
      //往父層找正方形節點or長方形節點
      target = e.target.closest("[data-clickable]") || null;
    }
    if (!target) throw Error("沒抓到要focus的目標元素");

    //判斷此節點是否可觸發click事件
    const id = target.dataset.id;
    const block_type = target.dataset?.attr;
    const isDisableFocus = target.dataset?.disable; //是否元素被添加disable屬性

    if (!props.ruleNotClick.includes(block_type) && !isDisableFocus) {
      focusNode.value = target.classList.add("focus-animate");
      emits("clickNode", id, block_type);
    }
  } catch (error) {
    console.warn("click 節點 有誤", error);
  }
}

/**
 * @const {string} parentNodeType 節點的種類
 */
const parentNodeType = computed(() => props.data?.value?.attr);
/**
 * @const {string} depth 節點位於樹狀圖層數
 */
const depth = computed(() => props.data?.value?.depth);

// 連接線位移調整
const isConnectLineTransForm = computed(() => {
  return props.data?.value?.depth >= 2 && props.data?.children?.length === 2;
});
/**
 * @const {number} child_counts 子節點數目
 */
const child_counts = computed(() => props.data?.children?.length || 0);

//顯示父節點側邊的工具列
const showToolBarHover = ref(false);

/**
 * 顯示劇本節點資料 (需要更改)
 * @return {string}  劇本節點資料字串
 */
const hasTitleData = computed(() => {
  /**
   * @const {string} template_name 模板名稱
   * @const {string} action_name 觸發事件觸發時間
   * @const {string} event_name 回應事件觸發時間
   * @const {string} is_yes 是否節點文字
   * */
  const template_name = props.data?.value?.data?.template?.template_name || "";
  const action_name = props.data?.value?.data?.action || "";
  const event_name = props.data?.value?.data?.event?.split("-")?.[0] || "";
  const is_yes = props.data?.value?.data?.is_ye;
  return template_name || action_name || event_name || is_yes;
});

// 是否顯示+號按鈕 (需要更改)
const isShowPlusButton = computed(() => {
  return props.ruleHasAddNode.includes(parentNodeType.value);
  const hasTemplateButtonList = templatePlusButtonList.value?.length > 0;
  console.log(
    "plus按鈕資訊",
    templatePlusButtonList.value,
    "是否要有+號按鈕?",
    hasTemplateButtonList
  );
  // 判斷目前節點是否已有children
  if (!hasTemplateButtonList) return false;

  // templatePlusButtonList 有樣板按鈕資訊
  if (hasTemplateButtonList && props.data.value.depth === 2) {
    const children_nodes = props.data.children;
    if (children_nodes.length === 0) return true; // 完全沒用樣板按鈕創建過
    else if (children_nodes.length === 1) {
      // 取得已創立子節點template list資訊，相同者至templatePlusButtonList移除
      updateButtonList(children_nodes);
      if (templatePlusButtonList.value?.length > 0) return true;
      else return false;
    } else return false;
  }
  return false;
});

/**
 * mouse enter節點時，判斷是否可以顯示工具列
 * @description 需要節點內已經有資料，才能開啟工具列 編輯/預覽
 * @const {Object} blockData 節點主體tree node(包含attr/data/isActive)
 * @param {Array} rule 節點資料內那些key需要存在
 * @constant {Object} blockData.data 實際節點設定資料
 */
function handleShowToolBar(blockData, rule) {
  if (!props.ruleHasToolbar.includes(blockData?.attr)) return; //排除不能顯示toolbar的節點種類
  try {
    if (!blockData.data) throw Error("沒有父節點的資料");
    if (!rule) throw Error("要設定blockData.data須確認是否有有那些key的資料");

    const hasSettingData = rule.every((key) => {
      return Object.keys(blockData.data).includes(key);
    });
    showToolBarHover.value = hasSettingData;
  } catch (error) {
    console.warn("判斷開啟工具列 失敗", error);
    showToolBarHover.value = false;
  }
}
/**
 * 點擊+號創建新節點
 * @param id
 * @param templateData
 * @param side
 */
function onClickCreateNewNode(id, templateData, side = "left") {
  // 產生新的空事件節點
  const newNodeData = new Tree(0, {
    attr: "response",
    isActive: true,
    title: "點擊設定事件1",
    data: {}, //自訂的節點的資料
    depth: 1, //節點深度(必要)
  });

  // 移除buttonList該樣板選項
  templatePlusButtonList.value = templatePlusButtonList.value?.filter(
    (item) => {
      console.log("filter plus按鈕", item, "templateData", templateData);
      return item.template_id !== templateData?.template_id;
    }
  );
  // createNewNode(id, newNodeData, side, templateData);
}
/**
 * 創建新節點
 * @param current_id 目前的節點id，要成為新節點的父節點id
 * @param templateData 節點的資料
 * @param side 新節點在left/right大分支
 */
function createNewNode(current_id, data, side = "left", templateData) {
  // 左節點和右節點 創建節點d會不太一樣
  const next_node_id =
    side === "left" ? Number(current_id) * 2 + 1 : Number(current_id) * 2 + 2;
  tree.value.insert(current_id, next_node_id, data);
  // 產生對應id preview script
  const new_preview_tree = createResPonseEventDefaultTree();
  new_preview_tree.root.value.data.template = templateData;
  previewTreeScript.value[next_node_id] = new_preview_tree;
}

defineExpose({
  openNextLayer,
});
</script>

<style scoped lang="scss">
table {
  width: 100%;
  caption-side: bottom;
  border-collapse: collapse;
}
//預覽樹狀圖的時，click任何元素都不能觸發事件
.preview > * {
  pointer-events: none;
}
.parent-node {
  place-items: center;
  display: block;
  position: relative;
  .no-icon {
    width: 50px;
    aspect-ratio: 1;
    border: 2px dashed white;
    margin: auto;
    border-radius: 5px;
  }
  .node-icon {
    width: 50px;
    aspect-ratio: 1;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    align-self: center;
  }
  &.one-line {
    &::before {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -30px;
      height: 30px;
      border-left: 2px solid var(--color-node-line);
      transform: translate3d(-1px, 0, 0);
    }
  }
  &.two-line {
    //右側的垂直線
    &::before {
      content: "";
      position: absolute;
      left: 51%;
      bottom: -48px;
      height: var(--tree-line-height);
      border-left: 2px solid var(--color-node-line);
      transform: translate3d(-1px, 0, 0);
      border-radius: 0 0 0 5px;
      width: 5px;
    }
    //左側的垂直線
    &::after {
      content: "";
      position: absolute;
      right: 51%;
      bottom: -48px;
      height: var(--tree-line-height);
      border-right: 2px solid var(--color-node-line);
      transform: translate3d(-1px, 0, 0);
      border-radius: 0 0 5px 0;
      width: 5px;
    }
  }
}
.wrapper-child-node {
  display: flex;
  margin-top: 32px;
  .child-node {
    width: 50%;
    place-items: center center;
    position: relative;
    // 共有的垂直線
    &::before {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 100%;
      height: 15px;
      border-left: 2px solid var(--color-node-line);
      transform: translate3d(-1px, 0, 0);
    }

    // 共有的水平線
    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 15px;
      border-top: 2px solid var(--color-node-line);
    }

    // 隱藏第一個與最後一個節點的垂直線
    &:first-child::before,
    &:last-child::before {
      display: none;
    }
    //控制<tree-chart>下一層的table
    table {
      position: absolute;
      top: 43px;
    }
    //控制<tree-chart>下一層的table 左側
    &:first-child {
      > table {
        left: 8%;
      }
    }
    //控制<tree-chart>下一層的table 右側
    &:last-child {
      > table {
        right: 8%;
      }
    }

    //只有一個子節點
    &.one-child {
      width: 100%;
      &::after {
        content: "";
        display: none;
      }
      //因為只有一個子節點，所以子節點要修正為水平置中
      > table {
        top: 0;
        right: 0;
        left: 0;
      }
    }
    //有兩個子節點
    &.two-child {
      width: 100%;
      //左側 連接父節點的水平線
      &:first-child::after {
        // left: 54%;
        left: 57.5%;
        height: 30px;
        border: 2px solid;
        border-color: var(--color-node-line) transparent transparent
          var(--color-node-line);
        border-radius: 6px 0 0 0;
        transform: translate3d(1px, 0, 0);
        width: 40%;
      }

      //右側 連接父節點的水平線
      &:last-child::after {
        left: 2%;
        height: 30px;
        border: 2px solid;
        border-color: var(--color-node-line) var(--color-node-line) transparent
          transparent;
        border-radius: 0 6px 0 0;
        transform: translate3d(1px, 0, 0);
        width: 40%;
      }
    }
  }
}

//顯示垂直的連接線
.vertical-connect-line {
  &::after,
  &::before {
    display: none;
  }
}
//被選取的節點邊框色
.focus-animate,
.isActive {
  border: 8px solid var(--color-node-active);
  z-index: 5;
}

//節點(父、子)
.card {
  width: var(--width-card);
  height: var(--width-card);
  padding: 10px;
  background-color: var(--color-parent-node);
  font-size: 14px;
  cursor: pointer;
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  justify-items: center;
  align-items: center;
  border-radius: 10px;
  user-select: none;
  background-color: transparent;
  &.block-disable {
    opacity: 0.5;
    pointer-events: none;
    background-color: var(--color-node-disabled);
  }
}
//長方形的模板 Email / SMS模板
.rectangle-node {
  color: var(--color-node-text);
  width: var(--width-card);
  line-height: 0px;
  // height: 40px;
  padding: 20px 4px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  box-sizing: border-box; //讓被clicked的時候，節點高度不會跳動
  place-content: center;
  place-items: center;
  position: relative;
}
.tool-bar {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 40%;
  height: 100%;
  top: 0;
  right: -35%;
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
// 「+」號
.add-more-block-btn {
  all: unset;
  position: absolute;
  bottom: -24px;
  transform: translate(-50%, 0);
  z-index: 5;
  cursor: pointer;
}
</style>
