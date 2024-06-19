import axios from '../services/axios';
import { createStore } from 'vuex';
import { useToast } from 'vue-toastification';

const store = createStore({
    state: {
        id_user: null,
        user: null,
        name: null,
        image: null,
    },
    mutations: {
        setUser(state, { id_user, username, name, image }) {
            state.id_user = id_user;
            state.user = username;
            state.name = name;
            state.image = image ? `${image}?t=${new Date().getTime()}` : null;
        },
        clearUser(state) {
            state.id_user = null;
            state.user = null;
            state.name = null;
            state.image = null;
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
        async validateEmail({ commit }) {
            try {
                await axios.get('/auth/EmailAuthApi');
            } catch (error) {
                throw error;
            }
        },
        async validatePassword({ commit }) {
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
        id_user: state => state.id_user,
        user: state => state.user,
        name: state => state.name,
        image: state => state.image
    },
});

export default store;