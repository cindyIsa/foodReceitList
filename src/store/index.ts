import { createStore } from 'vuex'
import { FoodItem, getReceiptFromDb } from './getReceiptFromDb'
import { searchKeyWords, searchKeyWordsState } from './searchKeyWords'

export interface rootState {
  limitState: searchKeyWordsState
  dbState: Array<FoodItem>
}

export default createStore({
  modules: { searchKeyWords, getReceiptFromDb },
  strict: true,
})
