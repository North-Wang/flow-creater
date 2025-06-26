<template>
  <DrawerModal @closeModal="injectRemoveTriggerEvent">
    <EventTypeForm @nextStep="handleNextStep" v-if="step === 1" />
    <DelayUntilFirstDeliver :event="currentEvent" v-if="step === 2" />
  </DrawerModal>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch, computed, provide, inject } from "vue";
import DrawerModal from "../../Modal/DrawerModal.vue";
import EventTypeForm from "./EventTypeForm.vue";
import DelayUntilFirstDeliver from "./DelayUntilFirstDeliver.vue";
import {
  typeTriggerEvent,
  schemaTriggerEvent,
} from "../../../../schemas/ReMaScript/schema.triggerEvent";

const injectRemoveTriggerEvent = inject("removeTriggerEvent");
const step = ref<number>(1);
const currentEvent = ref<typeof typeTriggerEvent>("sign");
function handleNextStep(data: typeof schemaTriggerEvent) {
  step.value = 2;
  currentEvent.value = data?.event;
}
</script>
