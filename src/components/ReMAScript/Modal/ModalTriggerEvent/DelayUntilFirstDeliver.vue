<template>
  <div class="wrapper">
    <div class="flex-wrap" v-if="event !== 'scheduled'">
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
    <div class="" v-if="event === 'scheduled'">
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
        下一步
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
import { schemaTriggerEvent } from "../../../../schemas/ReMaScript/schema.triggerEvent";
const injectRemoveTriggerEvent = inject("removeTriggerEvent");
//定義Form表單欄位、綁定資料
const {
  values: formData,
  handleSubmit,
  setValues,
  resetForm,
} = useForm({
  validationSchema: toTypedSchema(schemaTriggerEvent),
});

const {
  value: delayUntilFirstDeliverUnit,
  errorMessage: delayUntilFirstDeliverUnitError,
  setValue: setDelayUntilFirstDeliverUnit,
} = useField("delayUntilFirstDeliverUnit");
const {
  value: delayUntilFirstDeliverValue,
  errorMessage: delayUntilFirstDeliverValueError,
  setValue: setDelayUntilFirstDeliverValue,
} = useField("delayUntilFirstDeliverValue");
const {
  value: delayUntilFirstDeliverDate,
  errorMessage: delayUntilFirstDeliverDateError,
  setValue: setDelayUntilFirstDeliverDate,
} = useField("delayUntilFirstDeliverDate");
const {
  value: delayUntilFirstDeliver,
  errorMessage: delayUntilFirstDeliverError,
  setValue: setDelayUntilFirstDeliver,
} = useField("delayUntilFirstDeliver");

interface Props {
  event: string;
}
const props = withDefaults(defineProps<Props>(), {
  event: "sign",
});

const startTimeUnitOptions = ref([{ name: "天後", value: "天後" }]);
const delayUntilFirstEmailValue = ref<number>(2);
const delayUntilFirstEmailUnit = ref({ name: "天後", value: "天後" });
const startDate = ref(null);
type Unit = typeof delayUntilFirstEmailUnit.value;

interface Emits {
  (e: "updateDelayUnit", value: string): void;
  (e: "updateDelayValue", value: number): void;
  (e: "updateDelayDate", value: string): void;
}
const emits = defineEmits<Emits>();

/**
 * 輸入「經過多少時間寄第一封」的數值
 */
function handleStartTimeValue(value: number) {
  if (!Number.isInteger(value) || value === 0) {
    delayUntilFirstEmailValue.value = Math.round(value);
  }
  emits("updateDelayValue", delayUntilFirstEmailValue.value);
}

/**
 * 輸入「經過多少時間寄第一封」的單位
 */
function handleStartTimeUnit(unit: any) {
  if (!unit) return;
  delayUntilFirstEmailUnit.value = unit;
  emits("updateDelayUnit", unit?.value);
}

async function prepareSaveSetting() {
  console.log("aaa 準備更新開始的時間");
}

//更新「條件開始的時間」
watch(startDate, (date) => {
  const newDate = dayjs(date).format("YYYY-MM-DD");
  emits("updateDelayDate", newDate);
});

onMounted(() => {
  if (props.event !== "scheduled") {
    emits("updateDelayValue", delayUntilFirstEmailValue.value);
    emits("updateDelayUnit", delayUntilFirstEmailUnit.value?.value);
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
