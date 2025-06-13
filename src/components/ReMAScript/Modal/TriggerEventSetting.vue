<template>
  <ul class="wrapper">
    <li class="event-form font-18">
      <p class="title">事件設定</p>
      <div class="selector flex-wrap" :style="styleSpecialWrapper">
        <label
          for=""
          class="selector-title"
          :class="formData.event === '購買後促銷' ? 'mb-0' : ''"
          >觸發事件 (Trigger)</label
        >
        <Dropdown
          :options="triggerEventOptions"
          :width="'500px'"
          :selectedValue="'註冊'"
          :dropdownPlaceholder="'請選擇觸發事件'"
          @select="selectTriggerEvent"
        />
      </div>
      <div
        class="selector flex-row align-items-center position-relative"
        style="gap: 25px"
        v-show="formData.event === '購買後促銷'"
      >
        <label for="" class="selector-title mb-0" style="white-space: nowrap"
          >購買項目</label
        >
        <Dropdown
          :options="purchaseTypeOptions"
          :width="'100%'"
          :selectedValue="'註冊'"
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
        <DropdownWithSearch
          :valueArr="purchaseItems"
          :maxHeight="'192'"
          :selectValue="formData.purchaseItems"
          :styleDropdown="{ bottom: '40px', maxHeight: '192px' }"
          class="position-relative"
          style="width: calc(100% * 2 / 3)"
          @select="selectPurchaseItem"
          v-else
        />
        <div class="Red error-msg" v-if="showErrorMsg">{{ errorMsg }}</div>
      </div>
      <div>
        <label for="" class="selector-title">條件開始的時間</label>
      </div>
    </li>
    <li class="introduction">
      <div>
        <div class="title">事件說明</div>
        <p class="content font-18" v-if="formData.event === '註冊'">
          <span>設定當</span>
          <span class="Cyan">顧客註冊後過多久</span>
          <span>，系統即會觸發。請到</span>
          <span class="Cyan">時間</span>
          <span>功能做下一步設定。</span>
        </p>
        <p class="content font-18" v-if="formData.event === '購物車未結'">
          <span>設定當顧客加入購物車且</span>
          <span class="Cyan">且在幾天內未進行結帳</span>
          <span>，系統即會觸發。請到</span>
          <span class="Cyan">時間</span>
          <span
            >功能做下一步設定。此事件目前僅供API進行觸發來判斷，建議要有技術人員來協助串接。</span
          >
        </p>
        <p class="content font-18" v-if="formData.event === '購買後促銷'">
          <span>設定當</span>
          <span class="Cyan">顧客購買後過多久</span>
          <span>，系統即會觸發，您可以選擇購買的項目。完成後請到</span>
          <span class="Cyan">時間</span>
          <span>功能做下一步設定。</span>
        </p>
        <p class="content font-18" v-if="formData.event === '定期投放'">
          <span>根據</span>
          <span class="Cyan">指定的時間範圍與頻率</span>
          <span>，系統即會觸發。請到</span>
          <span class="Cyan">時間</span>
          <span>功能做下一步設定。</span>
        </p>
      </div>

      <div class="button-wrap">
        <button class="button-basic-light btn-cancel" @click="reset">
          移除
        </button>
        <button class="button-basic btn-next" @click="saveSetting">儲存</button>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  defineEmits,
  onMounted,
  watch,
  computed,
  inject,
} from "vue";

import ExplainTriggerEvent from "./ExplainTriggerEvent.vue";
import Dropdown from "../../Dropdown/Dropdown.vue";
import DropdownWithSearch from "../../Dropdown/DropdownCheckbox.vue";

interface FormData {
  event: string;
  purchaseTypes?: string; // 僅在「購買後促銷」時使用
  purchaseItems?: string; // 僅在「購買後促銷」時使用
}
const props = defineProps({
  /* 節點id */
  id: {
    type: Number,
  },
});
const emits = defineEmits(["updateSetting", "reset"]);
const triggerEventOptions = ref([
  { name: "註冊", value: "註冊" },
  { name: "購物車未結", value: "購物車未結" },
  { name: "購買後促銷", value: "購買後促銷" },
  { name: "定期投放", value: "定期投放" },
]);
const purchaseTypeOptions = ref([
  { name: "商品", value: "商品" },
  { name: "類別", value: "類別" },
  { name: "品牌", value: "品牌" },
]); //購買項目的類別
const purchaseItems = ref([]); //購買項目

/* 選擇的選項 */
const formData = ref<FormData>({
  event: "註冊", // 預設為「註冊」
});
const errorMsg = ref("需要選擇購買的項目");

const showLoadingInput = ref(false);
const showErrorMsg = ref(false);
const showExplainTriggerEvent = ref(false); //顯示【購買後促銷】的彈窗說明

/**
 * 還原設定「觸發事件」選項
 */
function initialTriggerEvent() {
  console.log("還原「觸發事件」的種類");
}

/**
 * 設定「觸發設定」要顯示的選項
 */
function initialStartTime() {
  console.log("還原「開始時間」");
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

function reset() {
  emits("reset");
}

async function saveSetting() {
  let data = {};
  switch (formData.value.event) {
    case "註冊":
    case "購物車未結":
    case "定期投放":
      data = {
        event: formData.value.event,
      };
      break;
    case "購買後促銷":
      if (
        formData.value.purchaseTypes === "-" ||
        formData.value.purchaseItems === "-"
      ) {
        console.warn("購買項目未填寫");
        errorMsg.value = "需要選擇購買的項目";
        showErrorMsg.value = true;
        return;
      } else {
        showErrorMsg.value = false;
      }
      data = {
        event: formData.value.event,
        item: returnPurchaseType(formData.value.purchaseTypes),
        item_name: formData.value.purchaseItems,
      };
      break;
    default:
      console.warn("未定義的觸發事件種類", formData.value.event);
      break;
  }
  emits("updateSetting", data);
}

//送出資料之前，將「加入購物車未結」的「購買項目種類」轉換成後端指定的參數
function returnPurchaseType(type) {
  switch (type) {
    case "品牌":
      return "brand";
    case "商品":
      return "product";
    case "類別":
      return "category";
    default:
      console.warn("未定義的購買項目種類", type);
      return "";
  }
}

const styleSpecialWrapper = computed(() => {
  if (formData.value.event === "購買後促銷") {
    return {
      flexDirection: "row",
      gap: "25px",
      alignItems: "center",
    };
  } else {
    return {
      flexDirection: "column",
    };
  }
});

/**
 * 變更「觸發設定」的內容
 * */
watch(
  () => formData.value.event,
  (event) => {}
);
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
watch(
  () => props.id,
  async function (id) {
    // const hadData = await getTreeData(id);
    // if (hadData) {
    //   await initialTriggerEvent();
    //   initialStartTime();
    // }
  },
  { immediate: true }
);
/**
 * 如果有prop原有設定，則顯示之
 */
onMounted(async function () {
  initialTriggerEvent();
  initialStartTime();
});
</script>

<style scoped lang="scss">
.wrapper {
  max-height: 275px;
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
    .selector-title {
      font-size: 18px;
      font-weight: 400;
      margin-bottom: 15px;
      position: relative;
      display: flex;
    }
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
}
.btn-cancel::before {
  content: url("../../../assets/remove.svg");
  margin-right: 10px;
}
.btn-next::after {
  content: url("../../../assets/white-left-arrow.svg");
  display: inline-block;
  transform: rotate(180deg);
  margin-top: 4px;
  margin-left: 10px;
}
.question-mark {
  background-image: url("../../../assets/question-img.png");
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
