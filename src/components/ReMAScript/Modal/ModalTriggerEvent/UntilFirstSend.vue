<template>
  <div class="wrapper">
    <div class="flex-wrap">
      <label for="" class="selector-title">經過多少時間寄第一封</label>
      <div class="w-full flex gap-x-2">
        <input
          type="number"
          min="1"
          step="1"
          v-model="delayUntilFirstDeliverValue"
          @change="handleStartTimeValue(delayUntilFirstDeliverValue)"
          class="text-white"
        />
        <Dropdown
          :width="'100%'"
          :options="startTimeUnitOptions"
          :selectedValue="delayUntilFirstDeliverUnit"
          class="w-full"
          @select="handleStartTimeUnit"
        />
      </div>
    </div>

    <div v-if="trigger_event === 'recurring_scheduled'">
      <label for="" class="selector-title">條件開始的時間</label>
      <VueDatePicker
        v-model="startDate"
        :minDate="new Date()"
        :start-date="new Date()"
        :format="'MM/dd/yyy'"
        :enable-time-picker="false"
        is-expanded
        autoApply
      ></VueDatePicker>
    </div>
    <div class="button-wrap">
      <button
        class="button-basic-light btn-cancel"
        @click="injectRemoveTriggerEvent"
      >
        移除
      </button>
      <button
        type="submit"
        class="button-basic btn-next"
        @click="prepareSaveSetting()"
      >
        儲存
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, inject } from "vue";
import Dropdown from "../../../Dropdown/Dropdown.vue";
import dayjs from "dayjs";
import { z } from "zod";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  schemaStartTimeRelative,
  schemaStartTimeAbsolute,
  schemaSendStartTime,
} from "../../../../schemas/ReMaScript/schema.triggerEvent";

const injectRemoveTriggerEvent = inject("removeTriggerEvent");
const injectCloseModal = inject("closeTriggerEventModal");
const injectUpdateDelayUntilFirstDeliver = inject(
  "updateDelayUntilFirstDeliver"
);
const injectUpdateTriggerEvent = inject("updateTriggerEvent");

const {
  value: trigger_event,
  resetField: resetTriggerEvent,
  setValue: setEventName,
} = useField("trigger_event");
const {
  value: unit,
  errorMessage: delayUntilFirstDeliverUnitError,
  setValue: setUnit,
} = useField("unit");
const {
  value: deliverValue,
  errorMessage: delayUntilFirstDeliverValueError,
  setValue: setDeliverValue,
} = useField("value");
const {
  value: deliverDate,
  errorMessage: delayUntilFirstDeliverDateError,
  setValue: setDeliverDate,
} = useField("date");

interface Props {
  triggerEventSetting?: object;
}
const props = withDefaults(defineProps<Props>(), {});

const startTimeUnitOptions = ref([{ name: "天後", value: "天後" }]);
const delayUntilFirstDeliverValue = ref<number>(2);
const delayUntilFirstDeliverUnit = ref({ name: "天後", value: "天後" });
const startDate = ref(null);

/**
 * 輸入「經過多少時間寄第一封」的數值
 */
function handleStartTimeValue(value: number) {
  if (!Number.isInteger(value) || value === 0) {
    const roundedValue = Math.round(value);
    delayUntilFirstDeliverValue.value =
      roundedValue === 0 ? 1 : Math.round(value);
  }
  setDeliverValue(delayUntilFirstDeliverValue.value);
}

/**
 * 輸入「經過多少時間寄第一封」的單位
 */
function handleStartTimeUnit(unit: any) {
  if (!unit) return;
  delayUntilFirstDeliverUnit.value = unit;
  setUnit(unit?.value);
}

function validateFormData(schema) {
  // const result = schema.safeParse();
  // if (result.success) {
  //   console.log("驗證過資料完整", result.data);
  //   return true;
  // } else {
  //   console.warn("欄位未填寫完成", result.error.format());
  //   return false;
  // }
}
async function prepareSaveSetting() {
  console.log("aaa 準備儲存彈窗設定");
  injectCloseModal;
}

/**
 * 設定預設的formData設定
 * @description 當沒有先前儲存的【條件開始的時間】的資料，才要設定預設值
 */
function initFormDataWhenEmpty() {
  if (props.triggerEventSetting?.event !== "recurring_scheduled") {
    setUnit(delayUntilFirstDeliverUnit.value?.value);
    setDeliverValue(delayUntilFirstDeliverValue.value);
  }
}

//更新「條件開始的時間」
watch(startDate, (date) => {
  const newDate = dayjs(date).format("YYYY-MM-DD");
  setDeliverDate(newDate);
});

function isAllKeysUndefined(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).every((key) => !obj[key]);
}

onMounted(() => {});
</script>

<style scoped lang="scss">
.wrapper {
  // max-height: 275px;
  padding: 15px 80px 25px 80px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  color: black;
  gap: 100px;
  font-family: "Noto Sans TC";
  .selector {
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;
  }
  .selector-title {
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 15px;
    position: relative;
    display: flex;
  }
  .selector:last-of-type {
    margin-bottom: 0px;
  }

  .button-wrap {
    align-self: self-end;
    display: flex;
    gap: 25px;
    justify-content: end;
    button {
      min-width: 124px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
