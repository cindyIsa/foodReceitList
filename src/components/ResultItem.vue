<template>
  <div class="resultScr">
    <div v-if="data.length < 1">no data</div>
    <div v-for="(result, index) in data" :key="index">
      <img :src="result.Url" :alt="result.FoodName" class="itemImage" />
      <div class="itemInfo">
        <div class="infoTop">
          <span>{{ result.FoodName }}</span>
        </div>
        <div class="infoBot">
          <StarCmt :liked="liked()"></StarCmt>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
import StarCmt from './StarCmt.vue'

let data = computed(() => useStore().state.getReceiptFromDb.foods)
const liked = () => Math.floor(Math.random() * 5)
</script>

<style lang="scss">
.resultScr {
  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: center;
  grid-gap: 10px;
}
</style>
