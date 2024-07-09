<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex justify-center align-center">
            <v-container class="d-flex justify-center align-center pa-8" fluid>
                <ag-grid-vue
                    class="ag-theme-quartz"
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
    import ExcludeGanhosButtonRenderer from '../grid/renderers/ExcludeGanhosButtonRenderer.vue';
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
            ExcludeGanhosButtonRenderer
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
                    field: "ganho", 
                    headerName: "Ganho",
                    cellDataType: "text",
                },
                { 
                    field: "ganhoData", 
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
                                component: 'ExcludeGanhosButtonRenderer',
                                params: {
                                    loadGanhosData
                                }
                            };
                        }
                    }
                },
            ]);

            const rowData = ref([]);
            const pinnedTopRowData = ref([{ ganho: "", ganhoData: "", valor: "", obs: "" }]);
            const localeText = ref(AG_GRID_LOCALE_PT_BR);
    
            const validateUserBeforeRequest = async () => {
                try {
                    await validateUser(router);  
                    return true;
                } catch {
                    return false;
                }
            };

            const loadGanhosData = async () => {
                try {
                    const response = await axios.get('ganhos/GanhosApi/', {
                        params: {
                            id_user: id_user
                        }
                    });
                    
                    rowData.value = response.data.results.map(item => ({
                        id_userGanhos: item.id_userGanhos,
                        ganho: item.ganho,
                        ganhoData: item.ganhoData,
                        valor: Math.round(item.valor),
                        obs: item.obs,
                    }));
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            };

            const loadData = async () => {    
                if (await validateUserBeforeRequest()) {
                    await Promise.all([loadGanhosData()]);
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
                const newRow = { ganho: "", ganhoData: "", valor: "", obs: "" };
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
                    formData.append('ganho', rowDataItem.ganho);
                    formData.append('ganhoData', rowDataItem.ganhoData);
                    formData.append('valor', rowDataItem.valor);
                    formData.append('obs', rowDataItem.obs);
   
                    if (rowDataItem.id_userGanhos) {
                        formData.append('id_userGanhos', rowDataItem.id_userGanhos);

                        const response = await axios.put('ganhos/GanhosApi/', formData);

                        store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                    } else {
                        if (rowDataItem.ganho && rowDataItem.ganhoData && rowDataItem.valor) {
                            const response = await axios.post('ganhos/GanhosApi/', formData);
                            
                            rowDataItem.id_userganhos = response.data.id;
                            rowData.value = [...rowData.value, { ...rowDataItem }];
                            pinnedTopRowData.value = [{ ganho: "", ganhoData: "", valor: "", obs: "" }];

                            store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                        }
                    }

                    await loadGanhosData(); 
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
                loadGanhosData,
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
    .ag-theme-quartz {
        --ag-active-color: var(--primary-color)!important; 
        --ag-input-focus-border-color: var(--primary-color)!important;
        --ag-row-hover-color: var(--grid-tertiary-color)!important;
        --ag-selected-row-background-color: var(--grid-secondary-color)!important; 
    }
</style>