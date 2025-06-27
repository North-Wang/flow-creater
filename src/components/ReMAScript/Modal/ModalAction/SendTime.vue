<template>
  <div class="grid grid-rows-5">
    <label for="" class="selector-title">寄完第一封後</label>
    <section class="flex gap-5">
      <div>發生周期</div>
      <ul class="flex">
        <li v-for="item in cycleOption" :key="item" class="">
          <button
            @click="(item) => (cycleType = item)"
            class="switch-button"
            :class="cycleType === item ? 'switch-button-click' : ''"
          >
            {{ item }}
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const cycleOption = ref(["年", "月", "週", "日"]);
const cycleType = ref("年");
</script>

<style scoped></style>
