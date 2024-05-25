import store from '../store/store';
import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../views/LoginPage.vue';
import CadastroPage from '../views/CadastroPage.vue';
import HomePage from '../views/HomePage.vue';
import CategoriaGastoPage from '../views/CategoriaGastoPage.vue'
import MetodoPagamentoPage from '../views/MetodoPagamentoPage.vue'

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
    { 
        path: '/categoria-gasto', 
        component: CategoriaGastoPage,
        name: 'CategoriaGasto', 
        meta: { requiresAuth: true }
    },
    { 
        path: '/metodo-pagamento', 
        component: MetodoPagamentoPage,
        name: 'MetodoPagamento', 
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
            await store.dispatch('fetchUser');
            next();
        } catch (error) {
            next('/');
        }
    } else {
        next();
    }
});

export default router;