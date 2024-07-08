<template>
    <div class="d-flex align-center h-100">
        <v-btn 
            variant="text"
            :ripple="false"
            @click="removeRow">
            <v-icon>mdi-delete</v-icon>
        </v-btn>
    </div>
</template>
<script>
    import axios from '../../services/axios';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { validateUser } from '../../services/validateUser';

    export default {
        props: {
            params: Object
        },
        setup(props) {
            const router = useRouter();
            const store = useStore();

            const removeRow = async () => {
                const gridApi = props.params.api;
                const loadGanhosData = props.params.loadGanhosData
                const deletedRow = props.params.data;
                const id_userGanhos = props.params.data.id_userGanhos;

                try {
                    await validateUser(router);  
                } catch (error) {
                    return;
                }

                try {
                    const formData = new FormData();
                    formData.append('id_userGanhos', id_userGanhos);

                    const response = await axios.delete('ganhos/GanhosApi/', { data: formData });

                    gridApi.applyTransaction({ remove: [deletedRow] });
                    
                    await loadGanhosData();  

                    store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            };

            return { removeRow };
        },
    };
</script>
<style scoped>
    .v-btn {
        color: var(--red)!important;
    }
</style>