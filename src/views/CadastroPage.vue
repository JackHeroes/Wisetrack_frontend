<template>
    <v-app>
        <v-container class="d-flex justify-center align-center fill-height" fluid>
            <v-card class="d-flex flex-column justify-center align-center rounded-s-xl rounded-e-0">
                <v-img
                    class="w-100 h-100"
                    cover
                    src="\src\assets\images\">
                </v-img>
            </v-card>
            <v-card class="d-flex flex-column justify-center align-center rounded-s-0 rounded-e-xl">
                <div class="card-header d-flex flex-column justify-center align-center">
                    <v-img></v-img>
                    <h1 class="v-title text-uppercase mb-6">Cadastre-se</h1>
                </div>
                <div class="card-body">
                    <v-form @submit.prevent="submit" class="d-flex flex-column justify-center align-center w-100">
                        <v-text-field 
                            v-model="username"
                            class="mb-3 w-100"
                            color="var(--primary-color)"
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
                            hide-details="auto"
                            label="E-mail"
                            name="email"
                            variant="outlined" 
                            :error-messages="v$?.email?.$errors.map(e => e.$message)">
                        </v-text-field>
                        <v-text-field 
                            v-model="name"
                            class="mb-3 w-100"
                            color="var(--primary-color)"
                            hide-details="auto"
                            label="Nome"
                            name="name"
                            variant="outlined" 
                            :error-messages="v$?.name?.$errors.map(e => e.$message)">
                        </v-text-field>
                        <v-text-field
                            v-model="password"
                            class="mb-4 w-100"
                            color="var(--primary-color)"
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
            <SystemMessage
                v-if="message"
                :key="messageKey"
                :message="message"
                :type="messageType">
            </SystemMessage>
        </v-container>
    </v-app>
</template>
<script>
    import axios from '../services/axios';
    import store from '../store/store';
    import { email, required, helpers } from '@vuelidate/validators'
    import { mapGetters } from 'vuex';
    import { useVuelidate } from '@vuelidate/core'

    export default {
        setup: () => ({ v$: useVuelidate() }),
        data: () => ({
            username: '',
            email: '',
            name: '',
            password: '',
            loading: false,
            visible: false,
            messageKey: 0,
        }),
        mounted() {
            this.handleMessage(this.message, this.messageType);
        },
        computed: {
            ...mapGetters(['message', 'messageType'])
        },
        watch: {
            message(newMessage) {
                this.handleMessage(newMessage);
            }
        },
        methods: {
            async submit() {
                const result = await this.v$.$validate();
                if (!result) {
                    return;
                }

                this.loading = true

                try {
                    const response = await axios.post('register/RegisterApi/', {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        name: this.name,
                        last_name: this.last_name,
                    });
                    store.dispatch('setMessage', {
                        message: response.data.success,
                        messageType: 'success'
                    });
                    this.$router.push('/');
                }
                catch (error) {
                    store.dispatch('setMessage', {
                        message: error.response.data.error,
                        messageType: 'error'
                    });
                    this.messageKey += 1;
                } finally {
                    this.loading = false;
                }
            },
            goToLogin() {
                store.dispatch('clearMessage');
                this.$router.push('/');
            },
            handleMessage(message) {
                if (message) {
                    setTimeout(() => {
                        store.dispatch('clearMessage');
                    }, 3500);  
                }
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
                name: {
                    required: helpers.withMessage('Nome é obrigatório', required),
                    alpha: helpers.withMessage('Insira um nome válido', helpers.regex(/^[a-zA-ZÀ-ú\s]*$/))
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