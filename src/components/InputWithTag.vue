<template>
  <n-input
    placeholder="hae reseptiä"
    v-model:value="input"
    @keyup="updateFoods"
  >
    <template #prefix>
      <n-icon size="40" :component="Search" v-if="allowded_items.length == 0">
      </n-icon>
      <n-button round class="tag hidden" v-if="allowded_items.length > 2"
        >...</n-button
      >
      <n-button
        round
        class="tag"
        v-for="[key, val] in allowded_items"
        :key="key"
        @click="removeItem({ k: key, v: val })"
      >
        {{ formatedTag({ key, val }) }}
        <n-icon size="15" :component="Close"> </n-icon>
      </n-button>
    </template>
  </n-input>
</template>

<script lang="ts" setup>
import { computed, defineEmits, ref } from 'vue'
import { NInput, NIcon, NButton } from 'naive-ui'
import { Search, Close } from '@vicons/ionicons5'
import { useStore } from 'vuex'

const store = useStore()
const limits: Map<string, string[]> = store.state.searchKeyWords.limits
const max_show = 2
const input = ref('')
const emit = defineEmits<{ (event: 'getInputVal', val: string): void }>()
const updateFoods = async (e: KeyboardEvent) => {
  if (e.code == 'Enter') {
    emit('getInputVal', input.value)
    await store.dispatch('getReceiptFromDb/getFromDb', {
      keyword: input.value == '' ? 'all' : input.value,
      page: 0,
      load_more: false,
    })
  }
}

const allowded_items = computed(() => {
  const showed_items: Array<[string, string]> = []
  limits.forEach((limit, key) => {
    if (showed_items.length > max_show) {
      return
    }
    if (limit.length < 1) {
      showed_items.push([key, ''])
    } else {
      if (showed_items.indexOf([key, ''])) {
        showed_items.splice(showed_items.indexOf([key, '']), 1)
      }
      for (const val of limit) {
        showed_items.push([key, val])
        if (showed_items.length > max_show) {
          break
        }
      }
    }
  })
  return showed_items
})
const removeItem = (item: { k: string; v: string }) => {
  store.commit('searchKeyWords/DELETE_ITEM', item)
}
const formatedTag = (state: { key: string; val: string }) => {
  const maxShowStringLen = 7
  const value = state.val == '' ? state.key : state.val
  if (value.length > maxShowStringLen) {
    return value.slice(0, maxShowStringLen) + '...'
  }
  return value
}
</script>

<style lang="scss" scoped>
:deep(.n-input .n-input__prefix) {
  max-width: 300px;
}

.tag {
  border: 1px solid #fff;
  padding: 0 5px;
  width: 100px;
  display: flex;
  align-items: center;
  background: rgb(255, 255, 255);
  overflow: hidden;
  color: #888;
  .n-icon {
    cursor: pointer;
    position: absolute;
    right: 5px;
  }
}
.hidden {
  width: auto;
}
</style>
