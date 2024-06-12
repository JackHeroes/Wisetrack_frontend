<template>
	<v-app>
		<SystemMenu/>
		<SystemSidebar/>
		<v-main class="d-flex justify-center align-center">
			<v-container class="pa-8" fluid>
				<SystemCrud
					endpoint="categoriaGasto/CategoriaGastoApi/"
					:headers="[
						{ key: 'id_categoriaGasto', title: 'Id' },
						{ key: 'categoriaGasto', title: 'Categoria de gasto' },
						{ key: 'obs', title: 'Observação' },
						{ key: 'actions', title: 'Ações', sortable: false }
					]"
					:fields="[
						{ name: 'categoriaGasto', label: 'Categoria de gasto', required: true, alpha: true },
						{ name: 'obs', label: 'Observação' }
					]"
					:itemDefault="{
						id_categoriaGasto: null,
						categoriaGasto: '',
						obs: ''
					}"
					createButtonText="Adicionar nova categoria de gasto"
					createDialogTitle="Criar categoria de gasto"
					editDialogTitle="Editar categoria de gasto"
					deleteDialogTitle="Excluir categoria de gasto"
					deleteConfirmationText="Você tem certeza que deseja excluir a categoria de gastos"
					categoriaField="categoriaGasto"/>
			</v-container>
		</v-main>
		<SystemFooter/>
	</v-app>
</template>
<script>
</script>
<style scoped>
</style>  