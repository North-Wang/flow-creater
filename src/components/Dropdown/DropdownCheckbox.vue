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
      :style="{
        width,
        background: `var(${bgColorDefault})`,
      }"
      @click="showDropdown = !showDropdown"
    >
      <slot
        name="selected"
        :checkedList="checkedList"
        :isTextShouldWrap="isTextShouldWrap"
        :isLoading="isLoading"
        :placeholder="placeholder"
      >
        <slot name="loading" v-if="isLoading">
          <div class="dropdown-loading">Loading...</div>
        </slot>
        <div
          :class="{
            'text-overflow': !isTextShouldWrap,
          }"
          v-if="!isLoading"
        >
          <span v-if="checkedList?.length > 0">
            選擇了{{ checkedList?.length }}項
          </span>
          <span v-else>{{ placeholder }}</span>
        </div>
      </slot>
    </div>

    <section
      class="wra-options w-full"
      :style="{
        width,
        '--bg-default': `var(${bgColorDefault})`,
        '--color-text': `var(${textColor})`,
      }"
      v-if="showDropdown && !isLoading"
    >
      <slot name="option-top">
        <div class="input-search">
          <input
            type="text"
            class="text-overflow"
            :placeholder="searchPlaceholder"
            v-model="keyword"
          />
        </div>
        <hr />
      </slot>
      <div
        class="wra-options overflow-y-auto overflow-x-hidden"
        :style="{
          maxHeight,
        }"
        v-if="options && options.length > 0"
      >
        <slot name="no-match" v-if="optionList.length === 0">
          <div
            class="px-[10px] py-0 h-10 flex place-items-center place-content-center"
          >
            查無資料
          </div>
        </slot>
        <template v-else>
          <label
            v-for="(opt, index) in optionList"
            data-gtm="dropdown-option"
            class="item"
            :for="opt + index"
            :key="opt + index"
            :style="{
              ...$attrs.styleDropdownOption,
              '--bg-hover': `var(${bgColorHover})`,
              '--text-hover': `var(${textColorHover})`,
            }"
          >
            <slot
              name="option"
              :opt="opt"
              :index="index"
              :checkedList="checkedList"
              :toggleChecked="toggleChecked"
            >
              <input
                type="checkbox"
                :id="opt + index"
                :value="opt"
                :style="{
                  '--color': `var(${textColor})`,
                }"
                v-model="checkedList"
              />
              <div
                :class="{
                  'text-overflow': !isTextShouldWrap,
                }"
              >
                {{ opt?.name }}
              </div>
            </slot>
          </label>
        </template>
      </div>

      <slot name="option-bottom"></slot>
    </section>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, useAttrs, watch } from "vue";
import { onClickOutside } from "@vueuse/core";

const $attrs = useAttrs();
const refDropdown = ref(null);
const showDropdown = ref(false);

onClickOutside(refDropdown, () => {
  showDropdown.value = false;
});
const keyword = ref("");
const checkedList = ref([]);
/**
 * 預設選項
 */
const placeholder = ref("");
/**
 * 顯示在介面上的選項列表
 * @description 包含搜尋完的結果
 */
const optionList = ref([]);

const emit = defineEmits(["select"]);
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
      { name: "蘋果" },
      { name: "番茄" },
      { name: "蔥爆牛肉炒泡麵佐澎湖生蠔" },
      { name: "節瓜" },
      { name: "甜椒" },
      { name: "苦瓜" },
    ],
    validator: (value) => {
      //必須有name
      return (
        Array.isArray(value) &&
        value.every(
          (item) => typeof item === "object" && typeof item.name === "string"
        )
      );
    },
  },

  //沒有選項時要出現的文字
  emptyText: {
    type: String,
    default: "此條件尚未取得資料",
  },
  maxHeight: {
    //選項列表區域的最大高度
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
  //尚未選擇任何其他選項時顯示的提示性文字
  dropdownPlaceholder: {
    type: String,
    default: "選擇晚餐要吃什麼?",
  },
  //從外部控制要選哪一樣
  selectedValue: {
    type: Array,
    default: () => [{ name: "蘋果" }],
    //必須有name
    validator: (value) => {
      return (
        Array.isArray(value) &&
        value.every(
          (item) => typeof item === "object" && typeof item.name === "string"
        )
      );
    },
  },
  searchPlaceholder: {
    type: String,
    default: "搜尋名稱",
  },
  textColor: {
    type: String,
    default: "--neutral-04",
  },
  iconColor: {
    type: String,
    default: "--color-brand-05",
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
});

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
const isChecked = (opt) => checkedList.value.some((item) => item === opt);

/**
 * 提供給外部的函式，控制所選的項目
 * @param opt
 */
const toggleChecked = (opt) => {
  if (isChecked(opt)) {
    checkedList.value = checkedList.value?.filter((item) => item !== opt);
  } else {
    checkedList.value = [...checkedList.value, opt];
  }
};

watch(
  () => props.options,
  (options) => {
    optionList.value = options;
    if (options?.length === 0) {
      //無任何選項時顯示提示文字
      placeholder.value = props.emptyText;
    }
  },
  { immediate: true }
);

//如果有設定下拉選單的預設文字，則顯示
watch(
  () => props.dropdownPlaceholder,
  (val) => {
    if (!val || val?.trim() === "") return;
    placeholder.value = val;
  },
  { immediate: true }
);

//從外部控制要選擇那些選項
watch(
  () => props.selectedValue,
  (list) => {
    if (!list || list?.length === 0) return;
    checkedList.value = list;
  },
  { immediate: true }
);

//變更所選項目
watch(checkedList, (list) => {
  console.log("選擇：", list);
  emit("select", list);
});

watch(keyword, (key) => {
  if (!key || key.trim() === "") {
    optionList.value = props.options;
  } else {
    optionList.value = props.options?.filter((item) => {
      return item?.name?.includes(key);
    });
  }
});
</script>

<style scoped lang="scss">
.wraDropdown {
  user-select: none;
  color: var(--color-text);
  font-size: 18px;
  .selected-dropdown {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    column-gap: 0.25rem;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border: 1px solid var(--neutral-02);
    border-radius: 10px;
    padding: 0 14px;

    height: 40px;
    &.has-wrap {
      min-height: 10px;
      height: auto;
    }
  }
}
.input-search {
  width: calc(100% - 28px);
  padding: 0 15px;

  display: grid;
  grid-template-columns: 18px 1fr;
  place-items: center;
  gap: 10px;
  input {
    width: 100%;
    height: 40px;
    border: none;
    font-size: 18px;
    &:active,
    &:focus {
      outline: none;
    }
  }
}
section {
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  box-shadow: none;
  border: 1px solid #c4c4c4;
  border-radius: 10px;

  background: var(--bg-default);
  z-index: 50;
  overflow: hidden;

  cursor: pointer;
  .wra-options {
    overflow-y: auto;
    overflow-x: hidden;
    .item {
      height: 40px;
      display: grid;
      grid-template-columns: 20px auto;
      gap: 10px;
      align-items: center;
      font-size: 18px;
      padding: 0px 14px;
      line-height: 18px;
      line-height: 1.5;
      cursor: pointer;
      &:hover {
        background: var(--bg-hover);
        color: var(--text-hover);
      }
    }
  }
}
input[type="checkbox"]:checked {
  background: var(--color);
  cursor: pointer;
}
input[type="checkbox"] {
  border: 1px solid var(--color);
}
.text-overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;
  white-space: nowrap;
}
.dropdown-loading {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
