<template>
  <div class="wrapper">
    <div class="event-form font-18">
      <p class="title">事件設定</p>

      <div class="selector flex-wrap" :style="styleSpecialWrapper">
        <label for="" class="selector-title">觸發事件 (Trigger)</label>

        <Dropdown
          :options="triggerEventOptions"
          :width="'100%'"
          :selectedValue="defaultTriggerEvent"
          @select="selectTriggerEvent"
        />
      </div>

      <div
        class="relative w-full grid grid-cols-[auto_auto_1fr] gap-x-[25px] place-items-center mb-[25px]"
        v-if="values?.trigger_event === 'post_purchase_marketing'"
      >
        <label
          for=""
          class="selector-title whitespace-nowrap mb-2"
          style="white-space: nowrap; margin-bottom: 8px"
          >購買項目</label
        >
        <div class="w-full relative">
          <Dropdown
            :options="purchaseTypeOptions"
            :dropdownPlaceholder="'-'"
            :width="'138px'"
            :selectedValue="presetPurchasedType"
            :direction="'bottom'"
            @select="selectPurchaseType"
          />
          <div
            class="error-msg top-0 right-0 left-0"
            v-if="purchaseItemTypeError"
          >
            {{ purchaseItemTypeError }}
          </div>
        </div>

        <ul
          class="wrapper-loading-input"
          style="width: calc(100% * 2 / 3)"
          v-if="showLoadingInput"
        >
          <li
            class="flex-fill d-flex align-items-center justify-content-center"
          >
            <div class="spinner-border" role="status"></div>
          </li>
        </ul>
        <div class="w-full relative" v-else>
          <Dropdown
            :width="'100%'"
            :options="purchaseItemsOptions"
            :dropdownPlaceholder="'-'"
            :selectedValue="presetPurchasedItem"
            class="w-full"
            @select="selectPurchaseItem"
          />
          <div class="error-msg top-0 right-0 left-0" v-if="purchaseItemError">
            {{ purchaseItemError }}
          </div>
        </div>
      </div>
      <div
        class="selector flex-wrap"
        v-if="values?.trigger_event === '定期投放'"
      >
        <label for="" class="selector-title">條件開始的時間</label>
        <DatePicker v-model="recurringStartDate" />
      </div>
    </div>

    <div class="introduction">
      <EventInform :event="values?.trigger_event" />
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
          @click="prepareNextStep()"
        >
          下一步
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch, computed, inject, onMounted } from "vue";
import EventInform from "./EventInform.vue";
import ExplainTriggerEvent from ".././ExplainTriggerEvent.vue";
import Dropdown from "../../../Dropdown/Dropdown.vue";
import DatePicker from "primevue/datepicker";
import { schemaTriggerEvent } from "../../../../schemas/ReMaScript/schema.triggerEvent";
import { z } from "zod";
import { useFieldError } from "vee-validate";
const purchaseItemTypeError = useFieldError("purchase_item_type");
const purchaseItemError = useFieldError("purchase_item");

const injectRemoveTriggerEvent = inject("removeTriggerEvent");

const interfaceForm = z.object({
  trigger_event: z.string(),
});

const values = inject<typeof interfaceForm>("values");
const setValues = inject("setValues");
const resetField = inject("resetField");
const validateField = inject("validateField");

interface Emits {
  (e: "nextStep", payload: z.infer<typeof schemaTriggerEvent>): void;
}
const emits = defineEmits<Emits>();

//先前設定的【購買項目】的【種類】

const presetPurchasedType = computed(() => {
  return { name: "-", value: "-" };
});

//先前設定的【購買項目】的【品項】
const presetPurchasedItem = ref({ name: "-", value: "-" });

const triggerEventOptions = ref([
  { name: "註冊", value: "sign" },
  { name: "購物車未結", value: "cart_abandonment" },
  { name: "購買後促銷", value: "post_purchase_marketing" },
  { name: "定期投放", value: "recurring_scheduled" },
]);
const purchaseTypeOptions = ref([
  { name: "商品", value: "商品" },
  { name: "類別", value: "類別" },
  { name: "品牌", value: "品牌" },
]);
//購買項目的類別
const purchaseItemsOptions = ref([]);

const showLoadingInput = ref(false);
//預設的觸發事件
const defaultTriggerEvent = computed(() => {
  if (!values?.trigger_event) return { name: "", value: "" };
  const target = triggerEventOptions.value?.find((opt) => {
    return opt?.value === values?.trigger_event;
  });
  return {
    name: target?.name,
    value: target?.value,
  };
});
const recurringStartDate = ref(null); //定期投放的開始日期

function selectTriggerEvent(opt) {
  setValues({ trigger_event: opt?.value });
  if (opt?.value !== "post_purchase_marketing") {
    //清除「購買後促銷」的欄位資料
    resetField("purchase_item");
    resetField("purchase_item_type");
  }
}
function selectPurchaseType(type) {
  setValues({ purchase_item_type: type?.value });
}
function selectPurchaseItem(item) {
  setValues({ purchase_item: item?.value });
}

async function prepareNextStep() {
  //驗證資料
  let field = [];
  if (values?.trigger_event === "post_purchase_marketing") {
    field = ["trigger_event", "purchase_item_type", "purchase_item"];
  } else {
    field = ["trigger_event"];
  }
  const res = await Promise.all(field.map((f) => validateField(f)));
  const allValid = res.every((r) => {
    return r?.valid === true;
  });
  if (allValid) {
    emits("nextStep");
  } else {
    console.warn("未通過驗證");
  }
}

const styleSpecialWrapper = computed(() => {
  if (values?.trigger_event === "購買後促銷") {
    return {
      flexDirection: "row",
      alignItems: "center",
    };
  } else {
    return {
      flexDirection: "column",
    };
  }
});

/**
 * 當「購買項目」 的「種類」變更時，重新取得「項目」
 * */
watch(
  () => values.purchase_item_type,
  (type) => {
    if (!type) return;
    //根據「購買項目」的種類，給後端對應的參數
    switch (type) {
      case "商品":
        purchaseItemsOptions.value = [
          { name: "桂冠食品", value: "桂冠食品" },
          { name: "冰淇淋", value: "冰淇淋" },
        ];
        setValues({ purchase_item: null });
        break;
      case "類別":
        purchaseItemsOptions.value = [
          { name: "冷藏食品", value: "冷藏食品" },
          { name: "飲料類", value: "飲料類" },
        ];
        break;
      case "品牌":
        purchaseItemsOptions.value = [
          { name: "可口可樂", value: "可口可樂" },
          { name: "桂冠", value: "桂冠" },
        ];
        break;

      default:
        console.warn("未定義的購買項目種類", type);
        break;
    }
    //清空已經選擇的購買商品的品項
    presetPurchasedItem.value = { name: "-", value: "-" };
  }
);

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
    button {
      min-width: 124px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
input[type="text"] {
  border: 1px solid #c4c4c4;
  border-radius: 10px;
  height: 40px;
  padding: 0 14px;
}
input[type="text"]:disabled {
  background-color: #fff;
}
.title {
  color: #71afb6;
  font-size: 18px;
  font-weight: 400;
  margin-right: 0px; //reset
  margin-bottom: 20px;
  text-align: left;
}
.btn-cancel::before {
  content: url("../../../assets/remove.svg");
  margin-right: 10px;
}
.btn-next::after {
  // content: url("../../../assets/white-left-arrow.svg");
  display: inline-block;
  transform: rotate(180deg);
  margin-top: 4px;
  margin-left: 10px;
}
.question-mark {
  // background-image: url("../../../assets/question-img.png");
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
  position: relative;
  top: 5px;
  left: 5px;
  cursor: pointer;
}
.wrapper-loading-input {
  border: 1px solid #c4c4c4;
  border-radius: 10px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  .spinner-border {
    width: 1.6rem;
    height: 1.6rem;
  }
  img {
    margin-right: 14px;
  }
}
.error-msg {
  position: absolute;
  font-size: 12px;
  top: 40px;
  color: red;
}
.introduction {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
