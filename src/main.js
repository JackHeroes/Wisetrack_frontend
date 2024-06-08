import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';

import SystemMenu from './components/SystemMenu.vue'; 
import SystemSidebar from './components/SystemSidebar.vue';  
import SystemFooter from './components/SystemFooter.vue';   
import SystemCrud from './components/SystemCrud.vue'; 

import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"; 

import './assets/styles/main.css';

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        aliases,
        defaultSet: 'mdi',
        sets: {
            mdi,
        },
    },
});

const app = createApp(App);

const options = {
    closeButton: "button",
    closeOnClick: true,
    draggable: true,
    draggablePercent: 0.6,
    hideProgressBar: false,
    icon: true,
    maxToasts: 4,
    newestOnTop: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    position: "top-right",
    rtl: false,
    showCloseButtonOnHover: false,
    timeout: 5000,
    transition: "Vue-Toastification__bounce",
};

app.component('SystemMenu', SystemMenu);
app.component('SystemSidebar', SystemSidebar);
app.component('SystemFooter', SystemFooter);
app.component('SystemCrud', SystemCrud);

app.component('AgGridVue', AgGridVue);

app.use(router);
app.use(store);
app.use(Toast, options);
app.use(vuetify);

app.mount('#app');