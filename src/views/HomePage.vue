<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex flex-column justify-center align-center">
            <h1 class="ma-3">Bem-vindo, {{ user }}!</h1>
            <p class="welcome-message ma-3">Pronto para começar a organizar a sua vida financeira?</p>
            <v-btn 
                class="ma-3"
                @click="navigate('/primeiros-passos')">
                Comece pelos primeiros passos!
            </v-btn>
        </v-main>
        <SystemFooter/>
    </v-app>
</template>
<script>
    import { mapGetters } from 'vuex';
  
    export default {
        computed: {
            ...mapGetters(['user'])
        },
        methods: {
            navigate(route) {
                this.$router.push(route);
            }
        }
    }
</script>
<style scoped>
    .welcome-message {
        font-size: 1.2rem!important;
    }
  
    .v-btn {
        border: 1px solid var(--primary-color)!important;
        color: var(--primary-color)!important;
        transition: all 0.3s ease!important;
    }
  
    .v-btn:hover {
        background-color: var(--primary-color)!important;
        color: var(--white)!important;
    }
</style>