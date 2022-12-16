import { Module } from 'vuex'
import axios from 'axios'
import { rootState } from '..'

export interface FoodItem {
  foodname: string
  url: string
  time: string
}

export const getReceiptFromDb: Module<{ foods: Array<FoodItem> }, rootState> = {
  namespaced: true,
  state: { foods: Array<FoodItem>() },
  actions: {
    getFromDb: (
      { commit },
      search: { keyword: string; page: number; load_more: boolean }
    ) => {
      const limit = 30
      axios
        .get(
          'http://localhost:8080/api/get/' +
            search.page +
            '/' +
            limit +
            '/' +
            search.keyword
        )
        .then((response) => {
          if (search.load_more) {
            commit('LOAD_MORE_DATA', response.data as FoodItem[])
          } else {
            commit('LOAD_DATA', response.data as FoodItem[])
          }
        })
    },
  },
  mutations: {
    LOAD_MORE_DATA: (state, data: FoodItem[]) => {
      state.foods.push(...data)
    },
    LOAD_DATA: (state, data: FoodItem[]) => {
      state.foods = data
    },
  },
}
