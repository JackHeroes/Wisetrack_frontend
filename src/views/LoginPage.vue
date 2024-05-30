<template>
    <v-app>
        <v-container class="d-flex justify-center align-center fill-height" fluid>
            <v-card class="d-flex flex-column justify-center align-center rounded-s-xl rounded-e-0">
                <h1 class="v-title text-uppercase mb-4">Login</h1>
                <v-form @submit.prevent="submit" class="d-flex flex-column justify-center align-center w-100">
                    <v-text-field 
                        v-model="username"
                        class="mb-4"
                        color="var(--primary-color)"
                        hide-details="auto"
                        label="Usuário"
                        name="username"
                        variant="outlined" 
                        :error-messages="v$?.username?.$errors.map(e => e.$message)">
                    </v-text-field>
                    <v-text-field
                        v-model="password"
                        class="mb-4"
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
                        class="v-btn-primary mb-4"
                        size="large" 
                        type="submit"
                        :loading="loading">
                        Entrar
                    </v-btn>
                </v-form>
                <p class="v-link">
                    <span>Ainda não tem uma conta? </span>
                    <a @click="goToCadastro" class="cursor-pointer">Cadastre-se</a>
                </p>
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
    import { mapGetters } from 'vuex';
    import { required, helpers } from '@vuelidate/validators';
    import { useVuelidate } from '@vuelidate/core';

    export default {
        setup: () => ({ v$: useVuelidate() }),
        data() {
            return {
                username: '',
                password: '',
                loading: false,
                visible: false,
                messageKey: 0,
            };
        },
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

                this.loading = true;

                try {
                    await axios.post('login/LoginApi/', {
                        username: this.username,
                        password: this.password,
                    });
                    this.$router.push('/inicio');
                } catch (error) {
                    store.dispatch('setMessage', {
                        message: error.response.data.error,
                        messageType: 'error'
                    });
                    this.messageKey += 1;
                } finally {
                    this.loading = false;
                }
            },
            goToCadastro() {
                store.dispatch('clearMessage');
                this.$router.push('/cadastro');
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