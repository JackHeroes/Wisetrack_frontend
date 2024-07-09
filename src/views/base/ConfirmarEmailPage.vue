<template>
    <v-app>
        <v-container class="d-flex justify-center align-center fill-height" fluid>
            <v-card class="content-card d-flex flex-column justify-center align-center rounded-xl">
                <div class="card-header d-flex flex-column justify-center align-center">
                    <h1 class="v-title text-center text-uppercase mb-6">E-mail confirmado</h1>
                </div>
                <div class="card-body">
                    <p class="text-center">
                        Seu e-mail foi confirmado com sucesso. Você será redirecionado para a tela de login em {{ counter }} segundos
                    </p>
                </div>
            </v-card>   
        </v-container>
    </v-app>
</template>
<script>
    export default {
        data() {
            return {
                counter: 5
            };
        },
        mounted() {
            this.startCounter();
        },
        methods: {
            startCounter() {
                const interval = setInterval(() => {
                    this.counter--;
                    if (this.counter === 0) {
                        clearInterval(interval);
                        this.$router.push('/');
                    }
                }, 1000);
            },
        }
    }
</script>
<style scoped>
    @import "@/assets/styles/loginCadastro.css";
</style>