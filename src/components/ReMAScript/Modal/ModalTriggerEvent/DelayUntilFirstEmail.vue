<template>
  <div class="selector flex-wrap" v-if="event !== 'scheduled'">
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
  <div class="selector" v-if="event === 'scheduled'">
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
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Dropdown from "../../../Dropdown/Dropdown.vue";

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
  (
    e: "update",
    payload: {
      value: number;
      unit: Unit;
    }
  ): void;
}
const emits = defineEmits<Emits>();

/**
 * 輸入「經過多少時間寄第一封」的數值
 */
function handleStartTimeValue(value: number) {
  if (!Number.isInteger(value) || value === 0) {
    delayUntilFirstEmailValue.value = Math.round(value);
  }
}

/**
 * 輸入「經過多少時間寄第一封」的單位
 */
function handleStartTimeUnit(unit: any) {
  if (!unit) return;
  delayUntilFirstEmailUnit.value = unit;
}

watch(
  [delayUntilFirstEmailValue, delayUntilFirstEmailUnit],
  ([value, unit]) => {
    emits("update", {
      unit,
      value,
    });
  }
);

watch(startDate, (date) => {
  console.log("aaa date", date);
});
</script>

<style scoped lang="scss">
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
</style>
