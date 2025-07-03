<template>
  <div class="wrapper">
    <div
      class="flex-wrap"
      v-if="values?.trigger_event !== 'recurring_scheduled'"
    >
      <label for="" class="selector-title">經過多少時間寄第一封</label>
      <div class="w-full flex gap-x-2">
        <input
          type="number"
          min="1"
          step="1"
          v-model="firstSendValue"
          @change="handleStartTimeValue(firstSendValue)"
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

    <div v-if="values?.trigger_event === 'recurring_scheduled'">
      <label for="" class="selector-title">條件開始的時間</label>
      <VueDatePicker
        v-model="startDate"
        :minDate="new Date()"
        :start-date="new Date()"
        :format="'MM/dd/yyy'"
        :enable-time-picker="false"
        :clearable="false"
        is-expanded
        autoApply
      ></VueDatePicker>
      <div class="error-msg" v-if="firstSendDateError">
        {{ firstSendDateError }}
      </div>
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
import { useFieldError } from "vee-validate";
const firstSendDateError = useFieldError("first_send_date");

const injectRemoveTriggerEvent = inject("removeTriggerEvent");
const values = inject("values");
const setValues = inject("setValues");
const validateField = inject("validateField");

const closeTriggerEventModal = inject("closeTriggerEventModal");

interface Props {}
const props = withDefaults(defineProps<Props>(), {});

const startTimeUnitOptions = ref([{ name: "天後", value: "天後" }]);
const firstSendValue = ref<number>(2);
const delayUntilFirstDeliverUnit = ref({ name: "天後", value: "天後" });
const startDate = ref(null);

/**
 * 輸入「經過多少時間寄第一封」的數值
 */
function handleStartTimeValue(value: number) {
  if (!Number.isInteger(value) || value === 0) {
    const roundedValue = Math.round(value);
    firstSendValue.value = roundedValue === 0 ? 1 : Math.round(value);
  }
  setValues({ first_send_value: firstSendValue.value });
}

/**
 * 輸入「經過多少時間寄第一封」的單位
 */
function handleStartTimeUnit(unit: any) {
  if (!unit) return;
  delayUntilFirstDeliverUnit.value = unit;
  setValues({ first_send_unit: unit?.value });
}

async function prepareSaveSetting() {
  const field =
    values.trigger_event === "recurring_scheduled"
      ? ["first_send_date"]
      : ["first_send_value", "first_send_unit"];
  const res = await Promise.all(field.map((f) => validateField(f)));
  const allValid = res.every((r) => {
    return r?.valid === true;
  });
  if (allValid) {
    closeTriggerEventModal();
  } else {
    console.warn("未通過驗證");
  }
}

function setDefaultValue() {
  if (values?.trigger_event !== "recurring_scheduled") {
    setValues({ first_send_value: 2, unit: "天後" });
  }
}

//更新「條件開始的時間」
watch(startDate, (date) => {
  const newDate = dayjs(date).format("YYYY-MM-DD");
  setValues({ first_send_date: newDate });
});

onMounted(() => {
  setDefaultValue();
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

.error-msg {
  // position: absolute;
  font-size: 12px;
  top: 40px;
  color: red;
}
</style>
