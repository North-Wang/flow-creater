<template>
  <aside
    class="wrapper"
    :style="style"
    droppable="true"
    @drop="(event) => receiveDropData(event)"
    @dragover="(e) => e.preventDefault()"
  >
    工具列
    <slot name="content"></slot>
  </aside>
</template>

<script setup>
import { ref, onMounted, provide, defineProps, Teleport } from "vue";
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
});

async function receiveDropData(e) {
  e.preventDefault();
  console.log("拖曳drop 偵測到接收方塊");
}
</script>

<style scoped lang="scss">
.wrapper {
  background-color: white;
  padding: 12px;
  border-radius: 15px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1), 0 0 1px 0 rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(1fr);
  // left: 0;
  // top: 0;
}
</style>
