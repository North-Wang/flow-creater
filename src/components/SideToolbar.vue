<template>
  <aside class="" :style="style" droppable="true">
    <div class="wra-button">
      <div
        class="item"
        v-for="[name, icon] in Object.entries(
          interfaceIcon.returnToolbarOptions(nodeType)
        )"
        :key="name"
      >
        <button
          class="button"
          :style="{ backgroundColor: interfaceNodeColor(nodeType) }"
          @click="selectBlock(name)"
        >
          <img :src="icon" :alt="name" />
        </button>
        <span class="select-none"> {{ name }}</span>
      </div>
    </div>
    <button type="submit" @click="submitBlock">確定</button>
  </aside>
</template>

<script setup>
import {
  ref,
  onMounted,
  provide,
  defineProps,
  defineEmits,
  Teleport,
} from "vue";
import { interfaceNodeColor } from "../utility/interfaceNode.js";
import { iconMap } from "../composables/HomePage/nodeSchema.js";
import iconSignUp from "../assets/icons/sign-up.svg";
import iconAfterSales from "../assets/icons/after-sales.svg";
import iconShoppingCar from "../assets/icons/shopping-car.svg";
import iconCycleTime from "../assets/icons/cycle-time.svg";

const emits = defineEmits(["select"]);
const props = defineProps({
  style: {
    type: Object,
    default: () => ({
      width: "200px",
      minHeight: "400px",
    }),
  },
  width: {
    type: String,
    default: "250px",
  },
  nodeType: {
    type: String,
    default: "trigger",
  },
});

const currentBlock = ref({});
const interfaceIcon = ref(new iconMap());

function selectBlock(block) {
  currentBlock.value = block;
}

/**
 * 選擇的節點種類
 * @param params
 */
function submitBlock() {
  if (!currentBlock.value || Object.keys(currentBlock.value).length === 0) {
    alert("未選擇任何選項");
    return;
  }
  console.log("提交", currentBlock.value);
  emits("select", currentBlock.value);
}
</script>

<style scoped lang="scss">
aside {
  background-color: white;
  padding: 12px;
  border-radius: 15px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1), 0 0 1px 0 rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-rows: 1fr 40px;
  row-gap: 12px;
}
.wra-button {
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  .item {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    button {
      // background-color: #baabe7;
      // width: 80px;
      width: 100%;
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      place-content: center;
      place-items: center;
      background-size: contain;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      align-self: center;
      border-radius: 10px;
      cursor: pointer;
      position: relative;
      &:focus::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2); /* 黑色半透明遮罩 */
        border-radius: inherit; /* 保持與按鈕相同的圓角 */
        pointer-events: none; /* 避免影響點擊 */
      }
    }
    img {
      width: var(--width-node-icon);
      aspect-ratio: 1;
      background-size: contain;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
    }
  }
}
button[type="submit"] {
  background-color: var(--color-button);
  border-radius: 10px;
  color: white;
  cursor: pointer;
}
</style>
