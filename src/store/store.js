import axios from '../services/axios';
import { createStore } from 'vuex';

const store = createStore({
    state: {
        user: null,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        clearUser(state) {
            state.user = null;
        },
    },
    actions: {
        async fetchUser({ commit }) {
            try {
                const response = await axios.get('auth/AuthApi/');
                commit('setUser', response.data.user);
            } catch (error) {
                commit('clearUser');
                throw error;
            }
        },
    },
    getters: {
        user: state => state.user,
    },
});

export default store;