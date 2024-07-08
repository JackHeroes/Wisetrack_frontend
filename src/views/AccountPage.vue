<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex flex-column justify-center align-center">
            <v-container class="d-flex flex-column justify-center align-center pa-8" fluid>
                <v-card 
                    class="w-100"
                    max-width="600px"
                    variant="text">
                    <v-card-title class="d-flex justify-center align-center mb-6">
                        <div class="v-avatar-container">
                            <v-avatar size="200">
                                <v-img :src="image"></v-img>
                            </v-avatar>
                            <v-file-input 
                                accept="image/*"
                                hide-details="auto"
                                prepend-icon="mdi-camera"
                                ref="fileInput" 
                                variant="outlined" 
                                hide-input
                                @change="fileChange">
                            </v-file-input>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="submit" class="d-flex flex-column justify-center w-100">
                            <v-text-field 
                                v-model="username"
                                class="mb-3 w-100"
                                color="var(--primary-color)"
                                density="comfortable"
                                hide-details="auto"
                                label="Usuário"
                                name="username"
                                variant="outlined" 
                                readonly
                                :error-messages="v$?.username?.$errors.map(e => e.$message)">
                            </v-text-field>
                            <v-text-field 
                                v-model="email"
                                class="mb-3 w-100"
                                color="var(--primary-color)"
                                density="comfortable"
                                hide-details="auto"
                                label="E-mail"
                                name="email"
                                variant="outlined"
                                readonly
                                :error-messages="v$?.email?.$errors.map(e => e.$message)">
                            </v-text-field>
                            <v-text-field 
                                v-model="firstName"
                                class="mb-3 w-100"
                                color="var(--primary-color)"
                                density="comfortable"
                                hide-details="auto"
                                label="Nome"
                                name="firstName"
                                variant="outlined"
                                :error-messages="v$?.firstName?.$errors.map(e => e.$message)">
                            </v-text-field>
                            <v-text-field 
                                v-model="lastName"
                                class="mb-3 w-100"
                                color="var(--primary-color)"
                                density="comfortable"
                                hide-details="auto"
                                label="Sobrenome"
                                name="lastName"
                                variant="outlined"
                                :error-messages="v$?.lastName?.$errors.map(e => e.$message)">
                            </v-text-field>
                            <v-switch
                                v-model="changePassword"
                                color="var(--primary-color)"
                                hide-details="auto"
                                label="Alterar senha"
                                inset>
                            </v-switch>
                            <v-text-field
                                v-if="changePassword"
                                v-model="currentPassword"
                                class="mb-3 w-100"
                                color="var(--primary-color)"
                                density="comfortable"
                                hide-details="auto"
                                label="Senha atual"
                                name="currentPassword"
                                variant="outlined"
                                :append-inner-icon="currentPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                                :error-messages="v$?.currentPassword?.$errors.map(e => e.$message)"
                                :type="currentPasswordVisible ? 'text' : 'password'"
                                @click:append-inner="currentPasswordVisible = !currentPasswordVisible">
                            </v-text-field>
                            <v-text-field
                                v-if="changePassword"
                                v-model="newPassword"
                                class="mb-3 w-100"
                                color="var(--primary-color)"
                                density="comfortable"
                                hide-details="auto"
                                label="Nova senha"
                                name="newPassword"
                                variant="outlined"
                                :append-inner-icon="newPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                                :error-messages="v$?.newPassword?.$errors.map(e => e.$message)"
                                :type="newPasswordVisible ? 'text' : 'password'"
                                @click:append-inner="newPasswordVisible = !newPasswordVisible">
                            </v-text-field>
                            <v-switch
                                v-model="deleteAccount"
                                color="var(--primary-color)"
                                hide-details="auto"
                                label="Excluir conta"
                                inset
                                @change="handleDeleteAccount">
                            </v-switch>
                            <v-btn 
                                class="v-btn-primary w-100"
                                size="large" 
                                type="submit"
                                :loading="loading">
                                Atualizar informações
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-container>
        </v-main>
        <v-dialog v-model="deleteAccountDialog" max-width="500px">
            <v-card>
                <v-card-title class="headline">Confirmar exclusão de conta</v-card-title>
                <v-card-text>
                    <v-text-field 
                        v-model="confirmUsername"
                        class="mb-3 w-100"
                        color="var(--primary-color)"
                        density="comfortable"
                        hide-details="auto"
                        label="Digite seu usuário para confirmar"
                        name="confirmUsername"
                        variant="outlined" 
                        :error-messages="v$?.confirmUsername?.$errors.map(e => e.$message)">
                    </v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn class="btn-cancel" @click="cancelDelete" variant="plain">Cancelar</v-btn>
                    <v-btn class="btn-confirm" @click="confirmDelete" variant="tonal">Excluir</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <SystemFooter/>
    </v-app>
</template>
<script>
    import axios from '../services/axios';
    import defaultUserImage from '@/assets/images/defaultUser/defaultUserImage.svg';
    import store from '../store/store';
    import { alpha, strongPassword } from '../services/customValidations';
    import { email, required, helpers } from '@vuelidate/validators';
    import { mapGetters } from 'vuex';
    import { useVuelidate } from '@vuelidate/core';
    import { validateUser } from '../services/validateUser';

    export default {
        setup() {
            return { 
                v$: useVuelidate() 
            };
        },
        data() {
            return {
                username: '',
                email: '',
                firstName: '',
                lastName: '',
                imageFile: null,
                image: defaultUserImage,
                currentPassword: '',
                newPassword: '',
                confirmUsername: '',
                changePassword: false,
                currentPasswordVisible: false,
                newPasswordVisible: false,
                deleteAccount: false,
                deleteAccountDialog: false,
                loading: false,
            };
        },
        mounted() {
            this.loadUserData();
        },
        computed: {
            ...mapGetters(['id_user']),
        },
        watch: {
            changePassword(newValue) {
                if (!newValue) {
                    this.currentPassword = '';
                    this.newPassword = '';
                    
                    if (this.v$.currentPassword) {
                        this.v$.currentPassword.$reset();
                    }
                    if (this.v$.newPassword) {
                        this.v$.newPassword.$reset();
                    }
                }
            },
            deleteAccount(newValue) {
                if (!newValue) {
                    this.confirmUsername = '';
                    
                    if (this.v$.confirmUsername) {
                        this.v$.confirmUsername.$reset();
                    }
                }
            },
            deleteAccountDialog(newValue) {
                if (!newValue) {
                    this.deleteAccount = false;
                }
            },
        },
        methods: {
            async loadUserData() {
                try {
                    await validateUser(this.$router);
                } catch {
                    return;
                }

                try {
                    const response = await axios.get('manageAccount/ManageAccountApi/', {
                        params: { 
                            id_user: this.id_user 
                        }
                    });
                    this.username = response.data.username;
                    this.email = response.data.email;
                    this.firstName = response.data.first_name;
                    this.lastName = response.data.last_name;
                    this.image = response.data.image ? `${response.data.image}?t=${new Date().getTime()}` : defaultUserImage;
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                }
            },
            async submit() {
                const result = await this.v$.$validate();
                if (!result) return
                
                this.loading = true;

                try {
                    await validateUser(this.$router);
                } catch {
                    return;
                }
                
                try {
                    const formData = new FormData();
                    formData.append('id_user', this.id_user);
                    formData.append('firstName', this.firstName);
                    formData.append('lastName', this.lastName);
                    if (this.imageFile) {
                        formData.append('image', this.imageFile);
                    }
                    if (this.changePassword) {
                        formData.append('changePassword', this.changePassword);
                        formData.append('currentPassword', this.currentPassword);
                        formData.append('newPassword', this.newPassword);
                    }
                    
                    const response = await axios.put('manageAccount/ManageAccountApi/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    this.v$.$reset();
                    this.loadUserData();
                    store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                }
                catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                } finally {
                    this.loading = false;
                }
            },
            handleDeleteAccount() {
                if (this.deleteAccount) {
                    this.v$.$reset();
                    this.changePassword = false;
                    this.deleteAccountDialog = true;
                } else {
                    this.deleteAccountDialog = false;
                }
            },
            async confirmDelete() {
                const result = await this.v$.confirmUsername.$validate();
                if (!result) return

                try {
                    await validateUser(this.$router);
                } catch {
                    return;
                }

                try {
                    const formData = new FormData();
                    formData.append('id_user', this.id_user);
                    formData.append('deleteAccount', this.deleteAccount);
                    formData.append('confirmUsername', this.confirmUsername);

                    const response = await axios.delete('manageAccount/ManageAccountApi/', { data: formData });

                    this.$router.push('/');
                    store.dispatch('showToast', { message: response.data.success, messageType: 'success' });
                } catch (error) {
                    store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
                } finally {
                    this.loading = false;
                }
            },
            cancelDelete() {
                this.deleteAccount = false;
                this.deleteAccountDialog = false;
            },
            fileChange(event) {
                const file = event.target.files[0];
                if (file) {
                    this.imageFile = file;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.image = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            }
        },
        validations() {
            const passwordValidations = this.changePassword ? {
                currentPassword: {
                    required: helpers.withMessage('Senha atual é obrigatória', required),
                },
                newPassword: {
                    required: helpers.withMessage('Nova senha é obrigatória', required),
                    strongPassword: helpers.withMessage('A senha deve conter pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.', strongPassword)
                },
            } : {};

            const deleteValidations = this.deleteAccount ? {
                confirmUsername: {
                    required: helpers.withMessage('Confirmar o usuário é obrigatório', required),
                },
            } : {};

            return {
                email: {
                    required: helpers.withMessage('E-mail é obrigatório', required),
                    email: helpers.withMessage('Insira um e-mail válido', email),
                },
                firstName: {
                    required: helpers.withMessage('Nome é obrigatório', required),
                    alpha: helpers.withMessage('Insira um nome válido', alpha)
                },
                lastName: {
                    required: helpers.withMessage('Sobrenome é obrigatório', required),
                    alpha: helpers.withMessage('Insira um sobrenome válido', alpha)
                },
                ...passwordValidations,
                ...deleteValidations
            };
        },
    }
</script>
<style scoped>
    .v-avatar-container {
        max-width: 200px!important;
        position: relative!important;
    }

    .v-card-title .v-file-input {
        background-color: var(--primary-color)!important;
        border-radius: 100%!important;
        bottom: 0!important;
        color: var(--white)!important;
        font-size: 1rem!important;
        padding: .5rem!important;
        position: absolute!important;
        right: 0.5rem!important;
    }

    .btn-confirm {
        background-color: var(--primary-color)!important;
        color: var(--white)!important;
    }

    :deep(.v-input__prepend .v-icon) {
        opacity: 1!important;
    }
</style>