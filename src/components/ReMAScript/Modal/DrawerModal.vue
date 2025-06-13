<template>
  <teleport to="#app">
    <div class="modal-container">
      <div class="back-drop" @click="closeModal"></div>
      <teleport to="#app">
        <transition>
          <div class="content">
            <div class="header">
              <span
                class="close-arrow-btn cursor-pointer"
                @click="closeModal"
              ></span>
            </div>
            <slot>
              <p></p>
            </slot>
          </div>
        </transition>
      </teleport>
    </div>
  </teleport>
</template>
<script setup>
import { defineEmits } from "vue";
const emits = defineEmits(["closeModal"]);
function closeModal() {
  emits("closeModal");
}
</script>
<style scoped>
.modal-container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  z-index: 4;
}
.back-drop {
  background: #00000033;
  height: 100%;
  position: relative;
}
.content {
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: white;
  z-index: 6;
}
.header {
  width: 100%;
  height: 35px;
  background-color: #71afb6;
  border-radius: 0;
  display: flex;
  justify-content: center;
}
.close-arrow-btn {
  align-self: center;
}
.close-arrow-btn::before {
  content: url("../../../assets/downArrowWhite.svg");
}
.fade-enter-active,
.fade-leave-active {
  transform: translate(0, -300px);
  transition: all 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: translate(0, 0);
}
</style>
