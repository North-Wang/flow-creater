<script setup>
import { ref, onMounted } from "vue";
import { VueFlow, useVueFlow, Panel, Position } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { ControlButton, Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { NodeToolbar } from "@vue-flow/node-toolbar";
import NodeTriggerEvent from "../components/ReMAScript/NodeTriggerEvent.vue";
import NodeAction from "../components/ReMAScript/NodeAction.vue";

const {
  onInit,
  onNodeDragStop,
  onConnect,
  addEdges,
  setViewport,
  toObject,
  onNodeClick,
  fitView,
  onPaneReady,
} = useVueFlow();

const elements = ref([
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "trigger-event",
    data: { nodeType: "trigger", label: "Node 1" },
  },
  {
    id: "2",
    position: { x: -100, y: 150 },
    type: "action",
    data: { label: "Node 2" },
  },
  {
    id: "3",
    position: { x: 100, y: 150 },
    type: "template",
    data: { label: "Node 3" },
    targetPosition: "top",
    sourcePosition: "bottom",
    connectable: 1,
  },
  {
    id: "4",
    position: { x: 100, y: 500 },
    type: "default",
    data: { label: "Node 4" },
    targetPosition: "top",
    sourcePosition: "bottom",
    connectable: 1,
  },
  {
    id: "e1-2",
    type: "step",
    source: "1",
    target: "2",
    class: "dark",
    animated: true,
  },
  {
    id: "e1-3",
    type: "step",
    source: "1",
    target: "3",
    class: "dark",
    animated: true,
  },
]);
onNodeClick(({ node }) => {
  console.log("on node  click", node);
});
onPaneReady((instance) => instance.fitView());

onInit((vueFlowInstance) => {
  vueFlowInstance.fitView();
});

onNodeDragStop(({ event, nodes, node }) => {
  console.log("Node Drag Stop", { event, nodes, node });
});

onConnect((connection) => {
  console.log("aaa 驗證是否可以連接", connection);
  addEdges(connection);
});

function removeEdge(id) {
  edges.value = edges.value.filter((edge) => edge.id !== id);
}

/**
 * 顯示目前的劇本資料
 */
function showCurrentScript() {
  console.log("目前劇本的資料", elements.value);
}

onMounted(() => {
  fitView();
});
</script>

<template>
  <button @click="showCurrentScript">顯示目前的劇本</button>
  <div class="h-[800px]">
    <VueFlow
      v-model="elements"
      class="basic-flow"
      :default-viewport="{ zoom: 0.5 }"
      :min-zoom="0.2"
      :max-zoom="4"
    >
      <Background pattern-color="#aaa" :gap="20" :height="100" :width="100" />

      <!-- <NodeToolbar /> -->
      <MiniMap class="w-fit h-fit fixed left-0 top-[40px]" />
      <template #connection-line="connectionLineProps">
        <div>line</div>
      </template>
      <!-- <Controls /> -->
      <Controls class="fixed right-0 top-0" position="top-left">
        <!-- <ControlButton title="Reset Transform" @click="resetTransform">
          <div>resetTransform</div>
        </ControlButton>

        <ControlButton title="Shuffle Node Positions" @click="updatePos">
          <div>updatePos</div>
        </ControlButton>

        <ControlButton title="Toggle Dark Mode" @click="toggleDarkMode">
          <div>toggleDarkMode</div>
        </ControlButton>

        <ControlButton title="Log `toObject`" @click="logToObject"
          ><div>logToObject</div>
        </ControlButton> -->
      </Controls>
      <template #node-trigger-event="{ id, data, selected }">
        <NodeTriggerEvent />
      </template>

      <template #node-action="{ id, data, selected }">
        <NodeAction />
      </template>
    </VueFlow>
  </div>
</template>

<style scoped>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
.vue-flow__node-custom {
  background: purple;
  color: white;
  border: 1px solid purple;
  border-radius: 4px;
  box-shadow: 0 0 0 1px purple;
  padding: 8px;
}
</style>
