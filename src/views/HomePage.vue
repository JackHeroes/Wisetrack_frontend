<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex justify-center align-center">
            <h1>Bem-vindo {{ user }}!</h1>
        </v-main>
        <SystemFooter/>
    </v-app>
</template>
<script>
    import { mapGetters } from 'vuex';

    export default {
        computed: {
            ...mapGetters(['user']),
        },
    }
</script>
<style>
</style>