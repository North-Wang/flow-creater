<template>
  <div>
    <div class="title">事件說明</div>
    <p class="text-left font-18" v-if="props.event === 'sign'">
      <span>設定當</span>
      <span class="Cyan">顧客註冊後過多久</span>
      <span>，系統即會觸發。請到</span>
      <span class="Cyan">時間</span>
      <span>功能做下一步設定。</span>
    </p>
    <p class="text-left font-18" v-if="props.event === 'cart_abandonment'">
      <span>設定當顧客加入購物車且</span>
      <span class="Cyan">且在幾天內未進行結帳</span>
      <span>，系統即會觸發。請到</span>
      <span class="Cyan">時間</span>
      <span
        >功能做下一步設定。此事件目前僅供API進行觸發來判斷，建議要有技術人員來協助串接。</span
      >
    </p>
    <p class="text-left font-18" v-if="props.event === 'purchase'">
      <span>設定當</span>
      <span class="Cyan">顧客購買後過多久</span>
      <span>，系統即會觸發，您可以選擇購買的項目。完成後請到</span>
      <span class="Cyan">時間</span>
      <span>功能做下一步設定。</span>
    </p>
    <p class="text-left font-18" v-if="props.event === 'scheduled'">
      <span>根據</span>
      <span class="Cyan">指定的時間範圍與頻率</span>
      <span>，系統即會觸發。請到</span>
      <span class="Cyan">時間</span>
      <span>功能做下一步設定。</span>
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  event: string;
}

const props = withDefaults(defineProps<Props>(), {
  event: "sign",
});
</script>

<style scoped lang="scss">
.title {
  color: #71afb6;
  font-size: 18px;
  font-weight: 400;
  margin-right: 0px; //reset
  margin-bottom: 20px;
  text-align: left;
}
</style>
