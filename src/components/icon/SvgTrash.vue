<template>
  <svg
    class="icon"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="24" rx="12" :fill="props.color" />
    <path
      d="M15.8102 9.33333V18.2222H8.19113V9.33333H15.8102ZM14.3816 4H9.6197L8.66732 4.88889H6.22287C5.73195 4.88889 5.33398 5.28686 5.33398 5.77778C5.33398 6.2687 5.73195 6.66667 6.22287 6.66667H17.7784C18.2693 6.66667 18.6673 6.2687 18.6673 5.77778C18.6673 5.28686 18.2693 4.88889 17.7784 4.88889H15.334L14.3816 4ZM17.7149 7.55556H6.28637V18.2222C6.28637 19.2 7.14351 20 8.19113 20H15.8102C16.8578 20 17.7149 19.2 17.7149 18.2222V7.55556Z"
      fill="white"
    />
  </svg>
</template>
<script setup>
import { defineProps } from "vue";
const props = defineProps({
  color: {
    type: String,
    default: "white",
  },
});
</script>
