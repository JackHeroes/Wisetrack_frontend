<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex justify-center align-center">
            <SystemCrud
                :title="'Categoria de gasto'"
                :headers="headers"
                :items="categoriasGastos"
                :newItemButtonText="'Nova categoria de gasto'"
                :NenhumItem="'Nenhuma categoria cadastrada'"
                :formFields="formFields"
                :sortKey="'categoriaGasto'"
                :sortOrder="'asc'"
                @add-item="addItem"
                @update-item="updateItem"
                @delete-item="deleteItem"
            />
        </v-main>
        <SystemFooter/>
    </v-app>
</template>
  
  <script>
  import { required, helpers } from '@vuelidate/validators';
  
  export default {
    data() {
      return {
        headers: [
          { title: 'Id', align: 'start', key: 'id', sortable: false },
          { title: 'Categoria de gasto', key: 'categoriaGasto' },
          { title: 'Observação', key: 'obs' },
          { title: 'Ações', key: 'actions', sortable: false },
        ],
        categoriasGastos: [],
        formFields: [
          {
                label: 'Categoria de gasto',
                key: 'categoriaGasto',
                validators: {
                    required: helpers.withMessage('Categoria de gasto é obrigatório', required),
                },
          },
          { 
                label: 'Observação', 
                key: 'obs' 
            },
        ],
      };
    },
    methods: {
      addItem(item) {
        this.categoriasGastos.push(item);
      },
      updateItem(index, item) {
        Object.assign(this.categoriasGastos[index], item);
      },
      deleteItem(index) {
        this.categoriasGastos.splice(index, 1);
      },
    },
  };
  </script>
  <style scoped>
  </style>  