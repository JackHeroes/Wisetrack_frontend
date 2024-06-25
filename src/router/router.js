import cookies from 'js-cookie';
import store from '../store/store';
import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../views/LoginPage.vue';
import CadastroPage from '../views/CadastroPage.vue';
import RecuperarSenhaPage from '../views/RecuperarSenhaPage.vue';
import RedefinirSenhaPage from '../views/RedefinirSenhaPage.vue';
import ConfirmarEmailPage from '../views/ConfirmarEmailPage.vue';
import HomePage from '../views/HomePage.vue';
import PrimeirosPassosPage from '../views/PrimeirosPassosPage.vue'
import CategoriaGastoPage from '../views/CategoriaGastoPage.vue'
import MetodoPagamentoPage from '../views/MetodoPagamentoPage.vue'
import PlanilhaGastoPage from '../views/PlanilhaGastoPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import AccountPage from '../views/AccountPage.vue'

const routes = [
    {
        path: '/', 
        component: LoginPage,
        name: 'Login', 
    },
    { 
        path: '/criar-conta', 
        component: CadastroPage,
        name: 'Cadastro', 
    },
    { 
        path: '/esqueci-a-senha', 
        component: RecuperarSenhaPage,
        name: 'RecuperarSenha', 
    },
    { 
        path: '/redefinir-senha/:passwordToken',
        component: RedefinirSenhaPage,
        name: 'RedefinirSenha',
        meta: { requiresPasswordAuth: true }
    },
    { 
        path: '/confirmar-email/:emailToken',
        component: ConfirmarEmailPage,
        name: 'ConfirmarEmail',
        meta: { requiresEmailAuth: true }
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
        path: '/categorias-gasto', 
        component: CategoriaGastoPage,
        name: 'CategoriaGasto', 
        meta: { requiresUserAuth: true }
    },
    { 
        path: '/metodos-pagamento', 
        component: MetodoPagamentoPage,
        name: 'MetodoPagamento', 
        meta: { requiresUserAuth: true }
    },
    { 
        path: '/gastos-diarios', 
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
    { 
        path: '/conta', 
        component: AccountPage,
        name: 'Conta', 
        meta: { requiresUserAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const requiresUserAuth = to.matched.some(record => record.meta.requiresUserAuth);
    const requiresPasswordAuth = to.matched.some(record => record.meta.requiresPasswordAuth);
    const requiresEmailAuth = to.matched.some(record => record.meta.requiresEmailAuth);
  
    if (requiresUserAuth) {
        try {
            await store.dispatch('validateUser');
            next();
        } catch (error) {
            next('/');
            store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
        }
    } else if (requiresEmailAuth) {
        const emailToken = to.params.emailToken;
        const existingEmailToken = cookies.get('emailToken');

        if (!existingEmailToken || existingEmailToken !== emailToken) {
            cookies.set('emailToken', emailToken, { 
                secure: true, 
                sameSite: 'Lax' 
            });
        }

        try {
            await store.dispatch('validateEmail');
            next();
        } catch (error) {
            next('/');
            store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
        } 
    } else if (requiresPasswordAuth) {
        const passwordToken = to.params.passwordToken;
        const existingPasswordToken = cookies.get('passwordToken');

        if (!existingPasswordToken || existingPasswordToken !== passwordToken) {
            cookies.set('passwordToken', passwordToken, { 
                secure: true, 
                sameSite: 'Lax' 
            });
        }

        try {
            await store.dispatch('validatePassword');
            next();
        } catch (error) {
            next('/');
            store.dispatch('showToast', { message: error.response.data.error, messageType: 'error' });
        }
    } else {
        next();
    }
});

export default router;