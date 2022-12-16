<template>
  <div class="limitType">
    <div class="item" v-for="(detail, type) in keywords" :key="type">
      <h3>{{ detail.label }}</h3>
      <div class="itemValue">
        <template v-for="(val, index) in detail.value" :key="index">
          <n-button
            v-if="is_object(val)"
            @click="
              setLimit(
                detail.label,
                null,
                getLabelValue(val)[0].toString(),
                index
              )
            "
            class="label"
            icon-placement="right"
            round
            :class="{
              active: setActive(
                detail.label + '/' + getLabelValue(val)[0].toString(),
                ''
              ),
            }"
          >
            <template #icon>
              <n-icon
                v-if="!subItemValueShow[index]"
                size="20"
                :component="Add"
              >
              </n-icon>
              <n-icon
                v-if="subItemValueShow[index]"
                size="20"
                :component="Remove"
              >
              </n-icon>
            </template>
            {{ getLabelValue(val)[0] }}
          </n-button>
          <n-button
            v-show="subItemValueShow[index]"
            round
            v-for="option in getLabelValue(val)[1]"
            @click="
              setLimit(
                detail.label,
                option,
                getLabelValue(val)[0].toString(),
                index
              )
            "
            :key="option"
            :class="{
              active: setActive(
                detail.label + '/' + getLabelValue(val)[0].toString(),
                option
              ),
            }"
          >
            {{ option }}
          </n-button>
          <n-button
            v-if="!is_object(val)"
            :bordered="false"
            round
            type="primary"
            size="medium"
            @click="setLimit(detail.label, val.toString())"
            :class="{ active: setActive(detail.label, val.toString()) }"
          >
            {{ val }}
          </n-button>
        </template>
      </div>
      <n-divider />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NDivider, NButton, NIcon } from 'naive-ui'
import { Add, Remove } from '@vicons/ionicons5'
import { useStore } from 'vuex'
interface Option {
  label: string
  value: string[] | Option[]
}
const store = useStore()
const subItemValueShow = ref([false, false, false])
const keywords: Option[] = [
  {
    label: 'Pääraaka-aine',
    value: [
      'liha',
      'jauheliha',
      'makkara',
      'broileri',
      'kala',
      'äyriäiset',
      'kananmuna',
      'kasvis',
      'kasviproteiini',
      'suklaa',
    ],
  },
  {
    label: 'Ruokalajit',
    value: [
      'keitot',
      'salaatit',
      'pastat',
      'pizzat',
      'hampurilaiset ja täytetyt leivät',
      'pihvit',
      'uuniruoat',
      'pataruoat',
    ],
  },
  {
    label: 'Leivonta ja jälkiruoat',
    value: [
      {
        label: 'makeat leivonnaise',
        value: [
          'juustokakut ja hyydytetyt kakut',
          'kahvikakut',
          'keksit ja pikkuleivät',
          'leivokset',
          'munkit ja donitsit',
          'piirakat ja tortut',
          'täytekakut',
        ],
      },
      {
        label: 'suolaiset leivonnaise',
        value: [
          'leivät ja sämpylät',
          'muut suolaiset leivonnaiset',
          'piirakat ja pasteijat',
        ],
      },
      {
        label: 'jälkiruoa',
        value: [
          'paistokse',
          'keitot, kiisselit ja kastikkee',
          'makeise',
          'letut, pannukakut ja vohvelit',
        ],
      },
    ],
  },
  {
    label: 'Ruokavalio',
    value: [
      'kasvis (lakto-ovo)',
      'vegaaninen',
      'gluteeniton',
      'laktoositon',
      'maidoton',
      'kananmunaton',
    ],
  },
  {
    label: 'Sesongit ja teemat',
    value: [
      'Sadonkorjuu',
      'Itsenäisyyspäivä',
      'Joulu',
      'Uusivuosi',
      'Runebergin päivä',
      'Ystävänpäivä',
      'Laskiainen',
      'Pääsiäinen',
      'Vappu',
      'Juhannus',
      'Grillaus',
      'Halloween',
      'Arkiruoka',
      'Mitä tänään syötäisiin',
    ],
  },
]
const is_object = (val: string | Option) => {
  const parseVal = val as Option
  if (parseVal.value) {
    return true
  }
  return false
}
const getLabelValue = (val: string | Option) => {
  const parseVal = val as Option
  return [parseVal.label, parseVal.value as string[]]
}
const limits = store.state.searchKeyWords.limits
const setLimit = (
  limit_label: string,
  value: string | null,
  objVal_label?: string,
  index = -1
) => {
  const key =
    objVal_label == undefined ? limit_label : limit_label + '/' + objVal_label
  const haskey = limits.has(key)
  if (!value) {
    subItemValueShow.value[index] = !subItemValueShow.value[index]
    //if the button is from subOptions
    store.dispatch('searchKeyWords/toggle_add_by_key', {
      hasItemOrKey: haskey,
      key,
      value,
    })
    return
  }
  if (haskey) {
    const arr = limits.get(key) ?? []
    const hasItem = arr.indexOf(value) >= 0
    store.dispatch('searchKeyWords/toggle_add_by_key', {
      hasItemOrKey: hasItem,
      key,
      value,
    })
    const sub_option_limit =
      store.getters['searchKeyWords/limits_len_by_key'](key)
    if (sub_option_limit < 1 && index >= 0) {
      subItemValueShow.value[index] = false
    }
  } else {
    store.commit('searchKeyWords/ADD_ITEM', { k: key, v: value })
  }
}
const setActive = (label: string, val: string) => {
  if (!val) {
    return limits.has(label)
  }
  const arr = limits.get(label) ?? []
  return arr.indexOf(val) >= 0
}
</script>

<style lang="scss" scoped>
@import '../styles/constants.scss';
.limitType {
  display: flex;
  flex-direction: column;
  .item {
    .itemValue {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .n-button {
      margin-right: 5px;
      margin-top: 5px;
      background: $disabled-background;
      color: $dark;
    }
    .active {
      background: $light-orange;
      border: 1px solid $orange;
    }
  }
}
</style>
