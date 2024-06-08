<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex justify-center align-center">
            <ag-grid-vue
                class="ag-theme-alpine pa-8"
                style="height: 100%; width: 100%;"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowData="rowData"
                :dataTypeDefinitions="dataTypeDefinitions">
            </ag-grid-vue>
        </v-main>
        <SystemFooter/>
    </v-app>
</template>
<script>
    import { onBeforeMount, ref } from "vue";

    export default {
        setup() {
            const defaultColDef = { 
                editable: true,
                flex: 1, 
            };

            const columnDefs = ref([
                { 
                    field: "gasto", 
                    headerName: "Gasto", 
                },
                { 
                    field: "data", 
                    headerName: "Data",
                },
                { 
                    field: "valor", 
                    headerName: "Valor",
                },
                { 
                    field: "metodo", 
                    headerName: "Método de Pagamento", 
                    cellEditor: 'agSelectCellEditor', 
                    cellEditorParams: { values: ['Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Transferência'] },
                },
                { 
                    field: "categoria", 
                    headerName: "Categoria do Gasto", 
                    cellEditor: 'agSelectCellEditor', 
                    cellEditorParams: { values: ['Transporte', 'Alimentação', 'Saúde', 'Educação', 'Entretenimento'] },
                }
            ]);

            const rowData = ref([
                { gasto: "Supermercado", data: "01/01/2024", valor: 450, metodo: "Cartão de Crédito", categoria: "Alimentação" },
                { gasto: "Gasolina", data: "02/02/2024", valor: 300, metodo: "Dinheiro", categoria: "Transporte" },
                { gasto: "Aluguel", data: "03/03/2024", valor: 1200, metodo: "Transferência", categoria: "Habitação" },
                { gasto: "Academia", data: "04/04/2024", valor: 150, metodo: "Cartão de Débito", categoria: "Saúde" },
                { gasto: "Restaurante", data: "05/05/2024", valor: 200, metodo: "Cartão de Crédito", categoria: "Entretenimento" },
            ]);

            const dataTypeDefinitions = ref(null);
            onBeforeMount(() => {
                dataTypeDefinitions.value = {
                    dateString: {
                        baseDataType: "dateString",
                        extendsDataType: "dateString",
                        valueParser: (params) =>
                            params.newValue != null &&
                            params.newValue.match("\\d{2}/\\d{2}/\\d{4}")
                                ? params.newValue
                                : null,
                        valueFormatter: (params) =>
                            params.value == null ? "" : params.value,
                        dataTypeMatcher: (value) =>
                            typeof value === "string" && !!value.match("\\d{2}/\\d{2}/\\d{4}"),
                        dateParser: (value) => {
                            if (value == null || value === "") {
                                return undefined;
                            }
                            const dateParts = value.split("/");
                            return dateParts.length === 3 ? 
                                new Date(
                                    parseInt(dateParts[2]),
                                    parseInt(dateParts[1]) - 1,
                                    parseInt(dateParts[0]),
                                ) : undefined;
                        },
                        dateFormatter: (value) => {
                            if (value == null) {
                                return undefined;
                            }
                            const date = String(value.getDate());
                            const month = String(value.getMonth() + 1);
                            return `${date.length === 1 ? "0" + date : date}/${month.length === 1 ? "0" + month : month}/${value.getFullYear()}`;
                        },
                    },
                };
            });

            return {
                defaultColDef,
                columnDefs,
                rowData,
                dataTypeDefinitions,
            };
        },
    };
</script>
<style scoped>
</style>