<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex justify-center align-center">
            <v-container class="d-flex flex-column justify-center align-center pa-8" fluid>
                <div class="d-flex justify-center align-center w-100 ga-5 mb-8">
                    <v-card class="info-card rounded-xl" width="350px">
                        <v-card-title class="d-flex justify-space-between">
                            <span>Saldo atual</span>
                            <v-icon color="blue">mdi-bank</v-icon>
                        </v-card-title>
                        <v-card-text>{{ totalBalance }}</v-card-text>
                    </v-card>
                    <v-card class="info-card rounded-xl" width="350px">
                        <v-card-title class="d-flex justify-space-between">
                            <span>Receitas</span>
                            <v-icon color="green">mdi-arrow-up</v-icon>
                        </v-card-title>
                        <v-card-text>{{ totalIncome }}</v-card-text>
                    </v-card>
                    <v-card class="info-card rounded-xl" width="350px">
                        <v-card-title class="d-flex justify-space-between">
                            <span>Despesas</span>
                            <v-icon color="red">mdi-arrow-down</v-icon>
                        </v-card-title>
                        <v-card-text>{{ totalExpenses }}</v-card-text>
                    </v-card>
                </div>
                <div class="d-flex justify-center align-center w-100">
                    <v-card class="chart-container d-flex justify-center align-center rounded-xl w-100 mb-8">
                        <ag-charts-vue 
                            style="height: 500px; width: 100%;"
                            :options="gastosIncomeOptions"> 
                        </ag-charts-vue>
                    </v-card>
                </div>
                <div class="d-flex justify-center align-center w-100">
                    <v-card class="chart-container d-flex justify-center align-center rounded-xl w-100 me-4 mb-8">
                        <ag-charts-vue 
                            style="height: 500px; width: 500px;"
                            :options="categoriaDonutOptions"> 
                        </ag-charts-vue>
                    </v-card>
                    <v-card class="chart-container d-flex justify-center align-center rounded-xl w-100 ms-4 mb-8">
                        <ag-charts-vue 
                            style="height: 500px; width: 500px;"
                            :options="metodoDonutOptions"> 
                        </ag-charts-vue>
                    </v-card>
                </div>
                <div class="d-flex flex-column justify-center align-center w-100">
                    <v-card class="chart-container d-flex justify-center align-center rounded-xl w-100 mb-8">
                        <ag-charts-vue 
                            style="height: 500px; width: 100%;"
                            :options="categoriaStackedOptions"> 
                        </ag-charts-vue>
                    </v-card>
                    <v-card class="chart-container d-flex justify-center align-center rounded-xl w-100">
                        <ag-charts-vue 
                            style="height: 500px; width: 100%;"
                            :options="metodoStackedOptions"> 
                        </ag-charts-vue>
                    </v-card>
                </div>
            </v-container>
        </v-main>
        <SystemFooter/>
    </v-app>
</template>
<script>
    import axios from '../services/axios';
    import locale from '../charts/locale/locale';
    import store from '../store/store';
    import { getMonthName } from '../charts/month/getMonthName';
    import { mapGetters } from 'vuex';
    import { validateUser } from '../services/validateUser';

    export default {
        data() {
            return {
                totalIncome: 'R$ 0,00',
                totalExpenses: 'R$ 0,00',
                totalBalance: 'R$ 0,00',
                gastosIncomeOptions: {
                    title: {
                        text: 'Comparativo de gastos e renda mensal'
                    },
                    data: this.fetchGastosIncome(),
                    series: [],
                    axes: [
                        {
                            type: 'category',
                            position: 'bottom',
                            label: {
                                formatter: params => getMonthName(params.value)
                            }
                        },
                        {
                            type: 'number',
                            position: 'left',
                            title: {
                                text: 'Valor dos gastos'
                            }
                        },
                    ],
                    overlays: locale.overlays,
                    background: {
                        fill: '#E4CDFB',
                    },
                },
                categoriaDonutOptions: {
                    title: {
                        text: 'Top cinco categorias de gasto'
                    },
                    data: this.fetchCategorias(),
                    series: [],
                    overlays: locale.overlays,
                    background: {
                        fill: '#E4CDFB',
                    },
                },
                metodoDonutOptions: {
                    title: {
                        text: 'Top cinco métodos de pagamento'
                    },
                    data: this.fetchMetodos(),
                    series: [],
                    overlays: locale.overlays,
                    background: {
                        fill: '#E4CDFB',
                    },
                },
                categoriaStackedOptions: {
                    title: {
                        text: 'Gastos por categoria por mês'
                    },
                    data: this.fetchGastosCategorias(),
                    series: [],
                    axes: [
                        {
                            type: 'category',
                            position: 'bottom',
                            label: {
                                formatter: params => getMonthName(params.value)
                            }
                        },
                        {
                            type: 'number',
                            position: 'left',
                            title: {
                                text: 'Valor dos gastos'
                            }
                        }
                    ],
                    overlays: locale.overlays,
                    background: {
                        fill: '#E4CDFB',
                    },
                },
                metodoStackedOptions: {
                    title: {
                        text: 'Gastos por método de pagamento por mês'
                    },
                    data: this.fetchGastosMetodos(),
                    series: [],
                    axes: [
                        {
                            type: 'category',
                            position: 'bottom',
                            label: {
                                formatter: params => getMonthName(params.value)
                            }
                        },
                        {
                            type: 'number',
                            position: 'left',
                            title: {
                                text: 'Valor dos gastos'
                            }
                        }
                    ],
                    overlays: locale.overlays,
                    background: {
                        fill: '#E4CDFB',
                    },
                }
            };
        },
        mounted() {
            this.fetchCardsData();
        },
        computed: {
            ...mapGetters(['id_user']),
        },
        methods: {
            async fetchCardsData() {
                try {
                    await validateUser(this.$router);
                } catch {
                    return;
                }

                try {
                    const response = await axios.get('dashboard/DashboardCardsApi/', {
                        params: {
                            id_user: this.id_user
                        }
                    });
                    const data = response.data.data;

                    this.totalIncome = this.formatCurrency(data.total_income);
                    this.totalExpenses = this.formatCurrency(data.total_expenses);
                    this.totalBalance = this.formatCurrency(data.total_balance);
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async fetchGastosIncome() {
                try {
                    await validateUser(this.$router);
                } catch {
                    return [];
                }

                try {
                    const response = await axios.get('dashboard/DashboardGastosTotalApi/', {
                        params: { 
                            id_user: this.id_user 
                        }
                    });
                    const data = response.data.data;

                    this.gastosIncomeOptions.data = Array.isArray(data) ? data : [];
                    this.gastosIncomeOptions.series = [
                        {
                            type: 'bar',
                            xKey: 'mes',
                            yKey: 'income',
                            yName: 'Renda',
                            grouped: true,
                        },
                        {
                            type: 'bar',
                            xKey: 'mes',
                            yKey: 'valor',
                            yName: 'Gastos',
                            grouped: true,
                        },
                        {
                            type: 'line',
                            xKey: 'mes',
                            yKey: 'difference',
                            yName: 'Saldo',
                            strokeWidth: 3,
                            marker: {
                                size: 10
                            }
                        }
                    ];
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async fetchCategorias() {
                try {
                    await validateUser(this.$router);
                } catch {
                    return [];
                }

                try {
                    const response = await axios.get('dashboard/DashboardTopCategoriasApi/', {
                        params: { 
                            id_user: this.id_user 
                        }
                    });
                    const data = response.data.data;

                    this.categoriaDonutOptions.data = Array.isArray(data) ? data : [];
                    this.categoriaDonutOptions.series = [{
                        type: 'donut',
                        calloutLabelKey: 'categoriaGasto',
                        angleKey: 'valor',
                        innerRadiusRatio: 0.7
                    }];
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async fetchMetodos() {
                try {
                    await validateUser(this.$router);
                } catch {
                    return [];
                }

                try {
                    const response = await axios.get('dashboard/DashboardTopMetodosApi/', {
                        params: { 
                            id_user: this.id_user 
                        }
                    });
                    const data = response.data.data;

                    this.metodoDonutOptions.data = Array.isArray(data) ? data : [];
                    this.metodoDonutOptions.series = [{
                        type: 'donut',
                        calloutLabelKey: 'metodoPagamento',
                        angleKey: 'valor',
                        innerRadiusRatio: 0.7
                    }];
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async fetchGastosCategorias() {
                try {
                    await validateUser(this.$router);
                } catch {
                    return [];
                }

                try {
                    const response = await axios.get('dashboard/DashboardGastosCategoriasApi/', {
                        params: { 
                            id_user: this.id_user 
                        }
                    });
                    const data = response.data.data;

                    this.categoriaStackedOptions.data = Array.isArray(data) ? data : [];
                    if (Array.isArray(data) && data.length > 0) {
                        const categorias = Object.keys(data[0]).filter(key => key !== 'ano' && key !== 'mes');
                        this.categoriaStackedOptions.series = categorias.map(categoria => ({
                            type: 'bar',
                            xKey: 'mes',
                            yKey: categoria,
                            stacked: true,
                            yName: categoria
                        }));
                    }
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async fetchGastosMetodos() {
                try {
                    await validateUser(this.$router);
                } catch {
                    return [];
                }
                
                try {
                    const response = await axios.get('dashboard/DashboardGastosMetodosApi/', {
                        params: { 
                            id_user: this.id_user 
                        }
                    });
                    const data = response.data.data;

                    this.metodoStackedOptions.data = Array.isArray(data) ? data : [];
                    if (Array.isArray(data) && data.length > 0) {
                        const metodos = Object.keys(data[0]).filter(key => key !== 'ano' && key !== 'mes');
                        this.metodoStackedOptions.series = metodos.map(metodo => ({
                            type: 'bar',
                            xKey: 'mes',
                            yKey: metodo,
                            stacked: true,
                            yName: metodo
                        }));
                    }
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            formatCurrency(value) {
                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
            },
        }
    };
</script>
<style scoped>
    .info-card,
    .chart-container {
        background-color: var(--tertiary-color)!important;
    }

    .info-card .v-card-title span {
        font-size: 1rem!important;
        font-weight: lighter!important;
    }

    .info-card .v-card-title .v-icon {
        font-size: 2rem!important;
    }

    .info-card .v-card-text {
        font-size: 1.5rem!important;
        font-weight: bold!important;
    }

    .chart-container {
        padding: 2rem!important;
    }
</style>