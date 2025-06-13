<template>
  <div
    class="wraDropdown"
    :style="{
      '--color-text': `var(${textColor})`,
    }"
    ref="refDropdownFilter"
  >
    <div
      class="selected-dropdown"
      :style="{
        ...$attrs.styleDropdownSelected,
        width,
        background: `var(${bgColorDefault})`,
      }"
      @click="showDropdown = !showDropdown"
    >
      <slot
        name="selected"
        :countSelected="countSelected"
        :isLoading="isLoading"
        :iconColor="iconColor"
      >
        <slot name="loading" v-if="isLoading">
          <div class="dropdown-loading">
            <Spinner :size="'sm'" :backgroundColor="'transparent'"></Spinner>
          </div>
        </slot>
        <div class="left">篩選</div>
        <div class="right">
          <div class="circle" :style="{ background: `var(${iconColor})` }">
            {{ countSelected }}
          </div>
          <IconTriangle :colorVariable="iconColor" class="h-2" />
        </div>
      </slot>
    </div>
    <section
      class="wra-options"
      :style="{
        width,
        '--bg-default': `var(${bgColorDefault})`,
        '--color-text': `var(${textColor})`,
      }"
      v-show="showDropdown && !isLoading"
    >
      <slot name="content" :updateFilter="updateFilter"> slot="content" </slot>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  defineEmits,
  computed,
  useAttrs,
  watch,
  provide,
} from "vue";
import { onClickOutside } from "@vueuse/core";

//多選框的選項
interface Options {
  name: string; //在介面上顯示的文字
  value: string; //會告訴外部元件的參數
}
//已選選項的格式
type CheckListValue = Options[] | string | boolean;

/**
 * 各種條件的已選選項
 * @description string[]：該條件是多選框
 * @description boolean。舉例：選擇結束時間是【永久】選項
 * @description string。舉例：選擇【時間區間】選項
 */
interface FilterAllCheckList {
  [groupKey: string]: string[] | string | boolean;
}
interface emitsEvents {
  (event: "filter", value: FilterAllCheckList): void;
}

interface Props {
  modelValue: FilterAllCheckList; //'v-model 綁定的物件，用於儲存多組篩選條件；每個 key 對應一組條件名稱與其選項陣列'
  width?: string;
  textColor?: string;
  bgColorDefault?: string;
  textColorHover?: string;
  bgColorHover?: string;
  iconColor?: string;
  isLoading?: boolean;
}

const emit = defineEmits<emitsEvents>();
const props = withDefaults(defineProps<Props>(), {
  width: "350px",
  textColor: "--neutral-04",
  bgColorDefault: "--neutral-00",
  textColorHover: "--neutral-04",
  bgColorHover: "--color-brand-01",
  iconColor: "--color-brand-05",
  isLoading: false,
});
const refDropdownFilter = ref(null);
onClickOutside(refDropdownFilter, () => {
  showDropdown.value = false;
});

const showDropdown = ref(false);

//所有已經選擇的選項
const selectedFilter = ref<FilterAllCheckList>({ ...props.modelValue });

//計算已經選取多少選項
const countSelected = computed(() => {
  if (!selectedFilter.value) return 0;
  return Object.values(selectedFilter.value)?.reduce(
    (total, arr) => {
      if (Array.isArray(arr)) {
        // 多選陣列（如 ["a", "b"]）
        return total + arr.length;
      } else if (typeof arr === "string") {
        // 有填字串 ex:"2025-06-01~2025-06-30"
        return arr.trim() !== "" ? total + 1 : total;
      } else if (typeof arr === "boolean") {
        // 勾選 boolean
        return arr === true ? total + 1 : total;
      } else {
        return total;
      }
    },

    0
  );
});

/**
 * 更新指定條件的已選項目
 * @description 會提供給外部使用
 * @param groupKey
 * @param checkList 該條件的已選選項
 */
function updateFilter(groupKey: string, checkList: CheckListValue) {
  switch (typeof checkList) {
    case "string":
    case "boolean":
      selectedFilter.value[groupKey] = checkList;
      break;
    case "object":
    default:
      selectedFilter.value[groupKey] = checkList?.map((opt) => {
        return opt?.value;
      });
      break;
  }
  emit("filter", { ...selectedFilter.value });
}

//當外部更新已選擇的資料時，同步更新到元件內部
watch(
  () => props.modelValue,
  (val) => {
    if (val) selectedFilter.value = { ...val };
  }
);

provide("updateFilter", updateFilter);
</script>

<style scoped lang="scss">
.wraDropdown {
  user-select: none;
  color: var(--color-text);
  font-size: 18px;
  .selected-dropdown {
    height: 40px;
    box-sizing: border-box;
    display: flex;
    column-gap: 4px;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border: 1px solid var(--neutral-02);
    border-radius: 10px;
    padding: 0 14px;
    position: relative;
    .left {
      position: absolute;
      left: 15px;
    }
    .right {
      position: absolute;
      right: 15px;
      display: flex;
      column-gap: 10px;
      align-items: center;
    }
  }
  .wra-options {
    width: 100%;
    box-sizing: content-box;
    position: absolute;
    box-shadow: none;
    border: 1px solid #c4c4c4;
    border-radius: 10px;
    background: var(--bg-default);
    z-index: 50;
    overflow: hidden;
    cursor: pointer;
  }
}
.circle {
  width: 20px;
  aspect-ratio: 1;
  color: white;
  border-radius: 50%;
  display: flex;
  place-items: center;
  place-content: center;
  font-size: 14px;
}
</style>
