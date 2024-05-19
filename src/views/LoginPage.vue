<template>
    <v-card class="d-flex flex-column justify-center align-center" height="1000" width="1000">
        <h1>Login</h1>
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
                Login
            </v-btn>
        </form>
        <div>
          <v-btn 
              variant="plain"
              @click="goToCadastro()">
              Cadastre-se
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
    import { useVuelidate } from '@vuelidate/core'
    import { required, helpers } from '@vuelidate/validators'

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
                    await axios.post('login/UserLoginAPI/', {
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