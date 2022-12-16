<template>
  <n-icon
    size="40"
    :component="Star"
    v-for="n in totalStar - (LikeStarNumber ?? 0)"
    :key="n"
  >
  </n-icon>
  <n-icon
    size="40"
    :component="StarOutline"
    v-for="n in LikeStarNumber"
    :key="n"
  >
  </n-icon>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue'
import { StarOutline, Star } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'

const totalStar = 5
const props = defineProps({ liked: Number })
const LikeStarNumber = computed(() => props.liked)
</script>

<style lang="scss" scoped></style>
