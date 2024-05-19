import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import CadastroPage from '../views/CadastroPage.vue';
import HomePage from '../views/HomePage.vue'
import axios from '../services/axios';

const routes = [
    {
        path: '/', 
        component: LoginPage,
        name: 'Login', 
    },
    { 
        path: '/cadastro', 
        component: CadastroPage,
        name: 'Cadastro', 
    },
    { 
        path: '/home', 
        component: HomePage,
        name: 'Home', 
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
    if (requiresAuth) {
        try {
            await axios.get('login/AuthAPI/');
            next();
        } catch (error) {
            next('/');
        }
    } else {
        next();
    }
});

export default router;