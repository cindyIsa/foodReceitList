<template>
  <div class="cover" v-show="show" @click="getData"></div>
  <div class="popOver">
    <div class="trigger" @click="show = !show">
      <slot name="triggerBtn"></slot>
      <n-icon v-if="show" :component="Triangle"> </n-icon>
    </div>
    <div v-if="show" class="content">
      <slot name="popContent"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Triangle } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
export default defineComponent({
  components: { NIcon },
  setup() {
    const show = ref(false)
    const getData = () => {
      show.value = false
    }
    return { Triangle, show, getData }
  },
})
</script>

<style lang="scss" scoped>
.cover {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}
.popOver {
  .trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    .n-icon {
      color: #f86801;
      font-size: 23px;
    }
  }
  .content {
    position: absolute;
    width: 80%;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid #eee;
    background: snow;
    padding: 10px;
    margin-top: -2px;
    border-top: 2px solid #f86801;
  }
}
</style>
