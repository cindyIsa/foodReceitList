import { Module } from 'vuex'
import { rootState } from '..'

export interface Limit {
  k: string
  v: string
}
export interface searchKeyWordsState {
  limits: Map<string, string[]>
}

export const searchKeyWords: Module<searchKeyWordsState, rootState> = {
  namespaced: true,
  state: {
    limits: new Map<string, string[]>(),
  } as searchKeyWordsState,
  actions: {
    toggle_add_by_key: (
      { commit },
      payload: { hasItemOrKey: boolean; key: string; value: string }
    ) => {
      const k = payload.key
      const v = payload.value
      if (payload.hasItemOrKey) {
        commit('DELETE_ITEM', { k, v })
      } else {
        commit('ADD_ITEM', { k, v })
      }
    },
  },
  mutations: {
    DELETE_ITEM: (state, payload: Limit) => {
      const items = state.limits.get(payload.k) ?? []
      items.splice(items.indexOf(payload.v), 1)
      if (items.length < 1 || !payload.v) {
        state.limits.delete(payload.k)
      }
    },
    ADD_ITEM: (state, payload: Limit) => {
      if (!state.limits.has(payload.k)) {
        state.limits.set(payload.k, payload.v ? [payload.v] : [])
      } else {
        state.limits.set(payload.k, [
          payload.v,
          ...(state.limits.get(payload.k) ?? []),
        ])
      }
    },
  },
  getters: {
    limits_len_by_key: (state) => (key: string) => {
      const arr = state.limits.get(key) ?? []
      return arr.length
    },
  },
}
