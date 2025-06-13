<template>
  <ul class="modal-container" ref="target">
    <li class="modal-main" style="position: relative">
      <ul class="modal-title"></ul>
      <ul class="modal-body">
        <div class="font-14">資料觸發:</div>
        <li class="list-align list-text">
          會以後台資料庫收到的新資料為基礎，入庫後系統會依照自動化劇本的條件，偵測是否觸發該劇本內容並執行
        </li>
        <li class="list-align list-text">
          注意若客戶資料傳輸給CDP的時間不即時或不定，將會有延遲寄信的問題。
        </li>
        <br />
        <li class="font-14">API觸發:</li>
        <li class="list-align list-text">
          成功串接First
          CDP所提供的API，觸發判斷後將偵測是否觸發該劇本內容並執行。
        </li>
        <li class="list-align list-text">
          將會大幅減少延遲寄信的問題，使用此方式來達到最佳劇本溝通效果。
        </li>
        <li class="list-align list-text">
          API串接細節請與負責窗口聯繫，建議客戶需有技術人員來完成此串接。
        </li>
        <li class="container-arrow" style=""></li>
      </ul>
    </li>
  </ul>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { onClickOutside } from "@vueuse/core";

const emit = defineEmits(["closeAlertModal"]);
const target = ref(null);

const closeModal = () => emit("closeAlertModal");
onClickOutside(target, () => {
  closeModal();
});
const notShowModal = ref(false);
</script>

<style scoped>
.modal-container {
  z-index: 10;
  border-radius: 10px;
  width: 544px;
  position: absolute;
  left: 105px;
  bottom: -72px;
  z-index: 100;
}
.modal-main {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
.modal-title {
  background: #63a7c8;
  height: 20px;
  border-radius: 10px 10px 0 0;
}
.modal-body {
  padding: 15px 11px;
  font-size: 14px;
  font-weight: 400;
  font-family: "Noto Sans TC";
  color: #575757;
}
.mt-25 {
  margin-top: 25px;
}
.list-align {
  list-style-type: disc;
  list-style-position: outside;
  margin-left: 25px;
}
.list-text {
  line-height: 20px;
  font-weight: 400;
  font-family: "Noto Sans TC";
}
.container-arrow {
  /* Invisible by default */
  opacity: 1;
  pointer-events: none;
  border: 8px solid transparent;
  left: -0.5%;
  bottom: 85px;
  position: absolute;
  transform: translate(-68%, 7px) rotate(90deg);
  height: 0;
  width: 0;
  z-index: 10;
  border-top-color: white;
}
</style>
