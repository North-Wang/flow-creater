<template>
  <DrawerModal @closeModal="removeAction">
    <div>13</div>
  </DrawerModal>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch, computed, provide, inject } from "vue";
import DrawerModal from "../../Modal/DrawerModal.vue";

function removeAction(params: type) {
  console.warn("清空action");
}
</script>
