<template>
    <v-container class="d-flex justify-center align-center fill-height" fluid>
        <v-card class="d-flex flex-column justify-center align-center rounded-s-xl rounded-e-0">
            <h1 class="v-title text-uppercase">Login</h1>
            <v-form @submit.prevent="submit" class="d-flex flex-column justify-center align-center w-100">
                <v-text-field 
                    v-model="username"
                    class="mb-3"
                    color="var(--main-color)"
                    hide-details="auto"
                    label="Usuário"
                    name="username"
                    variant="outlined" 
                    :error-messages="v$?.username?.$errors.map(e => e.$message)">
                </v-text-field>
                <v-text-field
                    v-model="password"
                    class="mb-3"
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
                    class="v-btn-primary mb-3"
                    size="large" 
                    type="submit">
                    Entrar
                </v-btn>
            </v-form>
            <p>
                Ainda não tem uma conta? 
                <span @click="goToCadastro" class="v-link cursor-pointer">Cadastre-se</span>
            </p>
        </v-card>   
        <v-card 
            class="d-flex flex-column justify-center align-center rounded-s-0 rounded-e-xl"
            image="https://cdn.vuetifyjs.com/docs/images/cards/dark-beach.jpg">
        </v-card>    
    </v-container>
    <Message 
        v-if="message"
        :message="message"
        :type="messageType">
    </Message>
</template>
<script>
    import axios from '../services/axios';
    import { required, helpers } from '@vuelidate/validators'
    import { useVuelidate } from '@vuelidate/core'

    export default {
        setup: () => ({ v$: useVuelidate() }),
        data: () => ({    
            username: '',
            password: '',
            message: '',
            messageType: '',
            visible: false, 
        }),
        methods: {
            async submit() {
                const result = await this.v$.$validate()
                if (!result) {
                    return
                } 

                try {
                    await axios.post('login/LoginApi/', {
                        username: this.username,
                        password: this.password,
                    });
                    this.$router.push('/home');
                } catch (error) {
                    this.message = error.response.data.error;
                    this.messageType = 'error';
                }
            },
            goToCadastro() { 
                this.$router.push('/cadastro');
            }
        },
        validations () {
            return {
                username: { 
                    required: helpers.withMessage('Usuário é obrigatório', required),
                },
                password: {
                    required: helpers.withMessage('Senha é obrigatória', required),
                },
            }
        }
    }
</script>
<style scoped>
    @import "@/assets/styles/loginCadastro.css";
</style>