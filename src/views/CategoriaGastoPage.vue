<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex justify-center align-center">
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-btn color="primary" @click="openDialog('create')">Adicionar nova categoria de gasto</v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="search"
                            label="Pesquisa"
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            hide-details
                            single-line>
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-data-table
                            :headers="headers" 
                            :items="items" 
                            :search="search"
                            class="elevation-1">
                            <template v-slot:item.actions="{ item }">
                                <v-btn class="mr-2" @click="openDialog('edit', item)">
                                    <v-icon left>mdi-pencil</v-icon> Editar
                                </v-btn>
                                <v-btn @click="confirmDeleteItem(item)">
                                    <v-icon left>mdi-delete</v-icon> Excluir
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
                <v-dialog v-model="dialog" max-width="500px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ dialogMode === 'create' ? 'Criar Categoria' : 'Editar Categoria' }}</span>
                        </v-card-title>
                        <v-card-text>
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
                                    :error-messages="v$?.editedItem.categoriaGasto?.$errors.map(e => e.$message)"
                                ></v-text-field>
                                <v-text-field
                                    v-model="editedItem.obs"
                                    class="mb-3 w-100"
                                    color="var(--primary-color)"
                                    density="comfortable"
                                    label="Observação"
                                    name="editedItem.obs"
                                    variant="outlined" 
                                ></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
                            <v-btn color="blue darken-1" text @click="saveItem">Salvar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="deleteDialog" max-width="500px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Confirmar Exclusão</span>
                        </v-card-title>
                        <v-card-text>
                            Você tem certeza que deseja excluir a categoria "{{ deleteItemName }}"?
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="blue darken-1" text @click="closeDeleteDialog">Cancelar</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirmed">Excluir</v-btn>
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
    import { required, helpers } from '@vuelidate/validators';
    import { useVuelidate } from '@vuelidate/core';
    
    export default {
        setup: () => ({ 
            v$: useVuelidate(),
        }),
        data() {
            return {
                dialog: false,
                deleteDialog: false,
                dialogMode: '',
                search: '',
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
                itemToDelete: null,
                deleteItemName: ''
            }
        },
        methods: {
            openDialog(mode, item = null) {
                this.dialogMode = mode;
                if (mode === 'edit' && item) {
                    this.editedItem = Object.assign({}, item);
                } else {
                    this.editedItem = Object.assign({}, this.defaultItem);
                }
                this.dialog = true;
            },
            closeDialog() {
                this.dialog = false;
                this.v$.$reset();
            },
            async saveItem() {
                const result = await this.v$.$validate();
                if (!result) {
                    return;
                }
  
                if (this.dialogMode === 'create') {
                    console.log('Criar')
                    await this.createItem();
                } else if (this.dialogMode === 'edit') {
                    console.log('Editar')
                    await this.updateItem();
                }
                this.closeDialog();
                this.getItems();
            },
            confirmDeleteItem(item) {
                this.itemToDelete = item;
                this.deleteItemName = item.categoriaGasto;
                this.deleteDialog = true;
            },
            closeDeleteDialog() {
                this.deleteDialog = false;
                this.itemToDelete = null;
            },
            async deleteItemConfirmed() {
                console.log('Excluir')
                await this.deleteItem();
                this.deleteDialog = false;
                this.getItems();
            },
            async getItems() {
                try {
                    const response = await axios.get('categoriaGasto/CategoriaGastoApi/');
                    this.items = response.data;
                } catch (error) {
                    console.error('Erro ao pegar os items:', error);
                }
            },
            async createItem() {
                try {
                    const { id_categoriaGasto, ...data } = this.editedItem;
                    const response = await axios.post('categoriaGasto/CategoriaGastoApi/', data);
                } catch (error) {
                    console.error('Erro ao criar item:', error);
                }
            },
            async updateItem() {
                try {
                    const response = await axios.put('categoriaGasto/CategoriaGastoApi/', this.editedItem);
                } catch (error) {
                    console.error('Erro ao atualizar item:', error);
                }
            },
            async deleteItem() {
                try {
                    const response = await axios.delete('categoriaGasto/CategoriaGastoApi/', { data: { id_categoriaGasto: this.itemToDelete.id_categoriaGasto } });
                } catch (error) {
                    console.error('Erro ao excluir item:', error);
                }
            }
        },
        mounted() {
            this.getItems();
        },
        validations() {
            return {
                editedItem: {
                    categoriaGasto: {
                        required: helpers.withMessage('Categoria de gasto é obrigatória', required),
                    }
                },
            };
        },
    }
</script>
<style scoped>
</style>  