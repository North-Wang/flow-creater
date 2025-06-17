<template>
  <div class="step-edge">
    <svg>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#b1b1b7" />
        </marker>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@vue-flow/core";

interface Props {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: any;
  targetPosition: any;
  data?: any;
  selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
});

const [edgePath, labelX, labelY] = getBezierPath({
  sourceX: props.sourceX,
  sourceY: props.sourceY,
  sourcePosition: props.sourcePosition,
  targetX: props.targetX,
  targetY: props.targetY,
  targetPosition: props.targetPosition,
});
</script>

<style scoped lang="scss">
.step-edge {
  :deep(path) {
    @apply stroke-gray-400 stroke-2;
    marker-end: url(#arrowhead);

    &.selected {
      @apply stroke-blue-500;
    }
  }
}
</style>
