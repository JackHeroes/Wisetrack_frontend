<template>
    <v-container class="d-flex justify-center align-center fill-height" fluid>
        <v-card 
            class="d-flex flex-column justify-center align-center rounded-s-xl rounded-e-0"
            image="https://cdn.vuetifyjs.com/docs/images/cards/dark-beach.jpg">
        </v-card>
        <v-card class="d-flex flex-column justify-center align-center rounded-s-0 rounded-e-xl">
            <h1 class="v-title text-uppercase">Cadastre-se</h1>
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
                    v-model="email"
                    class="mb-3"
                    color="var(--main-color)"
                    hide-details="auto"
                    label="E-mail"
                    name="email"
                    variant="outlined" 
                    :error-messages="v$?.email?.$errors.map(e => e.$message)">
                </v-text-field>
                <v-text-field 
                    v-model="first_name"
                    class="mb-3"
                    color="var(--main-color)"
                    hide-details="auto"
                    label="Nome"
                    name="first_name"
                    variant="outlined" 
                    :error-messages="v$?.first_name?.$errors.map(e => e.$message)">
                </v-text-field>
                <v-text-field 
                    v-model="last_name"
                    class="mb-3"
                    color="var(--main-color)"
                    hide-details="auto"
                    label="Sobrenome"
                    name="last_name"
                    variant="outlined" 
                    :error-messages="v$?.last_name?.$errors.map(e => e.$message)">
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
                    Criar conta
                </v-btn>
            </v-form>
            <p>
                Já tem uma conta?
                <span @click="goToLogin" class="v-link cursor-pointer">Faça login</span>
            </p>
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
        }),
        methods: {
            async submit() {
                const result = await this.v$.$validate()
                if (!result) {
                    return
                }

                try {
                    await axios.post('register/RegisterApi/', {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        first_name: this.first_name,
                        last_name: this.last_name,
                    });
                    this.$router.push('/');
                } catch (error) {
                    this.message = error.response.data.error;
                    this.messageType = 'error';
                }
            },
            goToLogin() {
                this.$router.push('/');
            }
        },
        validations () {
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
                    alpha: helpers.withMessage('O nome deve conter apenas letras', helpers.regex(/^[a-zA-ZÀ-ú\s]*$/))
                },
                last_name: { 
                    required: helpers.withMessage('Sobrenome é obrigatório', required),
                    alpha: helpers.withMessage('O sobrenome deve conter apenas letras', helpers.regex(/^[a-zA-ZÀ-ú\s]*$/))
      
                },
                password: {
                    required: helpers.withMessage('Senha é obrigatória', required),
                    strongPassword: helpers.withMessage('A senha deve conter pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.', helpers.regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/))
                },
            }
        }
    }
</script>
<style scoped>
    @import "@/assets/styles/loginCadastro.css";
</style>