import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';

import SystemMenu from './components/SystemMenu.vue'; 
import SystemSidebar from './components/SystemSidebar.vue';  
import SystemFooter from './components/SystemFooter.vue';   
import SystemCrud from './components/SystemCrud.vue'; 
import SystemMessage from './components/SystemMessage.vue';

import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

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

app.component('SystemMenu', SystemMenu);
app.component('SystemSidebar', SystemSidebar);
app.component('SystemFooter', SystemFooter);
app.component('SystemCrud', SystemCrud);
app.component('SystemMessage', SystemMessage);

app.use(router);
app.use(store);
app.use(vuetify);

app.mount('#app');