<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex justify-center align-center">
            <v-container class="d-flex flex-column justify-center align-center pa-8" fluid>
                <div class="d-flex justify-center align-center w-100">
                    <div class="chart-container d-flex justify-center align-center w-100">
                        <ag-charts-vue 
                            style="height: 500px; width: 100%;"
                            :options="gastosIncomeOptions"> 
                        </ag-charts-vue>
                    </div>
                </div>
                <div class="d-flex justify-center align-center w-100">
                    <div class="chart-container d-flex justify-center align-center w-100">
                        <ag-charts-vue 
                            style="height: 500px; width: 500px;"
                            :options="categoriaDonutOptions"> 
                        </ag-charts-vue>
                    </div>
                    <div class="chart-container d-flex justify-center align-center w-100">
                        <ag-charts-vue 
                            style="height: 500px; width: 500px;"
                            :options="metodoDonutOptions"> 
                        </ag-charts-vue>
                    </div>
                </div>
                <div class="d-flex flex-column justify-center align-center w-100">
                    <div class="chart-container d-flex justify-center align-center w-100">
                        <ag-charts-vue 
                            style="height: 500px; width: 100%;"
                            :options="categoriaStackedOptions"> 
                        </ag-charts-vue>
                    </div>
                    <div class="chart-container d-flex flex-column justify-center align-center w-100">
                        <ag-charts-vue 
                            style="height: 500px; width: 100%;"
                            :options="metodoStackedOptions"> 
                        </ag-charts-vue>
                    </div>
                </div>
            </v-container>
        </v-main>
        <SystemFooter/>
    </v-app>
</template>
<script>
    import axios from '../services/axios';
    import store from '../store/store';
    import { mapGetters } from 'vuex';
    import { validateUser } from '../services/validateUser';

    export default {
        data() {
            return {
                gastosIncomeOptions: {
                    title: {
                        text: 'Comparativo de gastos e renda mensal'
                    },
                    data: this.fetchGastosIncome(),
                    series: [
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
                        },
                    ],
                    axes: [
                        {
                            type: 'category',
                            position: 'bottom',
                            label: {
                                formatter: params => `Mês ${params.value}`
                            }
                        },
                        {
                            type: 'number',
                            position: 'left',
                            title: {
                                text: 'Valor dos gastos'
                            }
                        },
                    ]
                },
                categoriaDonutOptions: {
                    title: {
                        text: 'Top 5 categorias de gasto'
                    },
                    data: this.fetchCategorias(),
                    series: [{
                        type: 'donut',
                        calloutLabelKey: 'categoriaGasto',
                        angleKey: 'valor',
                        innerRadiusRatio: 0.7
                    }]
                },
                metodoDonutOptions: {
                    title: {
                        text: 'Top 5 métodos de pagamento'
                    },
                    data: this.fetchMetodos(),
                    series: [{
                        type: 'donut',
                        calloutLabelKey: 'metodoPagamento',
                        angleKey: 'valor',
                        innerRadiusRatio: 0.7
                    }]
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
                                formatter: params => `Mês ${params.value}`
                            }
                        },
                        {
                            type: 'number',
                            position: 'left',
                            title: {
                                text: 'Valor dos gastos'
                            }
                        }
                    ]
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
                                formatter: params => `Mês ${params.value}`
                            }
                        },
                        {
                            type: 'number',
                            position: 'left',
                            title: {
                                text: 'Valor dos gastos'
                            }
                        }
                    ]
                }
            };
        },
        computed: {
            ...mapGetters(['id_user']),
        },
        methods: {
            async fetchGastosIncome() {
                try {
                    await validateUser(this.$router);
                } catch {
                    return;
                }

                try {
                    const response = await axios.get('dashboard/DashboardGastosTotalApi/', {
                        params: { 
                            id_user: this.id_user 
                        }
                    });
                    const data = response.data.data;
                    this.gastosIncomeOptions.data = data;
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async fetchCategorias() {
                try {
                    await validateUser(this.$router);
                } catch {
                    return;
                }

                try {
                    const response = await axios.get('dashboard/DashboardTopCategoriasApi/', {
                        params: { 
                            id_user: this.id_user 
                        }
                    });
                    const data = response.data.data;
                    this.categoriaDonutOptions.data = data;
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async fetchMetodos() {
                try {
                    await validateUser(this.$router);
                } catch {
                    return;
                }

                try {
                    const response = await axios.get('dashboard/DashboardTopMetodosApi/', {
                        params: { 
                            id_user: this.id_user 
                        }
                    });
                    const data = response.data.data;
                    this.metodoDonutOptions.data = data;
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async fetchGastosCategorias() {
                try {
                    await validateUser(this.$router);
                } catch {
                    return;
                }

                try {
                    const response = await axios.get('dashboard/DashboardGastosCategoriasApi/', {
                        params: { 
                            id_user: this.id_user 
                        }
                    });
                    const data = response.data.data;
                    this.categoriaStackedOptions.data = data;

                    const categorias = Object.keys(data[0]).filter(key => key !== 'ano' && key !== 'mes');
                    this.categoriaStackedOptions.series = categorias.map(categoria => ({
                        type: 'bar',
                        xKey: 'mes',
                        yKey: categoria,
                        stacked: true,
                        yName: categoria
                    }));
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async fetchGastosMetodos() {
                try {
                    await validateUser(this.$router);
                } catch {
                    return;
                }
                
                try {
                    const response = await axios.get('dashboard/DashboardGastosMetodosApi/', {
                        params: { 
                            id_user: this.id_user 
                        }
                    });
                    const data = response.data.data;
                    this.metodoStackedOptions.data = data;

                    const metodos = Object.keys(data[0]).filter(key => key !== 'ano' && key !== 'mes');
                    this.metodoStackedOptions.series = metodos.map(metodo => ({
                        type: 'bar',
                        xKey: 'mes',
                        yKey: metodo,
                        stacked: true,
                        yName: metodo
                    }));
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            }
        }
    };
</script>
<style scoped>
    .chart-container {
        margin: 20px!important;
    }
</style>