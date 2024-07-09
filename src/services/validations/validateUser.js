import store from '@store/store';

export async function validateUser(router) {
    try {
        await store.dispatch('validateUser');
    } catch (error) {
        router.push('/');
        store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
        throw error;
    }
}