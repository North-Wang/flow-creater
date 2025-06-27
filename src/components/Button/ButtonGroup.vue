<!-- <template>
  <div
    v-if="data?.length"
    class="wra-btn-group"
    :style="{
      ...(typeof $attr.styleWraBtnGroup === 'object'
        ? $attr.styleWraBtnGroup
        : {}),
      background: `var(${bgColor})`,
    }"
  >
    <button
      v-for="btn in data"
      :key="btn.name"
      :style="{
        ...(typeof $attr.styleBtn === 'object' ? $attr.styleBtn : {}),
        color:
          btn.name === currentBtn?.name
            ? `var(${textColorActive})`
            : `var(${textColor})`,
        background:
          btn.name === currentBtn?.name ? `var(${bgColorActive})` : ``,
      }"
      @click="handleClick(btn)"
      ref="buttonGroup"
    >
      <slot name="option" :data="btn" :currentBtn="currentBtn">
        <img :src="btn?.img" :alt="btn?.img" class="icon" v-if="btn?.img" />
        {{ btn?.name }}
      </slot>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, useAttrs } from "vue";

//規範每個選項，至少要有參數：name
//[key: string]：是一種型別定義，它允許你在這個物件上使用**任何自訂的 key（必須是字串型態）
interface ButtonOption {
  name: string;
  value?: string;
  img?: string;
  [key: string]: any;
}

interface Props {
  data?: ButtonOption[];
  textColor?: string;
  textColorActive?: string;
  bgColor?: string;
  bgColorActive?: string;
}

const $attr = useAttrs();
const emits = defineEmits<{
  (e: "click", btn: ButtonOption): String;
}>();
const props = withDefaults(defineProps<Props>(), {
  data: () => [
    { name: "紐約", value: "new-york" },
    { name: "洛杉磯", value: "los-angeles" },
    { name: "聖地牙哥", value: "san-diego" },
  ],
  textColor: "--neutral-04",
  textColorActive: "--neutral-00",
  bgColor: "--color-brand-01",
  bgColorActive: "--color-brand-05",
});
const buttonGroup = ref<HTMLButtonElement[] | null>(null);
const currentBtn = ref<ButtonOption>({ name: "" });

/**
 * @param {string} text
 * */
function handleClick(data) {
  console.log("click:", data);
  currentBtn.value = data;
  emits("click", data);
}

onMounted(() => {
  if (props.data?.length) {
    currentBtn.value = props.data[0];
  }
});
</script>

<style scoped lang="scss">
.wra-btn-group {
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  user-select: none;
  button {
    height: 40px;
    width: fit-content;
    border-radius: 10px;
    border: none;
    font-family: "Noto Sans TC", sans-serif;
    font-weight: 400;
    font-size: 18px;
    white-space: nowrap;
    word-wrap: nowrap;
    padding: 7px 30px;

    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 10px;
    cursor: pointer;
  }
  .icon {
    height: 18px;
  }
}
</style> -->
