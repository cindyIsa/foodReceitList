<template>
  <div ref="container" class="container">
    <div class="receipt">
      <h1>Mitä tänään syötäisiin</h1>
      <div class="search">
        <InputWithTag :tags="tags" @getInputVal="inputVal"></InputWithTag>
        <PopOver>
          <template v-slot:triggerBtn>
            <n-button class="limit">
              <template #icon>
                <n-icon>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#F86800"
                      fill-rule="evenodd"
                      d="M19.25 9.378V3a.75.75 0 1 1 1.5 0v6.378a2.25 2.25 0 0 1 0 4.244V21a.75.75 0 1 1-1.5 0v-7.378a2.25 2.25 0 0 1 0-4.244zm-8-.756a2.25 2.25 0 0 1 0-4.244V3a.75.75 0 1 1 1.5 0v1.378a2.25 2.25 0 0 1 0 4.244V21a.75.75 0 1 1-1.5 0V8.622zm-6.5 6.756a2.25 2.25 0 0 1 0 4.244V21a.75.75 0 1 1-1.5 0v-1.378a2.25 2.25 0 0 1 0-4.244V3a.75.75 0 0 1 1.5 0v12.378zM4 18.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm8-11a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm8 5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"
                    ></path>
                  </svg>
                </n-icon>
              </template>
              Rajaa
            </n-button>
          </template>
          <template v-slot:popContent>
            <ReceiptLimit></ReceiptLimit>
          </template>
        </PopOver>
      </div>
    </div>
    <ResultItem></ResultItem>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { NButton, NIcon } from 'naive-ui'
import ReceiptLimit from '../components/ReceiptLimit.vue'
import InputWithTag from '../components/InputWithTag.vue'
import PopOver from '../components/PopOver.vue'
// import ResultItem from '../components/ResultItem.vue'
import { defineAsyncComponent, onMounted, onUnmounted } from '@vue/runtime-core'

const store = useStore()
let tags = store.state.searchKeyWords.limits
const container = ref<HTMLElement | undefined>(undefined)
const input = ref('')

const ResultItem = defineAsyncComponent(
  () => import('../components/ResultItem.vue')
)
const inputVal = (val: string) => {
  input.value = val
}
const limit = {
  keyword: input.value == '' ? 'all' : input.value,
  page: 0,
  load_more: false,
}
const scrollbtm = (e: Event) => {
  const el = container.value
  const scrollHeight = el?.getBoundingClientRect().bottom as number
  const innerHeight = window.innerHeight
  // the cursor is in the botton of page
  if (scrollHeight <= innerHeight) {
    store.dispatch('getReceiptFromDb/getFromDb', {
      ...limit,
      page: limit.page++,
      load_more: true,
    })
  }
}
// onBeforeMount
onMounted(() => {
  store.dispatch('getReceiptFromDb/getFromDb', limit)
  window.addEventListener('scroll', scrollbtm)
})
onUnmounted(() => {
  window.removeEventListener('scroll', scrollbtm)
})
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 5px;
}
.receipt {
  padding: 20px;
  display: flex;
  width: 70%;
  margin: 0 auto;
  flex-direction: column;
  justify-content: center;
  * {
    display: flex;
    justify-content: center;
  }
  .search {
    z-index: 3;
  }
  .n-button,
  .n-input {
    height: 50px;
  }
  .n-button.limit {
    margin-left: 20px;
  }
}

:deep(.n-input .n-input__input-el) {
  height: 50px;
}
</style>
