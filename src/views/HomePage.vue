<template>
    <v-app>
        <HorizontalMenu/>
        <SidebarMenu/>
        <v-main class="d-flex justify-center align-center" order="-1">
            <h1>Bem-vindo {{ user }}!</h1>
        </v-main>
        <FooterCustom/>
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