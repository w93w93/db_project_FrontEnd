import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  userId: null
}

const mutations = {
  set (state, [variable, value]) {
    state[variable] = value
  }
}

export default new Vuex.Store({
  state,
  mutations
})