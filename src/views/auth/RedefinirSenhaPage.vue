<template>
    <v-app>
        <v-container class="d-flex justify-center align-center fill-height" fluid>
            <v-card class="content-card d-flex flex-column justify-center align-center rounded-xl">
                <div class="card-header d-flex flex-column justify-center align-center">
                    <h1 class="v-title text-center text-uppercase mb-6">Redefina sua senha</h1>
                </div>
                <div class="card-body">
                    <v-form @submit.prevent="submit" class="d-flex flex-column justify-center align-center w-100">
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
                        <v-text-field
                            v-model="confirmPassword"
                            class="mb-4 w-100"
                            color="var(--primary-color)"
                            density="comfortable"
                            hide-details="auto"
                            label="Confirmar senha"
                            name="confirmPassword"
                            variant="outlined"
                            :append-inner-icon="confirmPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                            :error-messages="v$?.confirmPassword?.$errors.map(e => e.$message)"
                            :type="confirmPasswordVisible ? 'text' : 'password'"
                            @click:append-inner="confirmPasswordVisible = !confirmPasswordVisible">
                        </v-text-field>
                        <v-btn 
                            class="v-btn-primary mb-6 w-100"
                            size="large" 
                            type="submit"
                            :loading="loading">
                            Redefinir senha
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
    import axios from '@services/axios/axios';
    import store from '@store/store';
    import { required, helpers } from '@vuelidate/validators'
    import { strongPassword } from '@services/validations/customValidations';
    import { useVuelidate } from '@vuelidate/core'
    import { validatePassword } from '@services/validations/validatePassword';

    export default {
        setup: () => ({ 
            v$: useVuelidate() 
        }),
        data: () => ({
            password: '',
            confirmPassword: '',
            loading: false,
            passwordVisible: false,
            confirmPasswordVisible: false,
        }),
        methods: {
            async submit() {
                const result = await this.v$.$validate();
                if (!result) return

                this.loading = true

                try {
                    await validatePassword(this.$router);
                } catch {
                    return;
                }

                try {
                    const formData = new FormData();
                    formData.append('password', this.password);
                    formData.append('confirmPassword', this.confirmPassword);

                    const response = await axios.patch('password/PasswordResetApi/', formData);

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
                password: {
                    required: helpers.withMessage('Senha é obrigatória', required),
                    strongPassword: helpers.withMessage('A senha deve conter pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.', strongPassword)
                },
                confirmPassword: {
                    required: helpers.withMessage('Confirmação de senha é obrigatória', required),
                    strongPassword: helpers.withMessage('A senha deve conter pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.', strongPassword)
                },
            };
        },
    }
</script>
<style scoped>
    @import "@styles/loginCadastro.css";
</style>