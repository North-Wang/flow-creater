<template>
  <table
    class="script-table"
    :class="[
      props.currentKey > 1 ? 'active_bg' : '',
      props.preview ? 'preview' : '',
    ]"
    v-if="data && Object.keys(data).length !== 0"
  >
    <!--主要父元素-->
    <slot name="parent-node">
      <tr class="" :class="[isConnectLineTransForm ? 'transform' : '']">
        <td
          colspan="8"
          class="parent-node"
          :class="[
            props.data?.value?.disabledConnect ? 'hidden-line' : '',
            child_counts === 1 || !child_counts ? 'one-line' : 'two-line',
          ]"
        >
          <!--劇本步驟方塊-->
          <div
            class="card"
            @click="(event) => getCurrentKey(event)"
            @mouseenter="handleShowToolBar(props.data?.value)"
            @mouseleave="showToolBarHover = false"
            :data-id="props.data?.key"
            :data-attr="parentNodeType"
            :data-disable="props.data?.value?.disableFocus"
            :class="[
              parentNodeType,
              props.currentKey === props.data?.key ? 'focus-animate' : '',
              props.activeLayer >= depth ? '' : 'block-disable',
              props.data?.value?.disActive ? 'block-disable' : '',
            ]"
          >
            <!--方塊顯示圖片-->
            <div
              :class="[
                !hasTitleData
                  ? 'default-block'
                  : `${hasTitleData}-icon event-icon`,
              ]"
              v-if="isNotTemplateOrWetherBlock"
            ></div>
            <!--方塊顯示文字title-->
            <div
              :class="[parentNodeType === 'template' ? 'template-title' : '']"
            >
              {{ hasTitleData || props.data?.value?.title }}
            </div>
            <!-- 父節點側邊的tool工具列-->
            <div
              class="tool-bar"
              v-if="props.isShowToolbar && showToolBarHover"
            >
              <slot name="parent-node-toolbar">
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
          >
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
    </slot>

    <!--子節點-->
    <slot name="child-node">
      <tr
        class="script-child-row"
        v-if="props.data?.children"
        :class="[isConnectLineTransForm ? 'transform' : '']"
      >
        <td
          class="child card script-child-col relative flex justify-center"
          v-for="item in props.data?.children"
          :key="item.key"
          :class="[props.data?.children?.length === 1 ? 'one-child' : 'child']"
        >
          <tree-chart
            :data="item"
            :currentKey="props.currentKey"
            :activeLayer="props.activeLayer"
            :isShowToolbar="props.isShowToolbar"
            v-if="item.value"
            @getCurrentKey="
              (id, block_type) => getCurrentKeyEmit(id, block_type)
            "
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
import { ref, computed, defineProps } from "vue";
// import treeChart from "@/TreeChart.vue";
import SvgEye from "./icon/SvgEye.vue";
import SvgTrash from "./icon/SvgTrash.vue";
import SvgPen from "./icon/SvgPen.vue";

const props = defineProps({
  /**
   * 樹狀圖資料.
   * @const {object} data 樹狀圖資料
   * */
  data: {
    type: Object,
    default: () => ({
      children: [],
      key: 1,
      parent: {},
      value: {},
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
   * 可以顯示操作tree table的劇本層數.
   * @const {number}
   * */
  activeLayer: {
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
});
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
const showTemplateHover = ref(false);

//顯示父節點側邊的工具列
const showToolBarHover = ref(false);

/**
 * 顯示劇本節點資料
 * @return {string}  劇本節點資料字串
 */
const hasTitleData = computed(() => {
  return true;
});

// 判斷是否為樣板方塊/是否方塊 (需要更改)
const isNotTemplateOrWetherBlock = computed(() => {
  const includeBlockAttr = ["template", "wether_no", "wether_yes"];
  return !includeBlockAttr.includes(props.data?.value?.attr);
});

// 是否顯示+號按鈕
const isShowPlusButton = computed(() => {
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
    console.warn("沒有");
    return;
  }
  // const hasSettingData = blockData.data.event || blockData.data.action;
  // if (hasSettingData) {
  //   showToolBarHover.value = true;
  // }
}
</script>

<style scoped lang="scss">
.parent-node {
  display: flex;
  justify-content: center;
  position: relative;
  &.one-line {
    &::before {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -30px;
      height: 30px;
      border-left: 2px solid rgb(159, 186, 202);
      transform: translate3d(-1px, 0, 0);
    }
  }
  &.two-line {
    &::before {
      content: "";
      position: absolute;
      left: 55%;
      bottom: -48px;
      height: 50px;
      border-left: 2px solid rgb(159, 186, 202);
      transform: translate3d(-1px, 0, 0);
    }
    &::after {
      content: "";
      position: absolute;
      left: 45%;
      bottom: -48px;
      height: 50px;
      border-left: 2px solid rgb(159, 186, 202);
      transform: translate3d(-1px, 0, 0);
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

//節點
.card {
  width: 120px;
  height: 120px;
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
  // background-color: transparent;
  &.block-disable {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
