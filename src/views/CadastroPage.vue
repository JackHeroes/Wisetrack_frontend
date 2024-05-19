<template>
    <v-card class="d-flex flex-column justify-center align-center" height="1000" width="1000">
        <h1>Cadastre-se</h1>
        <form @submit.prevent="submit" class="w-100">
            <v-text-field 
                v-model="username"
                class="mb-2"
                label="Usuário"
                name="username"
                variant="outlined" 
                :error-messages="v$?.username?.$errors.map(e => e.$message)">
            </v-text-field>
            <v-text-field 
                v-model="email"
                class="mb-2"
                label="E-mail"
                name="email"
                variant="outlined" 
                :error-messages="v$?.email?.$errors.map(e => e.$message)">
            </v-text-field>
            <v-text-field 
                v-model="first_name"
                class="mb-2"
                label="Nome"
                name="first_name"
                variant="outlined" 
                :error-messages="v$?.first_name?.$errors.map(e => e.$message)">
            </v-text-field>
            <v-text-field 
                v-model="last_name"
                class="mb-2"
                label="Sobrenome"
                name="last_name"
                variant="outlined" 
                :error-messages="v$?.last_name?.$errors.map(e => e.$message)">
            </v-text-field>
            <v-text-field
                v-model="password"
                class="mb-2"
                label="Senha"
                name="password"
                variant="outlined"
                :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="v$?.password?.$errors.map(e => e.$message)"
                :type="visible ? 'text' : 'password'"
                @click:append-inner="visible = !visible">
            </v-text-field>
            <v-btn 
                class="mb-3"
                size="large" 
                type="submit" 
                block>
                Registre-se
            </v-btn>
        </form>
        <div>
            <v-btn 
                variant="plain"
                @click="goToLogin">
                Login
            </v-btn>
        </div>
    </v-card>
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