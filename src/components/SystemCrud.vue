<template>
    <v-app>
        <v-container class="pa-0" fluid>
            <v-row>
                <v-col cols="12">
                    <v-btn class="btn-create" @click="openDialog('create')">{{ createButtonText }}</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-text-field
                        v-model="search"
                        color="var(--primary-color)"
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
                            <div class="ga-2">
                                <v-btn class="btn-update" @click="openDialog('edit', item)">
                                    <v-icon left>mdi-pencil</v-icon> 
                                    Editar
                                </v-btn>
                                <v-btn class="btn-delete" @click="openDialog('delete', item)">
                                    <v-icon left>mdi-delete</v-icon> 
                                    Excluir
                                </v-btn>
                            </div>
                        </template>
                    </v-data-table-server>
                </v-col>
            </v-row>
            <v-dialog v-model="dialog">
                <v-card>
                    <v-card-title>
                        <span v-if="dialogMode === 'create'">{{ createDialogTitle }}</span>
                        <span v-else-if="dialogMode === 'edit'">{{ editDialogTitle }}</span>
                        <span v-else>{{ deleteDialogTitle }}</span>
                    </v-card-title>
                    <v-card-text v-if="dialogMode === 'delete'">
                        {{ deleteConfirmationText.replace('{item}', editedItem[categoriaField]) }}
                    </v-card-text>
                    <v-card-text v-else>
                        <v-form>
                            <template v-for="field in fields" :key="field.name">
                                <v-text-field
                                    v-model="editedItem[field.name]"
                                    class="mb-3 w-100"
                                    color="var(--primary-color)"
                                    density="comfortable"
                                    hide-details="auto"
                                    :label="field.label"
                                    :name="field.name"
                                    variant="outlined"
                                    :error-messages="v$?.editedItem[field.name]?.$errors.map(e => e.$message)">
                                </v-text-field>
                            </template>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn class="btn-cancel" @click="closeDialog" variant="plain">Cancelar</v-btn>
                        <v-btn class="btn-confirm" v-if="dialogMode === 'delete'" @click="handleDeleteItemConfirmed" variant="tonal">Excluir</v-btn>
                        <v-btn class="btn-confirm" v-else @click="handleSaveItem" variant="tonal">Salvar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </v-app>
</template>
<script>
    import axios from '../services/axios';
    import store from '../store/store';
    import { required, helpers } from '@vuelidate/validators';
    import { useVuelidate } from '@vuelidate/core';

    export default {
        props: {
            endpoint: {
                type: String,
                required: true
            },
            headers: {
                type: Array,
                required: true
            },
            fields: {
                type: Array,
                required: true
            },
            itemDefault: {
                type: Object,
                required: true
            },
            createButtonText: {
                type: String,
                required: true
            },
            createDialogTitle: {
                type: String,
                required: true
            },
            editDialogTitle: {
                type: String,
                required: true
            },
            deleteDialogTitle: {
                type: String,
                required: true
            },
            deleteConfirmationText: {
                type: String,
                required: true
            },
            categoriaField: {
                type: String,
                required: true
            }
        },
        setup() {
            return { 
                v$: useVuelidate(),
            };
        },
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
                items: [],
                editedItem: { ...this.itemDefault },
                defaultItem: { ...this.itemDefault }
            };
        },
        watch: {
            dialog(val) {
                if (!val) {
                    this.v$.$reset();
                }
            }
        },
        methods: {
            openDialog(mode, item = null) {
                this.dialogMode = mode;
                this.editedItem = item ? { ...item } : { ...this.defaultItem };
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
                    const response = await axios.get(this.endpoint, {
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
                    const { ...data } = this.editedItem;
                    const response = await axios.post(this.endpoint, data);
                    store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async updateExistingItem() {
                try {
                    const response = await axios.put(this.endpoint, this.editedItem);
                    store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async deleteExistingItem() {
                try {
                    const response = await axios.delete(this.endpoint, { data: { [this.categoriaField]: this.editedItem[this.categoriaField] } });
                    store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            }
        },
        validations() {
            const validations = {
                editedItem: {}
            };
            this.fields.forEach(field => {
                if (field.required) {
                    validations.editedItem[field.name] = {
                        required: helpers.withMessage(`${field.label} é obrigatória`, required)
                    };
                }
                if (field.alpha) {
                    validations.editedItem[field.name] = {
                        ...validations.editedItem[field.name],
                        alpha: helpers.withMessage('Insira um nome válido', helpers.regex(/^[a-zA-ZÀ-ú\s]*$/))
                    };
                }
            });
            return validations;
        }
    };
</script>
<style scoped>
    .v-dialog {
        max-width: 500px;
    }

    .v-card-title {
        
    }

    .btn-cancel {
        
    }

    .btn-confirm {
        
    }

    .btn-confirm,
    .btn-create,
    .btn-update,
    .btn-delete {
        color: var(--white);
    }

    .btn-confirm,
    .btn-create {
        background-color: var(--primary-color);
    }
    
    .btn-update {
        background-color: var(--yellow);
    }

    .btn-delete {
        background-color: var(--red);
    }
</style>