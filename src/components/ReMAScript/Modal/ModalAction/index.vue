<template>
  <DrawerModal @closeModal="removeAction">
    <Frequency />
  </DrawerModal>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch, computed, provide, inject } from "vue";
import DrawerModal from "../../Modal/DrawerModal.vue";
import Frequency from "./Frequency.vue";

function removeAction(params: type) {
  console.warn("清空action");
}
</script>
