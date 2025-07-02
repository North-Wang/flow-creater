<template>
  <DrawerModal @closeModal="injectCloseActionModal">
    <div class="wrapper">
      <Frequency />
      <AfterFirstSend />
      <!-- <ExplainSend /> -->
    </div>
  </DrawerModal>
</template>

<script setup lang="ts">
import {
  ref,
  defineEmits,
  watch,
  computed,
  provide,
  inject,
  onMounted,
} from "vue";
import DrawerModal from "../../Modal/DrawerModal.vue";
import Frequency from "./Frequency.vue";
import AfterFirstSend from "./AfterFirstSend.vue";
import ExplainSend from "./ExplainSend.vue";
import { z } from "zod";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { schemaSendStartTime } from "../../../../schemas/ReMaScript/schema.triggerEvent";
import { typeSendType } from "../../../../schemas/ReMaScript/schema.sendTime";

let injectCloseActionModal = inject("closeActionModal");

const formSchema = z.object({
  send_type: z.enum(["once", "recurrence"]),
});
//定義Form表單欄位、綁定資料
// const { values, errors, handleSubmit, setValues, resetForm, validateField } =
//   useForm({
//     validationSchema: toTypedSchema(formSchema),
//   });

onMounted(() => {});
// provide("validateField", validateField);
</script>

<style scoped>
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
}
</style>
