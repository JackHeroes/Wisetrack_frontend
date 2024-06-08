<template>
    <v-app-bar permanent order="-1">
        <v-app-bar-title>Teste</v-app-bar-title>
        <template v-slot:append>
            <div class="v-btn-group d-flex gap-3 h-100">
                <v-btn 
                    class="v-btn-menu"
                    variant="plain"
                    :class="{ 'v-menu-active': isActive('/inicio') }"
                    :ripple="false"
                    @click="navigate('/inicio')">
                    Início
                </v-btn>
                <v-btn 
                    class="v-btn-menu"
                    variant="plain"
                    :ripple="false">
                    {{ user }}
                </v-btn>
                <v-btn 
                    class="v-btn-menu"
                    variant="plain"
                    @click="logout"
                    :ripple="false">
                    Sair
                </v-btn>
            </div>
        </template>
    </v-app-bar>
</template>
<script>
    import axios from '../services/axios';
    import store from '../store/store';
    import { mapGetters } from 'vuex';
 
    export default {
        name: 'SystemMenu',
        computed: {
            ...mapGetters(['user']),
            currentRoute() {
                return this.$route.path;
            }
        },
        methods: {
            async logout() {
                try {
                    await axios.post('logout/LogoutApi/');
                    this.$store.commit('clearUser');
                    this.$router.push('/');
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            isActive(route) {
                return this.currentRoute === route;
            },
            navigate(route) {
                this.$router.push(route);
            },
        }
    }
</script>
<style scoped>
    .v-toolbar {
        background: var(--black)!important;
        color: var(--white)!important;
    }

    .v-toolbar-title {
        margin-inline-start: 30px!important;
    }

    .v-btn-group {
        margin-inline: auto 26px!important;
    }

    .v-btn-menu {
        background-color: transparent!important;
        color: var(--white)!important;
        height: 100%!important;
        opacity: 1!important;
    }

    .v-btn-menu::before {
        background-color: var(--primary-color)!important;
        bottom: 0!important;
        content: ''!important;
        height: 4px!important;
        left: 50%!important;
        position: absolute!important;
        transition: width 0.3s, left 0.3s!important;
        width: 0!important;
    }

    .v-btn-menu:hover::before,
    .v-menu-active::before {
        left: 0!important;
        width: 100%!important;
    }
</style>