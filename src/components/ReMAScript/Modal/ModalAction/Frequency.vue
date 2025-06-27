<template>
  <div class="wrapper gap-20">
    <div class="selector flex-wrap" :style="styleSpecialWrapper">
      <label for="" class="selector-title">發送方式</label>

      <div class="flex gap-6">
        <div v-for="opt in sendTypeOptions" :key="opt?.value" class="flex">
          <input
            type="radio"
            :id="opt?.value"
            :value="opt?.value"
            class="mr-4"
            v-model="currentSendTimeType"
          />
          <label :for="opt?.value" class="cursor-pointer whitespace-nowrap">{{
            opt?.name
          }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const sendTypeOptions = ref([
  {
    value: "once",
    name: "一次性投放",
  },
  {
    value: "recurrence",
    name: "週期性投放",
  },
]);
</script>

<style scoped lang="scss">
.wrapper {
  padding: 15px 80px 25px 80px;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  color: black;
  gap: 50px;
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
    color: #71afb6;
  }
  // .selector:last-of-type {
  //   margin-bottom: 0px;
  // }

  // .button-wrap {
  //   align-self: self-end;
  //   display: flex;
  //   gap: 25px;
  //   button {
  //     min-width: 124px;
  //     display: flex;
  //     justify-content: center;
  //     align-items: center;
  //   }
  // }
}
</style>
