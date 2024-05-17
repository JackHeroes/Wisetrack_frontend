<template>
  	<v-alert 
		:color="color"
		:type="type">
		{{ message }}
  	</v-alert>
</template>
<script>
	export default {
  		name: 'Message',
  		props: {
			message: {
				type: String,
				required: true
    		},
    		type: {
      			type: String,
      			validator: value => ['success', , 'info', 'warning', 'error'].includes(value)
    		},
  		},
  		computed: {
    		color() {
      			switch (this.type) {
        			case 'success':
          				return 'green';
					case 'info':
						return 'blue';
        			case 'warning':
          				return 'orange';
					case 'error':
          				return 'red';
      			}
    		}
  		},
	}
</script>
<style scoped>
	.v-alert {
		position: absolute;
	}
</style>