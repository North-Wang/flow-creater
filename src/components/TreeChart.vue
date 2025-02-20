<template>
  <table
    :class="[
      props.currentKey > 1 ? 'active_bg' : '',
      props.preview ? 'preview' : '',
    ]"
    v-if="data && Object.keys(data).length !== 0"
  >
    <!--主要父元素-->

    <tr class="" :class="[isConnectLineTransForm ? '' : '']">
      <td
        colspan="8"
        class="parent-node"
        :class="[
          props.data?.value?.disabledConnect ? 'hidden-line' : '',
          child_counts === 1 || !child_counts ? 'one-line' : 'two-line',
        ]"
      >
        <!--父節點的內容-->
        <div
          class=""
          @click="(event) => getCurrentKey(event)"
          @mouseenter="handleShowToolBar(props.data?.value)"
          @mouseleave="showToolBarHover = false"
          :data-id="props.data?.key"
          :data-attr="parentNodeType"
          :data-disable="props.data?.value?.disableFocus"
          :class="[
            props.currentKey === props.data?.key ? 'focus-animate' : '',
            activeLayer >= depth ? '' : 'block-disable',
            props.data?.value?.disActive ? 'block-disable' : '',
            isRectangleNode ? 'node-template' : 'card',
          ]"
          :style="{
            backgroundColor: returnInterfaceNodeColor(parentNodeType),
          }"
        >
          <slot name="root-node">
            <!--方塊顯示圖片-->
            <div
              :class="[
                !hasTitleData ? 'no-icon' : `${hasTitleData}-icon event-icon`,
              ]"
            ></div>
            <!--方塊顯示文字title-->
            <div>
              {{ hasTitleData || props.data?.value?.title }}
            </div>
          </slot>

          <!-- 父節點側邊的tool工具列-->
          <div class="tool-bar" v-if="props.isShowToolbar && showToolBarHover">
            <slot name="parent-node-toolbar" :node="node">
              <SvgEye
                :color="toolBarIconColor"
                @click="seeBlockPreview(props.data?.key)"
              ></SvgEye>
              <SvgPen :color="toolBarIconColor"></SvgPen>
              <SvgTrash
                :color="toolBarIconColor"
                @click="deleteBlock(props.data?.key)"
              ></SvgTrash>
            </slot>
          </div>
        </div>
        <!--方塊顯示樣板名稱hover和新增plus按鈕-->

        <button
          class="add-more-block-btn"
          v-if="isShowPlusButton"
          @mouseenter="showTemplateHover = true"
          @mouseleave="showTemplateHover = false"
          @click="
            (parentNodeType) => {
              emits('addNode', parentNodeType);
            }
          "
        >
          <img :src="iconAdd" alt="icon-add" />
          <!--樣板hover資訊-->
          <div
            class="template-infos"
            :class="[templatePlusButtonList?.length < 2 ? 'translate' : '']"
            v-show="showTemplateHover"
          >
            <div
              class="template-name"
              v-if="templatePlusButtonList?.[0]?.template_name"
              @click="
                onClickCreateNewNode(
                  props.data.key,
                  templatePlusButtonList?.[0],
                  templatePlusButtonList?.[0]?.side
                )
              "
            >
              {{ templatePlusButtonList?.[0]?.template_name }}
            </div>
            <div
              class="template-name"
              v-if="templatePlusButtonList?.[1]?.template_name"
              @click="
                onClickCreateNewNode(
                  props.data.key,
                  templatePlusButtonList?.[1],
                  templatePlusButtonList?.[1]?.side
                )
              "
            >
              {{ templatePlusButtonList?.[1]?.template_name }}
            </div>
          </div>
        </button>
      </td>
    </tr>

    <!--子節點-->
    <slot name="child-node">
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
            :isShowToolbar="props.isShowToolbar"
            :returnInterfaceNodeColor="returnInterfaceNodeColor"
            v-if="item.value"
            @clickNode="(id, block_type) => getCurrentKeyEmit(id, block_type)"
          />
        </td>
      </tr>
    </slot>
  </table>
  <slot name="no-data" v-else>
    <span>no data</span>
  </slot>
</template>

<script setup>
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  defineExpose,
  watch,
} from "vue";
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
   * 是否顯示預覽劇本side bar.
   * @const {Boolean}
   * */
  isShowToolbar: {
    type: Boolean,
    default: false,
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
    default: () => [],
  },
  //規則：那些節點的attr要顯示icon
  ruleHasNodeIcon: {
    type: Array,
    default: () => [],
  },
});

const isRectangleNode = computed(() => {
  return props.ruleRectangleNode.includes(parentNodeType.value) || false;
});

// 劇本樹狀圖root id
const root_id = ref("");
// 可以顯示操作tree table的劇本層數
const activeLayer = ref(2);
function getCurrentKeyEmit(id, block_type) {
  emits("clickNode", id, block_type);
}

function openNextLayer() {
  activeLayer.value++;
}
// 點擊任何的節點
function getCurrentKey(e) {
  console.log("點擊任何的節點");
  const target = e.target.classList.contains("card")
    ? e.target
    : e.target.parentNode;
  const id = target.dataset.id;
  const block_type = target.dataset?.attr;
  const disableFocus = target.dataset?.disable; // 回應事件前兩個節點不能動作
  // wether是否節點不能focus
  const excluded_block_attr = ["wether-yes", "wether-no"];
  if (!excluded_block_attr.includes(block_type) && !disableFocus) {
    target.classList.add("focus-animate");
    emits("clickNode", id, block_type);
  }
}
const plusButtonLists = computed(() => {
  if (props.data?.value?.data?.plusButtonList) {
    return props.data?.value?.data?.plusButtonList.map((item, index) => {
      const side = index === 0 ? "left" : "right";
      return {
        ...item,
        side: side,
      };
    });
  } else return [];
});
/**
 * @const {string} parentNodeType 節點的種類
 */
const parentNodeType = computed(() => props.data?.value?.attr);
/**
 * @const {string} depth 節點位於樹狀圖層數
 */
const depth = computed(() => props.data?.value?.depth);
// templatePlus + 號顯示的樣板名
const templatePlusButtonList = ref(plusButtonLists.value);
// 連接線位移調整
const isConnectLineTransForm = computed(() => {
  return props.data?.value?.depth >= 2 && props.data?.children?.length === 2;
});
/**
 * @const {number} child_counts 子節點數目
 */
const child_counts = computed(() => props.data?.children?.length || 0);
const showTemplateHover = ref(true);

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

// 是否顯示+號按鈕
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
 * mouse enter父節點 (需要更改)
 * @const {Object} blockData 節點主體tree node(包含attr/data/isActive)
 * @constant {Object} blockData.data 實際節點設定資料
 * @constant {string} blockData.data.event 回應事件
 * @constant {string} blockData.data.action 觸發投放渠道事件
 */
function handleShowToolBar(blockData) {
  /**
   * @const {boolean} hasSettingData 節點有無回應事件/觸發渠道事件
   */
  console.log("blockData", blockData);
  if (!blockData.data) {
    console.warn("沒有父節點的資料");
    showToolBarHover.value = false;
    return;
  }
  const hasSettingData = blockData.data.event || blockData.data.action;
  if (hasSettingData) {
    showToolBarHover.value = true;
  }
}
// 點擊+號創建新節點
function onClickCreateNewNode(id, templateData, side = "left") {
  showTemplateHover.value = false;
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
  createNewNode(id, newNodeData, side, templateData);
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
    height: 50px;
    aspect-ratio: 1;
    border: 2px dashed white;
    margin: auto;
    border-radius: 5px;
  }
  .event-icon {
    width: 50px;
    height: 40px;
    margin-top: 5px;
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

    //aaa 只有一個子節點
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
    //aaa 有兩個子節點
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

// 末端節點去除連接線
.hidden-line {
  &::after,
  &::before {
    display: none;
  }
}
//被選取的節點邊框色
.focus-animate,
.isActive {
  border: 8px solid var(--color-parent-node-active);
  z-index: 5;
}

//節點(父、子)
.card {
  width: var(--width-card);
  height: var(--width-card);
  padding: 10px;
  // color: #ffffff;
  background-color: var(--color-parent-node);
  font-size: 14px;
  cursor: pointer;
  position: relative; /*點擊事件等Email SMS提示*/
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: transparent;
  &.block-disable {
    opacity: 0.5;
    pointer-events: none;
    background-color: var(--color-node-disabled);
  }
}
// 模板類型的設定 Email / SMS模板
.node-template {
  color: #71afb6;
  width: var(--width-card);
  height: 40px;
  line-height: 0px;
  padding: 18px 7px;
  border-radius: 10px;
  .title {
    width: 100%;
    height: 30px;
    padding: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    top: -10px;
  }
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
  width: 200px;
  height: 50px;
  all: unset;
  position: absolute;
  bottom: -72%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  &::after {
    content: url("");
    width: 18px;
    height: 18px;
    border-radius: 50px;
    // background-color: white;
    background-image: var(--icon-url-add-more-block);
    display: inline-flex;
    top: 2px;
  }
  .template-name {
    width: 100%;
    padding: 4px 8px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover {
      background-color: #71afb6;
      color: white;
      border-radius: 4px;
    }
  }
}
</style>
