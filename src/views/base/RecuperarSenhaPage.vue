<template>
    <v-app>
        <v-container class="d-flex justify-center align-center fill-height" fluid>
            <v-card class="content-card d-flex flex-column justify-center align-center rounded-xl">
                <div class="card-header d-flex flex-column justify-center align-center">
                    <h1 class="v-title text-center text-uppercase mb-1">Redefina sua senha</h1>
                    <p class="text-center mb-6">Insira seu endereço de e-mail e lhe enviaremos instruções para redefinir sua senha</p>
                </div>
                <div class="card-body">
                    <v-form @submit.prevent="submit" class="d-flex flex-column justify-center align-center w-100">
                        <v-text-field 
                            v-model="email"
                            class="mb-4 w-100"
                            color="var(--primary-color)"
                            density="comfortable"
                            hide-details="auto"
                            label="E-mail"
                            name="email"
                            variant="outlined"
                            :error-messages="v$?.email?.$errors.map(e => e.$message)">
                        </v-text-field>
                        <v-btn 
                            class="v-btn-primary mb-6 w-100"
                            size="large" 
                            type="submit"
                            :loading="loading">
                            Enviar e-mail
                        </v-btn>
                    </v-form>
                </div>
                <div class="card-footer d-flex justify-center align-center ga-1">
                    <span>Já sabe sua senha?</span>
                    <a @click="goToLogin" class="cursor-pointer">Faça login</a>
                </div>
            </v-card>   
        </v-container>
    </v-app>
</template>
<script>
    import axios from '../../services/axios/axios';
    import store from '../../store/store';
    import { email, required, helpers } from '@vuelidate/validators'
    import { useVuelidate } from '@vuelidate/core'

    export default {
        setup: () => ({ 
            v$: useVuelidate() 
        }),
        data: () => ({
            email: '',
            loading: false,
        }),
        methods: {
            async submit() {
                const result = await this.v$.$validate();
                if (!result) return

                this.loading = true

                try {
                    const formData = new FormData();
                    formData.append('email', this.email);

                    const response = await axios.post('password/PasswordForgotApi/', formData);

                    this.$router.push('/');
                    store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                }
                catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                } finally {
                    this.loading = false;
                }
            },
            goToLogin() {
                this.$router.push('/');
            },
        },
        validations() {
            return {   
                email: {
                    required: helpers.withMessage('E-mail é obrigatório', required),
                    email: helpers.withMessage('Insira um e-mail válido', email),
                },
            };
        },
    }
</script>
<style scoped>
    @import "@/assets/styles/loginCadastro.css";
</style>