import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
let state = {
  visitedViews: [{
    name: '工作台',
    path: '/workbench'
  }],
};
let mutations = {
  ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.name === view.name)) return;
      state.visitedViews.push({
        name: view.name,
        path: view.path,
      })
  },
  DEL_VISITED_VIEWS: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.name === view.name) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
};
let actions = {
  addVisitedViews({
    commit
  }, view) {
    commit('ADD_VISITED_VIEWS', view)
  },
  delVisitedViews({
    commit,
    state
  }, view) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
};
export default new Vuex.Store({
  state,
  mutations,
  actions
});
