// store.js

import { createStore } from 'vuex';

const store = createStore({
    state: {
        user: null // Your shared data here
    },
    mutations: {
        setUser(state, newData) {
            state.user = newData;
        }
    },
    actions: {
        updateUser({ commit }, newUser) {
            commit('setUser', newUser);
        }
    },
    getters: {
        getUser: state => state.user
    }
});

export default store;
