<template>
    <v-navigation-drawer expand-on-hover permanent rail>
        <v-list class="avatar-container">
            <v-list-item
                :prepend-avatar="userImage"
                :ripple="false"
                :title="name"
                @click="navigate('/conta')">
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
                :class="{ 'v-sidebar-active': isActive('/categorias-gasto') }"
                @click="navigate('/categorias-gasto')">
            </v-list-item>
            <v-list-item 
                class="sidebar-item"
                prepend-icon="mdi-wallet" 
                title="Método de pagamento" 
                :class="{ 'v-sidebar-active': isActive('/metodos-pagamento') }"
                @click="navigate('/metodos-pagamento')" >
            </v-list-item>
            <v-list-item 
                class="sidebar-item"
                prepend-icon="mdi-cash" 
                title="Planilha de ganhos" 
                :class="{ 'v-sidebar-active': isActive('/ganhos') }"
                @click="navigate('/ganhos')" >
            </v-list-item>
            <v-list-item 
                class="sidebar-item"
                prepend-icon="mdi-cash" 
                title="Planilha de gastos" 
                :class="{ 'v-sidebar-active': isActive('/gastos-diarios') }"
                @click="navigate('/gastos-diarios')" >
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
    import defaultUserImage from '@images/defaultUser/defaultUserImage.svg';
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