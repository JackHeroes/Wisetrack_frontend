<template>
	<transition name="fade">
		<v-alert 
			v-if="status"
			:color="color"
			:type="type">
			{{ message }}
		</v-alert>
	</transition>
</template>
<script>
	export default {
  		name: 'SystemMessage',
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
		data: () => ({    
			status: true,
		}),
		mounted() {
			setTimeout(() => {
				this.status = false;
			}, 3000);
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
		bottom: 0!important;
		left: 0!important;
		margin: 1.5rem!important;
		position: absolute!important;
	}
	
	.fade-enter-active, .fade-leave-active {
		transition: opacity 1s!important;
  	}
	
	.fade-enter, .fade-leave-to{
		opacity: 0!important;
  	}
</style>