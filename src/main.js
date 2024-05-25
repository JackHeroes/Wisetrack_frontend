import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import store from './store/store';

import FooterCustom from './components/FooterCustom.vue'; 
import HorizontalMenu from './components/HorizontalMenu.vue'; 
import Message from './components/Message.vue';
import SidebarMenu from './components/SidebarMenu.vue';  
import Crud from './components/Crud.vue'; 

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

app.component('FooterCustom', FooterCustom);
app.component('HorizontalMenu', HorizontalMenu);
app.component('Message', Message);
app.component('SidebarMenu', SidebarMenu);
app.component('Crud', Crud);

app.use(router);
app.use(store);
app.use(vuetify);

app.mount('#app');