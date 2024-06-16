<template>
    <v-navigation-drawer expand-on-hover permanent rail>
        <v-list class="avatar-container">
            <v-list-item
                :prepend-avatar="userImage"
                :title="name">
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list 
            class="navigation-container"
            density="compact" 
            nav>
            <v-list-item 
                class="sidebar-item"
                prepend-icon="mdi-stairs" 
                title="Primeiros passos" 
                :class="{ 'v-sidebar-active': isActive('/primeiros-passos') }"
                @click="navigate('/primeiros-passos')">
            </v-list-item>
            <v-list-item 
                class="sidebar-item"
                prepend-icon="mdi-view-grid" 
                title="Categorias de gastos" 
                :class="{ 'v-sidebar-active': isActive('/categoria-gasto') }"
                @click="navigate('/categoria-gasto')">
            </v-list-item>
            <v-list-item 
                class="sidebar-item"
                prepend-icon="mdi-wallet" 
                title="Método de pagamento" 
                :class="{ 'v-sidebar-active': isActive('/metodo-pagamento') }"
                @click="navigate('/metodo-pagamento')" >
            </v-list-item>
            <v-list-item 
                class="sidebar-item"
                prepend-icon="mdi-cash" 
                title="Planilha de gastos" 
                :class="{ 'v-sidebar-active': isActive('/planilha-gasto') }"
                @click="navigate('/planilha-gasto')" >
            </v-list-item>
            <v-list-item 
                class="sidebar-item"
                prepend-icon="mdi-poll" 
                title="Dashboard" 
                :class="{ 'v-sidebar-active': isActive('/dashboard') }"
                @click="navigate('/dashboard')" >
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
    import defaultUserImage from '@/assets/images/defaultUserImage.svg';
    import { mapGetters } from 'vuex';

    export default {
        name: 'SystemSidebar',
        computed: {
            ...mapGetters(['name', 'image']),
            currentRoute() {
                return this.$route.path;
            },
            userImage() {
                return this.image || defaultUserImage;
            },
        },
        methods: {
            isActive(route) {
                return this.currentRoute === route;
            },
            navigate(route) {
                this.$router.push(route);
            }
        }
    }
</script>  
<style scoped>
    .v-navigation-drawer {
        background: var(--gray)!important;
        color: var(--white)!important;
    }

    .navigation-container .v-list-item {
        transition: background-color 0.3s!important;
    }

    .navigation-container .v-list-item:hover,
    .navigation-container .v-sidebar-active {
        background-color: var(--primary-color)!important;
    }

    .navigation-container :deep(.v-list-item__prepend .v-icon) {
        transition: opacity 0.3s!important; 
    }

    .navigation-container :deep(.v-sidebar-active .v-list-item__prepend .v-icon),
    .navigation-container :deep(.v-list-item:hover .v-list-item__prepend .v-icon) {
        opacity: 1!important;
    }
</style>