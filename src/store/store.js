import axios from '../services/axios';
import { createStore } from 'vuex';
import { useToast } from 'vue-toastification'

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
        async validateUser({ commit }) {
            try {
                const response = await axios.get('auth/UserAuthApi/');
                commit('setUser', response.data.user);
            } catch (error) {
                commit('clearUser');
                throw error;
            }
        },
        async validateToken({ commit }) {
            try {
                await axios.get('/auth/PasswordAuthApi');
            } catch (error) {
                throw error;
            }
        },
        showToast({ commit }, { message, messageType }) {
            const toast = useToast();
            switch (messageType) {
                case 'success':
                    toast.success(message);
                    break;
                case 'error':
                    toast.error(message);
                    break;
                case 'warning':
                    toast.warning(message);
                    break;
                case 'info':
                    toast.info(message);
                    break;
            }
        },
    },
    getters: {
        user: state => state.user,
    },
});

export default store;