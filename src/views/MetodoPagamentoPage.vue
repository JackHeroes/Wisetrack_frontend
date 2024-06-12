<template>
	<v-app>
		<SystemMenu/>
		<SystemSidebar/>
		<v-main class="d-flex justify-center align-center">
			<v-container class="d-flex justify-center align-center pa-8" fluid>
				<SystemCrud
					endpoint="metodoPagamento/MetodoPagamentoApi/"
					:headers="[
						{ key: 'id_metodoPagamento', title: 'Id' },
						{ key: 'metodoPagamento', title: 'Metodo de pagamento' },
						{ key: 'obs', title: 'Observação' },
						{ key: 'actions', title: 'Ações', sortable: false }
					]"
					:fields="[
						{ name: 'metodoPagamento', label: 'Metodo de pagamento', required: true, alpha: true },
						{ name: 'obs', label: 'Observação' }
					]"
					:itemDefault="{
						id_metodoPagamento: null,
						metodoPagamento: '',
						obs: ''
					}"
					idField="id_metodoPagamento"
					createButtonText="Adicionar novo metodo de pagamento"
					createDialogTitle="Criar metodo de pagamento"
					editDialogTitle="Editar metodo de pagamento"
					deleteDialogTitle="Excluir metodo de pagamento"
					deleteConfirmationText="Você tem certeza que deseja excluir o metodo de pagamento"/>
			</v-container>
		</v-main>
		<SystemFooter/>
	</v-app>
</template>
<script>
</script>
<style scoped>
</style> 