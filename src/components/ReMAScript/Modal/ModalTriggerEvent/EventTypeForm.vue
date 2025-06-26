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
        class="position-relative w-full grid grid-cols-[auto_auto_1fr] gap-x-[25px] place-items-center mb-[25px]"
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
      <!-- <div class="selector">
          <DelayUntilFirstDeliver
            :event="eventName"
            @updateDelayValue="(value) => setDelayUntilFirstDeliverValue(value)"
            @updateDelayUnit="(unit) => setDelayUntilFirstDeliverUnit(unit)"
            @updateDelayDate="(string) => setDelayUntilFirstDeliverDate(string)"
          />
        </div> -->

      <!-- <div class="selector flex-wrap">
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
        </div> -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch, computed, inject } from "vue";
import DrawerModal from "../../Modal/DrawerModal.vue";
import EventInform from "./EventInform.vue";
import DelayUntilFirstDeliver from "./DelayUntilFirstDeliver.vue";
import ExplainTriggerEvent from ".././ExplainTriggerEvent.vue";
import Dropdown from "../../../Dropdown/Dropdown.vue";
import DatePicker from "primevue/datepicker";
import {
  schemaTriggerEventSign,
  schemaTriggerEventCartAbandonment,
  schemaTriggerEventPurchaseAfterPromotion,
  schemaTriggerEventScheduled,
  schemaTriggerEvent,
  typeTriggerEventFrequency,
} from "../../../../schemas/ReMaScript/schema.triggerEvent";
import { z } from "zod";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

const injectTriggerEventSetting = inject<z.infer<typeof schemaTriggerEvent>>(
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
  setValues,
  resetForm,
} = useForm({
  validationSchema: toTypedSchema(schemaTriggerEvent),
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

type TriggerEventFrequency = z.infer<typeof typeTriggerEventFrequency>;
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
const defaultTriggerEvent = ref({ name: "註冊", value: "sign" }); //預設的觸發事件
const recurringStartDate = ref(null); //定期投放的開始日期

function selectTriggerEvent(opt) {
  setEventName(opt?.value);
  cleanFormDataBySchema();
}
function selectPurchaseType(type) {
  setPurchaseTypes(type?.value);
}
function selectPurchaseItem(item) {
  setPurchaseItems(item?.value);
}

/**
 * 變更event的時候，清除不合schema的參數
 * @param formData
 * @param schema
 */
function cleanFormDataBySchema() {
  console.log("aaa eventName", eventName.value);
  console.log(
    "aaa delayUntilFirstDeliverDate",
    delayUntilFirstDeliverDate.value
  );
  switch (eventName.value) {
    case "sign":
    case "cart_abandonment":
    case "purchase":
      resetForm({
        values: {
          event: eventName.value,
          frequency: frequency.value,
          delayUntilFirstDeliverUnit: delayUntilFirstDeliverUnit.value,
          delayUntilFirstDeliverValue: delayUntilFirstDeliverValue.value,
        },
      });
      break;
    case "scheduled":
      if (delayUntilFirstDeliverDate.value) {
        resetForm({
          values: {
            event: eventName.value,
            frequency: frequency.value,
            delayUntilFirstDeliverDate: delayUntilFirstDeliverDate.value,
          },
        });
      } else {
        resetForm({
          values: {
            event: eventName.value,
            frequency: frequency.value,
          },
        });
      }
      break;
    default:
      console.warn("未定義event name", eventName.value);
      break;
  }
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
      if (!validateFormData(schemaTriggerEventSign)) return;
      data = {
        event: eventName.value,
        frequency: frequency.value,
        delayUntilFirstDeliver: "",
      };
    case "cart_abandonment":
      if (!validateFormData(schemaTriggerEventCartAbandonment)) return;
      data = {
        event: eventName.value,
        frequency: frequency.value,
        delayUntilFirstDeliver: "",
      };
    case "scheduled":
      if (!validateFormData(schemaTriggerEventScheduled)) return;
      data = {
        event: eventName.value,
        frequency: frequency.value,
        delayUntilFirstDeliver: "",
      };
      break;
    case "purchase":
      if (!validateFormData(schemaTriggerEventPurchaseAfterPromotion)) return;
      data = {
        event: eventName.value,
        purchase_type: purchaseTypes.value,
        purchase_item: purchaseItems.value,
        frequency: frequency.value,
        delayUntilFirstDeliver: "",
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
//還原先前設定的觸發事件
watch(
  eventName,
  (event) => {
    const target = triggerEventOptions.value?.find(
      (opt) => opt.value === event
    );
    if (target) {
      defaultTriggerEvent.value = target;
    }
  },
  { immediate: true, once: true }
);

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
  //清空已經選擇的購買商品的品項
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
