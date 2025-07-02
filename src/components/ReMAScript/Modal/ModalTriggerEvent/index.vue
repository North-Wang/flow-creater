<template>
  <DrawerModal @closeModal="injectRemoveTriggerEvent">
    <EventTypeForm @nextStep="handleNextStep" v-show="step === 1" />
    <UntilFirstSend
      :triggerEventSetting="triggerEventSetting"
      v-show="step === 2"
    />
  </DrawerModal>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch, computed, provide, inject } from "vue";
import DrawerModal from "../../Modal/DrawerModal.vue";
import EventTypeForm from "./EventTypeForm.vue";
import UntilFirstSend from "./UntilFirstSend.vue";
import { schemaTriggerEvent } from "../../../../schemas/ReMaScript/schema.triggerEvent";

const injectRemoveTriggerEvent = inject("removeTriggerEvent");
const step = ref<number>(1);
const triggerEventSetting = ref<object>();
function handleNextStep(data: typeof schemaTriggerEvent) {
  step.value = 2;
  triggerEventSetting.value = data;
}
</script>
