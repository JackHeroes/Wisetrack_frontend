<template>
    <v-navigation-drawer expand-on-hover permanent rail>
        <v-list density="compact" nav>
            <v-list-item 
                prepend-icon="mdi-view-grid" 
                title="Categorias de gastos" 
                :class="{ 'v-sidebar-active': isActive('/categoria-gasto') }"
                @click="navigate('/categoria-gasto')">
            </v-list-item>
            <v-list-item 
                prepend-icon="mdi-wallet" 
                title="Método de pagamento" 
                :class="{ 'v-sidebar-active': isActive('/metodo-pagamento') }"
                @click="navigate('/metodo-pagamento')" >
            </v-list-item>
            <v-list-item 
                prepend-icon="mdi-cash" 
                title="Planilha de gastos" 
                :class="{ 'v-sidebar-active': isActive('/planilha-gasto') }"
                @click="navigate('/planilha-gasto')" >
            </v-list-item>
            <v-list-item 
                prepend-icon="mdi-poll" 
                title="Dashboard" 
                :class="{ 'v-sidebar-active': isActive('/dashboard') }"
                @click="navigate('/dashboard')" >
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
    export default {
        name: 'SystemSidebar',
        computed: {
            currentRoute() {
                return this.$route.path;
            }
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

    .v-list-item {
        transition: background-color 0.3s, color 0.3s!important;
    }

    .v-list-item:hover,
    .v-sidebar-active {
        background-color: var(--main-color)!important;
        color: var(--white)!important;
    }

    .v-sidebar-active i {
        opacity: 1!important;
    }
</style>