<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex justify-center align-center">
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-btn @click="openDialog('create')">Adicionar nova categoria de gasto</v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="search"
                            label="Pesquisa"
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            single-line>
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-data-table-server
                            v-model:items-per-page="itemsPerPage"
                            :headers="headers" 
                            :items="items" 
                            :loading="loading"
                            :loading-text="'Carregando itens'"
                            :no-data-text="'Nenhum item encontrado'"
                            :search="search"
                            :items-length="totalItems"
                            :items-per-page-options="[
                                {value: 5, title: '5'},
                                {value: 10, title: '10'},
                                {value: 50, title: '25'},
                                {value: 100, title: '50'},
                            ]"
                            :items-per-page-text="'Itens por página'"
                            :page-text="'{0}-{1} de {2}'"
                            @update:options="updateTableOptions">
                            <template v-slot:item.actions="{ item }">
                                <v-btn @click="openDialog('edit', item)">
                                    <v-icon left>mdi-pencil</v-icon> 
                                    Editar
                                </v-btn>
                                <v-btn @click="openDialog('delete', item)">
                                    <v-icon left>mdi-delete</v-icon> 
                                    Excluir
                                </v-btn>
                            </template>
                        </v-data-table-server>
                    </v-col>
                </v-row>
                <v-dialog v-model="dialog">
                    <v-card>
                        <v-card-title>
                            <span v-if="dialogMode === 'create'">Criar categoria de gasto</span>
                            <span v-else-if="dialogMode === 'edit'">Editar categoria de gasto</span>
                            <span v-else>Confirmar Exclusão</span>
                        </v-card-title>
                        <v-card-text v-if="dialogMode === 'delete'">
                            Você tem certeza que deseja excluir a categoria "{{ editedItem.categoriaGasto }}"?
                        </v-card-text>
                        <v-card-text v-else>
                            <v-form>
                                <v-text-field
                                    v-model="editedItem.categoriaGasto"
                                    class="mb-3 w-100"
                                    color="var(--primary-color)"
                                    density="comfortable"
                                    hide-details="auto"
                                    label="Categoria de gasto"
                                    name="editedItem.categoriaGasto"
                                    variant="outlined" 
                                    :error-messages="v$?.editedItem.categoriaGasto?.$errors.map(e => e.$message)">
                                </v-text-field>
                                <v-text-field
                                    v-model="editedItem.obs"
                                    class="mb-3 w-100"
                                    color="var(--primary-color)"
                                    density="comfortable"
                                    label="Observação"
                                    name="editedItem.obs"
                                    variant="outlined" >
                                </v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn @click="closeDialog">Cancelar</v-btn>
                            <v-btn v-if="dialogMode === 'delete'" @click="handleDeleteItemConfirmed">Excluir</v-btn>
                            <v-btn v-else @click="handleSaveItem">Salvar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-container>
        </v-main>
        <SystemFooter/>
    </v-app>
</template>
<script>
    import axios from '../services/axios';
    import store from '../store/store';
    import { required, helpers } from '@vuelidate/validators';
    import { useVuelidate } from '@vuelidate/core';

    export default {
        setup: () => ({ 
            v$: useVuelidate(),
        }),
        data() {
            return {
                page: 1,
                itemsPerPage: 5,
                sortBy: [],
                dialog: false,
                loading: true,
                dialogMode: '',
                search: '',
                totalItems: 0,
                headers: [
                    { key: 'id_categoriaGasto', title: 'Id' },
                    { key: 'categoriaGasto', title: 'Categoria de gasto' },
                    { key: 'obs', title: 'Observação' },
                    { key: 'actions', title: 'Ações', sortable: false },
                ],
                items: [],
                editedItem: {
                    id_categoriaGasto: null,
                    categoriaGasto: '',
                    obs: ''
                },
                defaultItem: {
                    id_categoriaGasto: null,
                    categoriaGasto: '',
                    obs: ''
                },
            }
        },
        methods: {
            openDialog(mode, item = null) {
                this.dialogMode = mode;
                this.editedItem = item ? Object.assign({}, item) : Object.assign({}, this.defaultItem);
                this.dialog = true;
            },
            closeDialog() {
                this.dialog = false;
                this.v$.$reset();
            },
            updateTableOptions(options) {
                this.page = options.page;
                this.itemsPerPage = options.itemsPerPage;
                this.sortBy = options.sortBy;
                this.loadItems(options);
            },
            async handleSaveItem() {
                const result = await this.v$.$validate();
                if (!result) {
                    return;
                }

                if (this.dialogMode === 'create') {
                    await this.createNewItem();
                } else if (this.dialogMode === 'edit') {
                    await this.updateExistingItem();
                }
                this.closeDialog();
                this.reloadItems();
            },
            async handleDeleteItemConfirmed() {
                await this.deleteExistingItem();
                this.closeDialog();
                this.reloadItems();
            },
            async loadItems({ page, itemsPerPage, sortBy }) {
                this.loading = true
                try {
                    const response = await axios.get('categoriaGasto/CategoriaGastoApi/', {
                        params: {
                            page,
                            itemsPerPage,
                            sortBy,
                            search: this.search
                        }
                    });
                    this.items = response.data.results;
                    this.totalItems = response.data.count;
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                } finally {
                    this.loading = false
                }
            },
            async reloadItems() {
                const options = {
                    page: this.page,
                    itemsPerPage: this.itemsPerPage,
                    sortBy: this.sortBy
                };
                await this.loadItems(options);
            },
            async createNewItem() {
                try {
                    const { id_categoriaGasto, ...data } = this.editedItem;
                    const response = await axios.post('categoriaGasto/CategoriaGastoApi/', data);
                    store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async updateExistingItem() {
                try {
                    const response = await axios.put('categoriaGasto/CategoriaGastoApi/', this.editedItem);
                    store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async deleteExistingItem() {
                try {
                    const response = await axios.delete('categoriaGasto/CategoriaGastoApi/', { data: { id_categoriaGasto: this.editedItem.id_categoriaGasto } });
                    store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            }
        },
        validations() {
            return {
                editedItem: {
                    categoriaGasto: {
                        required: helpers.withMessage('Categoria de gasto é obrigatória', required),
                        alpha: helpers.withMessage('Insira um nome válido', helpers.regex(/^[a-zA-ZÀ-ú\s]*$/))
                    }
                },
            };
        },
    }
</script>
<style scoped>
</style>