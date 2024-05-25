<template>
    <v-navigation-drawer expand-on-hover permanent rail>
        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-view-grid" title="Categorias de gastos" @click="navigate('/categoria-gasto')" value="Categorias de gastos"></v-list-item>
            <v-list-item prepend-icon="mdi-wallet" title="Método de pagamento" @click="navigate('/metodo-pagamento')" value="Método de pagamento"></v-list-item>
            <v-list-item prepend-icon="mdi-cash" title="Planilha de gastos" @click="navigate('/planilha-gasto')" value="Planilha de gastos"></v-list-item>
            <v-list-item prepend-icon="mdi-poll" title="Dashboard" @click="navigate('/dashboard')" value="Dashboard"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
    export default {
        name: 'NavigationDrawer',
        methods: {
            navigate(route) {
                this.$router.push(route);
            }
        }
    }
</script>
<style scoped>
    .v-navigation-drawer {
        background: var();
    }
</style>