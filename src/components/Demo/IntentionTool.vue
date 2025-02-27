<template>
  <div class="item" v-for="item in toolList" :key="item?.name">
    <button class="button" @click="selectBlock(item?.name)">
      <!-- <img :src="item?.icon" :alt="item?.name" /> -->
    </button>
    <span class="select-none"> {{ item?.name }}</span>
  </div>
  <Modal
    :setBackgroundStyle="{ alignItems: 'end' }"
    :setModalStyle="{ width: '100%', borderRadius: '0' }"
    @closeModal="isShowModal = false"
    v-if="isShowModal"
  >
    <template #modalContent>
      <div class="wra-content grid-rows-2 gap-4">
        <h5>意圖選擇</h5>
        <input type="text" v-model="intention" />
        <h5>回應設定</h5>
        <!-- <input type="text" class="sentence" v-model="sentence" /> -->
        <textarea name="" id="" v-model="sentence"></textarea>
      </div>
    </template>
    <template #body-bottom>
      <button class="mt-4" @click="saveData">儲存</button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { interfaceNodeColor } from "../../utility/interfaceNode.js";
import Modal from "../Modal.vue";

const emits = defineEmits(["select", "save"]);
const toolList = ref([
  { name: "猶豫", icon: "" },
  { name: "購物", icon: "" },
  { name: "放入清單", icon: "" },
]);
const isShowModal = ref(false);

const intention = ref("購物");
const sentence = ref(
  "大俠艾吃漢堡包！漢堡包！她們說我是宅男 我只是喜歡蹲在家裡種種花草養養雞 擦擦桌椅掃掃地清晨五點早早起 慢跑舞劍耍太極雙截棍練身體 瘀青藏在衣服裡愛吃炸雞不吃皮 小心計算卡路里直到那天看到妳 站在櫃台笑嘻嘻我兩眼發直走進去(你好，要來個漢堡嗎？ )"
);

function selectBlock(block) {
  isShowModal.value = true;
  intention.value = block;
  emits("select", block);
}

function saveData() {
  emits("save", {
    title: intention.value,
    sentence: sentence.value,
  });
  isShowModal.value = false;
}
</script>

<style scoped lang="scss">
.item {
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  button {
    background-color: #76d37a;
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
}
.wra-content {
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-rows: 40px 1fr;
  align-items: center;
}
.sentence {
  border: 1px solid #c4c4c4;
  border-radius: 10px;
  min-height: 200px;
}
textarea {
  resize: none;
  padding: 8px;
}
</style>
