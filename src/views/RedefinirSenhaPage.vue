<template>
    <v-app>
        <v-container class="d-flex justify-center align-center fill-height" fluid>
            <v-card class="d-flex flex-column justify-center align-center rounded-xl">
                <div class="card-header d-flex flex-column justify-center align-center">
                    <v-img></v-img>
                    <h1 class="v-title text-center text-uppercase mb-6">Redefina sua senha</h1>
                </div>
                <div class="card-body">
                    <v-form @submit.prevent="submit" class="d-flex flex-column justify-center align-center w-100">
                        <v-text-field
                            v-model="password"
                            class="mb-4 w-100"
                            color="var(--primary-color)"
                            hide-details="auto"
                            label="Senha"
                            name="password"
                            variant="outlined"
                            density="compact"
                            :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                            :error-messages="v$?.password?.$errors.map(e => e.$message)"
                            :type="visible ? 'text' : 'password'"
                            @click:append-inner="visible = !visible">
                        </v-text-field>
                        <v-text-field
                            v-model="confirm_password"
                            class="mb-4 w-100"
                            color="var(--primary-color)"
                            hide-details="auto"
                            label="Confirmar senha"
                            name="confirm_password"
                            variant="outlined"
                            density="compact"
                            :append-inner-icon="confirm_visible ? 'mdi-eye' : 'mdi-eye-off'"
                            :error-messages="v$?.confirm_password?.$errors.map(e => e.$message)"
                            :type="confirm_visible ? 'text' : 'password'"
                            @click:append-inner="confirm_visible = !confirm_visible">
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
    import { required, helpers } from '@vuelidate/validators'
    import { mapGetters } from 'vuex';
    import { useVuelidate } from '@vuelidate/core'

    export default {
        setup: () => ({ v$: useVuelidate() }),
        data: () => ({
            password: '',
            confirm_password: '',
            loading: false,
            visible: false,
            confirm_visible: false,
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
                    const response = await axios.post('password/PasswordResetApi/', {
                        password: this.password,
                        confirm_password: this.confirm_password,
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
                password: {
                    required: helpers.withMessage('Senha é obrigatória', required),
                    strongPassword: helpers.withMessage('A senha deve conter pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.', helpers.regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/))
                },
                confirm_password: {
                    required: helpers.withMessage('Confirmação de senha é obrigatória', required),
                    strongPassword: helpers.withMessage('A senha deve conter pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.', helpers.regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/))
                },
            };
        },
    }
</script>
<style scoped>
    @import "@/assets/styles/loginCadastro.css";
</style>