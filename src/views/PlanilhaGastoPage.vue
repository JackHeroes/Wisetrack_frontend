<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex justify-center align-center">
            <v-container class="d-flex justify-center align-center pa-8" fluid>
                <ag-grid-vue
                    class="ag-theme-alpine"
                    rowSelection="multiple"
                    style="height: 100%; width: 100%;"
                    :defaultColDef="defaultColDef"
                    :columnDefs="columnDefs"
                    :rowData="rowData"
                    :dataTypeDefinitions="dataTypeDefinitions"
                    :pinnedTopRowData="pinnedTopRowData"
                    :localeText="localeText"
                    @grid-ready="onGridReady"
                    @selection-changed="onSelectionChanged"
                    @cell-value-changed="onCellValueChanged">
                </ag-grid-vue>
            </v-container>
        </v-main>
        <SystemFooter/>
    </v-app>
</template>
<script>
    import ExcludeButtonRenderer from '../grid/renderers/ExcludeButtonRenderer.vue';
    import axios from '../services/axios';
    import { AG_GRID_LOCALE_PT_BR } from '../grid/locale/locale'; 
    import { currencyFormatter } from '../grid/formatters/formatters';
    import { dataTypeDefinitions } from '../grid/datatype/dataTypeDefinitions';
    import { onBeforeMount, ref } from "vue";
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { validateUser } from '../services/validateUser';

    export default {
        components: {
            ExcludeButtonRenderer
        },
        setup() {
            const router = useRouter();
            const store = useStore();
            const id_user = store.getters['id_user'];

            const defaultColDef = {
                flex: 1,
                editable: true,
                filter: true,
                floatingFilter: true,
                suppressMovable: true,
            };

            const columnDefs = ref([
                { 
                    field: "gasto", 
                    headerName: "Gasto",
                    cellDataType: "text",
                },
                { 
                    field: "gastoData", 
                    headerName: "Data",
                    cellDataType: "dateString",
                },
                {
                    field: "valor",
                    headerName: "Valor",
                    cellDataType: 'number',
                    valueFormatter: currencyFormatter,
                },
                {
                    field: "categoriaGasto",
                    headerName: "Categoria do Gasto",
                    cellDataType: "text",
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: { values: [] },
                },
                {
                    field: "metodoPagamento",
                    headerName: "Método de Pagamento",
                    cellDataType: "text",
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: { values: [] },
                },
                { 
                    field: "obs", 
                    headerName: "Observação",
                    cellDataType: "text",
                },
                {
                    field: "actions",
                    headerName: "Ações",
                    editable: false,
                    filter: false,
                    floatingFilter: false,
                    sortable: false,
                    cellRendererSelector: (params) => {
                        if (params.node.rowPinned) {
                            return null;
                        } else {
                            return {
                                component: 'ExcludeButtonRenderer',
                                params: {
                                    loadGastosData
                                }
                            };
                        }
                    }
                },
            ]);

            const rowData = ref([]);
            const pinnedTopRowData = ref([{ gasto: "", gastoData: "", valor: "", metodoPagamento: "", categoriaGasto: "", obs: "" }]);
            const localeText = ref(AG_GRID_LOCALE_PT_BR);
    
            const validateUserBeforeRequest = async () => {
                try {
                    await validateUser(router);  
                    return true;
                } catch {
                    return false;
                }
            };

            const loadGastosData = async () => {
                try {
                    const response = await axios.get('gastos/GastosApi/', {
                        params: {
                            id_user: id_user
                        }
                    });
                    
                    rowData.value = response.data.results.map(item => ({
                        id_userGastos: item.id_userGastos,
                        gasto: item.gasto,
                        gastoData: item.gastoData,
                        valor: Math.round(item.valor),
                        metodoPagamento: item.metodoPagamento,
                        categoriaGasto: item.categoriaGasto,
                        obs: item.obs,
                    }));
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            };

            const loadCategoriasData = async () => {
                try {
                    const response = await axios.get('categoriaGasto/GastosCategoriaGastoApi/', {
                        params: { 
                            id_user: id_user 
                        }
                    });
                    const categoriasGasto = response.data.results.map(item => item.categoriaGasto);
                    columnDefs.value.find(col => col.field === 'categoriaGasto').cellEditorParams.values = categoriasGasto;
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            };

            const loadMetodosData = async () => {
                try {
                    const response = await axios.get('metodoPagamento/GastosMetodoPagamentoApi/', {
                        params: { 
                            id_user: id_user 
                        }
                    });
                    const metodosPagamento = response.data.results.map(item => item.metodoPagamento);
                    columnDefs.value.find(col => col.field === 'metodoPagamento').cellEditorParams.values = metodosPagamento;
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            };

            const loadData = async () => {    
                if (await validateUserBeforeRequest()) {
                    await Promise.all([loadGastosData(), loadCategoriasData(), loadMetodosData()]);
                }
            };

            onBeforeMount(async () => {
                await loadData();
            });

            let gridApi = null;
            const onGridReady = (params) => {
                gridApi = params.api;
            };

            const onSelectionChanged = () => {
                gridApi.getSelectedRows();
            };

            const addRow = () => {
                const newRow = { gasto: "", gastoData: "", valor: "", metodoPagamento: "", categoriaGasto: "", obs: "" };
                pinnedTopRowData.value = [newRow];
            };

            const onCellValueChanged = async (params) => {
                const rowDataItem = params.data;

                if (!await validateUserBeforeRequest()) {
                    return;
                }

                try {
                    const formData = new FormData();
                    formData.append('id_user', id_user);
                    formData.append('gasto', rowDataItem.gasto);
                    formData.append('gastoData', rowDataItem.gastoData);
                    formData.append('valor', rowDataItem.valor);
                    formData.append('metodoPagamento', rowDataItem.metodoPagamento);
                    formData.append('categoriaGasto', rowDataItem.categoriaGasto);
                    formData.append('obs', rowDataItem.obs);
   
                    if (rowDataItem.id_userGastos) {
                        formData.append('id_userGastos', rowDataItem.id_userGastos);

                        const response = await axios.put('gastos/GastosApi/', formData);

                        store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                    } else {
                        if (rowDataItem.gasto && rowDataItem.gastoData && rowDataItem.valor && rowDataItem.metodoPagamento && rowDataItem.categoriaGasto) {
                            const response = await axios.post('gastos/GastosApi/', formData);
                            
                            rowDataItem.id_userGastos = response.data.id;
                            rowData.value = [...rowData.value, { ...rowDataItem }];
                            pinnedTopRowData.value = [{ gasto: "", gastoData: "", valor: "", metodoPagamento: "", categoriaGasto: "", obs: "" }];

                            store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                        }
                    }

                    await loadGastosData(); 
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            };

            return {
                defaultColDef,
                columnDefs,
                rowData,
                dataTypeDefinitions,
                pinnedTopRowData,
                localeText,
                loadGastosData,
                loadData,
                onGridReady,
                addRow,
                onSelectionChanged,
                onCellValueChanged,
            };
        },
    };
</script>
<style scoped>
    .ag-theme-alpine {
        --ag-alpine-active-color: var(--primary-color)!important; 
        --ag-input-focus-border-color: var(--primary-color)!important;
        --ag-row-hover-color: var(--grid-tertiary-color)!important;
        --ag-selected-row-background-color: var(--grid-secondary-color)!important; 
    }
</style>