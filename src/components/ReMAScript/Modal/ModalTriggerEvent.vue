<template>
  <DrawerModal @closeModal="removeEvent()">
    <ul class="wrapper">
      <li class="event-form font-18">
        <p class="title">事件設定</p>

        <div class="selector flex-wrap" :style="styleSpecialWrapper">
          <label for="" class="selector-title">觸發事件 (Trigger)</label>
          <Dropdown
            :options="triggerEventOptions"
            :width="'500px'"
            :selectedValue="defaultTriggerEvent"
            @select="selectTriggerEvent"
          />
        </div>

        <div
          class="position-relative w-full grid grid-cols-[auto_auto_1fr] gap-x-[25px] place-items-center"
          v-if="formData.event === 'purchase'"
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
            :selectedValue="{
              name: injectTriggerEventSetting?.purchaseTypes,
              value: injectTriggerEventSetting?.purchaseTypes,
            }"
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
            :width="'250px'"
            :options="purchaseItemsOptions"
            :dropdownPlaceholder="'-'"
            :selectedValue="{
              name: injectTriggerEventSetting?.purchaseItems,
              value: injectTriggerEventSetting?.purchaseItems,
            }"
            class="w-full"
            @select="selectPurchaseItem"
            v-else
          />
          <div class="Red error-msg" v-if="showErrorMsg">{{ errorMsg }}</div>
        </div>
        <div class="selector flex-wrap" v-if="formData.event === '定期投放'">
          <label for="" class="selector-title">條件開始的時間</label>
          <DatePicker v-model="recurringStartDate" />
        </div>
        <div class="selector flex-wrap">
          <label for="" class="selector-title">發送方式</label>
          <div class="flex gap-">
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
                v-model="formData.frequency"
              />
              <label :for="options?.value" class="cursor-pointer">{{
                options?.name
              }}</label>
            </div>
          </div>
        </div>
      </li>
      <li class="introduction">
        <div>
          <div class="title">事件說明</div>
          <p class="text-left font-18" v-if="formData.event === 'sign'">
            <span>設定當</span>
            <span class="Cyan">顧客註冊後過多久</span>
            <span>，系統即會觸發。請到</span>
            <span class="Cyan">時間</span>
            <span>功能做下一步設定。</span>
          </p>
          <p
            class="text-left font-18"
            v-if="formData.event === 'cart_abandonment'"
          >
            <span>設定當顧客加入購物車且</span>
            <span class="Cyan">且在幾天內未進行結帳</span>
            <span>，系統即會觸發。請到</span>
            <span class="Cyan">時間</span>
            <span
              >功能做下一步設定。此事件目前僅供API進行觸發來判斷，建議要有技術人員來協助串接。</span
            >
          </p>
          <p class="text-left font-18" v-if="formData.event === 'purchase'">
            <span>設定當</span>
            <span class="Cyan">顧客購買後過多久</span>
            <span>，系統即會觸發，您可以選擇購買的項目。完成後請到</span>
            <span class="Cyan">時間</span>
            <span>功能做下一步設定。</span>
          </p>
          <p class="text-left font-18" v-if="formData.event === 'scheduled'">
            <span>根據</span>
            <span class="Cyan">指定的時間範圍與頻率</span>
            <span>，系統即會觸發。請到</span>
            <span class="Cyan">時間</span>
            <span>功能做下一步設定。</span>
          </p>
        </div>

        <div class="button-wrap">
          <button class="button-basic-light btn-cancel" @click="closeModal">
            移除
          </button>
          <button class="button-basic btn-next" @click="prepareSaveSetting">
            儲存
          </button>
        </div>
      </li>
    </ul>
  </DrawerModal>
</template>

<script setup lang="ts">
import {
  ref,
  defineEmits,
  onMounted,
  watch,
  computed,
  inject,
  defineProps,
} from "vue";
import DrawerModal from "../Modal/DrawerModal.vue";
import ExplainTriggerEvent from "./ExplainTriggerEvent.vue";
import Dropdown from "../../Dropdown/Dropdown.vue";
import DropdownWithSearch from "../../Dropdown/DropdownCheckbox.vue";
import DatePicker from "primevue/datepicker";
import {
  TriggerEventBasicSchema,
  TriggerEventPurchaseAfterPromotionSchema,
  TriggerEventSchema,
} from "../../../schemas/ReMaScript/scriptSchema";
import { z } from "zod";

let injectTriggerEventSetting = inject<typeof TriggerEventSchema>(
  "triggerEventSetting"
);
let injectUpdateTriggerEventSetting = inject("updateTriggerEventSetting");
let injectEditingTaskId = inject("editingTaskId");

const emits = defineEmits(["closeModal", "removeEvent"]);

const triggerEventMap = new Map<string, string>([
  ["sign", "註冊"],
  ["cart_abandonment", "購物車未結"],
  ["purchase", "購買後促銷"],
  ["scheduled", "定期投放"],
]);
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
const purchaseItemsOptions = ref([
  { name: "桂冠食品", value: "桂冠食品" },
  { name: "冰淇淋", value: "冰淇淋" },
]); //購買項目
const currentSendTimeType = ref<"once" | "recurrence">("once"); //目前選擇的發送方式

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
type FormDataType = z.infer<typeof TriggerEventBasicSchema>;
const formData = ref<FormDataType>(TriggerEventBasicSchema.parse({}));
const errorMsg = ref("需要選擇購買的項目");

const showLoadingInput = ref(false);
const showErrorMsg = ref(false);
const showExplainTriggerEvent = ref(false); //顯示【購買後促銷】的彈窗說明
const defaultTriggerEvent = ref({ name: "購買後促銷", value: "purchase" }); //預設的觸發事件
const recurringStartDate = ref(null); //定期投放的開始日期

/**
 * 還原先前的設定
 */
function restoreSetting(setting) {
  if (!setting) return;
  console.log("還原先前的設定", setting);

  //下拉選單顯示觸發事件
  defaultTriggerEvent.value = {
    name: triggerEventMap.get(setting.event),
    value: setting.event,
  };

  //觸發事件
  formData.value.event = setting.event;
  formData.value.frequency = setting.frequency;

  //購買項目 (購買後促銷才有)
  if (setting.event === "purchase") {
    formData.value.purchaseTypes = setting.purchaseTypes;
    formData.value.purchaseItems = setting.purchaseItems;
  }

  //發送方式
  currentSendTimeType.value = setting.frequency || "once";
}

function selectTriggerEvent(opt) {
  formData.value.event = opt?.value;
}
function selectPurchaseType(type) {
  formData.value.purchaseTypes = type;
}
function selectPurchaseItem(item) {
  formData.value.purchaseItems = item;
}

function removeEvent() {
  emits("removeEvent");
}
function closeModal() {
  emits("closeModal");
}
//驗證資料是否填寫完整
function validateFormData(schema) {
  const result = schema.safeParse(formData.value);

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
  switch (formData.value.event) {
    case "sign":
    case "cart_abandonment":
    case "scheduled":
      if (validateFormData(TriggerEventBasicSchema) === false) return;
      data = {
        event: formData.value.event,
        frequency: formData.value.frequency,
      };
      break;
    case "purchase":
      if (validateFormData(TriggerEventPurchaseAfterPromotionSchema) === false)
        return;

      data = {
        event: formData.value.event,
        purchase_type: formData.value?.purchaseTypes?.value,
        purchase_item: formData.value.purchaseItems?.value,
        frequency: formData.value.frequency,
      };
      break;
    default:
      console.warn("未定義的觸發事件種類", formData.value.event);
      break;
  }
  // emits("updateSetting", data);
  injectUpdateTriggerEventSetting(injectEditingTaskId.value, data);
  closeModal();
}

const styleSpecialWrapper = computed(() => {
  if (formData.value.event === "購買後促銷") {
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
    restoreSetting(setting);
  },
  { immediate: true }
);

/**
 * 變更「發送方式」
 * */
watch(currentSendTimeType, (val) => {
  formData.value.frequency = val;
});
/**
 * 當「購買項目」 的「種類」變更時，重新取得「項目」
 * */
watch(
  () => formData.value.purchaseTypes,
  (type) => {
    //根據「購買項目」的種類，給後端對應的參數
    switch (type) {
      case "商品":
        // getPurchaseItems("productsales");
        formData.value.purchaseItems = "-";
        break;
      case "類別":
        // getPurchaseItems("categorysales");
        formData.value.purchaseItems = "-";
        break;
      case "品牌":
        // getPurchaseItems("brandsales");
        formData.value.purchaseItems = "-";
        break;
      case "-":
        formData.value.purchaseItems = "-";
        break;

      default:
        console.warn("未定義的購買項目種類", type);
        break;
    }
  }
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

  .introduction {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
</style>
