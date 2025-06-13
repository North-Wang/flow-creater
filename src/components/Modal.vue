<template>
  <div
    class="modal-bg"
    :style="setBackgroundStyle"
    @click.self="clickBackground"
  >
    <transition name="slide-fade">
      <ul
        class="modal-contents"
        ref="modalModule"
        :style="setModalStyle"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
        v-show="showModal"
      >
        <!-- modal header -->
        <li class="header White" :style="setHeaderStyle" v-if="hasHeader">
          <div class="d-flex">
            <img
              :src="goBackIcon"
              alt="go-back-icon"
              class="cursor-pointer"
              @click.self="closeModal"
              v-show="hasBackIcon"
            />
            <div :style="setHeaderTitleStyle">
              <slot name="headerTitle"></slot>
            </div>
          </div>

          <img
            :src="whiteX"
            alt="close-modal"
            class="w-2.5 h-2.5 cursor-pointer"
            @click.self="closeModal"
            v-show="hasXMark"
          />
        </li>
        <!-- modal body -->
        <li class="body flex flex-col" :style="setBodyStyle">
          <slot name="modalContent"></slot>
          <!-- default button -->
          <slot name="body-bottom">
            <div :style="setBodyBottom" v-if="hasBodyButtonList">
              <button
                class="button-basic"
                :style="setButtonStyle"
                @click="clickButton"
              >
                確認
              </button>
            </div>
          </slot>
        </li>
        <li class="footer" :style="setFooterStyle" v-if="hasFooter">
          <slot name="footer">
            <div class="footer-default-content">footer default content</div>
          </slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps } from "vue";
import whiteX from "../assets/icons/whiteX.svg";
// import goBackIcon from "../assets/icons/white-left-arrow.svg";

const props = defineProps({
  modalId: {
    //用來辨識是哪一個彈窗
    type: String,
    default: "modalModule",
  },
  /* ----- 是否顯示 start ----- */
  hasHeader: {
    type: Boolean,
    default: true,
  },
  hasBackIcon: {
    //標頭的返回箭頭
    type: Boolean,
    default: false,
  },
  hasXMark: {
    //右上角關閉彈窗的icon
    type: Boolean,
    default: true,
  },
  hasBodyButtonList: {
    //是否顯示body下方的按鈕列
    type: Boolean,
    default: true,
  },
  hasFooter: {
    type: Boolean,
    default: false,
  },
  /* ----- 是否顯示 end ----- */

  /* ----- 設定style start ----- */
  //背景的style
  setBackgroundStyle: {
    type: Object,
    default: () => ({}),
  },
  //整個彈窗的style。可設定maxWidth、width、height
  setModalStyle: {
    type: Object,
    default: () => ({
      width: "60%",
    }),
  },
  //標頭
  setHeaderStyle: {
    type: Object,
    default: () => ({}),
  },
  //標頭的標題
  setHeaderTitleStyle: {
    type: Object,
    default: () => ({}),
  },
  //標窗內容
  setBodyStyle: {
    type: Object,
    default: () => ({
      padding: "25px 20px 20px 20px",
    }),
  },
  //預設的按鈕的style
  setButtonStyle: {
    type: Object,
    default: () => ({}),
  },
  //彈窗內容下方的按鈕區域的style
  setBodyBottom: {
    type: Object,
    default: () => ({
      justifyContent: "end",
      marginTop: "25px",
      display: "flex",
    }),
  },
  setFooterStyle: {
    type: Object,
    default: () => ({}),
  },

  /* ----- 設定style end ----- */
});
const emits = defineEmits(["closeModal", "clickButton"]);
const modalModule = ref(null);
const showModal = ref(false);

const closeModal = (e) => {
  /* 延遲關閉彈窗，才有時間出現轉場效果 */
  showModal.value = false;
  setTimeout(() => {
    emits("closeModal");
  }, 500);
};

const clickButton = () => {
  emits("clickButton");
};

const clickBackground = () => {
  /* 在背景綁定此function來關閉彈窗，不使用onClickOutside() */
  /* 因為如果彈窗內有第二層彈窗的時候，關閉第二層彈窗時會連第一層也關閉 */
  closeModal();
};

onMounted(() => {
  showModal.value = true;
});
</script>

<style scoped>
.justify-end {
  justify-content: end;
}
.modal-bg {
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.4);
  position: fixed;
  z-index: 100;
  display: flex;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
}
.modal-contents {
  width: 100%;
  background-color: white;
  opacity: 1;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;

  font-family: "Noto Sans TC", sans-serif;
  font-size: 18px;
  color: #575757;
}
.header {
  height: 30px;
  background: var(--unnamed, linear-gradient(90deg, #b5dbe0 0%, #70aeb5 100%));
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 15px;
}
.footer-default-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  text-align: center;
  padding: 12px;
}

/* 進場動畫 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
  transition-delay: 0.1s;
}

.slide-fade-leave-active {
  transition: all 0.3s linear;
  transition-delay: 0.1s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
