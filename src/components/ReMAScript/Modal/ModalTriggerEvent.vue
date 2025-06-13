<template>
  <DrawerModal>
    <TriggerEventSetting @closeModal="closeModal()" v-show="step === 1" />
  </DrawerModal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
import DrawerModal from "../Modal/DrawerModal.vue";
import TriggerEventSetting from "./TriggerEventSetting.vue";

const emits = defineEmits(["closeModal"]);

const step = ref<number>(1);
function closeModal() {
  emits("closeModal");
}
</script>
