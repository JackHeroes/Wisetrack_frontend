import store from '../store/store';

export async function validatePassword(router) {
    try {
        await store.dispatch('validatePassword');
    } catch (error) {
        router.push('/');
        store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
        throw error;
    }
}