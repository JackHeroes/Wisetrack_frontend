<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex justify-center align-center">
            <SystemCrud
                :title="'Metodo de pagamento'"
                :headers="headers"
                :items="categoriasGastos"
                :newItemButtonText="'Novo metodo de pagamento'"
                :NenhumItem="'Nenhum metodo de pagamento'"
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
          { title: 'Metodo de pagamento', key: 'categoriaGasto' },
          { title: 'Observação', key: 'obs' },
          { title: 'Ações', key: 'actions', sortable: false },
        ],
        categoriasGastos: [],
        formFields: [
          {
                label: 'Metodo de pagamento',
                key: 'categoriaGasto',
                validators: {
                    required: helpers.withMessage('Metodo de pagamento é obrigatório', required),
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