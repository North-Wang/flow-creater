<template>
  <div class="">
    <div class="selector flex-wrap">
      <label for="" class="selector-title">發送方式</label>

      <div class="flex gap-6">
        <div v-for="opt in sendTypeOptions" :key="opt?.value" class="flex">
          <input
            type="radio"
            :id="opt?.value"
            :value="opt?.value"
            class="mr-4"
            v-model="send_type"
          />
          <label :for="opt?.value" class="cursor-pointer whitespace-nowrap">{{
            opt?.name
          }}</label>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="text-red-500 mt-2">發送方式選擇錯誤</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, inject } from "vue";
import { useField } from "vee-validate";
import { typeSendType } from "../../../../schemas/ReMaScript/schema.sendTime";
// let injectValidateField = inject("validateField") as (
//   field: string
// ) => Promise<void> | void;

const { value: send_type, errorMessage, validate } = useField("send_type");

const sendTypeOptions = ref([
  {
    value: "once",
    name: "一次性投放",
  },
  {
    value: "recurrence",
    name: "週期性投放",
  },
  // {
  //   value: "wrong",
  //   name: "錯誤",
  // },
]);
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
  color: #71afb6;
}
</style>
