<template>
    <v-app>
        <v-container class="d-flex justify-center align-center fill-height" fluid>
            <v-card class="image-card d-flex flex-column justify-center align-center rounded-s-xl rounded-e-0">
                <v-img
                    class="rounded-s-xl rounded-e-0 w-100 h-100"
                    lazy-src="src/assets/images/banner/cadastroBanner.jpg"
                    src="src/assets/images/banner/cadastroBanner.jpg"
                    cover>
                    <template v-slot:placeholder>
                        <v-row
                            align="center"
                            class="fill-height ma-0"
                            justify="center">
                            <v-progress-circular
                                color="grey-lighten-5"
                                indeterminate>
                            </v-progress-circular>
                        </v-row>
                    </template>
                </v-img>
            </v-card>
            <v-card class="content-card d-flex flex-column justify-center align-center rounded-s-0 rounded-e-xl">
                <div class="card-header d-flex flex-column justify-center align-center">
                    <h1 class="v-title text-uppercase mb-6">Cadastre-se</h1>
                </div>
                <div class="card-body">
                    <v-form @submit.prevent="submit" class="d-flex flex-column justify-center align-center w-100">
                        <v-text-field 
                            v-model="username"
                            class="mb-3 w-100"
                            color="var(--primary-color)"
                            density="comfortable"
                            hide-details="auto"
                            label="Usuário"
                            name="username"
                            variant="outlined" 
                            :error-messages="v$?.username?.$errors.map(e => e.$message)">
                        </v-text-field>
                        <v-text-field 
                            v-model="email"
                            class="mb-3 w-100"
                            color="var(--primary-color)"
                            density="comfortable"
                            hide-details="auto"
                            label="E-mail"
                            name="email"
                            variant="outlined"
                            :error-messages="v$?.email?.$errors.map(e => e.$message)">
                        </v-text-field>
                        <v-text-field 
                            v-model="firstName"
                            class="mb-3 w-100"
                            color="var(--primary-color)"
                            density="comfortable"
                            hide-details="auto"
                            label="Nome"
                            name="firstName"
                            variant="outlined"
                            :error-messages="v$?.firstName?.$errors.map(e => e.$message)">
                        </v-text-field>
                            <v-text-field 
                            v-model="lastName"
                            class="mb-3 w-100"
                            color="var(--primary-color)"
                            density="comfortable"
                            hide-details="auto"
                            label="Sobrenome"
                            name="lastName"
                            variant="outlined"
                            :error-messages="v$?.lastName?.$errors.map(e => e.$message)">
                        </v-text-field>
                        <v-text-field
                            v-model="password"
                            class="mb-4 w-100"
                            color="var(--primary-color)"
                            density="comfortable"
                            hide-details="auto"
                            label="Senha"
                            name="password"
                            variant="outlined"
                            :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                            :error-messages="v$?.password?.$errors.map(e => e.$message)"
                            :type="passwordVisible ? 'text' : 'password'"
                            @click:append-inner="passwordVisible = !passwordVisible">
                        </v-text-field>
                        <v-btn 
                            class="v-btn-primary mb-6 w-100"
                            size="large" 
                            type="submit"
                            :loading="loading">
                            Criar conta
                        </v-btn>
                    </v-form>
                </div>
                <div class="card-footer d-flex justify-center align-center ga-1">
                    <span>Já tem uma conta?</span>
                    <a @click="goToLogin" class="cursor-pointer">Faça login</a>
                </div>
            </v-card>
        </v-container>
    </v-app>
</template>
<script>
    import axios from '../services/axios';
    import store from '../store/store';
    import { alpha, strongPassword } from '../services/customValidations';
    import { email, required, helpers } from '@vuelidate/validators'
    import { useVuelidate } from '@vuelidate/core'

    export default {
        setup: () => ({ 
            v$: useVuelidate() 
        }),
        data: () => ({
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            loading: false,
            passwordVisible: false,
        }),
        methods: {
            async submit() {
                const result = await this.v$.$validate();
                if (!result) return

                this.loading = true

                try {
                    const formData = new FormData();
                    formData.append('username', this.username);
                    formData.append('email', this.email);
                    formData.append('firstName', this.firstName);
                    formData.append('lastName', this.lastName);
                    formData.append('password', this.password);

                    const response = await axios.post('createAccount/CreateAccountApi/', formData);

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
                username: {
                    required: helpers.withMessage('Usuário é obrigatório', required),
                },
                email: {
                    required: helpers.withMessage('E-mail é obrigatório', required),
                    email: helpers.withMessage('Insira um e-mail válido', email),
                },
                firstName: {
                    required: helpers.withMessage('Nome é obrigatório', required),
                    alpha: helpers.withMessage('Insira um nome válido', alpha)
                },
                lastName: {
                    required: helpers.withMessage('Sobrenome é obrigatório', required),
                    alpha: helpers.withMessage('Insira um sobrenome válido', alpha)
                },
                password: {
                    required: helpers.withMessage('Senha é obrigatória', required),
                    strongPassword: helpers.withMessage('A senha deve conter pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.', strongPassword)
                },
            };
        },
    }
</script>
<style scoped>
    @import "@/assets/styles/loginCadastro.css";
</style>