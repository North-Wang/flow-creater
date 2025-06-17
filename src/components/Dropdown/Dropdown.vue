<template>
  <div
    class="wraDropdown"
    :style="{
      '--color-text': `var(${textColor})`,
    }"
    ref="refDropdown"
  >
    <div
      class="selected-dropdown"
      :class="isTextShouldWrap ? 'has-wrap' : ''"
      :style="{
        ...$attrs.styleDropdownSelected,
        width,
        background: `var(${bgColorDefault})`,
      }"
      @click="showDropdown = !showDropdown"
    >
      <slot
        name="selected"
        :selectedOption="selectedOption"
        :isTextShouldWrap="isTextShouldWrap"
        :isLoading="isLoading"
      >
        <slot name="loading" v-if="isLoading">
          <div class="dropdown-loading">loading...</div>
        </slot>
        <div
          :class="{
            'text-overflow': !isTextShouldWrap,
          }"
          v-if="!isLoading"
        >
          {{ selectedOption }}
        </div>
      </slot>
    </div>

    <section
      class="wra-options"
      :style="{
        ...$attrs.styleDropdownOptions,
        width,
        '--bg-default': `var(${bgColorDefault})`,
        '--color-text': `var(${textColor})`,
      }"
      v-if="showDropdown"
    >
      <slot name="option-top"></slot>

      <div
        class="overflow-y-auto overflow-x-hidden"
        :style="{
          maxHeight,
        }"
        v-if="options && options.length > 0"
      >
        <div
          v-for="(opt, index) in options"
          data-gtm="dropdown-option"
          class="option"
          :key="opt + index"
          :style="{
            ...$attrs.styleDropdownOption,
            '--bg-hover': `var(${bgColorHover})`,
            '--text-hover': `var(${textColorHover})`,
          }"
          @click="clickOption(opt, index)"
        >
          <slot name="option" :opt="opt" :index="index">
            <div
              :class="{
                'text-overflow ': !isTextShouldWrap,
              }"
            >
              {{ opt?.name }}
            </div>
          </slot>
        </div>
      </div>

      <slot name="option-bottom"></slot>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, useAttrs, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import { z } from "zod";

const $attrs = useAttrs();
const refDropdown = ref(null);
const showDropdown = ref(false);

//規範每個選項的結構，可暴露給外部驗證用
interface OptionItem {
  name: string;
  value: string;
  [key: string]: any;
}

interface Props {
  width?: string;
  options?: OptionItem[];
  dropdownPlaceholder?: string;
  selectedValue?: OptionItem;
  maxHeight?: string;
  isTextShouldWrap?: boolean;
  isLoading?: boolean;
  textColor?: string;
  bgColorDefault?: string;
  textColorHover?: string;
  bgColorHover?: string;
  iconColor?: string;
}
/**
 * 顯示所選選項的文字
 */
const selectedOption = ref("");
onClickOutside(refDropdown, () => {
  showDropdown.value = false;
});

interface emitsEvents {
  (event: "select", option: object, index: Number): void;
}

const emit = defineEmits<emitsEvents>();
const props = withDefaults(defineProps<Props>(), {
  width: "200px",
  options: () => [
    { name: "日本", value: "Japan" },
    { name: "韓國", value: "韓國" },
    { name: "上海自來水來自海上海自來水來自海", value: "上海" },
    { name: "Repoblikan'i Madagasikara", value: "Madagasikara" },
  ],
  dropdownPlaceholder: "員工旅遊去哪裡?",
  maxHeight: "200px",
  isTextShouldWrap: false,
  isLoading: false,
  textColor: "--neutral-04",
  bgColorDefault: "--neutral-00",
  textColorHover: "--neutral-04",
  bgColorHover: "--color-brand-01",
  iconColor: "--color-brand-05",
});
function clickOption(option, index) {
  selectedOption.value = option?.name;
  showDropdown.value = false;
  emitsSelect(option, index);
}

/**
 * 告訴外部選擇了哪一樣
 * @param {Object} option 選項資料
 * @param {Number} index 索引值
 */
function emitsSelect(option, index) {
  console.log("選擇：" + index, option);
  emit("select", option, index);
}

/**
 * 檢測文字是否出現省略符號，要出現v-tooltip
 * @param {*} 目標元素
 * @param {String} text  文字內容
 * @param {Number} line  在第幾行數出現省略符號
 */
function isOverflow(e, text) {
  const fontSize = 18;
  const line = 1;
  // showTooltip.value = text.length * fontSize <= e.target.scrollWidth * line;
}

/**
 * 由外部控制要選擇哪個選項
 * @description 初始時不要emit，避免無限迴圈
 */
let hasInitialized = false;
watch(
  () => props.selectedValue,
  (val) => {
    if (!val) return;
    selectedOption.value = val?.name;
    if (hasInitialized) {
      emitsSelect(val, null);
    } else {
      hasInitialized = true;
    }
  },
  { immediate: true }
);

// 若有設定下拉選單的預設文字，且尚未選擇任何初始值，則顯示該預設文字
watch(
  () => props.dropdownPlaceholder,
  (val) => {
    if (!val || val?.trim() === "") return;

    if (!props.selectedValue || props.selectedValue?.value?.trim() === "") {
      selectedOption.value = val;
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.wraDropdown {
  user-select: none;
  color: var(--color-text);
  font-size: 18px;
  .selected-dropdown {
    height: 40px;
    box-sizing: border-box;

    display: grid;
    grid-template-columns: 1fr 9px;
    column-gap: 4px;
    align-items: center;
    // justify-content: space-between;
    cursor: pointer;
    border: 1px solid var(--neutral-02);
    border-radius: 10px;
    padding: 0 14px;

    &.has-wrap {
      min-height: 10px;
      height: auto;
    }
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
  cursor: pointer;

  .option {
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 18px;
    padding: 11px 14px;
    line-height: 18px;
    &:hover {
      background: var(--bg-hover);
      color: var(--text-hover);
    }
  }
}

.dropdown-loading {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
