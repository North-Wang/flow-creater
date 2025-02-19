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
      d="M14.2154 9.01667L14.9819 9.78333L7.433 17.3333H6.66644V16.5667L14.2154 9.01667ZM17.215 4C17.0067 4 16.79 4.08333 16.6317 4.24167L15.1069 5.76667L18.2315 8.89167L19.7563 7.36667C20.0812 7.04167 20.0812 6.51667 19.7563 6.19167L17.8066 4.24167C17.6399 4.075 17.4316 4 17.215 4ZM14.2154 6.65833L5 15.875V19H8.12457L17.34 9.78333L14.2154 6.65833Z"
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
