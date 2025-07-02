<template>
  <KeepAlive>
    <DrawerModal @closeModal="injectCloseTriggerEventModal">
      <EventTypeForm @nextStep="handleNextStep" v-if="step === 1" />
      <UntilFirstSend v-if="step === 2" />
    </DrawerModal>
  </KeepAlive>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch, computed, provide, inject } from "vue";
import DrawerModal from "../../Modal/DrawerModal.vue";
import EventTypeForm from "./EventTypeForm.vue";
import UntilFirstSend from "./UntilFirstSend.vue";
import { schemaTriggerEvent } from "../../../../schemas/ReMaScript/schema.triggerEvent";

const injectCloseTriggerEventModal = inject("closeTriggerEventModal");
const step = ref<number>(1);
function handleNextStep() {
  step.value = 2;
}
</script>
