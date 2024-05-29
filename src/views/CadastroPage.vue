<template>
    <v-app>
        <v-container class="d-flex justify-center align-center fill-height" fluid>
            <v-card class="d-flex flex-column justify-center align-center rounded-s-xl rounded-e-0">
                <v-img
                    class="w-100 h-100"
                    cover
                    src="\src\assets\images\banner.png">
                </v-img>
            </v-card>
            <v-card class="d-flex flex-column justify-center align-center rounded-s-0 rounded-e-xl">
                <h1 class="v-title text-uppercase mb-4">Cadastre-se</h1>
                <v-form @submit.prevent="submit" class="d-flex flex-column justify-center align-center w-100">
                    <v-text-field 
                        v-model="username"
                        class="mb-4"
                        color="var(--main-color)"
                        hide-details="auto"
                        label="Usuário"
                        name="username"
                        variant="outlined" 
                        :error-messages="v$?.username?.$errors.map(e => e.$message)">
                    </v-text-field>
                    <v-text-field 
                        v-model="email"
                        class="mb-4"
                        color="var(--main-color)"
                        hide-details="auto"
                        label="E-mail"
                        name="email"
                        variant="outlined" 
                        :error-messages="v$?.email?.$errors.map(e => e.$message)">
                    </v-text-field>
                    <v-text-field 
                        v-model="first_name"
                        class="mb-4"
                        color="var(--main-color)"
                        hide-details="auto"
                        label="Nome"
                        name="first_name"
                        variant="outlined" 
                        :error-messages="v$?.first_name?.$errors.map(e => e.$message)">
                    </v-text-field>
                    <v-text-field 
                        v-model="last_name"
                        class="mb-4"
                        color="var(--main-color)"
                        hide-details="auto"
                        label="Sobrenome"
                        name="last_name"
                        variant="outlined" 
                        :error-messages="v$?.last_name?.$errors.map(e => e.$message)">
                    </v-text-field>
                    <v-text-field
                        v-model="password"
                        class="mb-4"
                        color="var(--main-color)"
                        hide-details="auto"
                        label="Senha"
                        name="password"
                        variant="outlined"
                        :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                        :error-messages="v$?.password?.$errors.map(e => e.$message)"
                        :type="visible ? 'text' : 'password'"
                        @click:append-inner="visible = !visible">
                    </v-text-field>
                    <v-btn 
                        class="v-btn-primary mb-4"
                        size="large" 
                        type="submit"
                        :loading="loading">
                        Criar conta
                    </v-btn>
                </v-form>
                <p class="v-link">
                    <span>Já tem uma conta? </span>
                    <a @click="goToLogin" class="cursor-pointer">Faça login</a>
                </p>
            </v-card> 
        </v-container>
        <SystemMessage 
            v-if="message"
            :message="message"
            :type="messageType">
        </SystemMessage>
    </v-app>
</template>
<script>
    import axios from '../services/axios';
    import { email, required, helpers } from '@vuelidate/validators'
    import { useVuelidate } from '@vuelidate/core'

    export default {
    setup: () => ({ v$: useVuelidate() }),
    data: () => ({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        message: '',
        messageType: '',
        visible: false,
        loading: false,
    }),
    methods: {
        async submit() {
            const result = await this.v$.$validate();
            if (!result) {
                return;
            }

            this.loading = true

            try {
                await axios.post('register/RegisterApi/', {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    first_name: this.first_name,
                    last_name: this.last_name,
                });
                this.$router.push('/');
            }
            catch (error) {
                this.message = error.response.data.error;
                this.messageType = 'error';
            } finally {
                this.loading = false;
            }
        },
        goToLogin() {
            this.$router.push('/');
        }
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
            first_name: {
                required: helpers.withMessage('Nome é obrigatório', required),
                alpha: helpers.withMessage('Insira um nome válido', helpers.regex(/^[a-zA-ZÀ-ú\s]*$/))
            },
            last_name: {
                required: helpers.withMessage('Sobrenome é obrigatório', required),
                alpha: helpers.withMessage('Insira um sobrenome válido', helpers.regex(/^[a-zA-ZÀ-ú\s]*$/))
            },
            password: {
                required: helpers.withMessage('Senha é obrigatória', required),
                strongPassword: helpers.withMessage('A senha deve conter pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.', helpers.regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/))
            },
        };
    },
}
</script>
<style scoped>
    @import "@/assets/styles/loginCadastro.css";
</style>