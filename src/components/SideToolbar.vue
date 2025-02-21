<template>
  <aside
    class="wrapper"
    :style="style"
    droppable="true"
    @drop="(event) => receiveDropData(event)"
    @dragover="(e) => e.preventDefault()"
  >
    工具列
    <div class="wra-block">
      <slot name="content">
        <div v-for="block in props.tools" :key="block">
          {{ block?.name }}
        </div>
      </slot>
    </div>

    <button>確定</button>
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
  tools: {
    type: Array,
    default: () => {
      [{ name: "Email" }, { name: "SMS" }];
    },
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
  display: flex;
  flex-direction: column;
  // display: grid;
  // grid-template-columns: 1fr;
  // grid-template-rows: repeat(1fr);
  justify-content: space-between;
  height: 100%;
  // left: 0;
  // top: 0;
}
.wra-block {
  display: flex;
  flex-direction: column;
}
</style>
