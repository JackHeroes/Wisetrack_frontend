<template>
    <v-app>
        <v-container class="d-flex justify-center align-center fill-height" fluid>
            <v-card class="d-flex flex-column justify-center align-center rounded-s-xl rounded-e-0">
                <div class="card-header d-flex flex-column justify-center align-center">
                    <v-img></v-img>
                    <h1 class="v-title text-uppercase mb-6">Redefina sua senha</h1>
                </div>
                <div class="card-body">
                    <v-form @submit.prevent="submit" class="d-flex flex-column justify-center align-center w-100">
                        <v-text-field 
                            v-model="email"
                            class="mb-4 w-100"
                            color="var(--primary-color)"
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
            <v-card class="d-flex flex-column justify-center align-center rounded-s-0 rounded-e-xl">
                <v-img
                    class="w-100 h-100"
                    cover
                    src="\src\assets\images\">
                </v-img>
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
            email: '',
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
                    const response = await axios.post('password/PasswordApi/', {
                        email: this.email,
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