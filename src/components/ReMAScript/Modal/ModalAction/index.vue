<template>
  <DrawerModal @closeModal="removeAction">
    <div class="wrapper">
      <Frequency />
      <SendTime />
      <div>123</div>
    </div>
  </DrawerModal>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch, computed, provide, inject } from "vue";
import DrawerModal from "../../Modal/DrawerModal.vue";
import Frequency from "./Frequency.vue";
import SendTime from "./SendTime.vue";

function removeAction() {
  console.warn("清空action");
}
</script>

<style scoped>
.wrapper {
  padding: 15px 80px 25px 80px;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  color: black;
  gap: 50px;
  .selector {
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;
  }
  .selector-title {
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 15px;
    position: relative;
    display: flex;
    color: #71afb6;
  }
}
</style>
