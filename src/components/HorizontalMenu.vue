<template>
    <v-app-bar permanent order="-1">
        <v-app-bar-title>Teste</v-app-bar-title>
        <v-btn text to="/home">Home</v-btn>
        <v-btn text>{{ user }}</v-btn>
        <v-btn text @click="logout"><v-icon icon="mdi-logout"/></v-btn>
    </v-app-bar>
</template>
<script>
    import { mapGetters } from 'vuex';
    import axios from '../services/axios';

    export default {
        name: 'HorizontalMenu',
        computed: {
            ...mapGetters(['user']),
        },
        methods: {
            async logout() {
                try {
                    await axios.post('logout/LogoutApi/');
                    this.$store.commit('clearUser');
                    this.$router.push('/');
                } catch (error) {
                    this.message = error.response.data.error;
                    this.messageType = 'error';
                }
            }
        }
    }
</script>
<style scoped>
    .v-app-bar.v-toolbar {
        background: var(--black);
        color: var(--white);
    }
</style>