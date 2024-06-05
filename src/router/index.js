import Cookies from 'js-cookie';
import store from '../store/store';
import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../views/LoginPage.vue';
import CadastroPage from '../views/CadastroPage.vue';
import RecuperarSenhaPage from '../views/RecuperarSenhaPage.vue';
import RedefinirSenhaPage from '../views/RedefinirSenhaPage.vue';
import HomePage from '../views/HomePage.vue';
import PrimeirosPassosPage from '../views/PrimeirosPassosPage.vue'
import CategoriaGastoPage from '../views/CategoriaGastoPage.vue'
import MetodoPagamentoPage from '../views/MetodoPagamentoPage.vue'
import PlanilhaGastoPage from '../views/PlanilhaGastoPage.vue'
import DashboardPage from '../views/DashboardPage.vue'

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
        path: '/esqueci-a-senha', 
        component: RecuperarSenhaPage,
        name: 'RecuperarSenha', 
    },
    { 
        path: '/redefinir-senha/:password_token',
        component: RedefinirSenhaPage,
        name: 'RedefinirSenha',
        meta: { requiresPasswordAuth: true }
    },
    { 
        path: '/inicio', 
        component: HomePage,
        name: 'Home', 
        meta: { requiresUserAuth: true }
    },
    { 
        path: '/primeiros-passos', 
        component: PrimeirosPassosPage,
        name: 'PrimeirosPassos', 
        meta: { requiresUserAuth: true }
    },
    { 
        path: '/categoria-gasto', 
        component: CategoriaGastoPage,
        name: 'CategoriaGasto', 
        meta: { requiresUserAuth: true }
    },
    { 
        path: '/metodo-pagamento', 
        component: MetodoPagamentoPage,
        name: 'MetodoPagamento', 
        meta: { requiresUserAuth: true }
    },
    { 
        path: '/planilha-gasto', 
        component: PlanilhaGastoPage,
        name: 'PlanilhaGasto', 
        meta: { requiresUserAuth: true }
    },
    { 
        path: '/dashboard', 
        component: DashboardPage,
        name: 'Dashboard', 
        meta: { requiresUserAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const requiresPasswordAuth = to.matched.some(record => record.meta.requiresPasswordAuth);
    const requiresUserAuth = to.matched.some(record => record.meta.requiresUserAuth);
  
    if (requiresUserAuth) {
        try {
            await store.dispatch('validateUser');
            next();
        } catch (error) {
            next('/');
        }
    } else if (requiresPasswordAuth) {

        const password_token = to.params.password_token;
        Cookies.set('passwordToken', password_token, { sameSite: 'Lax', secure: true });

        try {
            await store.dispatch('validateToken');
            next();
        } catch (error) {
            next('/');
        }
    } else {
        next();
    }
});

export default router;