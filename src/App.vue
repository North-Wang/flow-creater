<script setup>
import { ref, onMounted, provide } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";

const buttonList = ref([
  { name: "首頁", path: "/" },
  { name: "demo", path: "/demo" },
]);
</script>

<template>
  <div class="flex gap-2 w-full justify-center">
    <router-link :to="btn?.path" v-for="btn in buttonList">{{
      btn?.name
    }}</router-link>
  </div>
  <h1 class="bg-yellow-400 p-4 rounded-lg">測試客製化</h1>

  <RouterView></RouterView>
</template>

<style scoped></style>
