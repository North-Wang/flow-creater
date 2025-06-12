<template>
  <div class="w-full h-full relative">
    <div class="mb-4 absolute right-10 top-10 z-10">
      <button class="bg-blue-200 py-2 px-4 rounded-lg" @click="goFrontPage">
        回到前一頁
      </button>
    </div>
    <div class="w-full h-full relative">
      <VueFlow v-model="elements" :min-zoom="0.2" :max-zoom="4">
        <template #node-trigger-event="{ id, data, selected }">
          <NodeTriggerEvent />
        </template>
        <template #node-action="{ id, data, selected }">
          <NodeAction />
        </template>
      </VueFlow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { VueFlow, useVueFlow, Panel, Position } from "@vue-flow/core";
import { z } from "zod/v4";

//節點
import NodeTriggerEvent from "./NodeTriggerEvent.vue";
import NodeAction from "./NodeAction.vue";

//假資料
import { scriptDefault, scriptSchema, taskSchema } from "../../public/script";

interface Props {
  taskList?: z.infer<typeof taskSchema>[];
}
interface Emits {
  (e: "save"): void;
  (e: "cancel"): void;
}
const props = withDefaults(defineProps<Props>(), {
  taskList: () => [],
});
const emit = defineEmits<Emits>();
const elements = ref([
  {
    id: "node_1",
    type: "trigger-event",
    position: { x: 500, y: 0 },
    data: { nodeType: "trigger", label: "點擊設定事件" },
  },
  {
    id: "node_2",
    type: "action",
    position: { x: 400, y: 200 },
    data: { nodeType: "action", label: "點擊設定動作" },
  },
  {
    id: "node_3",
    type: "action",
    position: { x: 700, y: 200 },
    data: { nodeType: "action", label: "點擊設定動作" },
  },
]);

function goFrontPage() {
  emit("cancel");
}
</script>

<style lang="sass"></style>
