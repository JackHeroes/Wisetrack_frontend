<template>
	<v-app>
		<SystemMenu/>
		<SystemSidebar/>
		<v-main class="d-flex justify-center align-center">
			<v-container class="d-flex justify-center align-center pa-8" fluid>
				<SystemCrud
					endpoint="categoriaGasto/CategoriaGastoApi/"
					:headers="[
						{ key: 'categoriaGasto', title: 'Categoria de gasto' },
						{ key: 'obs', title: 'Observação' },
						{ key: 'actions', title: 'Ações', sortable: false }
					]"
					:fields="[
						{ name: 'categoriaGasto', label: 'Categoria de gasto', required: true, alpha: true, gender: 'female' },
						{ name: 'obs', label: 'Observação', gender: 'female' }
					]"
					:itemDefault="{
						id_userCategoriaGasto: null,
						categoriaGasto: '',
						obs: ''
					}"
                    idField="id_userCategoriaGasto"
					createButtonText="Adicionar nova categoria de gasto"
					createDialogTitle="Criar categoria de gasto"
					editDialogTitle="Editar categoria de gasto"
					deleteDialogTitle="Excluir categoria de gasto"
					deleteConfirmationText="Você tem certeza que deseja excluir a categoria de gasto"/>
			</v-container>
		</v-main>
		<SystemFooter/>
	</v-app>
</template>
<script>
</script>
<style scoped>
</style>  