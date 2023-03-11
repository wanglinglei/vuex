import { createStore } from "../vuex";
const store = createStore({
  state() {
    return {
      count: 0,
    };
  },
  getters: {
    twoCount: (state) => {
      return state.count * 2;
    },
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    addCount({ commit }) {
      setTimeout(() => {
        commit("increment");
      }, 2000);
    },
  },

  modules: {
    AAAA: {
      state() {
        return {
          aaaa: "aaaa",
        };
      },
      modules: {
        AAAAA1111: {
          state() {
            return {
              aaaa1111: "aaaa1111",
            };
          },
        },
      },
    },
    BBBB: {
      state() {
        return {
          aaaa: "aaaa",
        };
      },
      modules: {},
    },
  },
});

export { store };
