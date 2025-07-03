<template>
  <div class="grid gap-5 select-none">
    <label for="" class="selector-title">寄完第一封後</label>
    <section class="flex gap-5 place-items-center">
      <div class="whitespace-nowrap">發生周期</div>
      <div class="flex bg-[#EAF3F4] place-items-center rounded-[10px]">
        <button
          v-for="opt in cycleOption"
          :key="opt?.value"
          class="py-2 px-5 rounded-[10px]"
          :class="
            cycle_unit === opt?.value
              ? 'bg-[#71AFB6] text-white'
              : 'bg-[#EAF3F4]'
          "
        >
          {{ opt?.name }}
        </button>
      </div>
    </section>
    <section class="flex gap-5 items-center grid-cols-[1fr_auto]">
      <div v-if="cycle_unit === 'day'">每</div>
      <input
        type="number"
        name=""
        id=""
        step="1"
        min="0"
        class="bg-blue-200"
        v-model="cycle_frequency"
        v-if="cycle_unit === 'day'"
      />
      <Dropdown
        :width="'100%'"
        :selectedValue="{ name: selectedFrequency, value: cycle_frequency }"
        :options="frequencyOptions"
        v-if="cycle_unit !== 'day'"
      />

      <div class="whitespace-nowrap">
        <span v-if="cycle_unit === 'day'">天 ，</span>投放一次
      </div>
    </section>
    <section>
      <VueDatePicker
        v-model="cycle_time"
        :format="'HH:mm'"
        time-picker
        :clearable="false"
      />
    </section>
    <section class="grid grid-cols-[auto+1fr_auto]">
      <div class="mr-[25px]">結束次數</div>
      <input type="number" v-model="max_run_times" class="mr-2 bg-blue-200" />
      <div>次</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, inject, onMounted } from "vue";
import { useField } from "vee-validate";
import Dropdown from "../../../Dropdown/Dropdown.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import { format } from "@storybook/blocks";

const { value: cycle_unit } = useField("cycle_unit");
const { value: cycle_frequency } = useField("cycle_frequency");
const { value: cycle_time } = useField("cycle_time");
const { value: max_run_times } = useField("max_run_times");

const cycleOption = ref([
  {
    name: "年",
    value: "year",
  },
  {
    name: "月",
    value: "month",
  },
  {
    name: "週",
    value: "week",
  },
  {
    name: "日",
    value: "day",
  },
]);
//顯示在UI上的文字
const selectedFrequency = computed(() => {
  switch (cycle_unit.value) {
    case "year":
      return "每" + cycle_frequency.value + "年";
    case "month":
      return "每" + cycle_frequency.value + "個月";
    case "week":
      return "每" + cycle_frequency.value + "週";
    case "day":
      return cycle_frequency.value;
    default:
      return "每" + cycle_frequency.value + cycle_unit.value;
  }
});
const frequencyOptions = computed(() => {
  let options = [];
  switch (cycle_unit.value) {
    case "year":
      for (let i = 1; i <= 3; i++) {
        options.push({ name: `每${i}年`, value: i });
      }
      break;
    case "month":
      for (let i = 1; i <= 11; i++) {
        options.push({ name: `每${i}個月`, value: i });
      }
      break;
    case "week":
      for (let i = 1; i <= 11; i++) {
        options.push({ name: `每${i}週`, value: i });
      }
      break;
    default:
      break;
  }
  return options;
});

onMounted(() => {});
</script>

<style scoped lang="scss">
.selector-title {
  font-size: 18px;
  font-weight: 400;
  position: relative;
  display: flex;
  color: #71afb6;
}
</style>
