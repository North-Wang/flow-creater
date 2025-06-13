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

const $attrs = useAttrs();
const refDropdown = ref(null);
const showDropdown = ref(false);

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
const props = defineProps({
  // id: {
  //   //整個下拉選單的id。Google gtm埋碼會用來辨識下拉選單
  //   type: String,
  //   default: "",
  // },
  width: {
    type: String,
    default: "200px",
  },
  //所有下拉選單的選項
  options: {
    type: Array,
    default: () => [
      { name: "日本" },
      { name: "韓國" },
      { name: "上海自來水來自海上海自來水來自海" },
      { name: "Repoblikan'i Madagasikara" },
    ],
    //必須有name
    validator: (value: any[]) => {
      return (
        Array.isArray(value) &&
        value.every(
          (item) => typeof item === "object" && typeof item.name === "string"
        )
      );
    },
  },
  //尚未選擇任何其他選項時顯示的提示性文字
  dropdownPlaceholder: {
    type: String,
    default: "員工旅遊去哪裡?",
  },
  //從外部控制要選哪一樣
  selectedValue: {
    type: String,
    default: "",
  },
  maxHeight: {
    //選單的最大高度
    type: String,
    default: "200px",
  },
  isTextShouldWrap: {
    //文字是否要省略符號、出現v-tooltip?
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  textColor: {
    type: String,
    default: "--neutral-04",
  },
  bgColorDefault: {
    type: String,
    default: "--neutral-00",
  },
  textColorHover: {
    type: String,
    default: "--neutral-04",
  },
  bgColorHover: {
    type: String,
    default: "--color-brand-01",
  },
  iconColor: {
    type: String,
    default: "--color-brand-05",
  },
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

//如果有設定初始選項，則顯示
watch(
  () => props.selectedValue,
  (val) => {
    if (!val) return;
    selectedOption.value = val;
    emitsSelect(val, null);
  }
);

//如果有設定下拉選單的預設文字，則顯示
watch(
  () => props.dropdownPlaceholder,
  (val) => {
    if (!val || val?.trim() === "") return;
    selectedOption.value = val;
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
