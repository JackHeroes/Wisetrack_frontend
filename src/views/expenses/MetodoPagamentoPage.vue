<template>
	<v-app>
		<SystemMenu/>
		<SystemSidebar/>
		<v-main class="d-flex justify-center align-center">
			<v-container class="d-flex justify-center align-center pa-8" fluid>
				<SystemCrud
					endpoint="metodoPagamento/MetodoPagamentoApi/"
					:headers="[
						{ key: 'metodoPagamento', title: 'Metodo de pagamento' },
						{ key: 'obs', title: 'Observação' },
						{ key: 'actions', title: 'Ações', sortable: false }
					]"
					:fields="[
						{ name: 'metodoPagamento', label: 'Método de pagamento', required: true, alpha: true, gender: 'male' },
						{ name: 'obs', label: 'Observação', gender: 'female' }
					]"
					:itemDefault="{
						id_userMetodoPagamento: null,
						metodoPagamento: '',
						obs: ''
					}"
					idField="id_userMetodoPagamento"
					createButtonText="Adicionar novo método de pagamento"
					createDialogTitle="Criar método de pagamento"
					editDialogTitle="Editar método de pagamento"
					deleteDialogTitle="Excluir método de pagamento"
					deleteConfirmationText="Você tem certeza que deseja excluir o método de pagamento"/>
			</v-container>
		</v-main>
		<SystemFooter/>
	</v-app>
</template>
<script>
</script>
<style scoped>
</style> 