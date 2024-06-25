<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex justify-center align-center">
            <v-container class="d-flex justify-center align-center pa-8" fluid>
                <v-timeline align="start">
                    <v-timeline-item
                        v-for="(item, i) in items"
                        fill-dot
                        :dot-color="item.color"
                        :icon="item.icon"
                        :key="i">
                        <v-card>
                            <v-card-title 
                                class="cursor-pointer"
                                :style="{ backgroundColor: item.color }"
                                @click="navigate(item.route)">
                                {{ item.title }}
                            </v-card-title>
                            <v-card-text>
                                <p>{{ item.text }}</p>
                            </v-card-text>
                        </v-card>
                    </v-timeline-item>
                </v-timeline>
            </v-container>
        </v-main>
        <SystemFooter/>
    </v-app>
</template>
<script>
    export default {
        data() {
            return {
                items: [
                    {
                        color: 'var(--primary-color)',
                        icon: 'mdi-currency-usd',
                        title: 'Cadastre sua renda mensal',
                        text: 'Adicione sua renda mensal para um acompanhamento mais preciso das suas finanças. Com isso, você poderá gerar gráficos e relatórios detalhados no dashboard, tendo uma visão clara de seus ganhos e gastos',
                        route: '/conta'
                    },
                    {
                        color: 'var(--secondary-color)',
                        icon: 'mdi-view-grid',
                        title: 'Cadastre suas categorias de gasto',
                        text: 'Organize seus gastos cadastrando diferentes categorias como alimentação, transporte, saúde, lazer, dentre outros. Isso ajudará a monitorar melhor suas finanças',
                        route: '/categorias-gasto'
                    },
                    {
                        color: 'var(--primary-color)',
                        icon: 'mdi-wallet',
                        title: 'Cadastre seus métodos de pagamento',
                        text: 'Adicione seus métodos de pagamento, como cartões de crédito, débito, dentre outros. Para acompanhar suas despesas de forma mais eficiente',
                        route: '/metodos-pagamento'
                    },
                    {
                        color: 'var(--secondary-color)',
                        icon: 'mdi-cash',
                        title: 'Cadastre seus gastos diários',
                        text: 'Registre todas as suas despesas diárias. Isso permitirá que você mantenha um controle preciso sobre para onde seu dinheiro está indo',
                        route: '/gastos-diarios'
                    },
                    {
                        color: 'var(--primary-color)',
                        icon: 'mdi-poll',
                        title: 'Visualize seu dashboard',
                        text: 'Acompanhe suas finanças através de gráficos e relatórios no dashboard. Tenha uma visão clara de seus gastos',
                        route: '/dashboard'
                    },
                ],
            };
        },
        methods: {
            navigate(route) {
                this.$router.push(route);
            }
        }
    }
</script>
<style scoped>
    .v-card-title {
        color: var(--white)!important;
        font-size: 1.2rem!important;
    }

    .v-card-text {
        background-color: var(--white)!important;
        font-size: 1rem!important;
        padding: 1rem!important;
    }

    :deep(.v-timeline-divider__inner-dot .v-icon) {
        color: var(--white)!important;
    }
</style>