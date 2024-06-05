import axios from '../services/axios';
import { createStore } from 'vuex';

const store = createStore({
    state: {
        user: null,
        message: '',
        messageType: '',
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        clearUser(state) {
            state.user = null;
        },
        setMessage(state, { message, messageType }) {
            state.message = message;
            state.messageType = messageType;
        },
        clearMessage(state) {
            state.message = '';
            state.messageType = '';
        }
    },
    actions: {
        async validateUser({ commit }) {
            try {
                const response = await axios.get('auth/UserAuthApi/');
                commit('setUser', response.data.user);
            } catch (error) {
                commit('clearUser');
                commit('setMessage', {
                    message: error.response.data.error,
                    messageType: 'error'
                });
                throw error;
            }
        },
        async validateToken({ commit }) {
            try {
                await axios.get('/auth/PasswordAuthApi');
            } catch (error) {
                commit('setMessage', {
                    message: error.response.data.error,
                    messageType: 'error'
                });
                throw error;
            }
        },
        setMessage({ commit }, payload) {
            commit('setMessage', payload);
        },
        clearMessage({ commit }) {
            commit('clearMessage');
        }
    },
    getters: {
        user: state => state.user,
        message: state => state.message,
        messageType: state => state.messageType,
    },
});

export default store;