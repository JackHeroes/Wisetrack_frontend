<template>
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :sort-by="[{ key: sortKey, order: sortOrder }]">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ props }">
              <v-btn class="mb-2" color="primary" dark v-bind="props">
                {{ newItemButtonText }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row class="d-flex flex-column justify-center align-center">
                    <v-col v-for="field in formFields" :key="field.label" :cols="12">
                      <v-text-field
                        v-model="editedItem[field.key]"
                        :label="field.label"
                        :name="field.key"
                        :error-messages="v$?.editedItem?.[field.key]?.$errors.map(e => e.$message)"
                        color="var(--main-color)"
                        hide-details="auto"
                        variant="outlined">
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-text-field
          v-model="search"
          label="Pesquisa"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line>
        </v-text-field>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <p>{{ NenhumItem }}</p>
      </template>
    </v-data-table>
  </template>
  
  <script>

  export default {
    props: {
      title: {
        type: String,
        default: 'My CRUD'
      },
      headers: {
        type: Array,
        required: true
      },
      items: {
        type: Array,
        required: true
      },
      sortKey: {
        type: String,
        default: 'calories'
      },
      sortOrder: {
        type: String,
        default: 'asc'
      },
      formFields: {
        type: Array,
        required: true
      },
      newItemButtonText: {
        type: String,
        default: 'New Item'
      },
      NenhumItem: {
        type: String,
        default: 'Nenhum item cadastrado'
      }
    },
    data: () => ({
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      search: ''
    }),
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
      },
      filteredItems() {
        if (!this.search) {
          return this.items;
        }
        return this.items.filter(item => {
          return Object.values(item).some(value =>
            String(value).toLowerCase().includes(this.search.toLowerCase())
          );
        });
      }
    },
    watch: {
      dialog(val) {
        val || this.close();
      },
      dialogDelete(val) {
        val || this.closeDelete();
      }
    },
    methods: {
      editItem(item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem(item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm() {
        this.$emit('delete-item', this.editedIndex)
        this.closeDelete()
      },
      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save() {

        if (this.editedIndex > -1) {
          this.$emit('update-item', this.editedIndex, this.editedItem)
        } else {
          this.$emit('add-item', this.editedItem)
        }
        this.close()
      }
    }
  }
  </script>