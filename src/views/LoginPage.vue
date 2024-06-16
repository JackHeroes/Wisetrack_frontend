<template>
    <v-app>
        <v-container class="d-flex justify-center align-center fill-height" fluid>
            <v-card class="content-card d-flex flex-column justify-center align-center rounded-s-xl rounded-e-0">
                <div class="card-header d-flex flex-column justify-center align-center">
                    <v-img></v-img>
                    <h1 class="v-title text-uppercase mb-6">Login</h1>
                </div>
                <div class="card-body">
                    <v-form @submit.prevent="submit" class="d-flex flex-column justify-center w-100">
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
                            v-model="password"
                            class="mb-1 w-100"
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
                        <div class="d-flex justify-end align-center cursor-pointer mb-4">
                            <a @click="goToSenha">Esqueceu a senha?</a>
                        </div>
                        <v-btn 
                            class="v-btn-primary mb-6 w-100"
                            size="large" 
                            type="submit"
                            :loading="loading">
                            Entrar
                        </v-btn>
                    </v-form>
                </div>
                <div class="card-footer d-flex justify-center align-center ga-1">
                    <span>Ainda não tem uma conta?</span>
                    <a @click="goToCadastro" class="cursor-pointer">Cadastre-se</a>
                </div>
            </v-card>   
            <v-card class="image-card d-flex flex-column justify-center align-center rounded-s-0 rounded-e-xl">
                <v-img
                    class="rounded-s-0 rounded-e-xl w-100 h-100"
                    lazy-src="src/assets/images/banner/loginBanner.jpg"
                    src="src/assets/images/banner/loginBanner.jpg"
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
        </v-container>
    </v-app>
</template>
<script>
    import axios from '../services/axios';
    import store from '../store/store';
    import { required, helpers } from '@vuelidate/validators';
    import { useVuelidate } from '@vuelidate/core';

    export default {
        setup: () => ({ 
            v$: useVuelidate(),
        }),
        data() {
            return {
                username: '',
                password: '',
                loading: false,
                passwordVisible: false,
            };
        },
        methods: {
            async submit() {
                const result = await this.v$.$validate();
                if (!result) return

                this.loading = true;

                try {
                    const formData = new FormData();
                    formData.append('username', this.username);
                    formData.append('password', this.password);

                    await axios.post('login/LoginApi/', formData);

                    this.$router.push('/inicio');
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                } finally {
                    this.loading = false;
                }
            },
            goToSenha() {
                this.$router.push('/esqueci-a-senha');
            },
            goToCadastro() {
                this.$router.push('/cadastro');
            },
        },
        validations() {
            return {
                username: {
                    required: helpers.withMessage('Usuário é obrigatório', required),
                },
                password: {
                    required: helpers.withMessage('Senha é obrigatória', required),
                },
            };
        },
    }
</script>
<style scoped>
    @import "@/assets/styles/loginCadastro.css";
</style>