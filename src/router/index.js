import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import CadastroPage from '../views/CadastroPage.vue';
import HomePage from '../views/HomePage.vue'

const routes = [
    { path: '/', component: LoginPage },
    { path: '/cadastro', component: CadastroPage },
    { path: '/home', component: HomePage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;