<script setup>
import { ref, onMounted, provide } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";

const buttonList = ref([
  { name: "首頁", path: "/" },
  { name: "demo", path: "/demo" },
  { name: "自動化劇本測試", path: "/vueFlow" },
  { name: "cursor自動產生", path: "/script-editor" },
]);
</script>

<template>
  <div class="flex gap-2 w-full justify-center p-2 bg-yellow-200">
    <router-link :to="btn?.path" v-for="btn in buttonList">{{
      btn?.name
    }}</router-link>
  </div>

  <RouterView></RouterView>
</template>

<style scoped></style>
