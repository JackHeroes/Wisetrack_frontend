<template>
    <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="items"
        :loading="loading"
        :loading-text="'Carregando itens'"
        :no-data-text="'Nenhum item encontrado'"
        :search="search"
        :items-length="totalItems"
        @update:options="updateTableOptions">
        <template v-slot:top>
            <div class="data-table-header mb-3">
                <div class="mb-3">
                    <v-btn class="btn-create" @click="openDialog('create')">{{ createButtonText }}</v-btn>
                </div>
                <div class="mb-3">
                    <v-text-field
                        v-model="search"
                        color="var(--primary-color)"
                        density="comfortable"
                        hide-details="auto"
                        label="Pesquisar"
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        single-line>
                    </v-text-field>
                </div>
                <div class="d-flex justify-end">
                    <v-select
                        v-model="itemsPerPage"
                        color="var(--primary-color)"
                        density="comfortable"
                        hide-details="auto"
                        variant="outlined"
                        :items="itemsPerPageOptions">
                    </v-select>
                </div>
            </div>
        </template>
        <template v-slot:bottom>
            <div class="data-table-footer mt-3">
                <v-pagination
                    v-model="page"
                    active-color="var(--primary-color)"
                    :length="pageCount">
                </v-pagination>
            </div>
        </template>
        <template v-slot:item.actions="{ item }">
            <div class="data-table-items d-flex ga-2">
                <v-btn class="btn-update" @click="openDialog('edit', item)">
                    <v-icon left>mdi-pencil</v-icon> 
                    editar
                </v-btn>
                <v-btn class="btn-delete" @click="openDialog('delete', item)">
                    <v-icon left>mdi-delete</v-icon> 
                    excluir
                </v-btn>
            </div>
        </template>
    </v-data-table-server>
    <v-dialog v-model="dialog">
        <v-card>
            <v-card-title>
                <span v-if="dialogMode === 'create'">{{ createDialogTitle }}</span>
                <span v-else-if="dialogMode === 'edit'">{{ editDialogTitle }}</span>
                <span v-else>{{ deleteDialogTitle }}</span>
            </v-card-title>
            <v-card-text v-if="dialogMode === 'delete'">
                {{ deleteConfirmationText}} {{ `"${Object.values(editedItem)[2]}"` }}?
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
                <v-btn class="btn-confirm" v-if="dialogMode === 'delete'" @click="handleDeleteItem" variant="tonal">Excluir</v-btn>
                <v-btn class="btn-confirm" v-else @click="handleSaveItem" variant="tonal">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    import axios from '../services/axios';
    import store from '../store/store';
    import { mapGetters } from 'vuex';
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
            idField: {
                type: String,
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
                itemsPerPageOptions: [5, 10, 25, 50],
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
        computed: {
            ...mapGetters(['id_user']),
            pageCount() {
                return Math.ceil(this.totalItems / this.itemsPerPage)
            },
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
            async handleDeleteItem() {
                await this.deleteExistingItem();
                this.closeDialog();
                this.reloadItems();
            },
            async loadItems({ page, itemsPerPage, sortBy }) {
                this.loading = true
                try {
                    const response = await axios.get(this.endpoint, {
                        params: {
                            id_user: this.id_user,
                            page,
                            itemsPerPage,
                            sortBy,
                            search: this.search,
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
                    const data = { ...this.editedItem, id_user: this.id_user };
                    const response = await axios.post(this.endpoint, data);
                    store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async updateExistingItem() {
                try {
                    const data = { ...this.editedItem, id_user: this.id_user };
                    const response = await axios.put(this.endpoint, data);
                    store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async deleteExistingItem() {
                try {
                    const response = await axios.delete(this.endpoint, { data: { [this.idField]: this.editedItem[this.idField] }});
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
    .data-table-header .btn-create,
    .data-table-items .btn-update,
    .data-table-items .btn-delete,
    .v-dialog .btn-confirm {
        color: var(--white);
    }

    .data-table-header .btn-create,
    .v-dialog .btn-confirm {
        background-color: var(--primary-color);
    }

    .data-table-header .v-select {
        max-width: 100px;
    }

    .data-table-items .btn-update {
        background-color: var(--yellow);
    }

    .data-table-items .btn-delete {
        background-color: var(--red);
    }

    .v-dialog {
        max-width: 500px;
    }
</style>