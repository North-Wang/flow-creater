<template>
  <DrawerModal @closeModal="removeEvent()">
    <form class="wrapper">
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
          class="position-relative w-full grid grid-cols-[auto_auto_1fr] gap-x-[25px] place-items-center"
          v-if="eventName === 'purchase'"
        >
          <label
            for=""
            class="selector-title"
            style="white-space: nowrap; margin-bottom: 8px"
            >購買項目</label
          >
          <Dropdown
            :options="purchaseTypeOptions"
            :dropdownPlaceholder="'-'"
            :width="'138px'"
            :selectedValue="presetPurchasedType"
            @select="selectPurchaseType"
          />
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
          <Dropdown
            :width="'100%'"
            :options="purchaseItemsOptions"
            :dropdownPlaceholder="'-'"
            :selectedValue="presetPurchasedItem"
            class="w-full"
            @select="selectPurchaseItem"
            v-else
          />
          <div class="Red error-msg" v-if="showErrorMsg">{{ errorMsg }}</div>
        </div>
        <div class="selector flex-wrap" v-if="eventName === '定期投放'">
          <label for="" class="selector-title">條件開始的時間</label>
          <DatePicker v-model="recurringStartDate" />
        </div>
        <DelayUntilFirstEmail :event="eventName" />
        <div class="selector flex-wrap">
          <label for="" class="selector-title">發送方式</label>
          <div class="flex">
            <div
              class="d-flex align-items-center"
              v-for="options in sendTimeTypeOptions"
              :key="options?.value"
            >
              <input
                type="radio"
                :id="options?.value"
                :value="options?.value"
                style="margin-right: 16px"
                v-model="frequency"
              />

              <label :for="options?.value" class="cursor-pointer">{{
                options?.name
              }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="introduction">
        <EventInform :event="eventName" />
        {{ formData }}
        <div class="button-wrap">
          <button class="button-basic-light btn-cancel" @click="closeModal">
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
    </form>
  </DrawerModal>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch, computed, inject } from "vue";
import DrawerModal from "../../Modal/DrawerModal.vue";
import EventInform from "./EventInform.vue";
import DelayUntilFirstEmail from "./DelayUntilFirstEmail.vue";
import ExplainTriggerEvent from ".././ExplainTriggerEvent.vue";
import Dropdown from "../../../Dropdown/Dropdown.vue";
import DatePicker from "primevue/datepicker";
import {
  TriggerEventBasicSchema,
  TriggerEventPurchaseAfterPromotionSchema,
  TriggerEventSchema,
  TriggerEventFrequencyType,
} from "../../../../schemas/ReMaScript/schema.triggerEvent";
import { z } from "zod";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

const injectTriggerEventSetting = inject<z.infer<typeof TriggerEventSchema>>(
  "triggerEventSetting"
);
let injectUpdateSubscriptTriggerEventSetting = inject(
  "updateSubscriptTriggerEventSetting",
  null
);

//定義Form表單欄位、綁定資料
const {
  values: formData,
  handleSubmit,
  resetForm,
} = useForm({
  validationSchema: toTypedSchema(TriggerEventSchema),
});

const {
  value: eventName,
  errorMessage: eventError,
  setValue: setEventName,
} = useField<string>("event");
const {
  value: frequency,
  errorMessage: frequencyError,
  setValue: setFrequency,
} = useField("frequency");
const {
  value: purchaseTypes,
  errorMessage: purchaseTypesError,
  setValue: setPurchaseTypes,
} = useField("purchaseTypes");
const {
  value: purchaseItems,
  errorMessage: purchaseItemsError,
  setValue: setPurchaseItems,
} = useField("purchaseItems");

const emits = defineEmits(["closeModal", "removeEvent"]);

//先前設定的【購買項目】的【種類】

const presetPurchasedType = computed(() => {
  if (!injectTriggerEventSetting.value?.purchaseTypes) return null;
  return {
    name: injectTriggerEventSetting.value?.purchaseTypes,
    value: injectTriggerEventSetting.value?.purchaseTypes,
  };
});

//先前設定的【購買項目】的【品項】
const presetPurchasedItem = ref({ name: "-", value: "-" });

const triggerEventOptions = ref([
  { name: "註冊", value: "sign" },
  { name: "購物車未結", value: "cart_abandonment" },
  { name: "購買後促銷", value: "purchase" },
  { name: "定期投放", value: "scheduled" },
]);
const purchaseTypeOptions = ref([
  { name: "商品", value: "商品" },
  { name: "類別", value: "類別" },
  { name: "品牌", value: "品牌" },
]);
//購買項目的類別
const purchaseItemsOptions = ref([]);

type TriggerEventFrequency = z.infer<typeof TriggerEventFrequencyType>;
const currentSendTimeType = ref<TriggerEventFrequency>("once"); //目前選擇的發送方式

const sendTimeTypeOptions = ref([
  {
    value: "once",
    name: "一次性投放",
  },
  {
    value: "recurrence",
    name: "週期性投放",
  },
]);

// 推導型別
const errorMsg = ref("需要選擇購買的項目");

const showLoadingInput = ref(false);
const showErrorMsg = ref(false);
const defaultTriggerEvent = ref({ name: "購買後促銷", value: "purchase" }); //預設的觸發事件
const recurringStartDate = ref(null); //定期投放的開始日期

function selectTriggerEvent(opt) {
  setEventName(opt?.value);
}
function selectPurchaseType(type) {
  setPurchaseTypes(type?.value);
}
function selectPurchaseItem(item) {
  setPurchaseItems(item?.value);
}

function removeEvent() {
  emits("removeEvent");
}
function closeModal() {
  emits("closeModal");
}
//驗證資料是否填寫完整
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
  switch (eventName.value) {
    case "sign":
    case "cart_abandonment":
    case "scheduled":
      if (validateFormData(TriggerEventBasicSchema) === false) return;
      data = {
        event: eventName.value,
        frequency: frequency,
      };
      break;
    case "purchase":
      if (validateFormData(TriggerEventPurchaseAfterPromotionSchema) === false)
        return;

      data = {
        event: eventName.value,
        purchase_type: purchaseTypes.value,
        purchase_item: purchaseItems.value,
        frequency: frequency,
      };
      break;
    default:
      console.warn("未定義的觸發事件種類", eventName.value);
      break;
  }
  injectUpdateSubscriptTriggerEventSetting(data);
  closeModal();
}

const styleSpecialWrapper = computed(() => {
  if (eventName.value === "購買後促銷") {
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
 * 還原先前設定的彈窗內容
 */
watch(
  injectTriggerEventSetting,
  (setting) => {
    // restoreSetting(setting);
    resetForm({ values: setting ? JSON.parse(JSON.stringify(setting)) : {} });
  },
  { immediate: true }
);

/**
 * 變更「發送方式」
 * */
watch(currentSendTimeType, (val) => {
  setFrequency(val);
});
/**
 * 當「購買項目」 的「種類」變更時，重新取得「項目」
 * */
watch(purchaseTypes, (type) => {
  //根據「購買項目」的種類，給後端對應的參數
  switch (type) {
    case "商品":
      purchaseItemsOptions.value = [
        { name: "桂冠食品", value: "桂冠食品" },
        { name: "冰淇淋", value: "冰淇淋" },
      ];
      setPurchaseItems(null);
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
  //還原預設
  setPurchaseItems("-");
});

// 當表單的資料有變更，要讓【購買商品品項】的下拉選單也更新已選的選項
watch(
  purchaseItems,
  (item) => {
    if (!item) {
      //預設選項
      presetPurchasedItem.value = { name: "-", value: "-" };
      return;
    }
    presetPurchasedItem.value = { name: item, value: item };
  },
  { immediate: true }
);
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
}
.introduction {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
