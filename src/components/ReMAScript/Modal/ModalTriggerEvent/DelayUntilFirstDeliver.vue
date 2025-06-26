<template>
  <div class="wrapper">
    <div class="flex-wrap" v-if="triggerEventSetting?.event !== 'scheduled'">
      <label for="" class="selector-title">經過多少時間寄第一封</label>
      <div class="w-full flex gap-x-2">
        <input
          type="number"
          min="1"
          step="1"
          v-model="delayUntilFirstEmailValue"
          @change="handleStartTimeValue(delayUntilFirstEmailValue)"
          class="text-white"
        />
        <Dropdown
          :width="'100%'"
          :options="startTimeUnitOptions"
          :selectedValue="delayUntilFirstEmailUnit"
          class="w-full"
          @select="handleStartTimeUnit"
        />
      </div>
    </div>
    <div class="" v-if="triggerEventSetting?.event === 'scheduled'">
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
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  schemaStartTimeRelative,
  schemaStartTimeAbsolute,
  schemaSendStartTime,
} from "../../../../schemas/ReMaScript/schema.triggerEvent";

const injectRemoveTriggerEvent = inject("removeTriggerEvent");
const injectCloseModal = inject("closeTriggerEventModal");
let injectUpdateDelayUntilFirstDeliver = inject("updateDelayUntilFirstDeliver");
let injectUpdateTriggerEvent = inject("updateTriggerEvent");

//定義Form表單欄位、綁定資料
const {
  values: formData,
  handleSubmit,
  setValues,
  resetForm,
} = useForm({
  validationSchema: toTypedSchema(schemaSendStartTime),
});

const {
  value: delayUntilFirstDeliverUnit,
  errorMessage: delayUntilFirstDeliverUnitError,
  setValue: setDelayUntilFirstDeliverUnit,
} = useField("unit");
const {
  value: value,
  errorMessage: delayUntilFirstDeliverValueError,
  setValue: setDelayUntilFirstDeliverValue,
} = useField("value");
const {
  value: date,
  errorMessage: delayUntilFirstDeliverDateError,
  setValue: setDelayUntilFirstDeliverDate,
} = useField("date");

interface Props {
  triggerEventSetting: object;
}
const props = withDefaults(defineProps<Props>(), {});

const startTimeUnitOptions = ref([{ name: "天後", value: "天後" }]);
const delayUntilFirstEmailValue = ref<number>(2);
const delayUntilFirstEmailUnit = ref({ name: "天後", value: "天後" });
const startDate = ref(null);

/**
 * 輸入「經過多少時間寄第一封」的數值
 */
function handleStartTimeValue(value: number) {
  if (!Number.isInteger(value) || value === 0) {
    delayUntilFirstEmailValue.value = Math.round(value);
  }
  setDelayUntilFirstDeliverValue(delayUntilFirstEmailValue.value);
}

/**
 * 輸入「經過多少時間寄第一封」的單位
 */
function handleStartTimeUnit(unit: any) {
  if (!unit) return;
  delayUntilFirstEmailUnit.value = unit;
  setDelayUntilFirstDeliverUnit(unit?.value);
}

function validateFormData(schema) {
  const result = schema.safeParse(formData);

  if (result.success) {
    console.log("驗證過資料完整", result.data);
    return true;
  } else {
    console.warn("欄位未填寫完成", result.error.format());
    return false;
  }
}
async function prepareSaveSetting() {
  let data = {};
  switch (props.triggerEventSetting?.event) {
    case "sign":
    case "cart_abandonment":
    case "purchase":
      if (!validateFormData(schemaStartTimeRelative)) return;
      data = {
        value: value,
        unit: delayUntilFirstDeliverUnit,
      };
      break;
    case "scheduled":
      if (!validateFormData(schemaStartTimeAbsolute)) return;
      data = {
        date: date,
      };
      break;
    default:
      console.warn("未定義的觸發事件種類", props.triggerEventSetting?.event);
      break;
  }

  //依序更新資料
  await injectUpdateTriggerEvent(props.triggerEventSetting);
  await injectUpdateDelayUntilFirstDeliver(data);
  injectCloseModal();
}

//更新「條件開始的時間」
watch(startDate, (date) => {
  const newDate = dayjs(date).format("YYYY-MM-DD");
  setDelayUntilFirstDeliverDate(newDate);
});

onMounted(() => {
  console.warn("來自前一頁的設定", props.triggerEventSetting);
  if (props.triggerEventSetting?.event !== "scheduled") {
    setDelayUntilFirstDeliverUnit(delayUntilFirstEmailUnit.value?.value);
    setDelayUntilFirstDeliverValue(delayUntilFirstEmailValue.value);
  }
});
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
